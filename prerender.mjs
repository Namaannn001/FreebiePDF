import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';

const esc = value =>
  String(value).replace(
    /[&<>"']/g,
    char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
export const seoContentPath = root => resolve(root, 'src/seo-content.js');
export const emptySeoContent = 'export const brand={}, home={}, toolSeo={}, hubs=[], guides=[];';
export const slashGuard =
  "<script>if(!location.pathname.endsWith('/'))location.replace(location.pathname.replace(/\\/index\\.html$/,'').replace(/\\/?$/,'/')+location.search+location.hash);</script>";

// Cloudflare Pages production defaults to main. Set PRODUCTION_BRANCH for a different branch
// and set SITE_URL to the public HTTPS URL in Production. Previews can use CF_PAGES_URL.
export function deployment(env = process.env) {
  const cloudflare = env.CF_PAGES === '1';
  const production =
    cloudflare && env.CF_PAGES_BRANCH === (env.PRODUCTION_BRANCH?.trim() || 'main');
  const preview = cloudflare && !production;
  const siteUrl = env.SITE_URL?.trim();
  if (production && !siteUrl) {
    throw new Error(
      'SITE_URL is required for Cloudflare Pages production. Set it to the public HTTPS URL in the Production build environment.',
    );
  }
  const address = siteUrl || (preview ? env.CF_PAGES_URL?.trim() : null);
  if (!address) {
    console.warn(
      'No SITE_URL configured. This build omits absolute canonicals, the sitemap, and social image URLs.',
    );
    return { origin: null, preview };
  }
  let origin;
  try {
    origin = new URL(address);
  } catch {}
  if (
    !origin ||
    origin.protocol !== 'https:' ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password
  ) {
    const variable = siteUrl ? 'SITE_URL' : 'CF_PAGES_URL';
    throw new Error(variable + ' must be an HTTPS URL without a query, fragment, or credentials.');
  }
  origin.pathname = origin.pathname.replace(/\/?$/, '/');
  return { origin, preview };
}

export function homeHref() {
  return deployment().origin?.pathname ?? '/';
}

export function notFoundDocument(home = homeHref(), brand = 'Anywhere PDF') {
  return (
    '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | ' +
    esc(brand) +
    '</title>' +
    '<link rel="icon" href="' +
    esc(home) +
    'logo.svg" type="image/svg+xml"><link rel="icon" href="' +
    esc(home) +
    'icon.png" type="image/png"><link rel="apple-touch-icon" href="' +
    esc(home) +
    'apple-touch-icon.png"><link rel="manifest" href="' +
    esc(home) +
    'manifest.webmanifest">' +
    '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#101010;color:#ededed;font:16px/1.5 system-ui,sans-serif;text-align:center}main{padding:24px}h1{font-size:1.5rem;margin:8px 0}a{color:#e0e0e0}</style>' +
    '</head><body><main><strong>' +
    esc(brand) +
    '</strong><h1>Page not found</h1><p><a href="' +
    esc(home) +
    '">Back to all PDF tools</a></p></main></body></html>\n'
  );
}

function contentLastModified(projectRoot) {
  // The catalog and editorial data are published as one content snapshot.
  const sources = [
    'src/catalog.js',
    'src/guides.js',
    'src/site-content.js',
    'src/seo-content.js',
  ].filter(path => existsSync(resolve(projectRoot, path)));
  const modified = paths =>
    paths.map(path => statSync(resolve(projectRoot, path)).mtime.toISOString().slice(0, 10));
  const git = (...args) =>
    execFileSync('git', ['--no-optional-locks', ...args], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  try {
    const published = git('log', '-1', '--format=%cs', '--', ...sources);
    const dirty = git('status', '--porcelain', '--untracked-files=all', '--', ...sources)
      .split('\n')
      .map(line => line.slice(3))
      .filter(path => sources.includes(path));
    return [published, ...modified(dirty)].sort().at(-1) || modified(sources).sort().at(-1);
  } catch {
    return modified(sources).sort().at(-1);
  }
}

const faqSchema = items => ({
  '@type': 'FAQPage',
  mainEntity: items.map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  })),
});

function structuredData(page, site, trail, tools) {
  const { brand, url } = site;
  const graph = [];
  if (page.kind === 'home') {
    graph.push(
      { '@type': 'WebSite', name: brand, url: url(''), description: page.meta },
      { '@type': 'Organization', name: brand, url: url(''), logo: url('logo.svg') },
    );
  }
  if (page.kind === 'home' || page.kind === 'hub') {
    const entries =
      page.kind === 'home'
        ? tools
        : (page.toolIds?.map(id => tools.find(entry => entry.tool.id === id)).filter(Boolean) ??
          []);
    graph.push({
      '@type': 'ItemList',
      name: page.h1,
      itemListElement: entries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.h1,
        url: url(entry.path),
      })),
    });
  }
  if (page.kind === 'tool') {
    graph.push({
      '@type': ['SoftwareApplication', 'WebApplication'],
      name: page.h1,
      description: page.meta,
      url: url(page.path),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web browser',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
    });
  }
  if (trail.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: url(crumb.path),
      })),
    });
  }
  if (page.faq?.length) graph.push(faqSchema(page.faq));
  return { '@context': 'https://schema.org', '@graph': graph };
}

