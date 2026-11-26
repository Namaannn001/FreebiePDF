import { useEffect, useState } from 'react';

// Storage keys keep the legacy "freebiepdf.web.*" prefix so saved stars and workflows survive the rebrand.
export const starredKey = 'freebiepdf.web.starred';
export const workflowKey = 'freebiepdf.web.workflow';
export const themeKey = 'freebiepdf.web.theme';

/** Read JSON from localStorage, falling back to the pre-rebrand paperdesk.* key. */
export const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) return JSON.parse(saved) ?? fallback;
    const previous = localStorage.getItem(key.replace(/^freebiepdf\./, 'paperdesk.'));
    return previous === null ? fallback : (JSON.parse(previous) ?? fallback);
  } catch {
    return fallback;
  }
};

/** Persist JSON in localStorage. Storage failures are ignored. */
export const store = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/**
 * State backed by localStorage. The first render uses `fallback` so prerender and hydration match;
 * the saved value is applied after mount. `accept` can reject a corrupt saved value.
 */
export function useStored(key, fallback, accept = () => true) {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    const saved = load(key, fallback);
    if (accept(saved)) setValue(saved);
  }, [key]);
  function update(next) {
    setValue(current => {
      const resolved = typeof next === 'function' ? next(current) : next;
      store(key, resolved);
      return resolved;
    });
  }
  return [value, update];
}
