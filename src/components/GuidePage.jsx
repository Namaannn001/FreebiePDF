import React from 'react';
import { href } from '../lib/href.js';
import { toolLinks } from '../lib/pages.js';
import { ContentSections } from './ContentSections.jsx';
import { Faq } from './Faq.jsx';
import { ToolLinks } from './Links.jsx';

/** Guide article, with a link to the tool it describes. */
export function GuidePage({ page }) {
  const links = toolLinks(page.toolIds);
  return (
    <article className="editorial">
      <header className="tool-intro">
        <h1>{page.h1}</h1>
        <p>{page.intro}</p>
      </header>
      {links.length > 0 && (
        <p>
          <a href={href(links[0][0])}>Open {links[0][1]}</a>
        </p>
      )}
      {page.body?.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <ContentSections sections={page.sections} />
      {links.length > 0 && (
        <section className="content-section">
          <h2>Tools in this guide</h2>
          <ToolLinks items={links} />
        </section>
      )}
      <Faq items={page.faq} />
    </article>
  );
}
