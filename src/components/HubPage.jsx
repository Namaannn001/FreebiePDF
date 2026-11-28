import React from 'react';
import { byId } from '../catalog.js';
import { href } from '../lib/href.js';
import { guides, toolLinks } from '../lib/pages.js';
import { ContentSections } from './ContentSections.jsx';
import { Faq } from './Faq.jsx';
import { PageLinks } from './Links.jsx';

/** Hub page: tool collection followed by supporting copy, FAQs, and guides. */
export function HubPage({ page }) {
  const links = toolLinks(page.toolIds);
  const articles = guides.filter(article =>
    article.toolIds?.some(id => page.toolIds?.includes(id)),
  );
  return (
    <article className="editorial">
      <header className="tool-intro">
        <h1>{page.h1}</h1>
      </header>
      {links.length > 0 && (
        <section aria-label="PDF tools">
          <ul className="hub-tools">
            {links.map(([id, anchor]) => (
              <li key={id}>
                <a href={href(id)}>{anchor}</a>
                <p>{byId.get(id).description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {(page.intro || page.body?.length > 0) && (
        <div className="content-section">
          {page.intro && <p>{page.intro}</p>}
          {page.body?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
      <ContentSections sections={page.sections} />
      <Faq items={page.faq} />
      {articles.length > 0 && (
        <section className="content-section">
          <h2>Guides</h2>
          <PageLinks items={articles} />
        </section>
      )}
    </article>
  );
}
