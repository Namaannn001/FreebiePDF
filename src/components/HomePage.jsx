import React, { useEffect, useRef, useState } from 'react';
import { byId, catalog } from '../catalog.js';
import { href } from '../lib/href.js';
import { categoryColors, popular, startWith } from '../lib/nav.js';
import { brandName, categoryLinks, home } from '../lib/pages.js';
import { ContentSections } from './ContentSections.jsx';
import { Faq } from './Faq.jsx';
import { categoryIcons, Icon, iconFor } from './Icon.jsx';
import { ToolLinks } from './Links.jsx';

const promises = [
  ['shield', 'Files stay on this device'],
  ['cloud', 'Usable without internet'],
  ['zap', 'No account needed'],
];

/** Home page: search, quick actions, popular tools, and the filterable catalog. */
export function HomePage({ favorites, toggle, filter, setFilter }) {
  const [query, setQuery] = useState('');
  const search = useRef(null);
  const popularCopy = home.sections?.find(section => section.heading === 'Popular PDF tools');
  const otherSections = home.sections?.filter(section => section !== popularCopy);
  useEffect(() => {
    if (new URLSearchParams(location.search).has('search')) search.current?.focus();
    function shortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        search.current?.focus();
      }
    }
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  const groups = Object.entries(catalog)
    .map(([name, list]) => [
      name,
      list.filter(
        tool =>
          (filter !== 'Starred' || favorites.includes(tool.id)) &&
          (filter === 'All tools' || filter === 'Starred' || filter === name) &&
          [tool.title, tool.description, tool.id]
            .join(' ')
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    ])
    .filter(([, list]) => list.length);
  const count = groups.reduce((sum, [, list]) => sum + list.length, 0);
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>{home.h1}</h1>
          <p>{home.hero}</p>
          <label className="searchbox">
            <Icon name="search" size={18} className="search-icon" />
            <span className="sr-only">Find a tool</span>
            <input
              ref={search}
              type="search"
              placeholder="Search PDF tools"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
            <kbd aria-hidden="true">Ctrl K</kbd>
          </label>
          <ul className="promises">
            {promises.map(([icon, text]) => (
              <li key={text}>
                <Icon name={icon} size={16} />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="start-with" aria-labelledby="start-title">
        <h2 id="start-title" className="eyebrow">
          Most used
        </h2>
        <div className="start-grid">
          {startWith.map((id, index) => {
            const tool = byId.get(id);
            return (
              <a
                className={'start-tile' + (index === 0 ? ' featured' : '')}
                href={href(id)}
                key={id}
              >
                <span className="start-icon">
                  <Icon name={iconFor(id)} size={20} />
                </span>
                <span>
                  <strong>{tool.title}</strong>
                  <small>{tool.description}</small>
                </span>
              </a>
            );
          })}
        </div>
      </section>
      <ContentSections sections={otherSections?.slice(0, 1)} />
      <section className="content-section">
        <h2>Popular PDF tools</h2>
        {popularCopy?.body?.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <ToolLinks items={popular} />
      </section>
      <section id="catalog" aria-labelledby="catalog-title">
        <div className="catalog-heading">
          <h2 id="catalog-title">{query.trim() ? 'Search results' : 'Tool library'}</h2>
          <p>
            {count} {count === 1 ? 'tool' : 'tools'}
          </p>
        </div>
        <div className="filter-nav" role="group" aria-label="Filter tools">
          {['All tools', 'Starred', ...Object.keys(catalog)].map(name => (
            <button
              type="button"
              aria-pressed={filter === name}
              key={name}
              onClick={() => setFilter(name)}
            >
              {name}
            </button>
          ))}
        </div>
        {groups.map(([category, list]) => {
          const hub = categoryLinks.get(category)?.hub;
          return (
            <section className="group" key={category}>
              <div className="group-heading">
                <span className={'category-icon ' + categoryColors[category]}>
                  <Icon name={categoryIcons[category]} size={16} />
                </span>
                <h3>{hub ? <a href={hub.path}>{category}</a> : category}</h3>
              </div>
              <div className="grid">
                {list.map(tool => (
                  <div className="tool-tile" key={tool.id}>
                    <a className="card" href={href(tool.id)} aria-labelledby={'card-' + tool.id}>
                      <span className={'tool-icon ' + categoryColors[category]}>
                        <Icon name={iconFor(tool.id, category)} size={18} />
                      </span>
                      <span className="card-body">
                        <strong id={'card-' + tool.id}>{tool.title}</strong>
                        <span>{tool.description}</span>
                        <span className="format">{tool.format}</span>
                      </span>
                    </a>
                    <button
                      className="favorite icon-button"
                      type="button"
                      aria-label={(favorites.includes(tool.id) ? 'Unstar ' : 'Star ') + tool.title}
                      aria-pressed={favorites.includes(tool.id)}
                      onClick={() => toggle(tool.id)}
                    >
                      <Icon name="star" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {!groups.length && (
          <div className="empty-state">
            <strong>
              {filter === 'Starred' && !query ? 'No starred tools yet' : 'No matching tools'}
            </strong>
            <p>
              {filter === 'Starred' && !query
                ? 'Star a tool to save it here.'
                : 'Try a different search term or category.'}
            </p>
          </div>
        )}
      </section>
      <ContentSections sections={otherSections?.slice(1)} />
      <Faq id="common-questions" title={`${brandName} FAQ`} items={home.faq} firstOpen />
    </>
  );
}
