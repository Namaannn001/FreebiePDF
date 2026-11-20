// OCR startup, local asset paths, timeout and worker cleanup with a mocked tesseract.js. No build needed.
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { root, tempDir } from './helpers.mjs';

const tmp = tempDir('anywherepdf-ocr-');
after(tmp.cleanup);
const outfile = join(tmp.dir, 'ocr.mjs');
await build({
  absWorkingDir: root,
  entryPoints: ['src/ocr.js'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile,
  logLevel: 'silent',
  define: { 'import.meta.env.BASE_URL': '"./"' },
  plugins: [
    {
      name: 'mock-tesseract',
      setup(build) {
        build.onResolve({ filter: /^tesseract\.js$/ }, () => ({
          path: 'tesseract.js',
          namespace: 'mock-tesseract',
        }));
        build.onLoad({ filter: /.*/, namespace: 'mock-tesseract' }, () => ({
          contents:
            'export function createWorker(...args){return globalThis.__ocrCreate(...args);}',
          loader: 'js',
        }));
      },
    },
  ],
});
const { createOcr } = await import(pathToFileURL(outfile).href);
globalThis.document = { baseURI: 'https://example.com/app/' };

const check = (name, actual, expected) => assert.strictEqual(actual, expected, name);
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const rejections = [];
const onReject = error => rejections.push(error);
process.on('unhandledRejection', onReject);
after(() => process.off('unhandledRejection', onReject));

class FakeWorker {
  constructor(url) {
    this.url = url;
    this.terminated = 0;
    FakeWorker.latest = this;
  }
  terminate() {
    this.terminated++;
  }
}
globalThis.Worker = FakeWorker;

test('uses local OCR assets and ignores later worker errors', async () => {
  let saved;
  globalThis.__ocrCreate = (_lang, _oem, options) => {
    saved = options;
    new Worker(options.workerPath);
    return Promise.resolve({
      recognize: async () => ({
        data: { blocks: [{ paragraphs: [{ lines: [{ words: ['word'] }] }] }] },
      }),
      terminate() {
        FakeWorker.latest.terminate();
        return Promise.resolve();
      },
    });
  };
  const ocr = await createOcr(() => {});
  check('worker path local', saved.workerPath, 'https://example.com/app/ocr/worker.min.js');
  check(
    'core path local',
    saved.corePath,
    'https://example.com/app/ocr/tesseract-core-lstm.wasm.js',
  );
  check('lang path local', saved.langPath, 'https://example.com/app/ocr/');
  check('no cdn worker', saved.workerPath.includes('jsdelivr'), false);
  check('no cdn core', saved.corePath.includes('jsdelivr'), false);
  check('no cdn lang', saved.langPath.includes('jsdelivr'), false);
  check('worker blob disabled', saved.workerBlobURL, false);
  const words = await ocr.recognize({});
  check('recognize', words[0], 'word');
  saved.errorHandler(new Error('later recognize failure'));
  await pause(20);
  check('errorHandler after startup is ignored', rejections.length, 0);
});

test('startup failure terminates the worker without unhandled rejections', async () => {
  globalThis.__ocrCreate = (_lang, _oem, options) => {
    new Worker(options.workerPath);
    queueMicrotask(() => options.errorHandler(new Error('language data failed')));
    return new Promise(() => {});
  };
  let startupError;
  try {
    await createOcr(() => {});
  } catch (error) {
    startupError = error;
  }
  check(
    'startup failure message',
    startupError?.message,
    'Could not start on-device OCR. Reload the page and try again.',
  );
  check('startup failure terminates worker', FakeWorker.latest.terminated >= 1, true);
  await pause(20);
  check('startup failure has no unhandled rejection', rejections.length, 0);
});

test('startup timeout terminates the worker, including a late one', async () => {
  let lateTerminate = 0;
  let release;
  globalThis.__ocrCreate = (_lang, _oem, options) => {
    const thread = new Worker(options.workerPath);
    return new Promise(resolve => {
      release = () =>
        resolve({
          recognize() {
            return { data: { blocks: [] } };
          },
          terminate() {
            lateTerminate++;
            thread.terminate();
            return Promise.resolve();
          },
        });
    });
  };
  let timeoutError;
  try {
    await createOcr(() => {}, 40);
  } catch (error) {
    timeoutError = error;
  }
  check(
    'timeout message',
    timeoutError?.message,
    'Could not start on-device OCR. Reload the page and try again.',
  );
  check('timeout terminates the captured worker', FakeWorker.latest.terminated >= 1, true);
  release();
  await pause(30);
  check('late createWorker resolution terminates again', lateTerminate >= 1, true);
  check('late resolution has no unhandled rejection', rejections.length, 0);
  check('worker constructor restored', globalThis.Worker === FakeWorker, true);
});
