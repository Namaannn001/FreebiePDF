import React from 'react';
import { ToolLinks } from './Links.jsx';

/** Related-tool list on a tool page. Renders nothing when the list is empty. */
export function RelatedTools({ items }) {
  if (!items?.length) return null;
  return (
    <section className="help-panel related">
      <h2>Related tools</h2>
      <ToolLinks items={items} />
    </section>
  );
}
