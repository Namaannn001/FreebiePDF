/** @file PDF stamps, form filling, and raster edits. */
import { StandardFonts, degrees, rgb } from 'pdf-lib';
import { rasterPdf } from './render.js';
import { cleanText, pageView, readSelection, saved } from './shared.js';

function labelText(text) {
  return text;
}

async function stampPages(
  { file, options },
  name,
  {
    labelForPage = labelText,
    fontName = StandardFonts.Helvetica,
    size = 12,
    placement = 'footer',
    opacity = 1,
  } = {},
) {
  const text = options.text ?? '';
  const { doc, indices } = await readSelection(file, options);
  const font = await doc.embedFont(fontName);
  for (const [j, index] of indices.entries()) {
    const page = doc.getPage(index);
    const { width, height, toUser, angle } = pageView(page);
    const label = labelForPage(text, j);
    if (!label.trim()) throw new Error('Enter the text to add.');
    const value = cleanText(font, label);
    let x, y;
    if (placement === 'top') {
      x = Number(options.x || 36);
      y = height - Number(options.y || 54);
    } else {
      x = Math.max(12, (width - font.widthOfTextAtSize(value, size)) / 2);
      y = placement === 'center' ? height / 2 : 24;
    }
    if (!Number.isFinite(x + y) || x < 0 || y < 0 || x >= width || y >= height)
      throw new Error('The text position is outside one of the pages.');
    const at = toUser(x, y);
    page.drawText(value, {
      font,
      size,
      x: at.x,
      y: at.y,
      rotate: degrees(angle),
      color: rgb(0.12, 0.26, 0.23),
      opacity,
      maxWidth: Math.max(1, width - x - 8),
    });
  }
  return saved(doc, name);
}

/** Adds supplied text at the specified position on each selected PDF page. */
async function editText(context) {
  return stampPages(context, 'edit-pdf-text.pdf', { placement: 'top' });
}

/** Adds a typed signature at the specified position on each selected PDF page. */
async function signPdf(context) {
  return stampPages(context, 'sign-pdf.pdf', {
    fontName: StandardFonts.TimesRomanItalic,
    size: 20,
    placement: 'top',
  });
}

/** Adds a centered translucent watermark to each selected PDF page. */
async function watermark(context) {
  return stampPages(context, 'add-watermark.pdf', {
    size: 27,
    placement: 'center',
    opacity: 0.28,
  });
}

/** Numbers selected pages in sequence from the supplied starting number. */
async function pageNumbers(context) {
  return stampPages(context, 'page-numbers.pdf', {
    labelForPage(text, index) {
      const number = Number(text || 1);
      if (!Number.isSafeInteger(number)) throw new Error('Enter a valid starting page number.');
      return String(number + index);
    },
  });
}

/** Adds sequential Bates numbers with the supplied prefix to selected pages. */
async function batesNumbering(context) {
  return stampPages(context, 'bates-numbering.pdf', {
    labelForPage(text, index) {
      return text + String(index + 1).padStart(6, '0');
    },
  });
}

/** Adds the supplied text to the footer of each selected PDF page. */
async function headersFooters(context) {
  return stampPages(context, 'headers-footers.pdf');
}

/** Fills named form fields from JSON and returns the updated PDF. */
async function fillForm({ file, options }) {
  const text = options.text ?? '';
  const preset = options.preset;
  const { doc } = await readSelection(file, options);
  const data = JSON.parse(text),
    form = doc.getForm();
  if (!data || Array.isArray(data) || typeof data !== 'object')
    throw new Error('Enter a JSON object with field names.');
  let found = 0;
  for (const field of form.getFields()) {
    if (!Object.hasOwn(data, field.getName())) continue;
    const value = data[field.getName()];
    if (typeof field.setText === 'function') field.setText(String(value));
    else if (typeof field.check === 'function') value ? field.check() : field.uncheck();
    else if (typeof field.select === 'function') field.select(value);
    else continue;
    found++;
  }
  if (!found) throw new Error('No supported fields matched.');
  if (preset === 'Flatten') form.flatten();
  return saved(doc, 'filled.pdf');
}

function drawTransformed(canvas, prepare) {
  const transformed = document.createElement('canvas');
  transformed.width = canvas.width;
  transformed.height = canvas.height;
  const context = transformed.getContext('2d');
  prepare(context);
  context.drawImage(canvas, 0, 0);
  return transformed;
}

/** Renders selected pages with the chosen color filter into a new PDF. */
async function invertPdf(context) {
  const filter =
    { Negative: 'invert(1)', Grayscale: 'grayscale(1)', Sepia: 'sepia(1)' }[
      context.options.preset
    ] ?? 'invert(1)';
  return rasterPdf(context, 'invert-pdf.pdf', {
    transform(canvas) {
      return drawTransformed(canvas, ctx => {
        ctx.filter = filter;
      });
    },
  });
}

/** Mirrors selected pages along the chosen axis and returns a raster PDF. */
async function flipPdf(context) {
  const preset = context.options.preset;
  return rasterPdf(context, 'flip-pdf.pdf', {
    transform(canvas) {
      return drawTransformed(canvas, ctx => {
        const x = preset !== 'Vertical';
        const y = preset !== 'Horizontal';
        ctx.translate(x ? canvas.width : 0, y ? canvas.height : 0);
        ctx.scale(x ? -1 : 1, y ? -1 : 1);
      });
    },
  });
}

/** Flattens selected pages into images in a new PDF. */
async function flattenPdf(context) {
  return rasterPdf(context, 'flatten-pdf.pdf');
}

export const editTools = {
  'edit-pdf-text': editText,
  'sign-pdf': signPdf,
  'add-watermark': watermark,
  'page-numbers': pageNumbers,
  'bates-numbering': batesNumbering,
  'headers-footers': headersFooters,
  'fill-pdf-form': fillForm,
  'flatten-pdf': flattenPdf,
  'invert-pdf': invertPdf,
  'flip-pdf': flipPdf,
};
