/** @file Splitting a PDF into page, section, or size-based parts. */
import { textPage } from './render.js';
import { copyPages, createZip, downloadZip, readSelection } from './shared.js';

async function splitBySize(doc, indices, limit) {
  if (!Number.isFinite(limit) || limit <= 0) throw new Error('Enter a positive file size in KB.');
  const zip = await createZip();
  let offset = 0,
    part = 1;
  while (offset < indices.length) {
    const remaining = indices.length - offset;
    // Copy each candidate as a batch so shared resources are serialized only once.
    const measure = async count =>
      (await copyPages(doc, indices.slice(offset, offset + count), 'part.pdf')).blob;
    let count = 1,
      best = await measure(count);
    if (best.size > limit)
      throw new Error(
        'Page ' +
          (indices[offset] + 1) +
          ' is ' +
          best.size +
          ' bytes on its own and exceeds the size limit.',
      );
    let next = Math.min(remaining, count * 2);
    while (next > count) {
      const candidate = await measure(next);
      if (candidate.size > limit) break;
      best = candidate;
      count = next;
      next = Math.min(remaining, count * 2);
    }
    while (next - count > 1) {
      const middle = Math.floor((count + next) / 2);
      const candidate = await measure(middle);
      if (candidate.size > limit) next = middle;
      else {
        count = middle;
        best = candidate;
      }
    }
    zip.file('part-' + part + '.pdf', new Uint8Array(await best.arrayBuffer()));
    part++;
    offset += count;
  }
  return downloadZip(zip, 'pdf-parts.zip');
}

/** Copies a supplied range to a PDF, or archives each page when no range is supplied. */
async function splitPages({ file, options }) {
  const pages = options.pages;
  const { doc, indices } = await readSelection(file, options);
  if (pages?.trim()) return copyPages(doc, indices, 'pages.pdf');
  const zip = await createZip();
  for (const index of indices) {
    const part = await copyPages(doc, [index], 'page.pdf');
    zip.file(
      'page-' + String(index + 1).padStart(3, '0') + '.pdf',
      new Uint8Array(await part.blob.arrayBuffer()),
    );
  }
  return downloadZip(zip, 'split-pages.zip');
}

async function zipParts(doc, groups) {
  const zip = await createZip();
  for (let i = 0; i < groups.length; i++) {
    const part = await copyPages(doc, groups[i], 'part.pdf');
    zip.file('part-' + (i + 1) + '.pdf', new Uint8Array(await part.blob.arrayBuffer()));
  }
  return downloadZip(zip, 'pdf-parts.zip');
}

/** Splits selected pages into an archive of PDFs under the requested size limit. */
async function splitByFileSize({ file, options }) {
  const text = options.text ?? '';
  const { doc, indices } = await readSelection(file, options);
  return splitBySize(doc, indices, Number(text || 2048) * 1024);
}

/** Splits selected pages at the midpoint and archives the two PDFs. */
async function splitInHalf({ file, options }) {
  const { doc, indices } = await readSelection(file, options);
  if (indices.length < 2) throw new Error('Choose at least two pages.');
  const middle = Math.ceil(indices.length / 2);
  return zipParts(doc, [indices.slice(0, middle), indices.slice(middle)]);
}

async function sectionGroups(indices, startsSection) {
  const groups = [];
  let current = [];
  for (const i of indices) {
    const start = await startsSection(i);
    if (current.length && start) {
      groups.push(current);
      current = [];
    }
    current.push(i);
  }
  if (current.length) groups.push(current);
  return groups;
}

/** Archives PDF sections split where the selected pages have top-level bookmarks. */
async function splitByBookmarks({ file, options, withRender }) {
  const { doc, input, indices } = await readSelection(file, options);
  const groups = await withRender(input, options, async source => {
    const outline = (await source.getOutline()) ?? [];
    const markers = new Set();
    for (const item of outline) {
      const dest =
        typeof item.dest === 'string' ? await source.getDestination(item.dest) : item.dest;
      const ref = dest?.[0];
      if (typeof ref === 'number') markers.add(ref);
      else if (ref?.num !== undefined) markers.add(await source.getPageIndex(ref));
    }
    if (!markers.size) throw new Error('No usable top-level bookmarks were found.');
    return sectionGroups(indices, i => markers.has(i));
  });
  return zipParts(doc, groups);
}

/** Archives PDF sections split at selected pages containing the supplied phrase. */
async function splitByText({ file, options, withRender }) {
  const text = options.text ?? '';
  const { doc, input, indices } = await readSelection(file, options);
  if (!text.trim()) throw new Error('Enter a phrase that starts a section.');
  const groups = await withRender(input, options, source =>
    sectionGroups(indices, async i => {
      const pageText = await textPage(await source.getPage(i + 1));
      return pageText.toLocaleLowerCase().includes(text.toLocaleLowerCase());
    }),
  );
  return zipParts(doc, groups);
}

export const splitTools = {
  'split-pdf': splitPages,
  'split-pdf-in-half': splitInHalf,
  'split-pdf-by-size': splitByFileSize,
  'split-pdf-by-bookmarks': splitByBookmarks,
  'split-pdf-by-text': splitByText,
};
