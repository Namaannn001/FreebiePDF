/** @file Combining, arranging, resizing, and compressing PDF pages. */
import { PDFDocument, StandardFonts, degrees } from 'pdf-lib';
import { rasterPdf } from './render.js';
import { copyPages, pageView, read, readSelection, saved } from './shared.js';
import { splitTools } from './split.js';

async function copyInputPages({ file, files, options }) {
  const { doc } = await readSelection(file, options);
  const others = await Promise.all(files.slice(1).map(file => read(file, options.password)));
  const docs = [doc, ...others.map(({ doc }) => doc)];
  const output = await PDFDocument.create();
  const pages = await Promise.all(
    docs.map(input => output.copyPages(input, input.getPageIndices())),
  );
  return { output, pages };
}

/** Concatenates all input PDFs in upload order into one PDF. */
async function merge(context) {
  const { output, pages } = await copyInputPages(context);
  for (const page of pages.flat()) output.addPage(page);
  return saved(output, 'combined.pdf');
}

/** Interleaves pages from the input PDFs into one PDF. */
async function alternateMix(context) {
  const { output, pages } = await copyInputPages(context);
  const longest = Math.max(...pages.map(list => list.length));
  for (let i = 0; i < longest; i++) for (const list of pages) if (list[i]) output.addPage(list[i]);
  return saved(output, 'combined.pdf');
}

/** Copies the selected pages into a new PDF in the specified order. */
async function extractPages({ file, options }) {
  const { doc, indices } = await readSelection(file, options);
  return copyPages(doc, indices, 'pages.pdf');
}

/** Copies all pages except the selected pages into a new PDF. */
async function deletePages({ file, options }) {
  const pages = options.pages;
  const { doc, indices } = await readSelection(file, options);
  if (!pages?.trim()) throw new Error('Enter the pages to delete.');
  const keep = doc.getPageIndices().filter(i => !indices.includes(i));
  if (!keep.length) throw new Error('The result needs at least one page.');
  return copyPages(doc, keep, 'pages.pdf');
}

/** Applies a rotation to each selected page and saves the updated PDF. */
async function rotatePages({ file, options }) {
  const preset = options.preset;
  const { doc, indices } = await readSelection(file, options);
  // Keep the font object these tools have historically included in the output.
  await doc.embedFont(StandardFonts.Helvetica);
  for (const index of indices) {
    const page = doc.getPage(index);
    pageView(page);
    page.setRotation(degrees((page.getRotation().angle + Number(preset || 90)) % 360));
  }
  return saved(doc, 'rotate-pdf.pdf');
}

/** Insets the crop box on each selected page and saves the updated PDF. */
async function cropPages({ file, options }) {
  const text = options.text ?? '';
  const { doc, indices } = await readSelection(file, options);
  await doc.embedFont(StandardFonts.Helvetica);
  for (const index of indices) {
    const page = doc.getPage(index);
    const { box } = pageView(page);
    const margin = Number(text || 18);
    if (!Number.isFinite(margin) || margin < 0 || margin * 2 >= Math.min(box.width, box.height))
      throw new Error('Enter a margin smaller than half the page size.');
    page.setCropBox(
      box.x + margin,
      box.y + margin,
      box.width - 2 * margin,
      box.height - 2 * margin,
    );
  }
  return saved(doc, 'crop-resize-pdf.pdf');
}

async function layOutPages(doc, indices, count, [width, height]) {
  const cols = Math.ceil(Math.sqrt(count)),
    rows = Math.ceil(count / cols),
    output = await PDFDocument.create();
  for (let start = 0; start < indices.length; start += count) {
    const target = output.addPage([width, height]);
    for (const [slot, index] of indices.slice(start, start + count).entries()) {
      const source = doc.getPage(index);
      if (!source.node.Contents()) continue;
      const box = source.getCropBox(),
        angle = ((source.getRotation().angle % 360) + 360) % 360;
      const embedded = await output.embedPage(source, {
        left: box.x,
        bottom: box.y,
        right: box.x + box.width,
        top: box.y + box.height,
      });
      const cellW = width / cols,
        cellH = height / rows;
      const sideways = angle % 180 !== 0;
      const shownW = sideways ? embedded.height : embedded.width,
        shownH = sideways ? embedded.width : embedded.height;
      const factor = Math.min((cellW - 20) / shownW, (cellH - 20) / shownH);
      const left = (slot % cols) * cellW + (cellW - shownW * factor) / 2;
      const bottomY =
        height - (Math.floor(slot / cols) + 1) * cellH + (cellH - shownH * factor) / 2;
      // Where the crop box corner lands on the upright page; drawPage then rotates the content by -angle so it matches the on-screen orientation
      const [ox, oy] = {
        0: [0, 0],
        90: [0, box.width],
        180: [box.width, box.height],
        270: [box.height, 0],
      }[angle] ?? [0, 0];
      target.drawPage(embedded, {
        x: left + ox * factor,
        y: bottomY + oy * factor,
        xScale: factor,
        yScale: factor,
        rotate: degrees(-angle),
      });
    }
  }
  return saved(output, 'layout.pdf');
}

/** Places groups of selected pages on A4 sheets in a new PDF. */
async function multiplePagesPerSheet({ file, options }) {
  const preset = options.preset;
  const { doc, indices } = await readSelection(file, options);
  const count = Number(preset ?? 4);
  if (![1, 2, 4, 6, 9, 16].includes(count)) throw new Error('Choose a supported layout.');
  return layOutPages(doc, indices, count, [595, 842]);
}

/** Fits each selected page to the chosen paper size in a new PDF. */
async function resizePages({ file, options }) {
  const preset = options.preset;
  const { doc, indices } = await readSelection(file, options);
  const size = { Letter: [612, 792], Legal: [612, 1008], A5: [420, 595] }[preset];
  return layOutPages(doc, indices, 1, size ?? [595, 842]);
}

/** Renders selected pages into a compressed PDF, keeping the original if compression saves no space. */
async function compressPdf(context) {
  const { file, options } = context;
  const dpi = { Light: 144, Medium: 110, Heavy: 85 }[options.preset] ?? 110;
  const rendered = await rasterPdf(context, 'compress-pdf.pdf', { dpi, mime: 'image/jpeg' });
  if (rendered.blob.size >= file.size)
    return {
      name: 'original-size.pdf',
      blob: file,
      note: 'No smaller output was found. Returned the original.',
    };
  return rendered;
}

/** Reserializes the uploaded PDF after validating the page selection. */
async function repairPdf({ file, options }) {
  const { doc, indices } = await readSelection(file, options);
  await doc.embedFont(StandardFonts.Helvetica);
  for (const index of indices) pageView(doc.getPage(index));
  return saved(doc, 'repair-pdf.pdf');
}

export const organizeTools = {
  ...splitTools,
  'merge-pdf': merge,
  'alternate-mix-pdf': alternateMix,
  'extract-pdf-pages': extractPages,
  'delete-pdf-pages': deletePages,
  'organize-pages': extractPages,
  'rotate-pdf': rotatePages,
  'crop-resize-pdf': cropPages,
  'multiple-pages-per-sheet': multiplePagesPerSheet,
  'resize-pdf': resizePages,
  'compress-pdf': compressPdf,
  'repair-pdf': repairPdf,
};
