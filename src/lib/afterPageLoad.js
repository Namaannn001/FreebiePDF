/** Schedule nonessential work after page load, during idle time when available. */
export function afterPageLoad(callback) {
  let cancelScheduled;
  function schedule() {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(callback, { timeout: 2000 });
      cancelScheduled = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, 0);
      cancelScheduled = () => clearTimeout(id);
    }
  }
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });

  return () => {
    window.removeEventListener('load', schedule);
    cancelScheduled?.();
  };
}
