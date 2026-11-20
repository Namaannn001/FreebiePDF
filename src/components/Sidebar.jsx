import React from 'react';
import { byId } from '../catalog.js';
import { href } from '../lib/href.js';
import { categoryMarks, pinned } from '../lib/nav.js';
import { brandName, categoryHubs, home } from '../lib/pages.js';

/** Workspace navigation: all tools, starred, categories, and pinned tools. */
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
          <img src="logo.svg" width="34" height="34" alt="" />
          {brandName}
        </a>
        <button
          className="mobile-close icon-button"
          type="button"
          aria-label="Close navigation"
          onClick={close}
        >
          ×
        </button>
      </div>
      <nav aria-label="Workspace navigation">
        <div className="nav-block">
          <p className="nav-label">Workspace</p>
          <a className={sideLink('')} aria-current={current('')} href={href()}>
            <span aria-hidden="true">◫</span>All tools
          </a>
          <a
            className={'side-link' + (page === home && filter === 'Starred' ? ' current' : '')}
            href="./?view=starred#catalog"
          >
            <span aria-hidden="true">☆</span>Starred
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
                <span aria-hidden="true">{categoryMarks[name]}</span>
                {name}
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
              <span aria-hidden="true">·</span>
              {byId.get(id).title}
            </a>
          ))}
        </div>
      </nav>
      <div className="sidebar-foot">
        <span className="privacy-mark" aria-hidden="true">
          ◈
        </span>
        <div>
          <strong>On-device processing</strong>
          <small>Files stay in your browser.</small>
        </div>
      </div>
    </aside>
  );
}
