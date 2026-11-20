// Minimal headless Chrome driver over the DevTools pipe. No npm dependency.
// Point it at a browser with CHROME_PATH=/path/to/chrome (Linux and macOS; Chrome, Chromium or Edge).
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {existsSync, readFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {delimiter, extname, join} from 'node:path';
import {tempDir} from '../helpers.mjs';

const names = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'];
const macApps = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

export function findChrome() {
  if (process.env.CHROME_PATH) {
    if (!existsSync(process.env.CHROME_PATH)) throw new Error('CHROME_PATH does not exist: ' + process.env.CHROME_PATH);
    return process.env.CHROME_PATH;
  }
  const found = [
    ...macApps,
    ...(process.env.PATH ?? '').split(delimiter).flatMap(dir => names.map(name => join(dir, name))),
  ].find(path => existsSync(path));
  if (!found) throw new Error('Chrome not found. Install Chrome or Chromium, or set CHROME_PATH=/path/to/chrome.');
  return found;
}

export async function launchChrome() {
  const profile = tempDir('anywherepdf-chrome-');
  const chrome = spawn(findChrome(), [
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--no-first-run',
    '--disable-background-networking', '--remote-debugging-pipe', '--user-data-dir=' + profile.dir, 'about:blank',
  ], {stdio: ['ignore', 'ignore', 'inherit', 'pipe', 'pipe']});
  let id = 0, buffer = '', session;
  const pending = new Map();
  const handlers = new Map();
  chrome.on('exit', code => { for (const {reject} of pending.values()) reject(new Error('Chrome exited ' + code)); });
  chrome.stdio[4].on('data', chunk => {
    buffer += chunk.toString();
    let index;
    while ((index = buffer.indexOf('\0')) !== -1) {
      const message = JSON.parse(buffer.slice(0, index));
      buffer = buffer.slice(index + 1);
      if (message.id) {
        const promise = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) promise?.reject(new Error(message.error.message)); else promise?.resolve(message.result);
      } else {
        for (const handler of handlers.get(message.method) ?? []) handler(message.params);
      }
    }
  });
  const api = {
    send(method, params = {}, sessionId = session) {
      return new Promise((resolve, reject) => {
        const current = ++id;
        pending.set(current, {resolve, reject});
        chrome.stdio[3].write(JSON.stringify({id: current, method, params, ...(sessionId ? {sessionId} : {})}) + '\0');
      });
    },
    on(event, handler) { handlers.set(event, [...(handlers.get(event) ?? []), handler]); },
    next(event) {
      return new Promise(resolve => {
        const handler = params => {
          handlers.set(event, handlers.get(event).filter(entry => entry !== handler));
          resolve(params);
        };
        api.on(event, handler);
      });
    },
    async evaluate(expression) {
      const {result, exceptionDetails} = await api.send('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true});
      if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
      return result.value;
    },
    // Polls an in-page expression until it is truthy.
    async waitFor(expression, {timeout = 20000, interval = 50} = {}) {
      const deadline = Date.now() + timeout;
      for (;;) {
        if (await api.evaluate(expression)) return;
        if (Date.now() > deadline) throw new Error('Timed out waiting for ' + expression);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    },
    async open() {
      const {targetId} = await api.send('Target.createTarget', {url: 'about:blank'});
      ({sessionId: session} = await api.send('Target.attachToTarget', {targetId, flatten: true}));
      await api.send('Page.enable');
      await api.send('Runtime.enable');
    },
    async visit(url) {
      const loaded = api.next('Page.loadEventFired');
      const opened = await api.send('Page.navigate', {url});
      if (opened.errorText) throw new Error(url + ' ' + opened.errorText);
      await loaded;
    },
    async close() {
      chrome.kill();
      if (chrome.exitCode === null && chrome.signalCode === null) await once(chrome, 'exit');
      profile.cleanup();
    },
  };
  return api;
}

export const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
};

// Serves a built dist directory on 127.0.0.1 with a random port. Unknown paths return 404.html.
export async function serveDist(dist) {
  const server = createServer((req, res) => {
    let path = new URL(req.url, 'http://127.0.0.1').pathname;
    if (path.endsWith('/')) path += 'index.html';
    try {
      const file = readFileSync(join(dist, path));
      res.writeHead(200, {'Content-Type': mime[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache'});
      res.end(file);
    } catch {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end(readFileSync(join(dist, '404.html')));
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {
    server,
    origin: 'http://127.0.0.1:' + server.address().port,
    async stop() {
      if (!server.listening) return;
      const closed = once(server, 'close');
      server.close();
      await closed;
    },
  };
}

export function sitemapPaths(dist) {
  const file = join(dist, 'sitemap.xml');
  return [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
}
