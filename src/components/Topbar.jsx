import React from 'react';
import { href } from '../lib/href.js';

/** Top bar with the menu button and the offline status. */
export function Topbar({ menu, sidebar, offline, onToggle }) {
  return (
    <header className="topbar">
      <div>
        <button
          className="menu-button icon-button"
          ref={menu}
          type="button"
          aria-label="Open navigation"
          aria-controls="workspace-sidebar"
          aria-expanded={sidebar}
          onClick={onToggle}
        >
          ☰
        </button>
        <a href={href()}>Workspace</a>
      </div>
      <span className="local">
        <i />
        {offline}
      </span>
    </header>
  );
}
