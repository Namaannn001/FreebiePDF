// Service worker precache list, install/activate/fetch behaviour and built slash guard.
// Needs a build: run "npm run test:build" (or SITE_URL=https://example.com/ npm run build) first.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, relative, resolve } from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';
import { all } from '../../src/catalog.js';
import { dist as root, requireDist } from '../helpers.mjs';

requireDist('sw.js', '404.html', 'tools/merge-pdf/index.html');
const code = readFileSync(resolve(root, 'sw.js'), 'utf8');
function check(name, actual, expected) {
  assert.strictEqual(actual, expected, name);
}
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}
const skip = new Set(['sw.js', '_headers', '_redirects']);
const expected = walk(root)
  .filter(path => !skip.has(basename(path)))
  .sort()
  .map(path =>
    ('./' + relative(root, path).replaceAll('\\', '/')).replace(/(^|\/)index\.html$/, '$1'),
  );
const marker = code.indexOf('const ASSETS=') + 'const ASSETS='.length;
let depth = 0,
  end = marker;
for (; end < code.length; end++) {
  if (code[end] === '[') depth++;
  else if (code[end] === ']') {
    depth--;
    if (depth === 0) {
      end++;
      break;
    }
  }
}
const assets = JSON.parse(code.slice(marker, end));
test('precache list matches dist and covers required files', () => {
  check('asset list matches dist', JSON.stringify(assets), JSON.stringify(expected));
  check('no silent asset skip', code.includes('catch(()=>{})'), false);
  check('404 precached', assets.includes('./404.html'), true);
  check('tool pages', assets.filter(url => /^\.\/tools\/[^/]+\/$/.test(url)).length, all.length);
  check('60 tools', all.length, 60);
  check('cmaps', assets.filter(url => url.startsWith('./cmaps/')).length > 100, true);
  check(
    'standard fonts',
    assets.some(url => url.startsWith('./standard_fonts/') && url.endsWith('.pfb')) &&
      assets.some(url => url.includes('LiberationSans-Regular.ttf')),
    true,
  );
  check('pdf worker', assets.filter(url => /\/pdf\.worker\.min-[^/]+\.mjs$/.test(url)).length, 1);
  check('ocr worker', assets.includes('./ocr/worker.min.js'), true);
  check('ocr core', assets.includes('./ocr/tesseract-core-lstm.wasm.js'), true);
  check('ocr language', assets.includes('./ocr/eng.traineddata.gz'), true);
  check('qpdf js', assets.includes('./qpdf/qpdf.js'), true);
  check('qpdf wasm', assets.includes('./qpdf/qpdf.wasm'), true);
  check(
    'brand assets',
    [
      'logo.svg',
      'icon.png',
      'icon-512.png',
      'icon-maskable-512.png',
      'apple-touch-icon.png',
      'social-preview.png',
    ].every(file => assets.includes('./' + file)),
    true,
  );
  check('manifest', assets.includes('./manifest.webmanifest'), true);
  check(
    'css chunk',
    assets.some(url => url.startsWith('./assets/') && url.endsWith('.css')),
    true,
  );
  check(
    'js chunks',
    assets.filter(url => url.startsWith('./assets/') && url.endsWith('.js')).length > 5,
    true,
  );
  check(
    'no remote asset urls',
    assets.some(url => url.startsWith('http')),
    false,
  );
});

