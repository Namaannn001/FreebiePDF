/** Category tints and the fixed sidebar, start-with, quick-action, and footer links. */
export const categoryColors = {
  Organize: 'violet',
  'Edit & protect': 'rose',
  Convert: 'blue',
  Business: 'amber',
};
export const startWith = [
  'merge-pdf',
  'compress-pdf',
  'split-pdf',
  'pdf-to-word',
  'images-to-pdf',
  'sign-pdf',
  'ocr-pdf',
  'encrypt-pdf',
];
export const pinned = ['merge-pdf', 'split-pdf', 'compress-pdf', 'ocr-pdf'];
export const quickActions = [
  ['merge-pdf', 'Merge PDF'],
  ['compress-pdf', 'Compress PDF'],
  ['pdf-to-word', 'PDF to Word'],
];
export const popular = [
  quickActions[0],
  ['split-pdf', 'Split PDF'],
  quickActions[1],
  quickActions[2],
  ['pdf-to-jpg', 'PDF to JPG'],
  ['images-to-pdf', 'JPG to PDF'],
  ['word-to-pdf', 'Word to PDF'],
  ['ocr-pdf', 'OCR PDF'],
  ['encrypt-pdf', 'Protect PDF'],
  ['unlock-pdf', 'Unlock PDF'],
  ['rotate-pdf', 'Rotate PDF'],
  ['page-numbers', 'Add page numbers to PDF'],
];
