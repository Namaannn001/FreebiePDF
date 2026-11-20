import React from 'react';

/** Disclosure list. The first item can start open. */
export function Faq({ items, id, title = 'Questions & answers', firstOpen = false }) {
  if (!items?.length) return null;
  return (
    <section id={id} className={'help-panel faq' + (id ? ' site-faq' : '')}>
      <h2>{title}</h2>
      {items.map(([question, answer], index) => (
        <details key={question} open={firstOpen && index === 0 ? true : undefined}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </section>
  );
}