function headTags(page, { origin, preview }, brand, schema) {
  const canonical = origin ? new URL(page.path, origin).href : null;
  const image = origin ? new URL('social-preview.png', origin).href : null;
  const imageAlt = brand + ' offline PDF tools';
  const meta = (attribute, key, value) =>
    '<meta ' + attribute + '="' + key + '" content="' + esc(value) + '">';
  const og = (key, value) => meta('property', 'og:' + key, value);
  const twitter = (key, value) => meta('name', 'twitter:' + key, value);
  return [
    ...(preview ? [meta('name', 'robots', 'noindex')] : []),
    og('type', 'website'),
    og('site_name', brand),
    og('title', page.title),
    og('description', page.meta),
    twitter('card', image ? 'summary_large_image' : 'summary'),
    twitter('title', page.title),
    twitter('description', page.meta),
    ...(canonical
      ? [
          '<link rel="canonical" href="' + esc(canonical) + '">',
          og('url', canonical),
          og('image', image),
          og('image:width', 1200),
          og('image:height', 630),
          og('image:alt', imageAlt),
          twitter('image', image),
          twitter('image:alt', imageAlt),
        ]
      : []),
    '<script type="application/ld+json">' +
      JSON.stringify(schema).replace(/</g, '\\u003c') +
      '</script>',
  ].join('\n');
}

export async function prerender(root, projectRoot, site, seoContent) {
  const template = readFileSync(resolve(root, 'index.html'), 'utf8');
  const directory = mkdtempSync(resolve(projectRoot, '.anywherepdf-render-'));
  const entry = resolve(directory, 'app.mjs');
  try {
    const bundle = await build({
      absWorkingDir: projectRoot,
      entryPoints: ['src/main.jsx'],
      bundle: true,
      format: 'esm',
      platform: 'node',
      write: false,
      loader: { '.css': 'empty' },
      external: ['react', 'react-dom/client', './engine.js'],
      define: { 'import.meta.env.PROD': 'false' },
      plugins: [
        {
          name: 'seo-content',
          setup(builder) {
            builder.onResolve({ filter: /^\.\/seo-content\.js$/ }, () => ({
              path: seoContentPath(projectRoot),
              namespace: 'seo-content',
            }));
            builder.onLoad({ filter: /.*/, namespace: 'seo-content' }, () => ({
              contents: seoContent,
              resolveDir: resolve(projectRoot, 'src'),
            }));
          },
        },
      ],
    });
    writeFileSync(entry, bundle.outputFiles[0].text);
    const { App, pages, brandName, breadcrumbs } = await import(pathToFileURL(entry).href);
    const tools = pages.filter(page => page.kind === 'tool');
    const { origin } = site;
    for (const page of pages) {
      const base = page.path ? '../'.repeat(page.path.split('/').length - 1) : './';
      const url = path => (origin ? new URL(path, origin).href : base + path);
      const schema = structuredData(page, { brand: brandName, url }, breadcrumbs(page), tools);
      const tags = headTags(page, site, brandName, schema);
      const markup = renderToString(React.createElement(App, { serverRoute: page.path }));
      const html = template
        .replace(/<base href="[^"]*">/, () => '<base href="' + base + '">')
        .replace(/<title>[^<]*<\/title>/, () => '<title>' + esc(page.title) + '</title>')
        .replace(
          /<meta name="description" content="[^"]*">/,
          () => '<meta name="description" content="' + esc(page.meta) + '">',
        )
        .replace('<head>', () => '<head>' + slashGuard)
        .replace('</head>', () => tags + '\n</head>')
        .replace(
          '<div id="root"></div>',
          () => '<div id="root" data-route="' + esc(page.path) + '">' + markup + '</div>',
        );
      const destination = resolve(root, page.path);
      mkdirSync(destination, { recursive: true });
      writeFileSync(resolve(destination, 'index.html'), html);
    }
    writeFileSync(resolve(root, '404.html'), notFoundDocument(origin?.pathname ?? '/', brandName));
    writeFileSync(
      resolve(root, 'robots.txt'),
      'User-agent: *\nAllow: /\n' +
        (origin ? 'Sitemap: ' + new URL('sitemap.xml', origin).href + '\n' : ''),
    );
    if (origin) {
      const lastmod = contentLastModified(projectRoot);
      const items = pages
        .map(
          page =>
            '<url><loc>' +
            esc(new URL(page.path, origin).href) +
            '</loc><lastmod>' +
            lastmod +
            '</lastmod></url>',
        )
        .join('\n');
      writeFileSync(
        resolve(root, 'sitemap.xml'),
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          items +
          '\n</urlset>\n',
      );
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
