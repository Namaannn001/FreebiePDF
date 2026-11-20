import React from 'react';

/** Full-screen click target behind the open mobile sidebar. */
export function DrawerScrim({ onClose }) {
  return (
    <button
      className="sidebar-scrim"
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      onMouseDown={event => event.preventDefault()}
      onClick={onClose}
    />
  );
}
