import { useEffect, useRef } from 'react';

/** Focusable controls inside the drawer, skipping disabled and hidden ones. */
export function drawerFocusables(panel) {
  if (!panel?.querySelectorAll) return [];
  return [
    ...panel.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])',
    ),
  ].filter(el => el.tabIndex !== -1 && !el.hasAttribute?.('disabled') && !el.closest?.('[hidden]'));
}

/** Mark the sidebar as a modal dialog while it covers the page. */
export function openMobileDrawer(panel) {
  panel?.setAttribute('role', 'dialog');
  panel?.setAttribute('aria-modal', 'true');
  panel?.setAttribute('aria-label', 'Workspace navigation');
}

/** Remove the dialog attributes when the drawer closes. */
export function closeMobileDrawer(panel) {
  panel?.removeAttribute('role');
  panel?.removeAttribute('aria-modal');
}

/** Keep Tab inside the open drawer. */
export function trapDrawerTab(event, panel) {
  if (event.key !== 'Tab' || !panel) return;
  const items = drawerFocusables(panel);
  const active = document.activeElement;
  if (!items.length) {
    event.preventDefault();
    return;
  }
  const first = items[0],
    last = items.at(-1);
  const outside = !panel.contains(active);
  if (event.shiftKey && (active === first || outside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault();
    first.focus();
  }
}

/** Escape, inert background, and focus trap for the narrow-screen drawer. */
export function useMobileDrawer(open, setOpen) {
  const shell = useRef(null),
    menu = useRef(null),
    drawer = useRef(null);
  useEffect(() => {
    if (!open) return;
    function escape(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);
  useEffect(() => {
    // The drawer is an overlay only at narrow widths, so inert and focus handling apply only there.
    const narrow = window.matchMedia('(max-width: 720px)');
    if (!open || !narrow.matches) return;
    const main = shell.current,
      panel = drawer.current;
    main?.setAttribute('inert', '');
    openMobileDrawer(panel);
    panel?.querySelector('a[href],button')?.focus();
    function onTab(event) {
      trapDrawerTab(event, panel);
    }
    function leave() {
      if (!narrow.matches) setOpen(false);
    }
    document.addEventListener('keydown', onTab);
    narrow.addEventListener('change', leave);
    return () => {
      document.removeEventListener('keydown', onTab);
      narrow.removeEventListener('change', leave);
      closeMobileDrawer(panel);
      main?.removeAttribute('inert');
      if (panel?.contains(document.activeElement) || document.activeElement === document.body)
        menu.current?.focus();
    };
  }, [open]);
  return { shell, menu, drawer };
}
