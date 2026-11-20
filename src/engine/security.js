/** @file PDF passwords, metadata, and permanent raster redaction. */
import { PDFDocument } from 'pdf-lib';
import { sizeReport } from './analyze.js';
import { addRasterPages, imageQuality, readPageTexts, withRenderedPages } from './render.js';
import { documentMetadata, readSelection, result, saved } from './shared.js';

/** Encrypts the input PDF with the supplied new password. */
async function encryptPdf({ file, options }) {
  const { changePassword } = await import('../password.js');
  return changePassword(file, {
    password: options.password,
    text: options.text ?? '',
    encrypt: true,
  });
}

/** Removes encryption from the input PDF using the supplied password. */
async function unlockPdf({ file, options }) {
  const { changePassword } = await import('../password.js');
  return changePassword(file, {
    password: options.password,
    text: options.text ?? '',
    encrypt: false,
  });
}

/** Reports the input PDF's metadata or returns a copy with standard metadata cleared. */
async function privacyScanner(context) {
  const { file, options } = context;
  if (options.preset !== 'Clear standard metadata') return sizeReport(context);
  const { doc } = await readSelection(file, options);
  // Validate the existing fields before overwriting them.
  documentMetadata(doc);
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setCreator('');
  doc.setProducer('');
  return saved(doc, 'metadata-cleared.pdf');
}

/** Updates supported metadata fields from a JSON object and saves the PDF. */
async function editMetadata({ file, options }) {
  const { doc } = await readSelection(file, options);
  const text = options.text ?? '';
  const value = JSON.parse(text);
  if (!value || Array.isArray(value) || typeof value !== 'object')
    throw new Error('Enter a JSON object.');
  for (const [key, setter] of Object.entries({
    title: 'setTitle',
    author: 'setAuthor',
    subject: 'setSubject',
    creator: 'setCreator',
  })) {
    if (typeof value[key] === 'string') doc[setter](value[key]);
  }
  return saved(doc, 'metadata.pdf');
}

/** Searches selected pages for a phrase and returns matching page numbers as JSON. */
async function checkRedactions(context) {
  const text = context.options.text ?? '';
  return withRenderedPages(context, async (doc, indices) => {
    const texts = await readPageTexts(doc, indices, context.progress);
    if (!text.trim()) throw new Error('Enter a phrase to search.');
    const matches = indices
      .filter((i, j) => texts[j].toLocaleLowerCase().includes(text.toLocaleLowerCase()))
      .map(i => i + 1);
    return result(
      'text-search.json',
      JSON.stringify({ matches, coverage: 'Searchable text only' }, null, 2),
      'application/json',
    );
  });
}

// Joins text items, then finds case-insensitive, whitespace-normalized phrase matches and maps them back to item character spans
function findPhrase(items, phrase) {
  const runs = [];
  let source = '';
  for (const item of items) {
    if (!('str' in item)) continue;
    const previous = runs[runs.length - 1]?.item;
    if (
      previous &&
      (previous.hasEOL ||
        Math.abs(item.transform[5] - previous.transform[5]) >
          Math.max(item.height, previous.height) / 2 ||
        item.transform[4] < previous.transform[4])
    )
      source += '\n';
    else if (
      previous &&
      item.transform[4] - previous.transform[4] - previous.width > previous.height * 0.2
    )
      source += ' ';
    runs.push({ item, start: source.length });
    source += item.str;
  }
  let folded = '',
    map = [],
    gap = false;
  for (let i = 0; i < source.length; i++) {
    if (/\s/.test(source[i])) {
      gap = folded.length > 0;
      continue;
    }
    if (gap) {
      folded += ' ';
      map.push(-1);
      gap = false;
    }
    const lower = source[i].toLowerCase();
    folded += lower.length === 1 ? lower : source[i];
    map.push(i);
  }
  const needle = phrase.replace(/\s+/g, ' ').trim().toLowerCase();
  const spans = [];
  for (let at = folded.indexOf(needle); at >= 0; at = folded.indexOf(needle, at + 1))
    spans.push([map[at], map[at + needle.length - 1] + 1]);
  const boxes = [];
  for (const [from, to] of spans)
    for (const { item, start } of runs) {
      const a = Math.max(from, start),
        b = Math.min(to, start + item.str.length);
      if (a < b) boxes.push({ item, from: a - start, to: b - start });
    }
  return { matches: spans.length, boxes };
}

