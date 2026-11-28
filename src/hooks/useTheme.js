import { themeKey, useStored } from './useStored.js';

export const themes = ['system', 'light', 'dark'];
const surface = { light: '#f3f3f3', dark: '#0c0c0c' };

/** Set the theme on <html>. "system" removes the override so CSS follows prefers-color-scheme. */
export function applyTheme(theme, root = document.documentElement) {
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
  else delete root.dataset.theme;
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    const scheme = meta.media.includes('light') ? 'light' : 'dark';
    meta.content = surface[theme === 'light' || theme === 'dark' ? theme : scheme];
  }
}

/**
 * Saved theme choice. The first render uses "system" so prerendered HTML and hydration match.
 * The inline script in index.html applies the saved theme before paint, so only changes are applied here.
 */
export function useTheme() {
  const [theme, setTheme] = useStored(themeKey, 'system', value => themes.includes(value));
  function next() {
    const value = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(value);
    applyTheme(value);
  }
  return [theme, next];
}
