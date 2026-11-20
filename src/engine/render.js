/** @file PDF.js document lifetimes, text extraction, and raster page helpers. */
import { PDFDocument } from 'pdf-lib';
import { range, saved } from './shared.js';

let renderer;
async function getRenderer() {
  renderer ??= Promise.all([
    import('pdfjs-dist/build/pdf.mjs'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]).then(([engine, worker]) => {
    engine.GlobalWorkerOptions.workerSrc = worker.default;
    return engine;
  });
  return renderer;
}

export async function withRender(file, options, work, baseUrl) {
  const engine = await getRenderer();
  const base = new URL(baseUrl, document.baseURI);
  const task = engine.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    password: options.password || undefined,
    isEvalSupported: false,
    cMapUrl: new URL('cmaps/', base).href,
    cMapPacked: true,
    standardFontDataUrl: new URL('standard_fonts/', base).href,
  });
  try {
    return await work(await task.promise);
  } finally {
    await task.destroy();
  }
}

export async function render(page, dpi) {
  const scale = Number(dpi || 144) / 72;
  const viewport = page.getViewport({ scale });
  if (viewport.width * viewport.height > 40_000_000)
    throw new Error('Choose a lower resolution for this page.');
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  await page.render({ canvasContext: canvas.getContext('2d'), viewport, background: 'white' })
    .promise;
  return canvas;
}
export const canvasBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) =>
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Could not encode the image.'))),
      type,
      quality,
    ),
  );
export const escapeHtml = text =>
  text.replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export const textPage = async page => {
  const content = await page.getTextContent();
  return content.items
    .map(item => ('str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : ''))
    .join('')
    .trim();
};

export function withRenderedPages({ file, options, withRender }, work) {
  const pages = options.pages;
  return withRender(file, options, doc => work(doc, range(pages, doc.numPages)));
}

export async function readPageTexts(doc, indices, progress) {
  const texts = [];
  for (const i of indices) {
    progress('Reading page ' + (i + 1) + '…');
    texts.push(await textPage(await doc.getPage(i + 1)));
  }
  return texts;
}

export function imageQuality(preset) {
  return preset === 'Heavy' ? 0.45 : preset === 'Medium' ? 0.65 : 0.85;
}

export async function addRasterPages(
  doc,
  indices,
  output,
  progress,
  { dpi = 144, mime = 'image/png', quality, transform, afterPage },
) {
  for (const index of indices) {
    progress('Processing page ' + (index + 1) + '…');
    const page = await doc.getPage(index + 1);
    let canvas = await render(page, dpi);
    if (transform) canvas = await transform(canvas, page);
    const encoded = await canvasBlob(canvas, mime, quality);
    const bytes = await encoded.arrayBuffer();
    const image =
      mime === 'image/jpeg' ? await output.embedJpg(bytes) : await output.embedPng(bytes);
    const viewport = page.getViewport({ scale: 1 });
    const dest = output.addPage([viewport.width, viewport.height]);
    dest.drawImage(image, { x: 0, y: 0, width: viewport.width, height: viewport.height });
    if (afterPage) await afterPage(canvas, dest, viewport);
    canvas.width = 0;
    canvas.height = 0;
  }
}

export function rasterPdf(context, name, settings) {
  const quality = imageQuality(context.options.preset);
  return withRenderedPages(context, async (doc, indices) => {
    const output = await PDFDocument.create();
    await addRasterPages(doc, indices, output, context.progress, { ...settings, quality });
    return saved(output, name);
  });
}
