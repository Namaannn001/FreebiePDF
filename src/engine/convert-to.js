/** @file PDF creation from images, text, office documents, and invoice details. */
import { PDFDocument } from 'pdf-lib';
import { result, saved } from './shared.js';
import { canvasBlob } from './render.js';

/** Builds an A4 PDF from the uploaded images in input order. */
async function imagesToPdf({ files }) {
  const output = await PDFDocument.create();
  for (const file of files) {
    let embedded;
    if (file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name))
      embedded = await output.embedJpg(await file.arrayBuffer());
    else if (file.type === 'image/png' || /\.png$/i.test(file.name))
      embedded = await output.embedPng(await file.arrayBuffer());
    else {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext('2d').drawImage(bitmap, 0, 0);
      bitmap.close();
      embedded = await output.embedPng(await (await canvasBlob(canvas, 'image/png')).arrayBuffer());
    }
    const w = embedded.width * 0.75,
      h = embedded.height * 0.75,
      landscape = embedded.width > embedded.height;
    const [pw, ph] = landscape ? [841.89, 595.28] : [595.28, 841.89],
      scale = Math.min(1, pw / w, ph / h);
    const page = output.addPage([pw, ph]);
    page.drawImage(embedded, {
      x: (pw - w * scale) / 2,
      y: (ph - h * scale) / 2,
      width: w * scale,
      height: h * scale,
    });
  }
  return saved(output, 'images.pdf');
}

async function createPdf(text) {
  // Built-in PDF fonts only cover Windows-1252, so refuse text that would be garbled
  const unsupported = [
    ...new Set(text.match(/[^\t\n\r\x20-\x7e\xa0-\xff€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/gu) ?? []),
  ];
  if (unsupported.length)
    throw new Error(
      'This text contains characters the built-in PDF font cannot show: ' +
        unsupported.slice(0, 10).join(', ') +
        (unsupported.length > 10 ? ' …' : '') +
        '. Use only Latin characters, or print to PDF from your browser instead.',
    );
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.setFontSize(11);
  let y = 56;
  for (const source of text.replace(/\r/g, '').split('\n')) {
    const lines = doc.splitTextToSize(source || ' ', 500);
    for (const line of lines) {
      if (y > 785) {
        doc.addPage();
        y = 56;
      }
      doc.text(line, 48, y);
      y += 15;
    }
  }
  return result('document.pdf', doc.output('arraybuffer'));
}

/** Builds a PDF from the text supplied directly in the options. */
async function createFromText({ options }) {
  return createPdf(options.text ?? '');
}

/** Imports the uploaded office document or ebook and renders its text to PDF. */
async function officeToPdf({ file }) {
  const { officeImport } = await import('../office.js');
  return createPdf(await officeImport(file));
}

/** Builds a PDF from the uploaded plain text, Markdown, or CSV. */
async function textToPdf({ file }) {
  return createPdf(await file.text());
}

/** Extracts visible text from the uploaded HTML and builds a PDF. */
async function htmlToPdf({ file }) {
  const value = await file.text();
  const template = document.createElement('template');
  template.innerHTML = value;
  template.content
    .querySelectorAll('script,style,template,noscript,title')
    .forEach(node => node.remove());
  return createPdf(template.content.textContent);
}

/** Builds a tax invoice PDF from the supplied details. */
async function invoice({ options }) {
  const quantity = Number(options.quantity),
    price = Number(options.price),
    rate = Number(options.rate);
  if (
    !options.supplier ||
    !options.buyer ||
    !options.item ||
    !(quantity > 0) ||
    !(price >= 0) ||
    !(rate >= 0)
  )
    throw new Error('Enter the invoice details, quantity, price, and tax rate.');
  const amount = quantity * price,
    tax = (amount * rate) / 100;
  if (!Number.isFinite(amount + tax)) throw new Error('Invoice values are too large.');
  return createPdf(
    [
      `TAX INVOICE  ${options.number || ''}`,
      options.date || '',
      `Supplier: ${options.supplier}`,
      `GSTIN: ${options.gstin || ''}`,
      `Buyer: ${options.buyer}`,
      '',
      options.item,
      `Quantity: ${quantity}    Unit price: INR ${price.toFixed(2)}`,
      `Subtotal: INR ${amount.toFixed(2)}`,
      `Tax (${rate}%): INR ${tax.toFixed(2)}`,
      `Total: INR ${(amount + tax).toFixed(2)}`,
    ].join('\n'),
  );
}

export const convertToTools = {
  'images-to-pdf': imagesToPdf,
  'scan-to-pdf': imagesToPdf,
  'create-pdf': createFromText,
  'txt-to-pdf': textToPdf,
  'markdown-to-pdf': textToPdf,
  'html-to-pdf': htmlToPdf,
  'csv-to-pdf': textToPdf,
  'word-to-pdf': officeToPdf,
  'excel-to-pdf': officeToPdf,
  'pptx-to-pdf': officeToPdf,
  'ebook-to-pdf': officeToPdf,
  'gst-invoice': invoice,
};
