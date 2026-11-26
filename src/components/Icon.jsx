import React from 'react';

// Outline icons on a 24px grid, drawn with currentColor so they follow the theme. Bundled inline so they work offline.
const paths = {
  search: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z M20 20l-4.6-4.6',
  grid: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z',
  layers: 'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
  pen: 'M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z M13.5 6.5l4 4',
  swap: 'M7 4L3 8l4 4 M3 8h14 M17 12l4 4-4 4 M21 16H7',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6 M9 16h3',
  sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  monitor: 'M3 5h18v11H3z M8 20h8 M12 16v4',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  x: 'M6 6l12 12 M18 6L6 18',
  upload: 'M12 15V4 M7 9l5-5 5 5 M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4',
  download: 'M12 4v11 M7 10l5 5 5-5 M4 19h16',
  file: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z M14 3v5h5',
  fileText:
    'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z M14 3v5h5 M8.5 13h7 M8.5 17h4.5',
  filePlus: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z M14 3v5h5 M12 11v6 M9 14h6',
  fileOut:
    'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z M14 3v5h5 M9 14h6 M12.5 11.5L15 14l-2.5 2.5',
  up: 'M12 19V5 M6 11l6-6 6 6',
  down: 'M12 5v14 M6 13l6 6 6-6',
  trash: 'M4 7h16 M10 11v6 M14 11v6 M6 7l1 13h10l1-13 M9 7V4h6v3',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z M9 12l2 2 4-4',
  cloud: 'M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z M9.5 13.5l2 2 3.5-3.5',
  zap: 'M13 3L4 14h7l-1 7 9-11h-7z',
  merge: 'M7 4v5c0 3 5 4 5 7v4 M17 4v5c0 3-5 4-5 7',
  scissors:
    'M6 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z M6 15.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z M8.2 7.2L20 18 M8.2 16.8L20 6',
  compress: 'M9 4v5H4 M15 4v5h5 M9 20v-5H4 M15 20v-5h5',
  rotate: 'M20 12a8 8 0 1 1-2.3-5.7 M20 4v4h-4',
  image: 'M3 4h18v16H3z M9 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z M21 16l-5-5-9 9',
  type: 'M5 7V4h14v3 M12 4v16 M9 20h6',
  lock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
  unlock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 7.5-2',
  signature: 'M3 17c3-3 4-9 6-9s-1 9 1 9 2-4 4-4 1 3 3 3 2-1 3-2 M3 21h18',
  droplet: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  hash: 'M5 9h14 M5 15h14 M10 4L8 20 M16 4l-2 16',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4z M12 9.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z',
  scanText:
    'M4 8V5a1 1 0 0 1 1-1h3 M16 4h3a1 1 0 0 1 1 1v3 M20 16v3a1 1 0 0 1-1 1h-3 M8 20H5a1 1 0 0 1-1-1v-3 M8 10h8 M8 14h5',
  volume: 'M4 9h4l5-4v14l-5-4H4z M16.5 8.5a5 5 0 0 1 0 7 M19 6a8.5 8.5 0 0 1 0 12',
  redact: 'M3 6h18v4H3z M3 14h11 M3 18h7',
  table: 'M3 4h18v16H3z M3 10h18 M3 15h18 M9 4v16',
  slides: 'M3 4h18v12H3z M12 16v4 M8 20h8',
  code: 'M8 8l-4 4 4 4 M16 8l4 4-4 4 M13.5 5l-3 14',
  book: 'M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z M4 19a2 2 0 0 0 2 2h13v-3',
  sparkles:
    'M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
  columns: 'M3 4h7v16H3z M14 4h7v16h-7z M5.5 8h2 M16.5 8h2',
  workflow: 'M4 4h6v6H4z M14 14h6v6h-6z M7 10v4a3 3 0 0 0 3 3h4',
  chart: 'M4 20V10 M10 20V4 M16 20v-7 M22 20H2',
  wrench: 'M15 4a4 4 0 0 0-4.6 5.4L4 15.8V20h4.2l6.4-6.4A4 4 0 0 0 20 9l-2.5 2.5-3-3z',
  flip: 'M12 3v18 M9 6L3 18h6z M15 6l6 12h-6z',
  crop: 'M6 2v16h16 M2 6h16v16',
  archive: 'M3 4h18v4H3z M5 8v12h14V8 M10 12h4',
  contrast: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 3v18',
  tag: 'M3 12V4h8l10 10-8 8z M7.5 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
  form: 'M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h4',
  flatten: 'M4 15h16 M4 19h16 M7 4h10v7H7z',
  panels: 'M4 4h16v16H4z M4 8h16 M4 16h16',
  shuffle: 'M3 7h4l10 10h4 M3 17h4l3-3 M14 10l3-3h4 M18 4l3 3-3 3 M18 14l3 3-3 3',
  resize: 'M14 4h6v6 M20 4l-7 7 M10 20H4v-6 M4 20l7-7',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  arrowRight: 'M5 12h14 M13 6l6 6-6 6',
};

