import React from 'react';
import { guides } from '../lib/pages.js';
import { Faq } from './Faq.jsx';
import { PageLinks } from './Links.jsx';
import { RelatedTools } from './RelatedTools.jsx';

/** How-to steps, FAQ, related tools, and guides for one tool. */
export function ToolGuide({ page }) {
  const { tool, steps, faq, related } = page;
  const articles = guides.filter(article => article.toolIds?.includes(tool.id));
  return (
    <div className="tool-help">
      <section className="help-panel" aria-labelledby="how-title">
        <div className="section-label">
          <span aria-hidden="true">↳</span>
          <h2 id="how-title">How to use it</h2>
        </div>
        <ol className="steps">
          {steps.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="output-note">
          <strong>Output</strong>
          <span>{tool.format}</span>
        </div>
      </section>
      <Faq items={faq} />
      <a href="./#common-questions">Questions about privacy and offline use</a>
      <RelatedTools items={related} />
      {articles.length > 0 && (
        <section className="help-panel related">
          <h2>Guides</h2>
          <PageLinks items={articles} />
        </section>
      )}
    </div>
  );
}
