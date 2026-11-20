import React from 'react';

/** Headed blocks of paragraphs from a page's SEO sections. */
export function ContentSections({ sections = [] }) {
  return sections.map(({ heading, body }) => (
    <section className="content-section" key={heading}>
      <h2>{heading}</h2>
      {body?.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </section>
  ));
}
