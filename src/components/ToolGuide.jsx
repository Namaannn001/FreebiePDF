import React from 'react';
import { guides } from '../lib/pages.js';
import { Faq } from './Faq.jsx';
import { PageLinks } from './Links.jsx';
import { RelatedTools } from './RelatedTools.jsx';

/** Instructions beside the tool form. */
export function ToolInstructions({ steps, format }) {
  return (
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
        <span>{format}</span>
      </div>
    </section>
  );
}

/** Frequently asked questions and links below the workspace. */
export function ToolGuide({ page }) {
  const { tool, faq, related } = page;
  const articles = guides.filter(article => article.toolIds?.includes(tool.id));
  return (
    <div className="tool-layout tool-resources">
      <div className="tool-help">
        <Faq items={faq} />
        <a href="./#common-questions">Questions about privacy and offline use</a>
      </div>
      {(related?.length > 0 || articles.length > 0) && (
        <div className="tool-help">
          <RelatedTools items={related} />
          {articles.length > 0 && (
            <section className="help-panel related">
              <h2>Guides</h2>
              <PageLinks items={articles} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
