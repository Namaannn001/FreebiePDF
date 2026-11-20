// Real Chrome: every prerendered page hydrates in place (same H1, FAQ, title, links) with no runtime errors.
// Needs a build with SITE_URL set ("npm run test:build" first) and Chrome (see CHROME_PATH in README).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {extname, join} from 'node:path';
import {after, before, describe, it} from 'node:test';
import {dist, requireDist} from '../helpers.mjs';
import {launchChrome, mime, sitemapPaths} from './chrome.mjs';

requireDist('sitemap.xml', '404.html');

const origin = 'https://seo-test.example';
const syncMarker = `<script>
  window.serverHeading=document.querySelector('main h1');
  window.serverText=window.serverHeading.textContent;
  window.serverTitle=document.title;
  window.serverLinks=Array.from(document.querySelectorAll('main a[href]'),a=>a.getAttribute('href'));
  window.serverFaq=document.querySelector('main details');
</script>`;

describe('hydration in Chrome', {timeout: 300000}, () => {
  let browser;
  const failures = [];
  const paths = sitemapPaths(dist);
  before(async () => {
    browser = await launchChrome();
    browser.on('Fetch.requestPaused', async ({requestId, request}) => {
      try {
        let path = new URL(request.url).pathname;
        if (path.endsWith('/')) path += 'index.html';
        const type = extname(path);
        let body = readFileSync(join(dist, path));
        if (type === '.html') body = Buffer.from(body.toString().replace('</body>', syncMarker + '</body>'));
        await browser.send('Fetch.fulfillRequest', {
          requestId, responseCode: 200,
          responseHeaders: [{name: 'Content-Type', value: mime[type] ?? 'application/octet-stream'}],
          body: body.toString('base64'),
        });
      } catch {
        await browser.send('Fetch.fulfillRequest', {requestId, responseCode: 404, body: ''});
      }
    });
    browser.on('Runtime.exceptionThrown', ({exceptionDetails}) => failures.push(exceptionDetails.exception?.description ?? exceptionDetails.text));
    browser.on('Runtime.consoleAPICalled', ({type, args}) => {
      if (type === 'error') failures.push(args.map(arg => arg.value ?? arg.description).join(' '));
    });
    await browser.open();
    await browser.send('Fetch.enable', {patterns: [{urlPattern: origin + '/*', requestStage: 'Request'}]});
    await browser.send('Page.addScriptToEvaluateOnNewDocument', {source: `
      navigator.serviceWorker.register=()=>Promise.reject(new Error('Bypassed in hydration test'));
      localStorage.setItem('freebiepdf.web.starred', '["merge-pdf"]');
      localStorage.setItem('freebiepdf.web.dashboard-filter', '"Starred"');
      localStorage.setItem('freebiepdf.web.workflow', '[{"id":"compress-pdf","preset":"Heavy"}]');
    `});
  });
  after(async () => { await browser?.close(); });

  it('has pages to check', () => assert.ok(paths.length > 0, 'sitemap.xml lists no pages'));

  for (const path of paths) {
    it('hydrates ' + path, async () => {
      await browser.visit(origin + path);
      // The offline label is empty in the prerendered HTML and set by an effect after hydration,
      // so waiting for it replaces fixed frame delays. If it never arrives the checks below report why.
      await browser.waitFor("document.querySelector('.local')?.textContent==='Browser processing'", {timeout: 10000}).catch(() => {});
      const result = await browser.evaluate(`({
        heading:document.querySelector('main h1')===serverHeading,
        text:document.querySelector('main h1').textContent===serverText,title:document.title===serverTitle,
        links:JSON.stringify(Array.from(document.querySelectorAll('main a[href]'),a=>a.getAttribute('href')))===JSON.stringify(serverLinks),
        faq:document.querySelector('main details')===serverFaq,active:document.querySelector('.local')?.textContent==='Browser processing',
        cards:document.querySelectorAll('.card').length,starred:document.querySelector('.favorite')?.getAttribute('aria-pressed'),
        workflow:document.querySelector('.workflow-step select')?.value})`);
      for (const key of ['heading', 'text', 'title', 'links', 'faq', 'active']) assert.ok(result[key], path + ' ' + key);
      if (path === '/') {
        assert.equal(result.cards, 60);
        assert.equal(result.starred, 'true');
      }
      if (path === '/tools/workflow/') assert.equal(result.workflow, 'compress-pdf');
    });
  }

  it('redirects a legacy hash route and keeps the query', async () => {
    await browser.visit(origin + '/tools/merge-pdf/?legacy=1#/split-pdf');
    await browser.waitFor("location.pathname==='/tools/split-pdf/'", {timeout: 5000});
    assert.equal(await browser.evaluate('location.pathname+location.search+location.hash'), '/tools/split-pdf/?legacy=1');
    assert.equal(await browser.evaluate("new URL(document.querySelector('link[rel=canonical]').href).pathname"), '/tools/split-pdf/');
  });

  it('logged no runtime or hydration errors', () => assert.deepEqual(failures, []));
});
