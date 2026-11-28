import React from 'react';
import { useTheme } from '../hooks/useTheme.js';
import { Icon } from './Icon.jsx';

const themeLabels = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' };
const themeIcons = { system: 'monitor', light: 'sun', dark: 'moon' };

/** Top bar with the menu button, the current page title, the offline status, and the theme switch. */
export function Topbar({ menu, sidebar, offline, onToggle, title }) {
  const [theme, nextTheme] = useTheme();
  return (
    <header className="topbar">
      <div className="topbar-title">
        <button
          className="menu-button icon-button"
          ref={menu}
          type="button"
          aria-label="Open navigation"
          aria-controls="workspace-sidebar"
          aria-expanded={sidebar}
          onClick={onToggle}
        >
          <Icon name="menu" size={20} />
        </button>
        <strong>{title}</strong>
      </div>
      <div className="topbar-actions">
        <span className="local" role="status">
          {offline && (
            <>
              <i />
              {offline}
            </>
          )}
        </span>
        <button
          className="theme-button icon-button"
          type="button"
          onClick={nextTheme}
          aria-label={themeLabels[theme] + '. Switch theme'}
          title={themeLabels[theme]}
        >
          <Icon name={themeIcons[theme]} size={18} />
        </button>
      </div>
    </header>
  );
}