function boot(
  scope,
  { failUrl = null, failTimes = 0, redirectUrls = new Set(), offline = false, slow = false } = {},
) {
  const listeners = {};
  let skipped = false;
  const attempts = new Map();
  const fetches = [];
  const stores = new Map();
  const matches = [];
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const map = stores.get(name);
      return {
        async put(url, response) {
          if (response.redirected) throw new TypeError('redirected response');
          const key = new URL(url, scope).href;
          map.set(key, {
            redirected: false,
            status: response.status,
            type: response.headers.get('content-type'),
            body: await response.clone().text(),
          });
        },
        async match(url) {
          const key = new URL(typeof url === 'string' ? url : url.url, scope).href;
          matches.push(key);
          const hit = map.get(key);
          if (!hit) return undefined;
          return new Response(hit.body, {
            status: hit.status,
            headers: { 'content-type': hit.type || 'text/plain' },
          });
        },
      };
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(name) {
      return stores.delete(name);
    },
  };
  async function fetch(input, options) {
    const url = new URL(typeof input === 'string' ? input : input.url, scope).href;
    fetches.push({ url, input, options });
    const seen = (attempts.get(url) ?? 0) + 1;
    attempts.set(url, seen);
    if (offline) throw new TypeError('offline');
    if (slow && input.mode === 'navigate')
      await new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => reject(options.signal.reason), {
          once: true,
        });
      });
    if (failUrl && url.endsWith(failUrl) && (failTimes < 0 || seen <= failTimes))
      return new Response('no', { status: 500 });
    const notFound = url.endsWith('/not-found');
    const body = url.endsWith('/404.html')
      ? readFileSync(resolve(root, '404.html'), 'utf8')
      : input.mode === 'navigate'
        ? 'network'
        : 'precache';
    const response = new Response(body, {
      status: notFound ? 404 : 200,
      headers: { 'content-type': 'text/html' },
    });
    if ([...redirectUrls].some(suffix => url.endsWith(suffix)))
      Object.defineProperty(response, 'redirected', { value: true });
    return response;
  }
  const self = {
    registration: { scope },
    location: { origin: new URL(scope).origin },
    addEventListener(type, fn) {
      listeners[type] = fn;
    },
    skipWaiting() {
      skipped = true;
      return Promise.resolve();
    },
    clients: { claim: async () => {} },
  };
  const sandbox = {
    self,
    caches,
    fetch,
    Response,
    URL,
    AbortController,
    setTimeout,
    clearTimeout,
    Promise,
    console,
    Math,
    Array,
    Object,
    Error,
    TypeError,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'sw.js' });
  return { listeners, fetches, attempts, stores, matches, skipped: () => skipped };
}
async function install(sw) {
  let task;
  sw.listeners.install({
    waitUntil(promise) {
      task = promise;
    },
  });
  await task;
}
async function navigate(sw, url) {
  const before = sw.fetches.length;
  const matchBefore = sw.matches.length;
  let task;
  sw.listeners.fetch({
    request: { method: 'GET', mode: 'navigate', url },
    respondWith(promise) {
      task = promise;
    },
  });
  const response = await task;
  return {
    status: response.status,
    redirected: response.redirected,
    location: response.headers.get('location'),
    body: await response.text(),
    matches: sw.matches.slice(matchBefore),
    fetched: sw.fetches.slice(before),
  };
}
async function ask(sw, id) {
  let reply;
  let task;
  sw.listeners.message({
    data: { type: 'anywherepdf-cache-check', id },
    source: {
      postMessage(data) {
        reply = data;
      },
    },
    waitUntil(promise) {
      task = promise;
    },
  });
  await task;
  return reply;
}

test('install, cache check, activate and online navigation', async () => {
  const sw = boot('https://example.com/', { redirectUrls: new Set(['/', '/sitemap.xml']) });
  await install(sw);
  check('install activates', sw.skipped(), true);
  check('every asset fetched once', sw.fetches.length, assets.length);
  const home = [...sw.stores.values()][0].get('https://example.com/');
  check('redirected precache response stored clean', home?.redirected, false);
  const ready = await ask(sw, 'abc');
  check('active cache reports ready', ready?.ok, true);
  check('cache check echoes id', ready?.id, 'abc');
  check('cache check missing count', ready?.missing, 0);
  check('cache status message renamed', ready?.type, 'anywherepdf-cache-status');
  check('current cache renamed', [...sw.stores.keys()][0].startsWith('anywherepdf:'), true);
  for (const name of [
    'freebiepdf:https://example.com/:old',
    'paperdesk:https://example.com/:old',
    'unrelated',
  ])
    sw.stores.set(name, new Map());
  let activation;
  sw.listeners.activate({
    waitUntil(promise) {
      activation = promise;
    },
  });
  await activation;
  check('legacy caches removed', sw.stores.size, 2);
  check('unrelated cache kept', sw.stores.has('unrelated'), true);
  const tool = await navigate(sw, 'https://example.com/tools/merge-pdf/?x=1');
  check('fresh HTML preferred', tool.body, 'network');
  check('known route hits network', tool.fetched.length, 1);
  check('network success avoids cache lookup', tool.matches.length, 0);
  check('network revalidates HTML', tool.fetched[0]?.options.cache, 'no-cache');
  check(
    'real network 404 preserved',
    (await navigate(sw, 'https://example.com/not-found')).status,
    404,
  );
  const sitemap = await navigate(sw, 'https://example.com/sitemap.xml?x=1');
  check(
    'sitemap request keeps the query',
    sitemap.fetched[0]?.input.url,
    'https://example.com/sitemap.xml?x=1',
  );
});

