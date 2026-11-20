import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './components/App.jsx';
import { DrawerScrim } from './components/DrawerScrim.jsx';
import {
  closeMobileDrawer,
  drawerFocusables,
  openMobileDrawer,
  trapDrawerTab,
} from './hooks/useMobileDrawer.js';
import { confirmOfflineCache, offlineLabel, watchOffline } from './hooks/useOffline.js';
import { beginReadAloud } from './hooks/useReadAloud.js';
import { breadcrumbs, brandName, pages } from './lib/pages.js';
import { browserRoute, redirectLegacyHash } from './lib/route.js';
import './style.css';

export {
  App,
  DrawerScrim,
  beginReadAloud,
  breadcrumbs,
  brandName,
  closeMobileDrawer,
  confirmOfflineCache,
  drawerFocusables,
  offlineLabel,
  openMobileDrawer,
  pages,
  trapDrawerTab,
  watchOffline,
};

if (typeof document !== 'undefined' && !redirectLegacyHash()) {
  const root = document.getElementById('root');
  const app = <App serverRoute={root.dataset.route ?? browserRoute()} />;
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
