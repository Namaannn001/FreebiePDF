import React from 'react';
import { all } from '../catalog.js';
import { popular } from '../lib/nav.js';
import { brandName, guides, hubs } from '../lib/pages.js';
import { PageLinks, ToolLinks } from './Links.jsx';

/** Popular tools, hubs, guides, and the privacy link. */
export function SiteFooter() {
  return (
    <footer>
      <nav aria-label="Site links">
        <div>
          <h2>Popular tools</h2>
          <ToolLinks items={popular} />
        </div>
        {hubs.length > 0 && (
          <div>
            <h2>PDF tool collections</h2>
            <PageLinks items={hubs} />
          </div>
        )}
        {guides.length > 0 && (
          <div>
            <h2>Guides</h2>
            <PageLinks items={guides} />
          </div>
        )}
      </nav>
      <span>
        {brandName} · {all.length} tools
      </span>
      <a href="./#common-questions">Privacy and offline access</a>
    </footer>
  );
}
