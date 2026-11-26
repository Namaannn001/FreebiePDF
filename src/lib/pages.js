import { all, catalog } from '../catalog.js';
import { guide } from '../guides.js';
import seo from '../seo.js';
import { websiteFaq } from '../site-content.js';
import { href } from './href.js';

/** Display name from SEO content, with a fixed fallback. */
export const brandName = seo.brand?.name ?? 'Anywhere PDF';

const home = {
  kind: 'home',
  path: '',
  title: 'Free Offline PDF Tools | ' + brandName,
  meta: `Merge, split, compress, edit, and convert PDFs for free with ${all.length} browser-based tools. Files stay on your device and the tools work offline.`,
  h1: 'PDF tools',
  hero: `Edit, merge, and convert PDFs free in your browser. Use all ${all.length} tools offline after the first visit.`,
  sections: [],
  ...seo.home,
  faq: seo.home?.faq ?? websiteFaq,
};

const toolPages = all.map(tool => {
  const content = seo.toolSeo?.[tool.id];
  const fallback = content?.steps && content?.faq ? null : guide(tool);
  return {
    kind: 'tool',
    path: href(tool.id),
    tool,
    title: content?.title ?? `${tool.title} Online, Free | ${brandName}`,
    meta:
      content?.meta ??
      `${tool.description} Use ${brandName} free in your browser. Works offline after the first visit.`,
    h1: content?.h1 ?? tool.title,
    intro: content?.intro ?? tool.description,
    steps: content?.steps ?? fallback.steps,
    faq: content?.faq ?? fallback.questions,
    related:
      content?.related ??
      (Object.values(catalog).find(list => list.includes(tool)) ?? [])
        .filter(entry => entry.id !== tool.id)
        .slice(0, 3)
        .map(entry => [entry.id, entry.title]),
  };
});

const toolsById = new Map(toolPages.map(page => [page.tool.id, page]));
const hubs = (seo.hubs ?? []).map(hub => ({ ...hub, kind: 'hub', path: hub.slug + '/' }));
const pageTitleKey = title => title.trim().toLowerCase().replace(/\s+/g, ' ');
const landingTitles = new Set([home, ...toolPages, ...hubs].map(page => pageTitleKey(page.title)));
const guides = (seo.guides ?? []).map(article => ({
  ...article,
  kind: 'guide',
  path: 'guides/' + article.slug + '/',
  // A distinct guide heading can disambiguate an editorial title shared with a tool.
  title: landingTitles.has(pageTitleKey(article.title))
    ? `${article.h1} | ${brandName}`
    : article.title,
}));

/** Every prerendered page: home, tools, hubs, and guides. */
export const pages = [home, ...toolPages, ...hubs, ...guides];
export const pagesByPath = new Map(pages.map(page => [page.path, page]));

const categoryHubs = new Map(
  Object.entries(catalog).flatMap(([name, tools]) => {
    const preferred = {
      Organize: 'organize-pdf',
      'Edit & protect': 'edit-pdf',
      Convert: 'convert-pdf',
    }[name];
    const ids = new Set(tools.map(tool => tool.id));
    // If there's no single category hub, pick the hub covering the most tools in this category.
    const coverage = hub => (hub.toolIds ?? []).filter(id => ids.has(id)).length;
    const hub =
      hubs.find(hub => hub.slug === preferred) ??
      hubs.filter(hub => coverage(hub) > 0).sort((a, b) => coverage(b) - coverage(a))[0];
    return hub ? [[name, hub]] : [];
  }),
);

/**
 * Navigation target per category. A category gets its hub page unless an earlier category already
 * uses that hub; otherwise it opens the home tool library filtered to that category.
 */
const categoryLinks = new Map();
for (const name of Object.keys(catalog)) {
  const hub = categoryHubs.get(name);
  const shared = hub && [...categoryLinks.values()].some(link => link.hub === hub);
  categoryLinks.set(
    name,
    hub && !shared
      ? { hub, path: hub.path }
      : { hub: null, path: './?category=' + encodeURIComponent(name) + '#catalog' },
  );
}
export { categoryLinks };

/** Home, the matching category hub, and the current page. Empty on the home page. */
export function breadcrumbs(page) {
  if (page === home) return [];
  const category =
    page.tool && Object.keys(catalog).find(name => catalog[name].includes(page.tool));
  const hub =
    page.tool &&
    (categoryHubs.get(category)?.toolIds?.includes(page.tool.id)
      ? categoryHubs.get(category)
      : hubs.find(hub => hub.toolIds?.includes(page.tool.id)));
  return [
    { path: '', name: 'All tools' },
    ...(hub ? [{ path: hub.path, name: hub.h1 }] : []),
    { path: page.path, name: page.h1 },
  ];
}

/** Tool id and heading pairs for ids that have a page. */
export const toolLinks = (ids = []) =>
  ids.filter(id => toolsById.has(id)).map(id => [id, toolsById.get(id).h1]);

export { categoryHubs, guides, home, hubs };