test('offline navigation, fallbacks and alias redirects', async () => {
  const cached = boot('https://example.com/');
  await install(cached);
  const offlineWorker = boot('https://example.com/', { offline: true });
  offlineWorker.stores.set([...cached.stores.keys()][0], [...cached.stores.values()][0]);
  const offlineMiss = await navigate(offlineWorker, 'https://example.com/no-such-tool');
  check('offline unknown route status', offlineMiss.status, 404);
  check('offline unknown route body', offlineMiss.body.includes('Page not found'), true);
  check(
    'offline unknown fallback keeps the request url',
    offlineMiss.fetched[0]?.input.url,
    'https://example.com/no-such-tool',
  );
  const offlineKnown = await navigate(offlineWorker, 'https://example.com/tools/merge-pdf/');
  check('offline known route still served', offlineKnown.status, 200);
  check('offline known route body', offlineKnown.body, 'precache');
  check(
    'offline sitemap lookup keeps the file url',
    (await navigate(offlineWorker, 'https://example.com/sitemap.xml?x=1')).matches[0],
    'https://example.com/sitemap.xml',
  );
  for (const alias of ['tools/merge-pdf', 'tools/merge-pdf/index.html']) {
    const redirect = await navigate(offlineWorker, 'https://example.com/' + alias + '?x=1');
    check('offline alias redirects', redirect.status, 308);
    check(
      'offline alias preserves query',
      redirect.location,
      'https://example.com/tools/merge-pdf/?x=1',
    );
  }
});

test('slow navigation falls back to the precache', async () => {
  const nested = boot('https://example.com/pdf/', { slow: true });
  await install(nested);
  const nestedNav = await navigate(nested, 'https://example.com/pdf/tools/split-pdf/');
  check('slow navigation falls back', nestedNav.body, 'precache');
  check('slow navigation aborts network', nestedNav.fetched[0]?.options.signal.aborted, true);
  check(
    'subdirectory route lookup',
    nestedNav.matches[0],
    'https://example.com/pdf/tools/split-pdf/',
  );
});

test('install retries a failed asset and fails when retries run out', async () => {
  const retry = boot('https://example.com/', { failUrl: '/404.html', failTimes: 1 });
  await install(retry);
  check('retry then success activates', retry.skipped(), true);
  check('failed asset was fetched twice', retry.attempts.get('https://example.com/404.html'), 2);

  let installError;
  const broken = boot('https://example.com/', { failUrl: '/404.html', failTimes: -1 });
  try {
    await install(broken);
  } catch (error) {
    installError = error;
  }
  check('exhausted asset fails install', installError instanceof Error, true);
  check('failed install does not activate', broken.skipped(), false);
  check('failed install drops the partial cache', [...broken.stores.keys()].length, 0);
});

test('built pages carry the slash guard and 404 links home', () => {
  const page = readFileSync(resolve(root, 'tools/merge-pdf/index.html'), 'utf8');
  const script = page.match(/<script>(if\(!location\.pathname[\s\S]*?)<\/script>/)[1];
  function redirect(pathname) {
    let replaced;
    const location = {
      pathname,
      search: '?q=1',
      hash: '#h',
      replace(value) {
        replaced = value;
      },
    };
    eval(script);
    return replaced;
  }
  check(
    'built slash guard index.html',
    redirect('/tools/merge-pdf/index.html'),
    '/tools/merge-pdf/?q=1#h',
  );
  check('built slash guard bare path', redirect('/tools/merge-pdf'), '/tools/merge-pdf/?q=1#h');
  check('built slash guard keeps slash', redirect('/tools/merge-pdf/'), undefined);
  const notFound = readFileSync(resolve(root, '404.html'), 'utf8');
  check('built 404 home link', notFound.includes('href="/"'), true);
  check('built 404 is not a directory link', notFound.includes('href="/404'), false);
});
