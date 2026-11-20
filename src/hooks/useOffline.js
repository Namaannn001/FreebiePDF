import { useEffect, useState } from 'react';

/** Short status string for the top bar. */
export function offlineLabel(kind, onLine) {
  if (kind === 'unsupported') return 'Browser processing';
  if (!onLine) return 'Offline';
  return kind === 'ready' ? 'Ready offline' : 'Preparing offline cache';
}

/** Ask the service worker whether the offline cache is complete. */
export function confirmOfflineCache(worker, timeout = 5000) {
  const id = crypto.randomUUID();
  return new Promise(resolve => {
    const timer = setTimeout(finish, timeout, false);
    function finish(ok) {
      clearTimeout(timer);
      navigator.serviceWorker.removeEventListener('message', onMessage);
      resolve(ok === true);
    }
    function onMessage(event) {
      if (event.data?.type !== 'anywherepdf-cache-status' || event.data.id !== id) return;
      finish(event.data.ok === true);
    }
    navigator.serviceWorker.addEventListener('message', onMessage);
    try {
      worker.postMessage({ type: 'anywherepdf-cache-check', id });
    } catch {
      finish(false);
    }
  });
}

/** Subscribe to online, offline, and service-worker changes. Returns an unsubscribe function. */
export function watchOffline(setState) {
  let cancel = false,
    generation = 0;
  const show = kind => {
    if (!cancel) setState(offlineLabel(kind, navigator.onLine));
  };
  async function confirm() {
    const gen = ++generation;
    if (!('serviceWorker' in navigator) || !import.meta.env.PROD) {
      show('unsupported');
      return;
    }
    try {
      const registration = await navigator.serviceWorker.register(
        new URL('./sw.js', document.baseURI),
      );
      await navigator.serviceWorker.ready;
      if (cancel || gen !== generation) return;
      const worker = navigator.serviceWorker.controller || registration.active;
      if (!worker) {
        show('preparing');
        return;
      }
      const ready = await confirmOfflineCache(worker);
      if (cancel || gen !== generation) return;
      show(ready ? 'ready' : 'preparing');
    } catch {
      if (!cancel && gen === generation) show('unsupported');
    }
  }
  function offline() {
    if (!cancel) setState('Offline');
  }
  function start() {
    window.addEventListener('online', confirm);
    navigator.serviceWorker?.addEventListener('controllerchange', confirm);
    confirm();
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
  window.addEventListener('offline', offline);
  return () => {
    cancel = true;
    window.removeEventListener('load', start);
    window.removeEventListener('online', confirm);
    window.removeEventListener('offline', offline);
    navigator.serviceWorker?.removeEventListener('controllerchange', confirm);
  };
}

/** Offline status label. Starts blank so prerendered HTML carries no status text. */
export function useOffline() {
  const [state, setState] = useState('');
  useEffect(() => watchOffline(setState), []);
  return state;
}
