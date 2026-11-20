/** @file PDF loading, saving, page selection, and output helpers shared by tools. */
import { EncryptedPDFError, PDFDocument } from 'pdf-lib';

export const PDF = 'application/pdf';
export const result = (name, bytes, type = PDF) => ({ name, blob: new Blob([bytes], { type }) });
export const saved = async (doc, name = 'document.pdf') =>
  result(name, await doc.save({ useObjectStreams: true }));
async function unlocked(file, password = '') {
  const { changePassword } = await import('../password.js');
  const output = await changePassword(file, { password });
  return new File([output.blob], output.name, { type: PDF });
}
const isEncryptedError = error =>
  error instanceof EncryptedPDFError ||
  error?.message?.startsWith('Input document to `PDFDocument.load` is encrypted.');
export async function read(file, password, loadOptions) {
  try {
    return { doc: await PDFDocument.load(await file.arrayBuffer(), loadOptions), input: file };
  } catch (error) {
    if (!isEncryptedError(error)) throw error;
  }
  const input = await unlocked(file, password);
  try {
    return { doc: await PDFDocument.load(await input.arrayBuffer(), loadOptions), input };
  } catch (error) {
    if (isEncryptedError(error))
      throw new Error('The browser could not process this PDF’s encryption.');
    throw error;
  }
}
// Upright (as displayed) size of a page, and a converter from upright points to default user space (honours CropBox and /Rotate)
export function pageView(page) {
  const box = page.getCropBox(),
    angle = ((page.getRotation().angle % 360) + 360) % 360;
  const [width, height] = angle % 180 ? [box.height, box.width] : [box.width, box.height];
  const toUser = (x, y) => {
    const [u, v] = {
      0: [x, y],
      90: [box.width - y, x],
      180: [box.width - x, box.height - y],
      270: [y, box.height - x],
    }[angle] ?? [x, y];
    return { x: box.x + u, y: box.y + v };
  };
  return { box, angle, width, height, toUser };
}
export const cleanText = (font, text) =>
  Array.from(text, char => {
    try {
      font.encodeText(char);
      return char;
    } catch {
      return '?';
    }
  }).join('');

export function range(spec, count) {
  if (!count) throw new Error('This PDF has no pages.');
  if (!spec?.trim()) return Array.from({ length: count }, (_, i) => i);
  return spec.split(',').flatMap(part => {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error('Enter page numbers or ranges such as 1,3-5.');
    const first = Number(match[1]),
      last = Number(match[2] ?? match[1]);
    if (Math.min(first, last) < 1 || Math.max(first, last) > count)
      throw new Error('Choose pages between 1 and ' + count + '.');
    return Array.from(
      { length: Math.abs(last - first) + 1 },
      (_, i) => first - 1 + i * Math.sign(last - first),
    );
  });
}

export async function readSelection(file, options, loadOptions) {
  const pages = options.pages;
  const { doc, input } = await read(file, options.password, loadOptions);
  return { doc, input, indices: range(pages, doc.getPageCount()) };
}

export function documentMetadata(doc) {
  return {
    title: doc.getTitle(),
    author: doc.getAuthor(),
    subject: doc.getSubject(),
    keywords: doc.getKeywords(),
    creator: doc.getCreator(),
    producer: doc.getProducer(),
  };
}

export async function createZip() {
  const { default: JSZip } = await import('jszip');
  return new JSZip();
}

export const downloadZip = async (zip, name) =>
  result(
    name,
    await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' }),
    'application/zip',
  );

export async function copyPages(doc, indices, name) {
  const output = await PDFDocument.create();
  for (const page of await output.copyPages(doc, indices)) output.addPage(page);
  return saved(output, name);
}
