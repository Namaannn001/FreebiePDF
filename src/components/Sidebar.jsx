import React from 'react';
import { byId, catalog } from '../catalog.js';
import { href } from '../lib/href.js';
import { pinned } from '../lib/nav.js';
import { brandName, categoryHubs, home } from '../lib/pages.js';
import { categoryIcons, Icon, iconFor } from './Icon.jsx';

/** Workspace navigation: search, all tools, starred, categories, and pinned tools. */
export function Sidebar({ page, filter, favorites, visible, close, drawer }) {
  const sideLink = path => (page.path === path ? 'side-link current' : 'side-link');
  const current = path => (page.path === path ? 'page' : undefined);
  return (
    <aside
      id="workspace-sidebar"
      ref={drawer}
      className={'sidebar' + (visible ? ' sidebar-open' : '')}
      aria-label="Workspace sidebar"
    >
      <div className="sidebar-brand">
        <a className="brand" href={href()}>
          <img src="logo.svg" width="30" height="30" alt="" />
          {brandName}
        </a>
        <button
          className="mobile-close icon-button"
          type="button"
          aria-label="Close navigation"
          onClick={close}
        >
          <Icon name="x" size={18} />
        </button>
      </div>
      <a className="side-search" href="./?search=1#catalog">
        <Icon name="search" size={16} />
        Find a tool
        <kbd aria-hidden="true">Ctrl K</kbd>
      </a>
      <nav aria-label="Workspace navigation">
        <div className="nav-block">
          <a className={sideLink('')} aria-current={current('')} href={href()}>
            <Icon name="grid" size={17} />
            All tools
          </a>
          <a
            className={'side-link' + (page === home && filter === 'Starred' ? ' current' : '')}
            href="./?view=starred#catalog"
          >
            <Icon name="star" size={17} />
            Starred
            <span className="side-count">{favorites.length || ''}</span>
          </a>
        </div>
        {categoryHubs.size > 0 && (
          <div className="nav-block">
            <p className="nav-label">Categories</p>
            {[...categoryHubs].map(([name, hub]) => (
              <a
                className={sideLink(hub.path)}
                aria-current={current(hub.path)}
                href={hub.path}
                key={name}
              >
                <Icon name={categoryIcons[name]} size={17} />
                {name}
                <span className="side-count">{catalog[name]?.length}</span>
              </a>
            ))}
          </div>
        )}
        <div className="nav-block nav-quick">
          <p className="nav-label">Quick access</p>
          {pinned.map(id => (
            <a
              className={sideLink(href(id))}
              aria-current={current(href(id))}
              href={href(id)}
              key={id}
            >
              <Icon name={iconFor(id)} size={17} />
              {byId.get(id).title}
            </a>
          ))}
        </div>
      </nav>
      <div className="sidebar-foot">
        <span className="privacy-mark" aria-hidden="true">
          <Icon name="shield" size={17} />
        </span>
        <div>
          <strong>On-device processing</strong>
          <small>Files stay in your browser.</small>
        </div>
      </div>
    </aside>
  );
}
