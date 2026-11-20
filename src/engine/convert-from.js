/** @file Image, archive, text, speech, office, ebook, and OCR exports from PDFs. */
import { PDFDocument, StandardFonts } from 'pdf-lib';
import {
  addRasterPages,
  canvasBlob,
  escapeHtml,
  imageQuality,
  readPageTexts,
  render,
  withRenderedPages,
} from './render.js';
import { cleanText, createZip, downloadZip, result, saved } from './shared.js';

/** Packages the uploaded PDFs in an archive in input order. */
async function zipPdfs({ files }) {
  const zip = await createZip();
  files.forEach((input, i) =>
    zip.file(String(i + 1).padStart(2, '0') + '-' + input.name.replace(/[\\/:]/g, '_'), input),
  );
  return downloadZip(zip, 'documents.zip');
}

async function exportPageImages(context, mime, extension, alwaysZip = false) {
  const { options, progress } = context;
  const quality = imageQuality(options.preset);
  return withRenderedPages(context, async (doc, indices) => {
    const zip = alwaysZip || indices.length > 1 ? await createZip() : null;
    for (const i of indices) {
      progress('Processing page ' + (i + 1) + '…');
      const canvas = await render(await doc.getPage(i + 1), options.dpi);
      const blob = await canvasBlob(canvas, mime, quality);
      const name = 'page-' + String(i + 1).padStart(3, '0') + extension;
      if (!zip) return { name, blob };
      zip.file(name, new Uint8Array(await blob.arrayBuffer()));
      canvas.width = 0;
      canvas.height = 0;
    }
    return downloadZip(zip, 'page-images.zip');
  });
}

/** Renders selected pages as JPEGs, archiving multiple images. */
async function pdfToJpg(context) {
  return exportPageImages(context, 'image/jpeg', '.jpg');
}

/** Renders selected pages as PNGs, archiving multiple images. */
async function pdfToPng(context) {
  return exportPageImages(context, 'image/png', '.png');
}

/** Renders selected pages as PNGs and always returns an archive. */
async function pdfToImageZip(context) {
  return exportPageImages(context, 'image/png', '.png', true);
}

function withExtractedText(context, work) {
  return withRenderedPages(context, async (doc, indices) => {
    const texts = await readPageTexts(doc, indices, context.progress);
    return work(texts.join('\n\n'));
  });
}

/** Exports searchable text from the selected pages as a text file. */
async function extractText(context) {
  return withExtractedText(context, full =>
    result('extracted.txt', full, 'text/plain;charset=utf-8'),
  );
}

/** Returns searchable text from the selected pages for the browser's speech reader. */
async function pdfToAudio(context) {
  return withExtractedText(context, full => ({ speech: full }));
}

/** Exports searchable text from the selected pages in an HTML document. */
async function pdfToHtml(context) {
  return withExtractedText(context, full =>
    result(
      'export.html',
      '<!doctype html><meta charset="utf-8"><title>PDF text</title><pre style="white-space:pre-wrap">' +
        escapeHtml(full) +
        '</pre>',
      'text/html;charset=utf-8',
    ),
  );
}

/** Packages searchable text from the selected pages into an EPUB. */
async function pdfToEpub(context) {
  return withExtractedText(context, async full => {
    const zip = await createZip(),
      uid = 'urn:uuid:' + crypto.randomUUID();
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
    zip.file(
      'META-INF/container.xml',
      '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="book.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
    );
    zip.file(
      'book.opf',
      `<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">${uid}</dc:identifier><dc:title>Anywhere PDF document</dc:title><dc:language>en</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="doc" href="doc.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="doc"/></spine></package>`,
    );
    zip.file(
      'nav.xhtml',
      '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol><li><a href="doc.xhtml">Document</a></li></ol></nav></body></html>',
    );
    zip.file(
      'doc.xhtml',
      '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Document</title></head><body><pre>' +
        escapeHtml(full.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '')) +
        '</pre></body></html>',
    );
    return result(
      'document.epub',
      await zip.generateAsync({ type: 'uint8array' }),
      'application/epub+zip',
    );
  });
}

async function extractRows(doc, indices) {
  const sheets = [];
  for (const i of indices) {
    const content = await (await doc.getPage(i + 1)).getTextContent();
    const lines = new Map();
    for (const item of content.items) {
      if (!('str' in item) || !item.str.trim()) continue;
      const y = Math.round(item.transform[5] / 3) * 3;
      const items = lines.get(y) || [];
      items.push(item);
      lines.set(y, items);
    }
    const rows = [...lines.entries()]
      .sort(([a], [b]) => b - a)
      .map(([, items]) => {
        const cells = [];
        let previous;
        for (const item of items.sort((a, b) => a.transform[4] - b.transform[4])) {
          const gap = previous
            ? item.transform[4] - previous.transform[4] - previous.width
            : Infinity;
          if (gap > 12) cells.push(item.str);
          else cells[cells.length - 1] += ' ' + item.str;
          previous = item;
        }
        return cells;
      });
    sheets.push(rows);
  }
  return sheets;
}

function exportOffice(context, format, getRows) {
  return withRenderedPages(context, async (doc, indices) => {
    const texts = await readPageTexts(doc, indices, context.progress);
    const { officeExport } = await import('../office.js');
    return officeExport(format, texts, getRows ? await getRows(doc, indices) : []);
  });
}

/** Exports searchable text from the selected pages to a Word document. */
async function pdfToWord(context) {
  return exportOffice(context, 'pdf-to-word');
}

/** Exports selected pages to an Excel workbook with rows inferred from text positions. */
async function pdfToExcel(context) {
  return exportOffice(context, 'pdf-to-excel', extractRows);
}

/** Exports searchable text from the selected pages to a PowerPoint document. */
async function pdfToPowerPoint(context) {
  return exportOffice(context, 'pdf-to-pptx');
}

/** Recognizes text on the selected pages and returns a searchable raster PDF. */
async function ocrPdf(context) {
  const quality = imageQuality(context.options.preset);
  return withRenderedPages(context, async (doc, indices) => {
    const output = await PDFDocument.create();
    const { createOcr } = await import('../ocr.js');
    const ocr = await createOcr(context.progress);
    try {
      await addRasterPages(doc, indices, output, context.progress, {
        quality,
        async afterPage(canvas, dest, viewport) {
          const textFont = await output.embedFont(StandardFonts.Helvetica);
          const matches = await ocr.recognize(canvas);
          for (const word of matches) {
            const box = word.bbox,
              scaleX = viewport.width / canvas.width,
              scaleY = viewport.height / canvas.height;
            const value = cleanText(textFont, word.text);
            if (value)
              dest.drawText(value, {
                x: box.x0 * scaleX,
                y: viewport.height - box.y1 * scaleY,
                size: Math.max(2, (box.y1 - box.y0) * scaleY),
                font: textFont,
                opacity: 0,
              });
          }
        },
      });
    } finally {
      await ocr.close();
    }
    return saved(output, 'ocr-pdf.pdf');
  });
}

export const convertFromTools = {
  'pdf-to-zip': zipPdfs,
  'pdf-to-jpg': pdfToJpg,
  'pdf-to-png': pdfToPng,
  'pdf-to-image-zip': pdfToImageZip,
  'pdf-to-word': pdfToWord,
  'pdf-to-excel': pdfToExcel,
  'pdf-to-pptx': pdfToPowerPoint,
  'pdf-to-html': pdfToHtml,
  'pdf-to-epub': pdfToEpub,
  'extract-text': extractText,
  'pdf-to-audio': pdfToAudio,
  'ocr-pdf': ocrPdf,
};
