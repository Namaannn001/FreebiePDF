import React from 'react';
import { DrawerScrim } from './DrawerScrim.jsx';

/** Scrim plus sidebar while the mobile drawer is open. Adds no extra DOM node. */
export function MobileDrawer({ open, onClose, children }) {
  return (
    <>
      {open && <DrawerScrim onClose={onClose} />}
      {children}
    </>
  );
}
