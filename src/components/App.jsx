import React, { useEffect, useState } from 'react';
import { useMobileDrawer } from '../hooks/useMobileDrawer.js';
import { useOffline } from '../hooks/useOffline.js';
import { starredKey, useStored } from '../hooks/useStored.js';
import { href } from '../lib/href.js';
import { pagesByPath } from '../lib/pages.js';
import { redirectLegacyHash } from '../lib/route.js';
import { Breadcrumbs } from './Breadcrumbs.jsx';
import { GuidePage } from './GuidePage.jsx';
import { HomePage } from './HomePage.jsx';
import { HubPage } from './HubPage.jsx';
import { MobileDrawer } from './MobileDrawer.jsx';
import { Sidebar } from './Sidebar.jsx';
import { SiteFooter } from './SiteFooter.jsx';
import { ToolPage } from './ToolPage.jsx';
import { Topbar } from './Topbar.jsx';

/** Application shell: sidebar, top bar, the current page, and the footer. */
export function App({ serverRoute = '' } = {}) {
  const page = pagesByPath.get(serverRoute) ?? {
    kind: 'missing',
    path: serverRoute,
    h1: 'Page not found',
  };
  const offline = useOffline();
  const [filter, setFilter] = useState('All tools');
  const [sidebar, setSidebar] = useState(false);
  const { shell, menu, drawer } = useMobileDrawer(sidebar, setSidebar);
  const [favorites, setFavorites] = useStored(starredKey, [], Array.isArray);
  useEffect(() => {
    if (new URLSearchParams(location.search).get('view') === 'starred') setFilter('Starred');
    if (location.hash === '#common-questions')
      document.getElementById('common-questions')?.scrollIntoView();
    window.addEventListener('hashchange', redirectLegacyHash);
    return () => window.removeEventListener('hashchange', redirectLegacyHash);
  }, []);
  function toggle(id) {
    setFavorites(current =>
      current.includes(id) ? current.filter(value => value !== id) : [...current, id],
    );
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href={(page.path || href()) + '#main-content'} inert={sidebar}>
        Skip to main content
      </a>
      <MobileDrawer open={sidebar} onClose={() => setSidebar(false)}>
        <Sidebar
          page={page}
          filter={filter}
          favorites={favorites}
          visible={sidebar}
          close={() => setSidebar(false)}
          drawer={drawer}
        />
      </MobileDrawer>
      <div className="main-shell" ref={shell}>
        <Topbar
          menu={menu}
          sidebar={sidebar}
          offline={offline}
          onToggle={() => setSidebar(!sidebar)}
        />
        <main id="main-content" tabIndex={-1}>
          {page.kind === 'missing' ? (
            <section className="empty-state">
              <h1>{page.h1}</h1>
              <a href={href()}>Browse all tools</a>
            </section>
          ) : (
            <>
              <Breadcrumbs page={page} />
              {page.kind === 'home' ? (
                <HomePage
                  favorites={favorites}
                  toggle={toggle}
                  filter={filter}
                  setFilter={setFilter}
                />
              ) : page.kind === 'tool' ? (
                <ToolPage page={page} />
              ) : page.kind === 'hub' ? (
                <HubPage page={page} />
              ) : (
                <GuidePage page={page} />
              )}
            </>
          )}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
