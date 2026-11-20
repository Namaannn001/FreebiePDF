/** Load the PDF engine on demand so it stays out of the first page bundle. */
export function loadEngine() {
  return import('./engine.js');
}
