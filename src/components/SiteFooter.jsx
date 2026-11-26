import React from 'react';
import { all } from '../catalog.js';
import { popular } from '../lib/nav.js';
import { brandName } from '../lib/pages.js';
import { ToolLinks } from './Links.jsx';

/** Brand line, five popular tools, and the privacy link. */
export function SiteFooter() {
  return (
    <footer>
      <span>
        {brandName} · {all.length} tools
      </span>
      <nav aria-label="Site links">
        <ToolLinks items={popular.slice(0, 5)} />
        <a href="./#common-questions">Privacy and offline access</a>
      </nav>
    </footer>
  );
}