function redactionBounds({ item, from, to }, page, context) {
  const pad = Math.max(2.5, item.height * 0.1);
  const whole = [-pad, item.width + pad];
  if (
    (from === 0 && to === item.str.length) ||
    item.dir !== 'ltr' ||
    !page.commonObjs.has(item.fontName)
  )
    return whole;
  const font = page.commonObjs.get(item.fontName);
  if (font.isType3Font || !context.measureText || !item.height) return whole;
  const family =
    font.systemFontInfo?.css ||
    (font.loadedName && font.fallbackName && `"${font.loadedName}", ${font.fallbackName}`);
  if (!family) return whole;
  const previous = context.font;
  context.font = `${font.italic ? 'italic' : 'normal'} ${font.black ? '900' : font.bold ? 'bold' : 'normal'} ${item.height}px ${family}`;
  try {
    const full = context.measureText(item.str).width;
    const start = context.measureText(item.str.slice(0, from)).width;
    const end = context.measureText(item.str.slice(0, to)).width;
    if (!(full > 0 && start >= 0 && end > start && end <= full)) return whole;
    const scale = item.width / full;
    return [start * scale - pad, end * scale + pad];
  } catch {
    return whole;
  } finally {
    context.font = previous;
  }
}

async function redactPage(canvas, page, text) {
  if (!text.trim()) throw new Error('Enter a phrase to redact.');
  const content = await page.getTextContent();
  const viewport = page.getViewport({ scale: 2 });
  const context = canvas.getContext('2d');
  context.fillStyle = 'black';
  const { matches, boxes } = findPhrase(content.items, text);
  for (const box of boxes) {
    const { item } = box;
    const [a, b, c, d, x, y] = item.transform;
    const basis = Math.hypot(a, b) || 1;
    const up = Math.hypot(c, d) || 1;
    const u = [a / basis, b / basis],
      v = [(c / up) * item.height, (d / up) * item.height];
    const [s, e] = redactionBounds(box, page, context);
    const x0 = x + u[0] * s,
      y0 = y + u[1] * s,
      span = [u[0] * (e - s), u[1] * (e - s)];
    const points = [
      [x0 - v[0] * 0.22, y0 - v[1] * 0.22],
      [x0 + span[0] - v[0] * 0.22, y0 + span[1] - v[1] * 0.22],
      [x0 + span[0] + v[0] * 1.2, y0 + span[1] + v[1] * 1.2],
      [x0 + v[0] * 1.2, y0 + v[1] * 1.2],
    ].map(point => viewport.convertToViewportPoint(...point));
    context.beginPath();
    points.forEach(([px, py], i) => (i ? context.lineTo(px, py) : context.moveTo(px, py)));
    context.closePath();
    context.fill();
  }
  return matches;
}

/** Covers matching text on selected pages and returns a raster PDF. */
async function redactPdf(context) {
  const text = context.options.text ?? '';
  const quality = imageQuality(context.options.preset);
  return withRenderedPages(context, async (doc, indices) => {
    const output = await PDFDocument.create();
    let redactions = 0;
    await addRasterPages(doc, indices, output, context.progress, {
      quality,
      async transform(canvas, page) {
        redactions += await redactPage(canvas, page, text);
        return canvas;
      },
    });
    if (!redactions) throw new Error('Phrase not found on the selected pages.');
    return saved(output, 'redact-pdf.pdf');
  });
}

export const securityTools = {
  'encrypt-pdf': encryptPdf,
  'unlock-pdf': unlockPdf,
  'privacy-scanner': privacyScanner,
  'edit-pdf-metadata': editMetadata,
  'redaction-checker': checkRedactions,
  'redact-pdf': redactPdf,
};
