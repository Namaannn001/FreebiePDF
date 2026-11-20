// Real Chrome: installs the service worker, shows "Ready offline", then works with the server stopped.
// Needs a build with SITE_URL set ("npm run test:build" first) and Chrome (see CHROME_PATH in README).
import assert from 'node:assert/strict';
import {after, before, describe, it} from 'node:test';
import {dist, requireDist} from '../helpers.mjs';
import {launchChrome, serveDist, sitemapPaths} from './chrome.mjs';

requireDist('sw.js', '404.html', 'sitemap.xml');

describe('offline in Chrome', {timeout: 120000}, () => {
  let browser, site, hub, guide;
  before(async () => {
    const paths = sitemapPaths(dist);
    hub = paths.find(path => path !== '/' && !path.startsWith('/tools/') && !path.startsWith('/guides/'));
    guide = paths.find(path => path.startsWith('/guides/'));
    site = await serveDist(dist);
    browser = await launchChrome();
    await browser.open();
  });
  after(async () => {
    await site?.stop();
    await browser?.close();
  });

  it('installs the full cache and shows Ready offline', async () => {
    await browser.visit(site.origin + '/');
    await browser.waitFor("document.querySelector('.local').textContent==='Ready offline'");
    assert.equal(await browser.evaluate('Boolean(navigator.serviceWorker.controller)'), true);
  });

  it('opens a hub and a guide with the server stopped', async () => {
    await site.stop();
    for (const path of [hub, guide].filter(Boolean)) {
      await browser.visit(site.origin + path);
      assert.equal(await browser.evaluate("Boolean(document.querySelector('main h1')?.textContent)"), true, path);
    }
  });

  it('generates a PDF offline', async () => {
    await browser.visit(site.origin + '/tools/create-pdf/');
    await browser.evaluate(`
      const textarea=document.querySelector('textarea');
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(textarea,'Offline content');
      textarea.dispatchEvent(new Event('input',{bubbles:true}));
    `);
    await browser.evaluate("document.querySelector('button.primary').click()");
    await browser.waitFor("Boolean(document.querySelector('#result a[download]'))");
    assert.equal(await browser.evaluate("document.querySelector('#result a').download.endsWith('.pdf')"), true);
  });

  it('serves the cached 404 for unknown routes', async () => {
    await browser.visit(site.origin + '/nonexistent/');
    assert.equal(await browser.evaluate("document.querySelector('main h1').textContent"), 'Page not found');
  });
});
