import React from 'react';
import { byId } from '../catalog.js';
import { href } from '../lib/href.js';

/** Bullet list of tool links. Unknown ids are skipped. */
export function ToolLinks({ items }) {
  return (
    <ul className="link-list">
      {items
        .filter(([id]) => byId.has(id))
        .map(([id, anchor]) => (
          <li key={id}>
            <a href={href(id)}>{anchor}</a>
          </li>
        ))}
    </ul>
  );
}

/** Bullet list of hub or guide pages. */
export function PageLinks({ items }) {
  return (
    <ul className="link-list">
      {items.map(page => (
        <li key={page.path}>
          <a href={page.path}>{page.h1}</a>
        </li>
      ))}
    </ul>
  );
}
