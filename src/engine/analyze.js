/** @file PDF text comparison, summarization, and size reporting. */
import { escapeHtml, readPageTexts, textPage, withRenderedPages } from './render.js';
import { documentMetadata, range, readSelection, result } from './shared.js';

/** Compares text from the selected pages in two PDFs and returns a side-by-side HTML report. */
async function comparePdfs({ file, files, options, progress, withRender }) {
  const pages = options.pages;
  return withRender(file, options, async doc => {
    if (files.length !== 2) throw new Error('Choose exactly two PDFs.');
    let sections;
    try {
      sections = await withRender(files[1], options, async second => {
        const indices = range(pages, Math.max(doc.numPages, second.numPages));
        const values = [];
        for (const i of indices) {
          const number = i + 1;
          progress('Reading page ' + number + '…');
          const left = number <= doc.numPages ? await textPage(await doc.getPage(number)) : null;
          const right =
            number <= second.numPages ? await textPage(await second.getPage(number)) : null;
          const status =
            left === null
              ? 'only in second file'
              : right === null
                ? 'only in first file'
                : left === right
                  ? 'same text'
                  : 'different text';
          values.push(
            '<h2>Page ' +
              number +
              ' · ' +
              status +
              '</h2><div><pre>' +
              escapeHtml(left ?? '') +
              '</pre><pre>' +
              escapeHtml(right ?? '') +
              '</pre></div>',
          );
        }
        return values;
      });
    } catch (error) {
      if (error?.name === 'PasswordException')
        throw new Error(
          'The second PDF needs a different password; unlock it first with Unlock PDF.',
        );
      throw error;
    }
    return result(
      'compare.html',
      '<!doctype html><meta charset="utf-8"><title>Compare PDFs</title><style>body{font:16px system-ui;padding:20px}div{display:grid;grid-template-columns:1fr 1fr;gap:15px}pre{white-space:pre-wrap;background:#eee;padding:10px}</style>' +
        sections.join(''),
      'text/html;charset=utf-8',
    );
  });
}

/** Ranks sentences from searchable text and returns a plain-text summary. */
async function summarizePdf(context) {
  return withRenderedPages(context, async (doc, indices) => {
    const texts = await readPageTexts(doc, indices, context.progress);
    const full = texts.join('\n\n');
    const sentences = full.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]?/g) ?? [];
    const counts = new Map();
    const words = line => line.toLowerCase().match(/\p{L}{5,}/gu) ?? [];
    words(full).forEach(w => counts.set(w, (counts.get(w) || 0) + 1));
    const ranked = sentences.map((s, i) => ({
      s,
      i,
      score:
        words(s).reduce((sum, w) => sum + (counts.get(w) || 0), 0) / Math.max(1, words(s).length),
    }));
    return result(
      'summary.txt',
      ranked
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .sort((a, b) => a.i - b.i)
        .map(row => row.s.trim())
        .join('\n\n'),
      'text/plain;charset=utf-8',
    );
  });
}

/** Reports the input PDF's size, page count, and original metadata as JSON. */
export async function sizeReport({ file, options }) {
  const { doc } = await readSelection(file, options, { updateMetadata: false });
  const metadata = documentMetadata(doc);
  const payload = { bytes: file.size, pages: doc.getPageCount(), metadata };
  return result('report.json', JSON.stringify(payload, null, 2), 'application/json');
}

export const analyzeTools = {
  'compare-pdfs': comparePdfs,
  'summarize-pdf': summarizePdf,
  'pdf-size-analyzer': sizeReport,
};
