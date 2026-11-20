import { byId } from '../catalog.js';
import { href } from './href.js';

/** Path of the open page relative to <base>, with a trailing slash. */
export function browserRoute() {
  const base = new URL(document.baseURI);
  const path = location.pathname.slice(base.pathname.length).replace(/(^|\/)index\.html$/, '$1');
  return path && !path.endsWith('/') ? path + '/' : path;
}

/** Replace a legacy #/tool-id URL with the real tool path. */
export function redirectLegacyHash() {
  if (!location.hash.startsWith('#/')) return false;
  const tool = byId.get(location.hash.slice(2));
  if (!tool) return false;
  const target = new URL(href(tool.id), document.baseURI);
  target.search = location.search;
  location.replace(target.href);
  return true;
}