/** Tool id to icon name. Tools without an entry use their category icon. */
export const toolIcons = {
  'merge-pdf': 'merge',
  'split-pdf': 'scissors',
  'compress-pdf': 'compress',
  'alternate-mix-pdf': 'shuffle',
  'extract-pdf-pages': 'fileOut',
  'delete-pdf-pages': 'trash',
  'organize-pages': 'grid',
  'rotate-pdf': 'rotate',
  'split-pdf-by-text': 'scissors',
  'split-pdf-by-bookmarks': 'scissors',
  'split-pdf-in-half': 'columns',
  'split-pdf-by-size': 'scissors',
  'multiple-pages-per-sheet': 'grid',
  'crop-resize-pdf': 'crop',
  'resize-pdf': 'resize',
  'flip-pdf': 'flip',
  workflow: 'workflow',
  'pdf-to-zip': 'archive',
  'edit-pdf-text': 'type',
  'sign-pdf': 'signature',
  'add-watermark': 'droplet',
  'page-numbers': 'hash',
  'bates-numbering': 'hash',
  'headers-footers': 'panels',
  'fill-pdf-form': 'form',
  'flatten-pdf': 'flatten',
  'invert-pdf': 'contrast',
  'edit-pdf-metadata': 'tag',
  'privacy-scanner': 'shield',
  'pdf-size-analyzer': 'chart',
  'redaction-checker': 'search',
  'redact-pdf': 'redact',
  'encrypt-pdf': 'lock',
  'unlock-pdf': 'unlock',
  'repair-pdf': 'wrench',
  'images-to-pdf': 'image',
  'scan-to-pdf': 'camera',
  'create-pdf': 'filePlus',
  'txt-to-pdf': 'fileText',
  'markdown-to-pdf': 'fileText',
  'html-to-pdf': 'code',
  'csv-to-pdf': 'table',
  'word-to-pdf': 'fileText',
  'excel-to-pdf': 'table',
  'pptx-to-pdf': 'slides',
  'ebook-to-pdf': 'book',
  'pdf-to-jpg': 'image',
  'pdf-to-png': 'image',
  'pdf-to-image-zip': 'archive',
  'pdf-to-word': 'fileText',
  'pdf-to-excel': 'table',
  'pdf-to-pptx': 'slides',
  'pdf-to-html': 'code',
  'pdf-to-epub': 'book',
  'ocr-pdf': 'scanText',
  'extract-text': 'type',
  'pdf-to-audio': 'volume',
  'summarize-pdf': 'sparkles',
  'compare-pdfs': 'columns',
  'gst-invoice': 'receipt',
};

/** Category name to icon name. */
export const categoryIcons = {
  Organize: 'layers',
  'Edit & protect': 'pen',
  Convert: 'swap',
  Business: 'receipt',
};

/** Decorative inline SVG icon. */
export function Icon({ name, size = 18, className }) {
  const d = paths[name] ?? paths.file;
  return (
    <svg
      className={'icon' + (className ? ' ' + className : '')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}

/** Icon for a tool id, falling back to its category icon. */
export const iconFor = (id, category) => toolIcons[id] ?? categoryIcons[category] ?? 'file';
