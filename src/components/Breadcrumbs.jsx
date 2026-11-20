import React from 'react';
import { breadcrumbs } from '../lib/pages.js';
import { href } from '../lib/href.js';

/** Home, category hub, and current page. Renders nothing on the home page. */
export function Breadcrumbs({ page }) {
  const trail = breadcrumbs(page);
  return (
    trail.length > 0 && (
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map(({ path, name }, index) => (
            <li key={path}>
              {index === trail.length - 1 ? (
                <span aria-current="page">{name}</span>
              ) : (
                <a href={path || href()}>{name}</a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  );
}
