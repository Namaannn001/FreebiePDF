export const brand = {
  name: 'Anywhere PDF',
  tagline: 'Free PDF tools that stay on your device.',
};

export const home = {
  title: 'Free PDF Tools: No Upload, Works Offline | Anywhere PDF',
  meta: 'Merge, split, compress, convert, OCR, and protect PDFs free in your browser. 60 PDF tools, no signup, no watermark, no upload. Works offline after one visit.',
  h1: 'Free PDF Tools That Work Offline, With No Upload',
  hero: 'Merge, split, compress, convert, and protect PDFs without an account and without sending a file anywhere. Your files stay on this device. After the status reads Ready offline, the 60 tools keep working with no connection.',
  sections: [
    {
      heading: 'A PDF toolbox that stays on your device',
      body: [
        'Anywhere PDF is free. There is no account and no subscription. You open a tool, pick a file from this device, and download the result.',
        'The work runs in the browser tab. To check, open the network panel, run a tool, and look for a request that carries your PDF. You should see the app load, and your document should stay put. The host serves the site files. It does not receive your PDFs or passwords.',
        'The first visit downloads the tools. Wait until the status reads Ready offline. After that you can open the tools and process files with no connection. If you clear site data, open the site again while you are online so the cache can rebuild.',
        'A watermark appears on a PDF when you run the watermark tool and type the words yourself. The site does not stamp its own mark on your download.',
      ],
    },
    {
      heading: 'Popular PDF tools',
      body: [
        'Start with Merge PDF when you need one file, Split PDF when you need separate pages, or Compress PDF when a file is too heavy to send. Compress saves each page as an image, so plan on that before you shrink a contract you still need to search.',
        'PDF to Word exports the text layer into a DOCX, one paragraph per line. JPG to PDF places each picture on an A4 page. Word to PDF prints the text of a .docx file and leaves images out. OCR PDF adds an English text layer to a scan.',
        'Protect PDF locks a file with AES-256. Unlock PDF removes a password you already know. Rotate PDF turns pages and keeps the text selectable. Add page numbers to a PDF, or add a watermark, when the file needs a stamp before you send it.',
      ],
    },
    {
      heading: 'How a tool run works',
      body: [
        'Pick the PDF, image, or Office file on this device. The tool reads it in the tab and builds the download there. Save that download before you close the page. Anywhere PDF does not keep your source file.',
        'Favorites and workflow presets stay in local storage on this browser. File contents and watermark wording are left out of that save.',
      ],
    },
    {
      heading: 'What these tools leave out',
      body: [
        'OCR reads English. Word, Excel, and PowerPoint conversions keep the text and drop pictures, charts, and the original layout. Compress, flatten, redact, invert, and flip save pages as images, so you cannot select the text afterward.',
        'New PDFs made from typed text, TXT, Markdown, HTML, CSV, Office files, EPUB, and the invoice form accept Latin characters. Cyrillic, Greek, Hindi, Chinese, Arabic, and emoji stop the tool with an error that lists the characters it cannot draw.',
        'A signature is a typed name in italic type. You cannot draw one or upload a picture of one, and the file does not get a certificate. Read aloud needs a speech voice installed on the device. It does not write an MP3.',
      ],
    },
  ],
  faq: [
    [
      'Can I use Anywhere PDF offline?',
      'Open the site once while you are online and wait until the status reads Ready offline. You can then open the tools and process files with no connection. If you clear site data, visit again online so the cache can rebuild.',
    ],
    [
      'Which PDF tools work offline?',
      'All 60 tools run in the browser after the site finishes caching. That includes merge, split, English OCR, PDF passwords, and Office text conversion. Read aloud also needs a speech voice installed on the device.',
    ],
    [
      'Are my documents uploaded?',
      'The tools process files in the browser. The host serves the application files. Your documents and passwords are not sent to the host.',
    ],
    [
      'Is Anywhere PDF free?',
      'The tools are free to use. There is no account and no subscription.',
    ],
    [
      'Does Anywhere PDF add a watermark?',
      'A download has a watermark when you run the watermark tool and type the text yourself. The site does not add a mark of its own.',
    ],
    [
      'Why is a large PDF slow or unable to finish?',
      'Processing uses memory on your device. Try a shorter page list, a lower image resolution, or a desktop browser when the file is large.',
    ],
    [
      'Will the app remember my documents?',
      'The browser stores favorites and workflow presets on this device. Download your result before you close the page. Source files are not stored by the site.',
    ],
    [
      'How can I check that my files are not uploaded?',
      'Open the browser network panel, run a tool, and watch the requests. You should see the app files load. Your PDF should not appear as an upload. After the status reads Ready offline, turn the connection off and run the tool again.',
    ],
    [
      'How is Anywhere PDF different from a typical online PDF site?',
      'You use it with no account. The file stays in the browser, and the tools keep working after the first visit with no connection. The site does not add its own watermark. Office conversion here keeps text, and signatures are typed names.',
    ],
    [
      'What can the tools not do compared with desktop PDF software?',
      'You cannot edit text that is already in the PDF, draw a signature, or target a compressed file size such as 200 KB. OCR is English. New text PDFs accept Latin characters. Compress, flatten, and redact replace pages with images.',
    ],
    [
      'Does Anywhere PDF work on phones and tablets?',
      'You can open the site in a phone browser. Large files use the memory on that phone, so a desktop browser has more room for a long PDF or a high-resolution export.',
    ],
    [
      'Which languages does OCR support?',
      'The bundled OCR model is English. Other languages are not included.',
    ],
    [
      'Can I install Anywhere PDF as an app?',
      'The site ships a web app manifest with a standalone display mode. Your browser decides whether to show an install control. Installed or not, the tools still need the Ready offline cache before they work with no connection.',
    ],
  ],
};

export const toolSeo = {
  'merge-pdf': {
    title: 'Merge PDF Files Free, No Upload | Anywhere PDF',
    h1: 'Merge PDF Files',
    meta: 'Combine PDF files into one document in your browser. Free, no signup, no watermark, and the files stay on this device. Works offline after one visit.',
    intro:
      'Combine two or more PDFs into one file. Add the files, set the order, and download the merged PDF. The files stay on this device.',
    steps: [
      'Add the PDFs. One file is enough, and extra files are appended in list order.',
      'Use Up and Down so the top file becomes the first pages of the result.',
      'Run the tool and download the single PDF. Locked files need Unlock PDF first, because this form has no password field.',
    ],
    faq: [
      [
        'How do I merge PDF files into one?',
        'Add the PDFs, arrange the list from top to bottom, and download the combined file. The original files stay where they were.',
      ],
      [
        'Are my PDFs uploaded when I merge them?',
        'The merge runs in this browser tab. The host is not sent your documents. After the status reads Ready offline, you can merge with no connection.',
      ],
      [
        'How do I change the order of the files before merging?',
        'Each row has Up and Down. The output follows the list from the top file to the bottom file.',
      ],
      [
        'Can I merge password-protected PDFs?',
        'Unlock each locked PDF first, then add the unlocked copies. Merge has no password field of its own.',
      ],
      [
        'Is there a limit on how many files or pages I can merge?',
        'The limit is the memory in your browser. A very large set can fail or stall. Merge fewer files, or compress first, when that happens.',
      ],
    ],
    related: [
      ['split-pdf', 'Split PDF'],
      ['organize-pages', 'Reorder PDF pages'],
      ['compress-pdf', 'Compress PDF'],
      ['alternate-mix-pdf', 'Alternate mix PDF'],
      ['rotate-pdf', 'Rotate PDF'],
    ],
  },
  'split-pdf': {
    title: 'Split PDF Into Pages or Ranges, Free | Anywhere PDF',
    h1: 'Split PDF Files',
    meta: 'Split a PDF into single pages or pull out one page range. Free, no signup, no upload, no watermark. Works in your browser and offline after one visit.',
    intro:
      'Leave Pages empty to get each page as its own PDF inside a ZIP. Enter a range such as 1,4-6 to save those pages together as one PDF. The file stays on this device.',
    steps: [
      'Open the PDF you want to split.',
      'Leave Pages blank for one PDF per page, or type a list such as 1,4-6 to keep that selection in a single PDF.',
      'Download the ZIP of single pages, or the one PDF that holds your range. A range does not create a separate file per number.',
    ],
    faq: [
      [
        'How do I split a PDF into separate pages?',
        'Leave Pages empty. You get a ZIP with one PDF per page, named from the original page number.',
      ],
      [
        'How do I split a PDF by page range?',
        'Type the pages in Pages, for example 1,4-6. You get one PDF that contains that selection, in the order you typed.',
      ],
      [
        'Can I pick pages that are not next to each other?',
        'Yes. A comma list such as 1,4,7-9 is valid. Those pages land in one PDF when you use a list, and in separate PDFs when Pages is blank.',
      ],
      [
        'Does splitting reduce the quality of my PDF?',
        'Split copies the pages. It does not re-render them as images, so text selection on those pages stays as it was.',
      ],
      [
        'What are the other ways to split a PDF here?',
        'Split PDF by size groups pages under a KB limit. Split by bookmarks uses the outline. Split by text starts a part when a phrase appears. Split in half makes two files.',
      ],
    ],
    related: [
      ['extract-pdf-pages', 'Extract pages from PDF'],
      ['split-pdf-by-size', 'Split PDF by size'],
      ['split-pdf-by-bookmarks', 'Split PDF by bookmarks'],
      ['split-pdf-by-text', 'Split PDF by text'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'compress-pdf': {
    title: 'Compress PDF Free, No Upload or Signup | Anywhere PDF',
    h1: 'Compress PDF',
    meta: 'Make a PDF smaller in your browser with three quality levels. Free, no upload, no signup, no watermark. Pages are saved as images, so text is not selectable.',
    intro:
      'Choose Light, Medium, or Heavy. Each page is re-saved as a JPEG, which can shrink the file and removes selectable text. If the new file is not smaller, you get the original back.',
    steps: [
      'Open the PDF. If it asks for a password, type it under Current PDF password.',
      'Set Quality to Light (144 DPI, higher JPEG quality), Medium (110 DPI), or Heavy (85 DPI, the strongest shrink).',
      'Download the result. A note that no smaller output was found means the original file was returned.',
      'Run OCR PDF afterward if you need the pages to be searchable again. OCR is English and will re-save the pages once more.',
    ],
    faq: [
      [
        'How do I reduce the size of a PDF?',
        'Pick Light, Medium, or Heavy and download the new file. Light keeps more detail. Heavy uses 85 DPI and a lower JPEG quality.',
      ],
      [
        'Will the compressed PDF keep selectable text?',
        'No. Each page becomes a JPEG image. Forms, links, and text selection on those pages are gone. OCR PDF can add an English text layer back.',
      ],
      [
        'What is the difference between Light, Medium, and Heavy?',
        'Light renders at 144 DPI with JPEG quality 85%. Medium uses 110 DPI and 65%. Heavy uses 85 DPI and 45%. A blank Pages field includes the whole file. A list exports only those pages.',
      ],
      [
        'Can I compress a PDF to a specific size, such as under 1 MB?',
        'There is no target size. You get one of the three presets. If you need parts under a limit, use Split PDF by size and enter the limit in KB.',
      ],
      [
        'Why did I get my original file back?',
        'The tool returns the original when the image copy is the same size or larger. Text-heavy pages often grow when they become pictures. Try Heavy, or split the file instead.',
      ],
    ],
    related: [
      ['split-pdf-by-size', 'Split PDF by size'],
      ['pdf-size-analyzer', 'PDF file info'],
      ['ocr-pdf', 'OCR PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['pdf-to-jpg', 'PDF to JPG'],
    ],
  },
  'alternate-mix-pdf': {
    title: 'Interleave PDFs: Alternate Pages of Two Files | Anywhere PDF',
    h1: 'Interleave PDF Pages (Alternate and Mix)',
    meta: 'Alternate pages from two or more PDFs into one file, for front and back scans. Free, no upload, no signup. The mix runs in your browser and works offline.',
    intro:
      'Page 1 comes from file A, page 1 from file B, page 2 from file A, and so on. Use it when a double-sided document was scanned as two separate PDFs.',
    steps: [
      'Add the PDFs. Put the front-side scan above the back-side scan.',
      'Use Up and Down until the list matches the order each file should contribute its next page.',
      'Download one PDF. There is no switch that reverses a file for you. Reverse a scan first with Reorder PDF pages and a descending range such as 8-1.',
    ],
    faq: [
      [
        'How do I merge front-side and back-side scans into one PDF?',
        'Add the front scan first and the back scan second, then run the tool. The result takes one page from each file in turn.',
      ],
      [
        'What order do the pages end up in?',
        'For two files the order is A1, B1, A2, B2, and so on. Extra files join the same rotation.',
      ],
      [
        'What happens if the files have different page counts?',
        'The tool keeps taking the next page from each file that still has one, until every page has been placed.',
      ],
      [
        'My back-side scan is in reverse order. What do I do?',
        'Open Reorder PDF pages on the back scan and type a descending range such as 8-1. Then interleave the corrected file. This tool does not reverse a file on its own.',
      ],
    ],
    related: [
      ['merge-pdf', 'Merge PDF'],
      ['organize-pages', 'Reorder PDF pages'],
      ['rotate-pdf', 'Rotate PDF'],
      ['split-pdf', 'Split PDF'],
      ['extract-pdf-pages', 'Extract pages from a PDF'],
    ],
  },
  'extract-pdf-pages': {
    title: 'Extract Pages From PDF Online, Free | Anywhere PDF',
    h1: 'Extract Pages From a PDF',
    meta: 'Pick the pages you want and save them as a new PDF. Free, no signup, no upload, no watermark. Your original file is left as it was, and the tool works offline.',
    intro:
      'Type the pages to keep, for example 1,4-6, and download them as a new PDF. The original file is left as it was. Nothing is sent off this device.',
    steps: [
      'Open the PDF.',
      'In Pages to keep, type the numbers in the order you want them, such as 5,2,1 or 1,4-6.',
      'Download the new PDF. A blank field keeps every page, in the original order.',
    ],
    faq: [
      [
        'How do I extract specific pages from a PDF?',
        'Type the page numbers in Pages to keep and download the new file. Example: 1,4-6.',
      ],
      [
        'Does extracting pages change my original file?',
        'You download a separate PDF. The file you opened is left as it was.',
      ],
      [
        'Can I extract pages in a different order?',
        'Type the numbers in the order you want. 5,2,1 puts page 5 first. Repeating a number repeats that page, because the list is copied as written.',
      ],
      [
        'What is the difference between Extract pages and Split PDF?',
        'Extract pages builds one PDF from the list you type. Split PDF with a blank Pages field gives you a ZIP of one PDF per page. Both copy pages. Neither re-renders them as images.',
      ],
    ],
    related: [
      ['delete-pdf-pages', 'Delete pages from PDF'],
      ['split-pdf', 'Split PDF'],
      ['organize-pages', 'Reorder PDF pages'],
      ['merge-pdf', 'Merge PDF'],
      ['rotate-pdf', 'Rotate PDF'],
    ],
  },
  'delete-pdf-pages': {
    title: 'Delete Pages From PDF Free, No Upload | Anywhere PDF',
    h1: 'Delete Pages From a PDF',
    meta: 'Remove unwanted pages from a PDF by number or range. Free, no signup, no upload, no watermark. Your original is kept, and the removal runs in your browser.',
    intro:
      'Enter the pages to remove, such as 2,5-7, and download a PDF without them. You get an error if the list would delete every page. A blank list is also an error.',
    steps: [
      'Open the PDF.',
      'In Pages to delete, type the pages to remove. 2,5-7 removes four pages. This field is the opposite of Extract pages.',
      'Download the shorter PDF. The source file is left as it was.',
    ],
    faq: [
      [
        'How do I delete pages from a PDF?',
        'Type the page numbers to remove and download the new file. The pages you omit from that list stay, in their original order.',
      ],
      [
        'Can I delete several pages or a range at once?',
        'Use commas and ranges, for example 2,5-7. A descending range such as 7-5 names the same pages.',
      ],
      [
        'Does deleting pages change my original file?',
        'You download a new PDF. The file you selected stays in place on your device.',
      ],
      [
        'How do I keep only some pages instead?',
        'Use Extract pages from a PDF and type the pages you want to keep. Delete lists pages to throw away.',
      ],
      [
        'Can I delete pages from a password-protected PDF?',
        'This form has no password field. Unlock the PDF first, then delete pages from the unlocked copy.',
      ],
    ],
    related: [
      ['extract-pdf-pages', 'Extract pages from PDF'],
      ['organize-pages', 'Reorder PDF pages'],
      ['split-pdf', 'Split PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['compress-pdf', 'Compress PDF'],
    ],
  },
  'organize-pages': {
    title: 'Reorder PDF Pages by Number, Free | Anywhere PDF',
    h1: 'Reorder PDF Pages',
    meta: 'Rearrange PDF pages by typing the order you want, such as 4,1-3. Free, no signup, no upload, works offline. Reverse a section with a range like 8-5.',
    intro:
      'Type the full page order, for example 4,1-3, and download the rearranged PDF. Pages you leave out are dropped. A descending range such as 8-5 reverses that section. There is no thumbnail board.',
    steps: [
      'Open the PDF.',
      'In Page order, type every page you want to keep, in the new sequence. 4,1-3 means page 4, then 1, then 2, then 3.',
      'Download the PDF. To reverse the whole file, type a descending range such as 8-1.',
    ],
    faq: [
      [
        'How do I reorder pages in a PDF?',
        'Type the new order in Page order and download the file. The list is the whole result, so include each page you still want.',
      ],
      [
        'How do I reverse the page order of a PDF?',
        'Type a descending range, such as 8-1 for an eight-page file. 8-5 reverses pages 8, 7, 6, and 5 and drops the rest unless you add them.',
      ],
      [
        'What happens to pages I leave out of the list?',
        'They are omitted from the download. A blank field is treated as the original order, because an empty page list means every page.',
      ],
      [
        'Can I drag page thumbnails?',
        'There is no thumbnail view. You type the numbers. Repeating a number, such as 1,1,2, copies that page again.',
      ],
      [
        'Can I duplicate a page?',
        'Type the page number twice in the list, for example 1,1,2. The copy follows the list as written.',
      ],
    ],
    related: [
      ['rotate-pdf', 'Rotate PDF'],
      ['delete-pdf-pages', 'Delete pages from PDF'],
      ['extract-pdf-pages', 'Extract pages from PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['alternate-mix-pdf', 'Alternate mix PDF'],
    ],
  },
  'rotate-pdf': {
    title: 'Rotate PDF Pages and Save the Turn | Anywhere PDF',
    h1: 'Rotate PDF Pages',
    meta: 'Rotate all or selected PDF pages by 90, 180, or 270 degrees and download the result. Free, no signup, no upload, no watermark. Works offline in your browser.',
    intro:
      'Choose 90, 180, or 270 degrees clockwise. Leave Pages empty to turn every page, or list the pages to turn. The rotation is stored in the file, and the text stays selectable.',
    steps: [
      'Open the PDF.',
      'Set Angle to 90, 180, or 270. In Pages, leave the field blank for the whole file, or type a page such as 2 to turn one page.',
      'Download the PDF. The angle is added to any rotation the page already had. 270 degrees is a quarter turn the other way from 90.',
    ],
    faq: [
      [
        'How do I rotate a PDF and save it?',
        'Pick 90, 180, or 270 and download the file. The page rotation is written into the PDF. The page is not redrawn as a picture.',
      ],
      [
        'How do I rotate only one page of a PDF?',
        'Type that page number in Pages and pick the angle. The other pages keep their current rotation.',
      ],
      [
        'How do I rotate a PDF the other way?',
        'Choose 270. That is a quarter turn opposite to 90. Choose 180 for a half turn. Flip PDF mirrors the page as an image instead, and text selection is lost there.',
      ],
      [
        'Will rotating a PDF reduce its quality?',
        'Rotate changes the page rotation value. It does not resample the page, so text and images stay as they were.',
      ],
    ],
    related: [
      ['organize-pages', 'Reorder PDF pages'],
      ['crop-resize-pdf', 'Crop PDF'],
      ['flip-pdf', 'Flip PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['extract-pdf-pages', 'Extract pages from PDF'],
    ],
  },
  'split-pdf-by-text': {
    title: 'Split PDF by Text or Keyword, Free | Anywhere PDF',
    h1: 'Split PDF by Text or Keyword',
    meta: 'Start a new PDF each time a chosen word or phrase appears, such as Invoice or Chapter. Free, no upload, no signup. Needs selectable text. Works offline.',
    intro:
      'Type a phrase. Any later page whose text contains that phrase starts a new part, wherever the phrase sits on the page. You download the parts in a ZIP. Scans need OCR first.',
    steps: [
      'Open a PDF that has selectable text. Type the current password if the file asks for one.',
      'In Phrase, type a marker that shows up where you want a new file, such as Chapter. Letter case is ignored.',
      'Leave Pages blank to scan the whole file, or limit the pages first.',
      'Download the ZIP of part-1.pdf, part-2.pdf, and so on. The first selected page starts part 1 even when it lacks the phrase.',
    ],
    faq: [
      [
        'How do I split a PDF by a keyword or phrase?',
        'Type the phrase and download the ZIP. Each selected page after the first that contains the phrase starts a new PDF, and that page is the first page of the new part.',
      ],
      [
        'Does the phrase have to be at the top of the page?',
        'No. A match anywhere in the page text starts a new part. Pick a phrase that appears at section starts, or you will get extra files.',
      ],
      [
        'Does it work on scanned PDFs?',
        'The search reads selectable text. Run OCR PDF first when the pages are pictures, then split the searchable copy. OCR is English.',
      ],
      [
        'Is the search case sensitive?',
        'No. Invoice and invoice match the same pages. The check is a plain contains test, so spacing has to match the text the page exposes.',
      ],
    ],
    related: [
      ['split-pdf', 'Split PDF'],
      ['split-pdf-by-bookmarks', 'Split PDF by bookmarks'],
      ['ocr-pdf', 'OCR PDF'],
      ['extract-text', 'Extract text from PDF'],
      ['split-pdf-by-size', 'Split PDF by size'],
    ],
  },
  'split-pdf-by-bookmarks': {
    title: 'Split PDF by Bookmarks or Chapters | Anywhere PDF',
    h1: 'Split PDF by Bookmarks (Chapters)',
    meta: 'Split a PDF into one file per top-level bookmark or chapter. Free, no signup, no upload, no watermark. Works in your browser and offline after your first visit.',
    intro:
      'Each top-level bookmark that points at a page starts a new section. You download one PDF per section in a ZIP. Nested bookmarks are ignored. A file with no usable outline cannot be split this way.',
    steps: [
      'Open a PDF that has a bookmark outline.',
      'Leave Pages blank to use the whole file, or narrow the pages. Only top-level bookmarks with a page destination are used.',
      'Download the ZIP. If the tool reports that no usable top-level bookmarks were found, use Split PDF or Split PDF by text.',
    ],
    faq: [
      [
        'How do I split a PDF into chapters?',
        'Open a file whose outline marks the chapters and run this tool. Each top-level bookmark starts a part, and the parts download in one ZIP.',
      ],
      [
        'How do I know if my PDF has bookmarks?',
        'Open the outline or bookmarks pane in a PDF viewer. If that pane is empty, this tool has nothing to split on.',
      ],
      [
        'Are nested bookmarks used?',
        'No. Only the top level of the outline is read. A bookmark that does not point at a page is skipped.',
      ],
      [
        'What can I do if my PDF has no bookmarks?',
        'Use Split PDF and type the page ranges, or use Split PDF by text if a repeated heading is selectable.',
      ],
    ],
    related: [
      ['split-pdf', 'Split PDF'],
      ['split-pdf-by-text', 'Split PDF by text'],
      ['extract-pdf-pages', 'Extract pages from PDF'],
      ['split-pdf-by-size', 'Split PDF by size'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'split-pdf-in-half': {
    title: 'Split PDF in Half Into Two Files | Anywhere PDF',
    h1: 'Split a PDF in Half',
    meta: 'Divide a PDF into two files of equal page count. Free, no signup, no upload, no watermark. Both halves download in one ZIP. Works offline in your browser.',
    intro:
      'The page list is cut into two PDFs. If the count is odd, the first file gets the extra page. This does not slice a page down the middle. You need at least two pages.',
    steps: [
      'Open a PDF with at least two pages.',
      'Leave Pages blank to split the whole file, or type a list to split only that selection.',
      'Download the ZIP. It holds two PDFs. The cut is by page count, halfway through the list.',
    ],
    faq: [
      [
        'How do I split a PDF into two equal parts?',
        'Run the tool with Pages blank. You get two PDFs in a ZIP, split at the middle of the page list.',
      ],
      [
        'What happens if the page count is odd?',
        'The first half gets one extra page. A five-page file becomes a three-page file and a two-page file.',
      ],
      [
        'Can I split each page vertically in half?',
        'No. The tool divides the sequence of pages into two files. It does not cut a two-page spread into left and right images.',
      ],
      [
        'Can I split only part of the document?',
        'Type the pages to include. That shorter list is what gets divided into two files. The rest of the PDF is left out of the ZIP.',
      ],
    ],
    related: [
      ['split-pdf', 'Split PDF'],
      ['split-pdf-by-size', 'Split PDF by size'],
      ['extract-pdf-pages', 'Extract pages from PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['organize-pages', 'Reorder PDF pages'],
    ],
  },
  'split-pdf-by-size': {
    title: 'Split PDF by File Size for Email, Free | Anywhere PDF',
    h1: 'Split a PDF by File Size',
    meta: 'Split a large PDF into parts that stay under a size you set. Free, no signup, no upload, no watermark. Useful for an email limit. Works offline in your browser.',
    intro:
      'Set the largest size of each part in KB. 1 MB is 1,024 KB. Pages are grouped in order until the next page would pass the limit, and the parts download in a ZIP.',
    steps: [
      'Open the PDF.',
      'In Maximum part size (KB), type the cap for each PDF inside the ZIP. For a 10 MB cap, type 10240.',
      'Download the ZIP. The cap applies to each PDF, not to the ZIP total. A single page larger than the cap stops the run and names that page.',
    ],
    faq: [
      [
        'How do I split a PDF into parts under 10 MB?',
        'Type 10240 in Maximum part size (KB). 10 MB is 10 times 1,024 KB. Download the ZIP of parts.',
      ],
      [
        'How do I enter a limit in MB?',
        'Multiply the megabytes by 1,024. A 5 MB cap is 5120. The field is KB.',
      ],
      [
        'What if a single page is larger than my limit?',
        'The tool stops and reports the page that cannot fit. Compress that PDF, or raise the limit, then split again.',
      ],
      [
        'Will the ZIP file also be under my limit?',
        'No. The limit is for each PDF inside the archive. The ZIP adds its own bytes on top.',
      ],
      [
        'Is splitting by size better than compressing?',
        'Split keeps the original pages and selectable text. Compress makes pages into JPEGs and may shrink one file more. Use Compress when you can accept images, and split when you must stay under a cap without redrawing pages.',
      ],
    ],
    related: [
      ['compress-pdf', 'Compress PDF'],
      ['split-pdf', 'Split PDF'],
      ['pdf-size-analyzer', 'PDF file info'],
      ['split-pdf-in-half', 'Split PDF in half'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'multiple-pages-per-sheet': {
    title: 'Put Multiple PDF Pages on One Sheet | Anywhere PDF',
    h1: 'Multiple Pages per Sheet (N-up PDF)',
    meta: 'Fit 2, 4, 6, 9, or 16 PDF pages on each A4 sheet for printing. Free, no signup, no upload, no watermark. The new PDF is built in your browser, offline too.',
    intro:
      'Pick how many source pages land on each sheet. The download is a new A4 portrait PDF, filled left to right and then down. Empty slots on the last sheet stay blank.',
    steps: [
      'Open the PDF.',
      'Set Pages per sheet to 2, 4, 6, 9, or 16. Leave Pages blank to include the whole file.',
      'Download the A4 PDF. The sheet is portrait. Source page rotation is kept when the page is drawn into its cell.',
    ],
    faq: [
      [
        'How do I print multiple PDF pages on one sheet?',
        'Choose 2, 4, 6, 9, or 16 and download the new PDF. Print that file. The arrangement is already on the page.',
      ],
      [
        'Which layouts are available?',
        '2, 4, 6, 9, and 16. Two-up is one row of two. Four-up is a two by two grid. Six-up is three columns and two rows.',
      ],
      [
        'Is the output always A4?',
        'Yes. Each sheet is A4 portrait. The source page is scaled to fit its cell, with a gap around it.',
      ],
      [
        'Will page order go left to right and then down?',
        'Yes. The first page is the top-left cell, the next page is to its right, and the row below starts after the row is full.',
      ],
    ],
    related: [
      ['resize-pdf', 'Resize PDF'],
      ['crop-resize-pdf', 'Crop PDF'],
      ['rotate-pdf', 'Rotate PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['compress-pdf', 'Compress PDF'],
    ],
  },
  'crop-resize-pdf': {
    title: 'Crop PDF Margins Online, Free | Anywhere PDF',
    h1: 'Crop PDF Margins',
    meta: 'Trim the same margin from every side of a PDF page. Free, no signup, no upload. The crop hides content and leaves it in the file. Works offline.',
    intro:
      'Enter a margin in points. 72 points equal 1 inch. The visible area shrinks by that amount on all four sides. This is a uniform trim, not a box you draw. Hidden content can remain in the file.',
    steps: [
      'Open the PDF.',
      'In Margin (points), start small, such as 18. The same value is applied to every side. It must be smaller than half the shortest side.',
      'Download and check the edges. To remove sensitive text for good, use Redact PDF instead of a crop.',
    ],
    faq: [
      [
        'How do I crop the margins of a PDF?',
        'Type a margin in points and download the PDF. The crop box moves in on every side by that amount.',
      ],
      [
        'How big is a point?',
        'There are 72 points in an inch. A margin of 36 is half an inch on each side.',
      ],
      [
        'Does cropping remove the hidden content?',
        'The crop changes what viewers show. Content outside the crop box can still sit in the file. Use Redact PDF when the words themselves have to go.',
      ],
      ['Can I crop only some pages?', 'Type those pages in Pages. A blank field crops every page.'],
      [
        'Can I draw a crop box by hand?',
        'You type one margin, and the same value moves in on all four sides. Separate margins per side are unavailable.',
      ],
    ],
    related: [
      ['resize-pdf', 'Resize PDF'],
      ['rotate-pdf', 'Rotate PDF'],
      ['multiple-pages-per-sheet', 'N-up PDF'],
      ['redact-pdf', 'Redact PDF'],
      ['organize-pages', 'Reorder PDF pages'],
    ],
  },
  'resize-pdf': {
    title: 'Resize PDF Pages to A4, Letter, Legal, A5 | Anywhere PDF',
    h1: 'Resize PDF Page Size',
    meta: 'Change PDF pages to A4, Letter, Legal, or A5. Free, no signup, no upload, no watermark. Works offline. This changes page size, not the file size in bytes.',
    intro:
      'Fit each page onto a standard paper size without stretching it. The sheet is portrait. To make the file smaller in bytes, use Compress PDF. Resize changes the page dimensions.',
    steps: [
      'Open the PDF.',
      'Set Paper size to A4, Letter, Legal, or A5. Leave Pages blank to resize the whole file.',
      'Download the PDF. Each selected page is scaled to fit the portrait sheet, with about 10 points of padding.',
    ],
    faq: [
      [
        'How do I change a PDF to A4 size?',
        'Choose A4 and download. Letter, Legal, and A5 are the other sizes. The page is scaled to fit, and the proportions stay as they were.',
      ],
      [
        'How do I resize a PDF to reduce file size?',
        'This tool changes paper size, not byte size. Use Compress PDF when you need a smaller file. Compress turns pages into JPEG images.',
      ],
      [
        'Will my pages be stretched?',
        'No. Each page keeps its proportions and is centered on the new sheet. Extra space stays empty.',
      ],
      [
        'What happens to landscape pages?',
        'The output sheet is portrait: A4, Letter, Legal, or A5. A landscape page is scaled down to fit inside that portrait sheet. The sheet stays portrait.',
      ],
    ],
    related: [
      ['compress-pdf', 'Compress PDF'],
      ['crop-resize-pdf', 'Crop PDF'],
      ['multiple-pages-per-sheet', 'N-up PDF'],
      ['rotate-pdf', 'Rotate PDF'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'flip-pdf': {
    title: 'Flip or Mirror PDF Pages, Free | Anywhere PDF',
    h1: 'Flip or Mirror PDF Pages',
    meta: 'Mirror PDF pages left to right, top to bottom, or both. Free, no signup, no upload, no watermark. Pages become images, so text is not selectable. Works offline.',
    intro:
      'Pick Horizontal, Vertical, or Both. Each selected page is drawn as a PNG and mirrored, so links and selectable text are lost. This is a mirror, not a page-turn flipbook. The file can grow.',
    steps: [
      'Open the PDF and enter the current password if the file asks for one.',
      'Set Direction to Horizontal, Vertical, or Both. A page list exports only those pages. A blank list exports the whole file.',
      'Download the PDF and check the facing. Run OCR PDF if you need English text you can search again.',
    ],
    faq: [
      [
        'How do I mirror a PDF?',
        'Choose Horizontal to mirror left to right, or Vertical to mirror top to bottom, then download.',
      ],
      [
        'How do I flip a PDF upside down?',
        'Choose Both, which mirrors both axes. The picture matches a 180 degree turn. Rotate PDF does that turn while keeping text selectable. Flip redraws the page.',
      ],
      [
        'Is flipping different from rotating?',
        'Rotate writes a rotation into the PDF and leaves the content selectable. Flip paints a mirrored image at 144 DPI. Text selection, links, and form fields on those pages are gone.',
      ],
      [
        'Will text still be selectable?',
        'No. The pages are images. File size often goes up. Compress PDF can shrink the result if you can accept another JPEG pass.',
      ],
    ],
    related: [
      ['rotate-pdf', 'Rotate PDF'],
      ['invert-pdf', 'Invert PDF colors'],
      ['organize-pages', 'Reorder PDF pages'],
      ['ocr-pdf', 'OCR PDF'],
      ['crop-resize-pdf', 'Crop PDF'],
    ],
  },
  workflow: {
    title: 'PDF Workflow: Chain Steps Offline | Anywhere PDF',
    h1: 'PDF Workflow Builder',
    meta: 'Chain up to eight PDF steps, such as rotate, compress, watermark, and page numbers, in one run. Free, no upload, no signup. Works offline in your browser.',
    intro:
      'Stack up to eight steps and run them on one PDF. The steps you can add are rotate, compress, watermark, page numbers, and flatten. You download the file from the last step.',
    steps: [
      'Open one PDF. Type the current password if the file is locked.',
      'Add steps in the order they should run. You can add from one to eight. Watermark text is typed for this run and is not saved in the preset.',
      'Download the final PDF. The browser remembers the step list and presets, not the file and not the watermark words.',
    ],
    faq: [
      [
        'What can I do with the workflow builder?',
        'Run several operations on one PDF and download the last result. A typical chain is rotate, then page numbers, then a watermark, then compress.',
      ],
      [
        'Which steps can I chain?',
        'Rotate, compress, watermark, page numbers, and flatten. Merge, split, and OCR are separate tools.',
      ],
      [
        'Does it process many files at once?',
        'One PDF per run. Add files one by one if you have a stack of them.',
      ],
      [
        'Does it remember my steps?',
        'This browser stores the operation choices and presets. It does not store the PDF or the watermark text.',
      ],
    ],
    related: [
      ['rotate-pdf', 'Rotate PDF'],
      ['compress-pdf', 'Compress PDF'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['page-numbers', 'Add page numbers to a PDF'],
      ['flatten-pdf', 'Flatten PDF'],
    ],
  },
  'pdf-to-zip': {
    title: 'Zip PDF Files Free, No Upload | Anywhere PDF',
    h1: 'Zip PDF Files',
    meta: 'Put several PDFs into one ZIP without uploading them. Free, no signup. Each file is copied unchanged. The archive does not merge the PDFs. Works offline.',
    intro:
      'Add the PDFs, set the order, and download one ZIP. Each file is stored under a numbered name, with its bytes copied as supplied. For one combined PDF, use Merge PDF.',
    steps: [
      'Add the PDFs you want in the archive.',
      'Use Up and Down if the numbered names should follow a particular order.',
      'Download the ZIP. The PDFs inside are the originals, not a merged document and not a recompressed copy.',
    ],
    faq: [
      [
        'How do I put several PDFs in a ZIP file?',
        'Add them and download the archive. Each entry is numbered and keeps the original file name, with slashes replaced.',
      ],
      [
        'Does the ZIP merge my PDFs?',
        'No. You get separate PDFs inside the ZIP. Merge PDF builds one document.',
      ],
      [
        'Will zipping make my PDFs smaller?',
        'The archive uses ZIP compression around the files. The PDF data itself is copied as supplied. Use Compress PDF when you need the PDF pages redrawn smaller.',
      ],
      [
        'Are my PDFs changed?',
        'The bytes placed in the ZIP are the files you added. They are not re-saved by the PDF engine.',
      ],
    ],
    related: [
      ['merge-pdf', 'Merge PDF'],
      ['compress-pdf', 'Compress PDF'],
      ['pdf-to-image-zip', 'PDF pages as a ZIP of images'],
      ['split-pdf', 'Split PDF'],
      ['extract-pdf-pages', 'Extract pages from PDF'],
    ],
  },
  'edit-pdf-text': {
    title: 'Add Text to PDF Free, No Upload | Anywhere PDF',
    h1: 'Add Text to a PDF',
    meta: 'Type a new line of text onto a PDF page at the position you set. Free, no signup, no upload, no watermark. Existing text stays put. The tool works offline.',
    intro:
      'Write one line and place it with left and top offsets in points. The line is drawn on top of the page in 12 point Helvetica. Text already in the PDF stays where it is.',
    steps: [
      'Open the PDF.',
      'Type the line in Text. Set Left offset (pt) and Top offset (pt). The defaults are 36 and 54. 72 points equal 1 inch from the corner.',
      'Leave Pages blank to stamp every page, or type the pages that should get the line.',
      'Download and check the position. Run again with new offsets if the line sits in the wrong place. There is no drag handle on the page.',
    ],
    faq: [
      [
        'How do I add text to a PDF?',
        'Type the line, set the offsets, and download. The words are drawn in dark green-black Helvetica at 12 points.',
      ],
      [
        'Can I edit the existing text in a PDF?',
        'The old text stays. This tool adds a new line on top. It does not delete or rewrite a sentence that is already in the file.',
      ],
      [
        'How do I position the text on the page?',
        'Left offset is the distance from the left edge. Top offset is the distance from the top. Both are in points. Change them and run again to nudge the line.',
      ],
      [
        'Can I change the font, size, or color?',
        'No. The font is Helvetica, the size is 12 points, and the color is fixed. Characters the font cannot draw become a question mark.',
      ],
      [
        'Can I add text to only some pages?',
        'Type those page numbers in Pages. A blank field covers every page with the same line.',
      ],
    ],
    related: [
      ['sign-pdf', 'Sign a PDF'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['fill-pdf-form', 'Fill a PDF form'],
      ['headers-footers', 'Add a footer to a PDF'],
      ['page-numbers', 'Add page numbers to a PDF'],
    ],
  },
  'sign-pdf': {
    title: 'Sign PDF With a Typed Signature, Free | Anywhere PDF',
    h1: 'Sign a PDF With a Typed Signature',
    meta: 'Place a typed signature on a PDF page. Free, no signup, no upload, no watermark. It is a visual name in italic type, not a certificate signature. Works offline.',
    intro:
      'Type your name, pick the pages, and set the position. The name is drawn in 20 point Times italic. You cannot draw a signature or upload a picture of one, and the PDF does not receive a certificate.',
    steps: [
      'Open the PDF.',
      'Type the name in Signature text. Set Left offset (pt) and Top offset (pt) for the spot on the page.',
      'Type a page number to sign one page, such as the last page, or leave Pages blank to stamp every page.',
      'Download and look at the placement. The color and size are fixed. Characters the font cannot draw become a question mark.',
    ],
    faq: [
      [
        'How do I sign a PDF for free?',
        'Type the name, set the offsets, and download. The mark is 20 point Times italic in a dark green-black color.',
      ],
      [
        'Can I draw or upload my handwritten signature?',
        'No. The tool accepts the characters you type. It does not take a drawn stroke or an image file.',
      ],
      [
        'Is a typed signature legally valid?',
        'That depends on the document and on the rules where you use it. This tool only places a visual name. It does not check or certify anything.',
      ],
      [
        'Is this a digital signature with a certificate?',
        'No. There is no certificate, no identity check, and no tamper seal. It is a typed mark on the page.',
      ],
      [
        'Can I sign only the last page?',
        'Type that page number in Pages. A blank field signs every page with the same name and position.',
      ],
    ],
    related: [
      ['edit-pdf-text', 'Add text to a PDF'],
      ['fill-pdf-form', 'Fill a PDF form'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['flatten-pdf', 'Flatten PDF'],
      ['encrypt-pdf', 'Password protect a PDF'],
    ],
  },
  'add-watermark': {
    title: 'Add Watermark to PDF Free, No Upload | Anywhere PDF',
    h1: 'Add a Watermark to a PDF',
    meta: 'Stamp translucent text such as DRAFT on PDF pages. Free, no signup, no upload. The site adds no watermark of its own. Works offline after one visit.',
    intro:
      'Type the watermark and choose the pages. The words sit in the middle of each page, horizontal, in 27 point type at 28% opacity. Image watermarks and diagonal text are not available.',
    steps: [
      'Open the PDF.',
      'Type a short label in Watermark text, such as DRAFT or CONFIDENTIAL.',
      'Leave Pages blank for every page, or list the pages that should carry the mark.',
      'Download and check the center of a page. Flatten PDF afterward if you want the mark baked into an image so it is harder to lift off.',
    ],
    faq: [
      [
        'How do I add a watermark to a PDF?',
        'Type the words and download. They are centered, horizontal, and partly see-through. The size, angle, and color are fixed.',
      ],
      [
        'Can I use an image or logo as a watermark?',
        'No. The tool accepts one line of text. It does not take a logo file.',
      ],
      [
        'Can I change the size, angle, or color?',
        'No. The type is 27 point Helvetica, the opacity is 28%, and the line is horizontal, not diagonal.',
      ],
      [
        'Does Anywhere PDF put its own watermark on my files?',
        'No. A watermark shows up when you type one here. Other tools do not add a mark.',
      ],
      [
        'Can I watermark only some pages?',
        'Type those pages in Pages. A blank field marks every page.',
      ],
    ],
    related: [
      ['page-numbers', 'Add page numbers to a PDF'],
      ['edit-pdf-text', 'Add text to a PDF'],
      ['flatten-pdf', 'Flatten PDF'],
      ['sign-pdf', 'Sign a PDF'],
      ['encrypt-pdf', 'Password protect a PDF'],
    ],
  },
  'page-numbers': {
    title: 'Add Page Numbers to PDF, No Upload | Anywhere PDF',
    h1: 'Add Page Numbers to a PDF',
    meta: 'Number PDF pages, starting at the number you choose. Free, no signup, no upload, no watermark. Digits sit at the bottom center. Works offline.',
    intro:
      'Set a starting number and the pages to number. Digits are drawn at the bottom center in 12 point Helvetica. You cannot move them or print a form such as Page 1 of 10.',
    steps: [
      'Open the PDF.',
      'Set Starting number. Use 1 for a normal count, or another integer if the file continues a previous document.',
      'Leave Pages blank to number every page, or type 2-20 to skip a cover. Numbering counts from the first selected page.',
      'Download. The digits sit about 24 points above the bottom edge, centered.',
    ],
    faq: [
      [
        'How do I add page numbers to a PDF?',
        'Set Starting number and download. Each selected page gets the next integer, in order.',
      ],
      [
        'Can I start numbering at a number other than 1?',
        'Set Starting number to that value, such as 7. The next selected page becomes 8.',
      ],
      [
        'Can I skip the cover page?',
        'Type the pages to number, for example 2-20, and set Starting number to 1 if the second page should read 1.',
      ],
      [
        'Where are the numbers placed?',
        'Bottom center, in 12 point Helvetica. The position and the font are fixed.',
      ],
      [
        'Can I use a format like Page 1 of 10?',
        'No. The tool writes the digits alone. For a prefix such as DOC-000001, use Bates numbering.',
      ],
    ],
    related: [
      ['bates-numbering', 'Bates numbering'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['headers-footers', 'Add a footer to a PDF'],
      ['organize-pages', 'Reorder PDF pages'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'bates-numbering': {
    title: 'Bates Numbering for PDF, Free, Offline | Anywhere PDF',
    h1: 'Add Bates Numbers to a PDF',
    meta: 'Stamp Bates-style IDs such as DOC-000001 on PDF pages. Free, no signup, no upload. The file stays on this device. Works offline after one visit.',
    intro:
      'Type an optional prefix. The tool stamps PREFIX-000001, then 000002, at the bottom center of each selected page. Each run starts at 000001. The width is six digits.',
    steps: [
      'Open the PDF. For one sequence across several files, merge them first.',
      'Type a prefix such as DOC- or leave it blank for numbers alone.',
      'Leave Pages blank to stamp the whole file. The first selected page is 000001.',
      'Download. The label is 12 point type at the bottom center, the same slot page numbers use.',
    ],
    faq: [
      [
        'What is Bates numbering?',
        'It is a running ID stamped on each page, often with a short prefix, so a packet can be cited by page. This tool writes a six-digit number with the prefix you type.',
      ],
      [
        'How do I add Bates numbers to a PDF?',
        'Type the prefix and download. The first selected page reads like DOC-000001 and the next selected page reads DOC-000002.',
      ],
      [
        'Can numbering continue from a previous document?',
        'Each run starts at 000001. Merge the PDFs first if you need one unbroken sequence, then stamp the merged file.',
      ],
      [
        'Can I add a suffix or change the number of digits?',
        'No. You get a prefix plus six digits, and nothing after the number. The position stays at the bottom center.',
      ],
    ],
    related: [
      ['page-numbers', 'Add page numbers to a PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['redact-pdf', 'Redact PDF'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['headers-footers', 'Add a footer to a PDF'],
    ],
  },
  'headers-footers': {
    title: 'Add a Footer to PDF Pages, Free | Anywhere PDF',
    h1: 'Add a Footer to a PDF',
    meta: 'Add one line of footer text to the bottom of each PDF page. Free, no signup, no upload, no watermark. A header line is not available. The tool works offline.',
    intro:
      'Type one footer line. It is centered at the bottom of each selected page in 12 point Helvetica. There is no header, and there is no left or right alignment.',
    steps: [
      'Open the PDF.',
      'Type the line in Footer text. The same line is used on every selected page.',
      'Leave Pages blank for the whole file, or list the pages that should get the footer.',
      'Download. The line sits at the bottom center. For a rising number, use Add page numbers instead.',
    ],
    faq: [
      [
        'How do I add a footer to a PDF?',
        'Type the line and download. It is centered at the bottom in 12 point type.',
      ],
      [
        'Can I add a header too?',
        'No. This tool draws one line at the bottom. It does not draw a header.',
      ],
      [
        'Can I put different text on different pages?',
        'No. One line is applied to each selected page. Run the tool again on a different page list if those pages need other words.',
      ],
      [
        'Can I include page numbers in the footer?',
        'The footer is the text you type, unchanged. Use Add page numbers when you want 1, 2, 3 at the bottom. That tool uses the same bottom-center slot.',
      ],
    ],
    related: [
      ['page-numbers', 'Add page numbers to a PDF'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['edit-pdf-text', 'Add text to a PDF'],
      ['bates-numbering', 'Bates numbering'],
      ['sign-pdf', 'Sign a PDF'],
    ],
  },
  'fill-pdf-form': {
    title: 'Fill a PDF Form From Field Names | Anywhere PDF',
    h1: 'Fill In a PDF Form',
    meta: 'Fill a PDF form from a JSON list of field names, then keep the fields or flatten them. Free, no signup, no upload. The form stays on your device.',
    intro:
      'Paste JSON that maps each internal field name to a value, then keep the form editable or flatten it. There is no click-to-type view of the fields. The PDF must already contain AcroForm fields.',
    steps: [
      'Open a fillable PDF, not a flat scan.',
      'In Field values as JSON, paste an object such as {"name":"Ada"}. The keys must be the field names stored in the form.',
      'Set Form mode to Preserve fields, or to Flatten if the values should be baked in and the fields removed.',
      'Download. If no supported fields matched, the names in the JSON do not match the form.',
    ],
    faq: [
      [
        'How do I fill a PDF form without Adobe?',
        'Paste JSON of field names and values, then download. Text fields, checkboxes, and supported choice fields can be set. The tool does not show the form on screen for you to click.',
      ],
      [
        'How do I find the field names in my PDF?',
        'This page does not list them. You need the internal names from the form, the ones a form editor shows. Guessing the visible label often fails with "No supported fields matched."',
      ],
      [
        'Which fields and forms are supported?',
        'Standard AcroForm text fields, checkboxes, and choice fields that accept a selection. A scanned page with no fields cannot be filled here. Use Add text to a PDF to place a line on a flat page.',
      ],
      [
        'What does Flatten do?',
        'Flatten keeps the visible values and removes the form controls. Preserve fields leaves the fields editable. Flatten here is the form flatten, not the image flatten on the Flatten PDF tool.',
      ],
      [
        'Can I fill a scanned form that has no fields?',
        'No. A scan has nothing for the JSON to set. Add text to a PDF can place a line at an offset, which is a different job.',
      ],
    ],
    related: [
      ['edit-pdf-text', 'Add text to a PDF'],
      ['sign-pdf', 'Sign a PDF'],
      ['flatten-pdf', 'Flatten PDF'],
      ['edit-pdf-metadata', 'Edit PDF metadata'],
      ['encrypt-pdf', 'Password protect a PDF'],
    ],
  },
  'flatten-pdf': {
    title: 'Flatten PDF: Pages Become Images | Anywhere PDF',
    h1: 'Flatten a PDF',
    meta: 'Turn PDF pages into images so notes and fields cannot be edited. Free, no signup, no upload. Text is not selectable afterward. The file can grow.',
    intro:
      'Each selected page is painted, annotations included, and saved as a picture. The download looks like the original and has no selectable text. A page list exports only those pages. The file often gets larger.',
    steps: [
      'Open the PDF and enter the current password if it is locked.',
      'Leave Pages blank to flatten the whole file, or list the pages to export. Unlisted pages are left out of the download.',
      'Download the image PDF. Run OCR PDF if you need an English text layer again, or Compress PDF if the file grew past what you can send.',
    ],
    faq: [
      [
        'What does flattening a PDF do?',
        'It redraws each selected page at 144 DPI, including annotations and filled fields, and saves that picture. Comments and fields are no longer separate objects.',
      ],
      [
        'Will the text still be selectable after flattening?',
        'No. The page is a PNG image inside the PDF. Search and copy stop working until you run OCR, which is English and redraws the page again.',
      ],
      [
        'How do I flatten only a form and keep the text?',
        'Use Fill a PDF form and choose Flatten. That path keeps the page content and removes the form widgets. This Flatten PDF tool replaces the page with an image.',
      ],
      [
        'Is flattening the same as compressing?',
        'No. Flatten keeps a 144 DPI PNG and often grows the file. Compress uses JPEG presets and returns the original if the copy is not smaller.',
      ],
    ],
    related: [
      ['fill-pdf-form', 'Fill a PDF form'],
      ['ocr-pdf', 'OCR PDF'],
      ['compress-pdf', 'Compress PDF'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['redact-pdf', 'Redact PDF'],
    ],
  },
  'invert-pdf': {
    title: 'Invert PDF Colors or Make It Grayscale | Anywhere PDF',
    h1: 'Invert PDF Colors or Convert to Grayscale',
    meta: 'Invert a PDF, or convert it to grayscale or sepia. Free, no signup, no upload. Pages become images, so text is not selectable. Works offline.',
    intro:
      'Pick Negative, Grayscale, or Sepia. Each selected page is redrawn as a 144 DPI image with that filter. Text is not selectable, and the file can grow. Grayscale is a gray picture, not a one-bit black and white file.',
    steps: [
      'Open the PDF and enter the current password if needed.',
      'Set Color mode to Negative, Grayscale, or Sepia.',
      'Leave Pages blank for the whole file, or list pages. The download contains only the pages you list.',
      'Download. Use Compress PDF if the PNG pages are too large, knowing that compress makes another image pass.',
    ],
    faq: [
      [
        'How do I invert the colors of a PDF?',
        'Choose Negative and download. Light areas go dark and dark areas go light, which some people use as a dark reading copy.',
      ],
      [
        'How do I convert a PDF to grayscale?',
        'Choose Grayscale. The page becomes a gray image, with shades of gray kept.',
      ],
      [
        'Is grayscale the same as black and white?',
        'No. Grayscale keeps shades of gray. Sepia applies a brown tone. Negative inverts the colors.',
      ],
      [
        'Will the PDF be larger afterward?',
        'Often yes. Pages are stored as PNG at 144 DPI. Compress PDF can shrink them by turning them into JPEGs.',
      ],
      [
        'Can I get searchable text back?',
        'Run OCR PDF on the result. The OCR model is English, and it redraws the pages again with an invisible text layer.',
      ],
    ],
    related: [
      ['compress-pdf', 'Compress PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['flip-pdf', 'Flip PDF'],
      ['flatten-pdf', 'Flatten PDF'],
      ['pdf-to-png', 'PDF to PNG'],
    ],
  },
  'edit-pdf-metadata': {
    title: 'Edit PDF Metadata: Title and Author | Anywhere PDF',
    h1: 'Edit PDF Metadata',
    meta: 'Change a PDF title, author, subject, or creator. Free, no signup, no upload, no watermark. Works offline. You enter the values as a short JSON object.',
    intro:
      'Paste JSON such as {"title":"Report","author":"Ada"}. Title, author, subject, and creator are the fields you can set. The words printed on the pages stay as they are.',
    steps: [
      'Open the PDF.',
      'In Metadata as JSON, include any of title, author, subject, and creator as strings. Other keys are ignored.',
      'Download the PDF. To read the current values first, run PDF metadata and open the JSON report. Producer in that report can read as pdf-lib.',
    ],
    faq: [
      [
        'How do I change the title and author of a PDF?',
        'Paste a JSON object with title, author, subject, or creator and download. Example: {"title":"Report","author":"Ada"}.',
      ],
      [
        'Which properties can I edit?',
        'Title, author, subject, and creator. Keywords and producer are not set by this form. The reader refreshes the producer and the modification time when it opens the file, so those two will not match the file you started with.',
      ],
      [
        'Does this change the text printed on the pages?',
        'No. It changes document properties. Visible page content is untouched.',
      ],
      [
        'How do I see the current metadata?',
        'Run the PDF metadata tool in Report only mode and open the JSON. Treat the producer line with caution, because loading the file can replace it with pdf-lib.',
      ],
    ],
    related: [
      ['privacy-scanner', 'Remove metadata from a PDF'],
      ['pdf-size-analyzer', 'PDF file info'],
      ['edit-pdf-text', 'Add text to a PDF'],
      ['fill-pdf-form', 'Fill a PDF form'],
      ['encrypt-pdf', 'Password protect a PDF'],
    ],
  },
  'privacy-scanner': {
    title: 'Remove or View PDF Metadata, Free | Anywhere PDF',
    h1: 'View and Remove PDF Metadata',
    meta: 'View a PDF title, author, and other properties, or clear six standard fields. Free, no upload, no signup. Dates and XMP can remain. Works offline.',
    intro:
      'Choose Report only for a JSON view of the standard properties, or Clear standard metadata to empty title, author, subject, keywords, creator, and producer. Creation date, modification date, XMP, and custom keys stay.',
    steps: [
      'Open the PDF.',
      'Pick Report only to download JSON, or Clear standard metadata to download a PDF with six fields emptied.',
      'Read the report with care. Producer may show pdf-lib, because the file is opened with metadata updates on. The page text is not removed. Use Redact PDF for words on the page.',
    ],
    faq: [
      [
        'How do I remove metadata from a PDF?',
        'Choose Clear standard metadata and download the PDF. Title, author, subject, keywords, creator, and producer are set empty.',
      ],
      [
        'Which metadata fields does this clear?',
        'Those six standard fields. Creation date, modification date, XMP packets, and custom keys are left in the file.',
      ],
      [
        'Does it remove every hidden detail?',
        'No. Embedded files, page content, bookmarks, and XMP can remain. Clearing properties is not redaction. Run Find PDF text and Redact PDF for words on the pages.',
      ],
      [
        'How do I view PDF metadata?',
        'Choose Report only and open the JSON. It lists size in bytes, page count, and the six properties. Producer can already read pdf-lib after the file is loaded.',
      ],
    ],
    related: [
      ['edit-pdf-metadata', 'Edit PDF metadata'],
      ['redact-pdf', 'Redact PDF'],
      ['redaction-checker', 'Find text in a PDF'],
      ['flatten-pdf', 'Flatten PDF'],
      ['encrypt-pdf', 'Password protect a PDF'],
    ],
  },
  'pdf-size-analyzer': {
    title: 'PDF Info: File Size, Pages, Metadata | Anywhere PDF',
    h1: 'PDF Info: Size, Page Count, and Metadata',
    meta: 'Get a PDF file size in bytes, a page count, and standard metadata as JSON. Free, no signup, no upload. The report is built on your device and works offline.',
    intro:
      'Open a PDF and download a JSON report with the size in bytes, the page count, and the standard properties. The tool does not change the PDF and does not shrink it.',
    steps: [
      'Open the PDF.',
      'Run the tool and download the JSON report.',
      'Use Compress PDF if you want a smaller file, or Split PDF by size if you need parts under a KB cap. This page only reports.',
    ],
    faq: [
      [
        'How do I check how many pages a PDF has?',
        'Run the tool and read pages in the JSON. The same report includes the file size in bytes.',
      ],
      [
        'What does the report include?',
        'Byte size, page count, and title, author, subject, keywords, creator, and producer. It matches the report from PDF metadata.',
      ],
      [
        'Does this reduce my PDF size?',
        'No. It writes a JSON file and leaves the PDF alone. Compress PDF is the tool that redraws pages as JPEGs.',
      ],
      [
        'Why does it show a different producer?',
        'Opening the PDF for the report can replace Producer with pdf-lib and refresh the modification time. Do not treat that producer line as the value stored before you opened the file.',
      ],
    ],
    related: [
      ['privacy-scanner', 'Remove metadata from a PDF'],
      ['compress-pdf', 'Compress PDF'],
      ['split-pdf-by-size', 'Split PDF by size'],
      ['edit-pdf-metadata', 'Edit PDF metadata'],
      ['extract-text', 'Extract text from PDF'],
    ],
  },
  'redaction-checker': {
    title: 'Find Text in a PDF: Which Pages Match | Anywhere PDF',
    h1: 'Find Which PDF Pages Contain a Phrase',
    meta: 'Search a PDF for a word or phrase and get the page numbers where it appears. Free, no signup, no upload. The search reads selectable text. It works offline.',
    intro:
      'Type a phrase and download JSON with the matching page numbers. The search ignores letter case and reads selectable text. A scanned page with no text layer is skipped. The result is a list, not highlighted hits.',
    steps: [
      'Open the PDF and enter the current password if needed.',
      'Type the words in Phrase to search. Leave Pages blank to scan the whole file.',
      'Download the JSON. The matches array lists page numbers. coverage says the search covered selectable text.',
    ],
    faq: [
      [
        'How do I find which pages of a PDF contain a word?',
        'Type the phrase and open the JSON. matches lists the page numbers whose text contains it, ignoring letter case.',
      ],
      [
        'Does a clear result mean my PDF is safe to share?',
        'No. The check misses scans, odd encodings, and text it cannot extract. Look at the pages yourself before you send a sensitive file.',
      ],
      [
        'Does it search scanned pages?',
        'Only if those pages already have selectable text. Run OCR PDF first for an English scan, then search the searchable copy.',
      ],
      [
        'How do I remove the phrase once I find it?',
        'Use Redact PDF with the same phrase, then run this search again on the redacted file. Redaction saves image pages, so a second search should find no text layer to match.',
      ],
    ],
    related: [
      ['redact-pdf', 'Redact PDF'],
      ['extract-text', 'Extract text from PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['privacy-scanner', 'Remove metadata from a PDF'],
      ['split-pdf-by-text', 'Split PDF by text'],
    ],
  },
  'redact-pdf': {
    title: 'Redact PDF Text Offline, Free | Anywhere PDF',
    h1: 'Redact Text in a PDF',
    meta: 'Black out each match of a phrase in a PDF. Pages are saved as images, so covered text is gone. Free, no upload, no signup. Review the pages. Works offline.',
    intro:
      'Type a phrase. Each match is covered by a black box on the matched characters, and the selected pages are saved as images with no text layer. Review the download before you share it. A page list exports only those pages.',
    steps: [
      'Open a PDF with selectable text. Enter the current password if the file is locked.',
      'Type the phrase in Phrase to redact. Matching ignores letter case and extra spaces, and it can join pieces of text on a line. A line break is treated as a space.',
      'Leave Pages blank to export the whole file, or list pages. Unlisted pages are absent from the download.',
      'Open the result and read every page. If the phrase is missing, the tool stops. Hyphenated words, odd encodings, and scans can be missed.',
    ],
    faq: [
      [
        'How do I redact text in a PDF?',
        'Type the phrase and download. The black box covers the matched glyphs when the font can be measured, plus a small margin. If the font cannot be measured, the box covers the whole text segment.',
      ],
      [
        'Is the redacted text removed?',
        'The selected pages are rebuilt as 144 DPI images with no text layer, so the covered words are not sitting in a hidden text object on those pages. Look at the images anyway. A miss stays visible.',
      ],
      [
        'Can I draw redaction boxes by hand?',
        'No. You type a phrase. There is no box-drawing tool.',
      ],
      [
        'Does it work on scanned PDFs?',
        'A scan has no text to match until you run OCR PDF. OCR is English and replaces the page with its own image. Redact that copy, then check it by eye.',
      ],
      [
        'Will a phrase split across the line still match?',
        'The search ignores case and extra spaces and joins text segments on a line. A line break counts as a space, so a phrase can match across two lines. Hyphens, ligatures, and unusual encodings can still miss.',
      ],
    ],
    related: [
      ['redaction-checker', 'Find text in a PDF'],
      ['flatten-pdf', 'Flatten PDF'],
      ['privacy-scanner', 'Remove metadata from a PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['encrypt-pdf', 'Password protect a PDF'],
    ],
  },
  'encrypt-pdf': {
    title: 'Password Protect a PDF With AES-256 | Anywhere PDF',
    h1: 'Protect a PDF With a Password',
    meta: 'Add an AES-256 password to a PDF. Free, no signup, no upload. The password and the file stay on this device. A lost password cannot be recovered. Works offline.',
    intro:
      'Choose a password and download an encrypted copy that must be unlocked to open. Encryption runs on this device with AES-256. Anywhere PDF does not store the password and cannot recover it later.',
    steps: [
      'Open the PDF. If it is already locked, type that password under Current PDF password.',
      'Type the new password. It must be 1 to 127 UTF-8 bytes, must not contain a null character, and must not start with @ or -.',
      'Download the encrypted PDF and open it once to confirm the password. Keep a copy of the password outside the file.',
    ],
    faq: [
      [
        'How do I password protect a PDF?',
        'Type a new password and download the encrypted file. Opening that file asks for the password you chose.',
      ],
      [
        'What encryption does this use?',
        'AES-256, through a qpdf WebAssembly build that runs in the browser. The password you type is the user password that opens the file.',
      ],
      [
        'What happens if I forget the password?',
        'The site does not keep it. There is no recovery and no reset. Keep another copy of the password, or keep an unlocked file in a safe place.',
      ],
      [
        'Can I protect a PDF that already has a password?',
        'Type the current password and the new one. The download uses the new password.',
      ],
      [
        'Does this restrict printing or copying?',
        'There are no separate print or copy switches. A random owner password is created and discarded, so you cannot set those permissions apart from the open password.',
      ],
    ],
    related: [
      ['unlock-pdf', 'Unlock a PDF'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['redact-pdf', 'Redact PDF'],
      ['privacy-scanner', 'Remove metadata from a PDF'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'unlock-pdf': {
    title: 'Unlock PDF: Remove a Known Password | Anywhere PDF',
    h1: 'Unlock a PDF (Remove Its Password)',
    meta: 'Remove the password from a PDF you can already open. Free, no signup, no upload. Unknown passwords are not guessed. The unlock runs on your device, offline.',
    intro:
      'Type the current password and download a copy without encryption. The tool does not guess passwords. The file and the password stay in this browser. The original locked file is left as it was.',
    steps: [
      'Open the locked PDF.',
      'Type the password that opens it under Current PDF password.',
      'Download the unlocked PDF and confirm it opens without a prompt. If the password is wrong, the tool reports that.',
    ],
    faq: [
      [
        'How do I remove the password from a PDF?',
        'Type the password you already know and download the decrypted copy. You get a separate file. The locked original stays where it was.',
      ],
      [
        'Can I unlock a PDF if I forgot the password?',
        'No. The tool does not try passwords and does not recover a forgotten one. You need the password that opens the file.',
      ],
      [
        'Can I remove copy and print restrictions?',
        'Use this when you know the password that opens the file. A file that opens with no password but blocks printing was not part of the tested path, so check the download in your viewer before you rely on it.',
      ],
      [
        'Is it safe to enter my password here?',
        'The browser uses the password to decrypt the file, then drops it. The site does not receive it. After the status reads Ready offline, the same step works with no connection.',
      ],
    ],
    related: [
      ['encrypt-pdf', 'Password protect a PDF'],
      ['repair-pdf', 'Repair a PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['compress-pdf', 'Compress PDF'],
      ['extract-text', 'Extract text from PDF'],
    ],
  },
  'repair-pdf': {
    title: 'Repair a PDF the Browser Can Still Open | Anywhere PDF',
    h1: 'Repair a PDF',
    meta: 'Re-save a PDF that still opens. Free, no signup, no upload. Missing pages and unreadable data cannot be rebuilt. The rewrite runs offline in your browser.',
    intro:
      'If the browser can still read the file, this writes a new PDF from the pages it understood. It cannot invent missing pages or recover a file the parser cannot open.',
    steps: [
      'Open the PDF that still loads.',
      'Run the tool. There are no options.',
      'Open the download in a PDF viewer. If the source is password protected, unlock it first. This form has no password field.',
    ],
    faq: [
      [
        'How do I fix a PDF that opens badly?',
        'Run the tool and open the new file. It rewrites a document the browser parser can load. It does not patch random byte damage by hand.',
      ],
      [
        'Can this recover a PDF that will not open at all?',
        'No. If the parser cannot read the file, the tool cannot rebuild the missing data. A truly corrupted file fails here.',
      ],
      [
        'Does it work on password-protected PDFs?',
        'Unlock the file first if you know the password, then repair the unlocked copy.',
      ],
      [
        'What else can I try?',
        'If you only need some pages that still display, open the file in a viewer that can print those pages. This tool cannot reconstruct pages it cannot read.',
      ],
    ],
    related: [
      ['unlock-pdf', 'Unlock a PDF'],
      ['extract-pdf-pages', 'Extract pages from PDF'],
      ['compress-pdf', 'Compress PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['ocr-pdf', 'OCR PDF'],
    ],
  },
  'images-to-pdf': {
    title: 'JPG to PDF Converter, Free, No Upload | Anywhere PDF',
    h1: 'Convert JPG and Other Images to PDF',
    meta: 'Turn JPG, PNG, and other images into one PDF. Free, no signup, no upload, no watermark. Each picture sits on an A4 page. Works offline after one visit.',
    intro:
      'Add JPG or PNG images, set the order, and download one PDF. Each image is placed on an A4 page, portrait or landscape to match the picture. Large images are scaled down. Small images are not enlarged.',
    steps: [
      'Add the images. JPEG and PNG are embedded as they are. Other formats are used when the browser can decode them.',
      'Use Up and Down so the first picture becomes page 1.',
      'Download the PDF. Phone photos can appear sideways because EXIF rotation is not applied. Turn those pages with Rotate PDF.',
    ],
    faq: [
      [
        'How do I convert JPG to PDF?',
        'Add the JPG files and download. PNG works the same way. Each image becomes one A4 page, centered.',
      ],
      [
        'Can I combine several images into one PDF?',
        'Add them all and arrange the list. You get one PDF with one image per page.',
      ],
      [
        'Which image formats are supported?',
        'JPEG and PNG are embedded as stored. WebP and other types depend on what the browser can decode. HEIC depends on the browser.',
      ],
      [
        'What page size does the PDF use?',
        'A4. A wide image gets a landscape A4 page. A tall image gets a portrait A4 page. There is no margin control and no other paper size.',
      ],
      [
        'Why does a phone photo appear sideways?',
        'The JPEG is embedded without applying EXIF orientation. Rotate PDF can turn the page afterward and keeps the image in the file.',
      ],
    ],
    related: [
      ['scan-to-pdf', 'Scan to PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['compress-pdf', 'Compress PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['pdf-to-jpg', 'PDF to JPG'],
    ],
  },
  'scan-to-pdf': {
    title: 'Scan to PDF With Your Phone Camera | Anywhere PDF',
    h1: 'Scan a Document to PDF With Your Camera',
    meta: 'Take a photo of a page with your phone camera and save it as a PDF. Free, no signup, no upload. One photo per PDF. Works offline in your browser.',
    intro:
      'On a phone, the button opens the camera. You take one photo and download it as a one-page PDF. The tool does not crop, straighten, or detect edges. It does not add searchable text.',
    steps: [
      'On a phone, use the camera control and take one photo. On a desktop, pick a photo from the device.',
      'Download the PDF. The picture is placed on an A4 page, scaled down if it is larger than the page.',
      'For more pages, repeat and then Merge PDF. Run OCR PDF if you need English text you can search. Run Rotate PDF if the photo landed sideways.',
    ],
    faq: [
      [
        'How do I scan a document to PDF with my phone?',
        'Open this tool, take one photo, and download the PDF. The browser camera picker supplies the picture. There is no separate scanner app.',
      ],
      [
        'Can I scan several pages into one PDF?',
        'Each run takes one photo. Scan each page, then use Merge PDF to join the one-page files.',
      ],
      [
        'Does it straighten or crop the page?',
        'No. You get the photo as the browser provides it, on an A4 page. Crop and rotate in the camera app first if you need a tight frame.',
      ],
      [
        'Can I make the scan searchable?',
        'Run OCR PDF on the download. The OCR model is English, and it re-saves the page as an image with an invisible text layer.',
      ],
    ],
    related: [
      ['images-to-pdf', 'JPG to PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['rotate-pdf', 'Rotate PDF'],
      ['compress-pdf', 'Compress PDF'],
    ],
  },
  'create-pdf': {
    title: 'Create a PDF From Text, Free | Anywhere PDF',
    h1: 'Create a PDF From Text',
    meta: 'Type or paste plain text and download it as a PDF. Free, no signup, no upload. Latin text is accepted. Other scripts stop with an error. Works offline.',
    intro:
      'Type or paste text and it flows onto A4 pages in an 11 point font. Latin letters, accents, and common punctuation are accepted. Cyrillic, Greek, Hindi, Chinese, Arabic, and emoji stop the tool with an error.',
    steps: [
      'Type or paste the document in Document text. There is no file to upload.',
      'Run the tool. Long lines wrap. A line that passes the bottom of the page continues on the next A4 page.',
      'Download document.pdf. If you see an error that lists characters, remove those characters. The tool does not print a garbled stand-in.',
    ],
    faq: [
      [
        'How do I create a PDF from text?',
        'Paste the text and download. The page is A4, the type is 11 point, and the left margin is 48 points.',
      ],
      [
        'Can I add images, tables, or bold text?',
        'The box accepts plain text. Bold, tables, and pictures are not available. Use JPG to PDF for image pages.',
      ],
      [
        'Which characters are supported?',
        'Latin characters in the Windows-1252 set, including common accents and punctuation. Other characters produce an error that names them. There is no preview of a broken glyph.',
      ],
      [
        'What page size and font does it use?',
        'A4, 11 point type, about 15 points between lines. The same path is used for TXT, Markdown, HTML, CSV, Office text, EPUB, and the invoice.',
      ],
    ],
    related: [
      ['txt-to-pdf', 'TXT to PDF'],
      ['images-to-pdf', 'JPG to PDF'],
      ['word-to-pdf', 'Word to PDF'],
      ['edit-pdf-text', 'Add text to a PDF'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'txt-to-pdf': {
    title: 'TXT to PDF Converter, Free, Offline | Anywhere PDF',
    h1: 'Convert a TXT File to PDF',
    meta: 'Convert a plain .txt file to a paged PDF. Free, no signup, no upload, no watermark. Latin text is accepted. Other characters are rejected. Works offline.',
    intro:
      'Choose a UTF-8 .txt file and download an A4 PDF in a standard font. Line breaks are kept, and long lines wrap. Text outside the Latin Windows-1252 set is rejected with an error.',
    steps: [
      'Choose a .txt file.',
      'Run the tool. The file is read as text and printed with the same rules as Create a PDF from text.',
      'Download the PDF. For a Word file, use Word to PDF. For text you want to type, use Create a PDF from text.',
    ],
    faq: [
      [
        'How do I convert a TXT file to PDF?',
        'Select the .txt file and download the PDF. Pages are A4 and the type is 11 point.',
      ],
      [
        'Why did I get an error about unsupported characters?',
        'The built-in font accepts Latin characters. Cyrillic, Greek, Hindi, Chinese, Arabic, and emoji stop the conversion and the message lists examples.',
      ],
      [
        'Does it keep line breaks and spacing?',
        'Line breaks stay. Long lines wrap to fit the page width. Tabs and spaces are kept as the text file stored them, within what the font can draw.',
      ],
      [
        'Can I convert a Word file here?',
        'No. Use Word to PDF for a .docx file. This tool reads plain text.',
      ],
    ],
    related: [
      ['create-pdf', 'Create a PDF from text'],
      ['word-to-pdf', 'Word to PDF'],
      ['markdown-to-pdf', 'Markdown to PDF'],
      ['csv-to-pdf', 'CSV to PDF'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'markdown-to-pdf': {
    title: 'Markdown File to PDF, Source Text | Anywhere PDF',
    h1: 'Convert a Markdown File to PDF',
    meta: 'Print a .md file as a PDF. Headings and tables stay as source text and are not rendered. Free, no signup, no upload. Latin text. Works offline.',
    intro:
      'This prints the Markdown source as plain text. Headings, bold, lists, and tables are not turned into styled layout. Use it when you want a PDF of the file as written. Latin characters only.',
    steps: [
      'Choose a .md or .markdown file.',
      'Run the tool. The source is printed, including hash marks and other syntax.',
      'Download the PDF. If you need styled output, export from an editor that renders Markdown, then bring that PDF here for other tools.',
    ],
    faq: [
      [
        'How do I convert a Markdown file to PDF?',
        'Select the file and download. You get the source text on A4 pages, not a rendered article.',
      ],
      [
        'Does it render headings, bold text, and tables?',
        'No. #, *, and pipe characters stay in the PDF as typed in the file.',
      ],
      [
        'Which characters are supported?',
        'Latin characters. A file with other scripts fails with an error that lists the characters, the same rule as Create a PDF from text.',
      ],
      [
        'What are the alternatives for styled output?',
        'Render the Markdown in an editor that can print to PDF. This page keeps the source on purpose so the limit is obvious.',
      ],
    ],
    related: [
      ['txt-to-pdf', 'TXT to PDF'],
      ['html-to-pdf', 'HTML to PDF'],
      ['create-pdf', 'Create a PDF from text'],
      ['word-to-pdf', 'Word to PDF'],
      ['csv-to-pdf', 'CSV to PDF'],
    ],
  },
  'html-to-pdf': {
    title: 'HTML File to PDF, Text Only, Free | Anywhere PDF',
    h1: 'Convert an HTML File to PDF (Text Only)',
    meta: 'Save the visible text of a local HTML file as a PDF. Layout, CSS, images, and scripts are left out. Free, no signup, no upload. Works offline.',
    intro:
      'Choose a saved .html file and get its visible text as a PDF. Styling, images, scripts, and page layout are not reproduced. You cannot paste a web address. Latin characters only.',
    steps: [
      'Save the HTML file on this device, then choose it here.',
      'The tool drops script, style, template, noscript, and title nodes, then prints the remaining text.',
      'Download the PDF. A web address is not fetched. Remote images and stylesheets are not loaded.',
    ],
    faq: [
      [
        'How do I convert an HTML file to PDF?',
        'Select a local .html or .htm file and download the text PDF. The page is A4 and the type is plain.',
      ],
      [
        'Does it keep CSS, images, and layout?',
        'No. You get the text content. Colors, columns, and pictures are left out.',
      ],
      [
        'Can I convert a web page by URL?',
        'No. The tool reads a file you already saved. It does not open a remote page.',
      ],
      [
        'Why is my PDF missing content?',
        'Text that lived in a script, a stylesheet, or a title element is removed before printing. Text that required the page to run is not executed. Non-Latin characters cause an error instead of a partial PDF.',
      ],
    ],
    related: [
      ['txt-to-pdf', 'TXT to PDF'],
      ['markdown-to-pdf', 'Markdown to PDF'],
      ['create-pdf', 'Create a PDF from text'],
      ['pdf-to-html', 'PDF to HTML'],
      ['images-to-pdf', 'JPG to PDF'],
    ],
  },
  'csv-to-pdf': {
    title: 'CSV to PDF as Plain Text, Offline | Anywhere PDF',
    h1: 'Convert a CSV File to PDF (Plain Text)',
    meta: 'Print a CSV file as a PDF. Commas and raw rows stay in the text. A table is not drawn. Free, no signup, no upload. Latin text. Works offline.',
    intro:
      'The CSV is printed as plain text, with separators kept. It is a reading copy, not a table with columns and borders. Non-Latin characters are rejected. For sheet values with a bar between cells, use Excel to PDF on an .xlsx file.',
    steps: [
      'Choose a .csv file.',
      'Run the tool. The source text is printed, including commas.',
      'Download the PDF. Keep the CSV if you still need to edit cells in a spreadsheet.',
    ],
    faq: [
      [
        'How do I convert a CSV file to PDF?',
        'Select the CSV and download. You get the file contents as text on A4 pages.',
      ],
      [
        'Will the PDF show a table with columns?',
        'No. Rows are not measured into columns. The commas remain in the text.',
      ],
      [
        'Which encodings are supported?',
        'The text is read as a browser text file, then drawn with a Latin font. Characters outside Windows-1252 stop the tool with an error.',
      ],
      [
        'How can I get a formatted spreadsheet PDF?',
        'This page will not draw one. Excel to PDF prints saved .xlsx values with cells separated by bars, still as text, still without chart graphics.',
      ],
    ],
    related: [
      ['excel-to-pdf', 'Excel to PDF'],
      ['txt-to-pdf', 'TXT to PDF'],
      ['pdf-to-excel', 'PDF to Excel'],
      ['markdown-to-pdf', 'Markdown to PDF'],
      ['html-to-pdf', 'HTML to PDF'],
    ],
  },
  'word-to-pdf': {
    title: 'Word to PDF, Text Only, Offline | Anywhere PDF',
    h1: 'Convert Word (DOCX) to PDF',
    meta: 'Turn .docx text into a PDF without uploading it. Free, no signup. Images and formatting are not kept. Latin text only. Works offline in your browser.',
    intro:
      'This reads paragraph text from a .docx file and prints it as a plain PDF. Images are left out. Table text becomes lines. Headers stored outside the main document are not read. Latin characters only.',
    steps: [
      'Choose a .docx file. .doc is not accepted.',
      'Run the tool. Each paragraph becomes lines of 11 point text on A4.',
      'Download and read it as a text copy. If the error lists characters, the document uses a script the built-in font cannot draw.',
    ],
    faq: [
      [
        'How do I convert a Word document to PDF?',
        'Select the .docx file and download the PDF. You get the words, in paragraph order, in a standard font.',
      ],
      [
        'Will my formatting, images, and tables be kept?',
        'Images are left out. Table cell text is flattened into lines. Fonts, headers, and the original layout are not reproduced.',
      ],
      [
        'Does it support .doc files?',
        'No. The file must be .docx. Save a legacy .doc as .docx in a word processor first.',
      ],
      [
        'Does it work with non-English text?',
        'Latin text, including common accents, is accepted. Hindi, Chinese, Arabic, Cyrillic, Greek, and emoji stop the tool with an error. The document is not uploaded either way.',
      ],
      [
        'Is my document uploaded?',
        'The .docx is read in this browser. The host does not receive the file. After Ready offline, the conversion works with no connection.',
      ],
    ],
    related: [
      ['excel-to-pdf', 'Excel to PDF'],
      ['pptx-to-pdf', 'PowerPoint to PDF'],
      ['txt-to-pdf', 'TXT to PDF'],
      ['pdf-to-word', 'PDF to Word'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'excel-to-pdf': {
    title: 'Excel to PDF: Print XLSX Values | Anywhere PDF',
    h1: 'Convert Excel (XLSX) to PDF',
    meta: 'Print the saved cell values from every sheet in an .xlsx file as a PDF. Free, no signup, no upload. Charts and cell formatting are left out. Works offline.',
    intro:
      'Each sheet is printed as text, one row per line, with cells separated by bars. Saved values are used, so formulas are not recalculated. Charts, colors, and column widths are left out. Latin text only.',
    steps: [
      'Choose an .xlsx workbook. .xls is not accepted.',
      'If formulas should show their latest results, open the workbook in a spreadsheet and save it first. This tool reads stored values.',
      'Download the PDF. Sheets are labeled Sheet 1, Sheet 2, and so on. Dates with a recognized date format are written as dates.',
    ],
    faq: [
      [
        'How do I convert an Excel file to PDF?',
        'Select the .xlsx file and download. You get the cell values as text, not a picture of the grid.',
      ],
      [
        'Are all sheets included?',
        'Each worksheet in the file is printed, in sheet order, with a Sheet N heading.',
      ],
      [
        'Are formulas, charts, and formatting kept?',
        'Charts, fills, and borders are left out. Formulas are not recalculated. You see the saved value, or a formatted date when the cell uses a date format the reader recognizes.',
      ],
      [
        'Does it support .xls files?',
        'No. Save the workbook as .xlsx first. Characters outside the Latin set cause an error instead of a partial PDF.',
      ],
    ],
    related: [
      ['csv-to-pdf', 'CSV to PDF'],
      ['word-to-pdf', 'Word to PDF'],
      ['pdf-to-excel', 'PDF to Excel'],
      ['pptx-to-pdf', 'PowerPoint to PDF'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'pptx-to-pdf': {
    title: 'PowerPoint to PDF: Slide Text Only | Anywhere PDF',
    h1: 'Convert PowerPoint (PPTX) to PDF',
    meta: 'Print the text of each .pptx slide as a PDF, free and without an upload. Images, backgrounds, and animations are left out. Works offline on your device.',
    intro:
      'The text of each slide is printed in order, labeled Slide 1, Slide 2, and so on. Pictures, backgrounds, and animations are left out. Speaker notes are not read. Latin characters only.',
    steps: [
      'Choose a .pptx file. .ppt is not accepted.',
      'Run the tool. Each slide contributes its text paragraphs, then the next slide.',
      'Download the PDF and treat it as a script of the deck, not a picture of the slides.',
    ],
    faq: [
      [
        'How do I convert PowerPoint to PDF?',
        'Select the .pptx file and download. You get the words from the slides, labeled by slide number.',
      ],
      [
        'Will my slides look the same?',
        'No. Images, backgrounds, positions, and animations are left out. The PDF is the slide text in a standard font.',
      ],
      ['Does it support .ppt files?', 'No. Save the deck as .pptx first.'],
      [
        'Are speaker notes included?',
        'No. Notes are not read. Only text from the slide files is printed.',
      ],
    ],
    related: [
      ['word-to-pdf', 'Word to PDF'],
      ['pdf-to-pptx', 'PDF to PowerPoint'],
      ['excel-to-pdf', 'Excel to PDF'],
      ['images-to-pdf', 'JPG to PDF'],
      ['merge-pdf', 'Merge PDF'],
    ],
  },
  'ebook-to-pdf': {
    title: 'EPUB to PDF Converter, Free, Offline | Anywhere PDF',
    h1: 'Convert EPUB to PDF',
    meta: 'Turn DRM-free EPUB text into a PDF in your browser. Free, no signup, no upload. Images and styling are left out. Latin text. Works offline after one visit.',
    intro:
      'Chapters are read in spine order and printed as plain text. Cover art, images, and styles are left out. MOBI, AZW3, and DRM-protected books are not supported. Latin characters only.',
    steps: [
      'Choose an .epub file that you can open without DRM.',
      'Run the tool. Body text from each spine item is printed, in order.',
      'Download the PDF. If a chapter uses a non-Latin script, the conversion stops with an error instead of dropping that chapter silently.',
    ],
    faq: [
      [
        'How do I convert an EPUB to PDF?',
        'Select the EPUB and download. You get the chapter text on A4 pages in a standard font.',
      ],
      [
        'Can I convert a Kindle MOBI or AZW3 file?',
        'No. The tool reads EPUB. It does not read MOBI or AZW3.',
      ],
      [
        'Does it keep images and formatting?',
        'Images and styles are left out. You get the text from each chapter body.',
      ],
      [
        'Does it work with DRM-protected books?',
        'No. The tool does not remove DRM. A book you cannot unpack as a normal EPUB will fail.',
      ],
    ],
    related: [
      ['pdf-to-epub', 'PDF to EPUB'],
      ['word-to-pdf', 'Word to PDF'],
      ['txt-to-pdf', 'TXT to PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['compress-pdf', 'Compress PDF'],
    ],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter, Free, No Upload | Anywhere PDF',
    h1: 'Convert PDF to JPG',
    meta: 'Convert PDF pages to JPG at 72, 144, 300, or 600 DPI. Free, no signup, no upload, no watermark. One page is a JPG. Several pages arrive as a ZIP.',
    intro:
      'Choose the pages and a resolution. Each page is rendered as a JPEG at quality 85%. One page downloads as a single JPG. Two or more pages download as a ZIP named page-001.jpg and so on.',
    steps: [
      'Open the PDF and enter the current password if needed.',
      'Set Resolution to 144 for a compact file, 72 for a smaller one, or 300 or 600 for more detail. Leave Pages blank for every page, or list the pages you want.',
      'Download. A single page is a JPG. Several pages are a ZIP. This renders the page. It does not pull out images embedded inside the PDF.',
    ],
    faq: [
      [
        'How do I convert a PDF to JPG?',
        'Pick a resolution and download. One page becomes one JPEG. A longer selection becomes a ZIP of JPEGs.',
      ],
      [
        'What DPI should I choose?',
        '144 is the default balance. 72 is smaller. 300 and 600 keep more detail and use more memory. JPEG quality stays at 85%.',
      ],
      [
        'How do I convert only some pages?',
        'Type those pages in Pages. The download contains only that list. A blank field renders the whole file.',
      ],
      [
        'Can I extract the images embedded in a PDF?',
        'No. The tool paints each page and saves that painting. It does not unpack the original image objects.',
      ],
      [
        'Why is a high-resolution conversion failing?',
        'A large page at 600 DPI can exceed the canvas memory the browser allows. Lower the resolution or process fewer pages at a time.',
      ],
    ],
    related: [
      ['pdf-to-png', 'PDF to PNG'],
      ['pdf-to-image-zip', 'PDF pages as images in a ZIP'],
      ['images-to-pdf', 'JPG to PDF'],
      ['compress-pdf', 'Compress PDF'],
      ['extract-text', 'Extract text from PDF'],
    ],
  },
  'pdf-to-png': {
    title: 'PDF to PNG Converter, Free, No Upload | Anywhere PDF',
    h1: 'Convert PDF to PNG',
    meta: 'Convert PDF pages to PNG at 72, 144, 300, or 600 DPI. Free, no signup, no upload, no watermark. One page is a PNG. Several pages arrive as a ZIP. Works offline.',
    intro:
      'Pick the pages and a resolution. Each page is rendered as a PNG on a white background. One page downloads as a single file. Several pages are bundled in a ZIP. The background is not transparent.',
    steps: [
      'Open the PDF and enter the password if the file is locked.',
      'Set Resolution. 144 is a solid default. 600 is for detail and can run out of memory on a large page.',
      'Download the PNG, or the ZIP if you selected more than one page. For a ZIP even when there is one page, use PDF pages as images.',
    ],
    faq: [
      [
        'How do I convert a PDF to PNG?',
        'Choose the resolution and download. A single page is one PNG file. More pages come in a ZIP named page-001.png and so on.',
      ],
      ['Is the PNG background transparent?', 'No. Pages are painted on white.'],
      [
        'Which resolution gives the most detail?',
        '600 DPI, then 300. Those settings use more memory. 144 and 72 are lighter.',
      ],
      [
        'Why does a page fail at 600 DPI?',
        'The browser canvas has a memory ceiling. A large page at 600 DPI can hit it. Lower the DPI or export fewer pages.',
      ],
    ],
    related: [
      ['pdf-to-jpg', 'PDF to JPG'],
      ['pdf-to-image-zip', 'PDF pages as images in a ZIP'],
      ['images-to-pdf', 'JPG to PDF'],
      ['invert-pdf', 'Invert PDF colors'],
      ['flatten-pdf', 'Flatten PDF'],
    ],
  },
  'pdf-to-image-zip': {
    title: 'PDF Pages to PNG Images in a ZIP | Anywhere PDF',
    h1: 'Save PDF Pages as Images in a ZIP',
    meta: 'Export PDF pages as PNG images in one ZIP, including a single page. Free, no signup, no upload, no watermark. Pick 72 to 600 DPI. Works offline in your browser.',
    intro:
      'Choose pages and a resolution. Every selected page is a PNG inside one ZIP, even when you export a single page. File names include the original page number.',
    steps: [
      'Open the PDF and enter the password if needed.',
      'Set Resolution and, if you want a subset, type the pages. A blank field exports every page.',
      'Download the ZIP of PNG files. It does not contain PDFs. Use Zip PDF files when you want the original PDFs archived.',
    ],
    faq: [
      [
        'How do I save PDF pages as images?',
        'Run the tool and unzip the download. Each page is a PNG on a white background.',
      ],
      [
        'What is the difference between this and PDF to PNG?',
        'PDF to PNG returns a bare PNG when you export one page, and a ZIP when you export more. This tool returns a ZIP every time.',
      ],
      [
        'How are the files named?',
        'page-001.png uses the page number from the PDF, with three digits.',
      ],
      [
        'Does the ZIP contain PDFs?',
        'No. It contains PNG images of the pages. Zip PDF files stores the original PDFs.',
      ],
    ],
    related: [
      ['pdf-to-png', 'PDF to PNG'],
      ['pdf-to-jpg', 'PDF to JPG'],
      ['pdf-to-zip', 'Zip PDF files'],
      ['images-to-pdf', 'JPG to PDF'],
      ['split-pdf', 'Split PDF'],
    ],
  },
  'pdf-to-word': {
    title: 'PDF to Word: Editable Text, Offline | Anywhere PDF',
    h1: 'Convert PDF to Word (DOCX)',
    meta: 'Export PDF text to an editable Word file with no upload. Free, no signup. Layout and images are not kept. Each line becomes a paragraph. Works offline.',
    intro:
      'The text on each selected page is saved into a DOCX you can edit, with a page break between PDF pages. Images, columns, fonts, and tables are not reproduced. A scan needs OCR first.',
    steps: [
      'Open a PDF that has selectable text. Enter the password if the file is locked.',
      'Leave Pages blank for the whole file, or list the pages to export.',
      'Download the DOCX. Each extracted line is its own paragraph. Rebuild tables and layout in Word if you need them.',
      'If the document is a scan, run OCR PDF first. OCR is English and redraws the pages, then send that file through this tool.',
    ],
    faq: [
      [
        'How do I convert a PDF to Word?',
        'Open the PDF and download the DOCX. You get the text layer, one paragraph per line, with a page break between PDF pages.',
      ],
      [
        'Will the formatting, images, and tables be kept?',
        'No. Images, columns, fonts, and table structure are left out. You can edit the words. You will rebuild the design.',
      ],
      [
        'Can I convert a scanned PDF to Word?',
        'Run OCR PDF on the scan, then convert that searchable file. OCR reads English and replaces each page with a 144 DPI image plus an invisible text layer.',
      ],
      [
        'Why does every line become its own paragraph?',
        'Each line of extracted text is written as its own Word paragraph. That makes editing clumsy and keeps the tool from pretending it recovered the layout.',
      ],
      [
        'Is my PDF uploaded?',
        'The conversion runs in this browser. The host does not receive the PDF. After Ready offline, it works with no connection.',
      ],
    ],
    related: [
      ['extract-text', 'Extract text from PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['pdf-to-excel', 'PDF to Excel'],
      ['pdf-to-pptx', 'PDF to PowerPoint'],
      ['word-to-pdf', 'Word to PDF'],
    ],
  },
  'pdf-to-excel': {
    title: 'PDF to Excel: Text Rows to XLSX | Anywhere PDF',
    h1: 'Convert PDF to Excel (XLSX)',
    meta: 'Export PDF text to Excel, one sheet per page, with rows guessed from positions. Free, no upload, no signup. Values are stored as text. Works offline.',
    intro:
      'Rows and columns are estimated from where the text sits on the page, and each page becomes a worksheet. Cells are stored as text, so Excel will not treat them as numbers. Scanned tables need OCR first.',
    steps: [
      'Open a PDF whose table text is selectable. Enter the password if needed.',
      'Choose the pages. A blank field exports every page, one sheet each, named Page 1 and so on.',
      'Download the XLSX and check the columns. A gap wider than 12 points starts a new cell. Nearby text on the same line stays in one cell.',
    ],
    faq: [
      [
        'How do I convert a PDF table to Excel?',
        'Open the PDF and download the workbook. Each selected page is a sheet. Expect to clean up columns that the position guess got wrong.',
      ],
      [
        'How does it detect rows and columns?',
        'Text on a similar vertical position, rounded to 3 points, shares a row. A horizontal gap above 12 points starts a new cell.',
      ],
      [
        'Why are my columns merged or misaligned?',
        'The guess uses gaps, not the real table borders. Tight columns and wrapped headings often land in the wrong cell. The values are text, so a SUM formula will not add them until you convert the cells to numbers.',
      ],
      [
        'Does it work on scanned PDFs?',
        'Only after OCR PDF, and only for English. OCR redraws the page, and the text positions it writes are what Excel will see.',
      ],
    ],
    related: [
      ['pdf-to-word', 'PDF to Word'],
      ['extract-text', 'Extract text from PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['excel-to-pdf', 'Excel to PDF'],
      ['csv-to-pdf', 'CSV to PDF'],
    ],
  },
  'pdf-to-pptx': {
    title: 'PDF to PowerPoint: Text Slides | Anywhere PDF',
    h1: 'Convert PDF to PowerPoint (PPTX)',
    meta: 'Turn each PDF page into a PowerPoint slide of its text. Free, no signup, no upload. Images, charts, and layouts are left out. Works offline.',
    intro:
      'Each selected PDF page becomes one slide that holds its text, shrunk to fit a wide slide. Original images, charts, and layouts are not reproduced. Plan to rebuild the design.',
    steps: [
      'Open a PDF with selectable text. Enter the password if the file is locked.',
      'Choose the pages. A blank field makes one slide per page in the file.',
      'Download the PPTX. The text is 14 point and fitted into the slide. For pictures of the pages, use PDF to JPG and place those images yourself.',
    ],
    faq: [
      [
        'How do I convert a PDF to PowerPoint?',
        'Download the PPTX. You get one slide per selected page, with the page text in the slide body.',
      ],
      [
        'Will slides keep my images and layout?',
        'No. Images, charts, and the original layout are left out. PDF to JPG gives you pictures of the pages if that is what you need to drop onto slides.',
      ],
      [
        'Can I edit the text afterward?',
        'Yes. The slide text is editable. A scan has nothing to edit until you run OCR PDF, which is English.',
      ],
      [
        'How many slides will I get?',
        'One slide for each selected page. A blank Pages field selects the whole file.',
      ],
    ],
    related: [
      ['pdf-to-word', 'PDF to Word'],
      ['pdf-to-jpg', 'PDF to JPG'],
      ['extract-text', 'Extract text from PDF'],
      ['pptx-to-pdf', 'PowerPoint to PDF'],
      ['ocr-pdf', 'OCR PDF'],
    ],
  },
  'pdf-to-html': {
    title: 'PDF to HTML Text Export, Offline | Anywhere PDF',
    h1: 'Convert PDF to HTML',
    meta: 'Export PDF text as a standalone HTML file. Free, no signup, no upload. The page is plain text with line breaks, not the original layout. Works offline.',
    intro:
      'The selected pages are saved as one HTML file that keeps line breaks in a simple block of text. Fonts, images, and page design are not preserved. You can open the file with no network.',
    steps: [
      'Open a PDF with selectable text and enter the password if needed.',
      'Choose the pages, or leave Pages blank for the whole file.',
      'Download the HTML and open it in a browser. A scan needs OCR PDF first, in English.',
    ],
    faq: [
      [
        'How do I convert a PDF to HTML?',
        'Download the HTML file. It is one page of text from the PDF, with line breaks preserved.',
      ],
      [
        'Does the HTML keep fonts and images?',
        'No. You get the text in a plain block. There are no images, no webfonts, and no columns.',
      ],
      [
        'Can I open the file offline?',
        'Yes. It is a single HTML file with the text inside it. It does not call a server when you open it.',
      ],
      [
        'What if my PDF is a scan?',
        'The export will be empty or thin until the pages have a text layer. Run OCR PDF first. The model is English.',
      ],
    ],
    related: [
      ['extract-text', 'Extract text from PDF'],
      ['pdf-to-word', 'PDF to Word'],
      ['pdf-to-epub', 'PDF to EPUB'],
      ['ocr-pdf', 'OCR PDF'],
      ['html-to-pdf', 'HTML to PDF'],
    ],
  },
  'pdf-to-epub': {
    title: 'PDF to EPUB Converter, Free, Offline | Anywhere PDF',
    h1: 'Convert PDF to EPUB',
    meta: 'Convert PDF text to an EPUB for an e-reader. Free, no signup, no upload. One section, text only, no images. Works offline in your browser after the first visit.',
    intro:
      'The text layer of the selected pages becomes one EPUB section. Images, page design, and chapter splits are not kept. A reader that opens EPUB can open the file. A scan needs OCR first.',
    steps: [
      'Open a text PDF and enter the password if needed.',
      'Choose the pages to include.',
      'Download the EPUB and open it in an EPUB reader. The contents list has a single entry.',
    ],
    faq: [
      [
        'How do I convert a PDF to EPUB?',
        'Download the EPUB. The selected text is placed in one section as preformatted text.',
      ],
      [
        'Will it keep images and chapters?',
        'No. There is one section and one contents entry. Pictures and the original chapter breaks are left out.',
      ],
      [
        'Can I convert a scanned book?',
        'Run OCR PDF first. OCR is English and rebuilds each page as an image with a text layer. Then convert that text.',
      ],
      [
        'Which e-readers can open the file?',
        'A reader that accepts EPUB. The tool does not promise a specific Kindle workflow, and it does not add images the reader could show.',
      ],
    ],
    related: [
      ['extract-text', 'Extract text from PDF'],
      ['pdf-to-word', 'PDF to Word'],
      ['ocr-pdf', 'OCR PDF'],
      ['ebook-to-pdf', 'EPUB to PDF'],
      ['pdf-to-html', 'PDF to HTML'],
    ],
  },
  'ocr-pdf': {
    title: 'OCR PDF: Make Scans Searchable | Anywhere PDF',
    h1: 'OCR a PDF and Make Scans Searchable',
    meta: 'Add a searchable English text layer to a scanned PDF with on-device OCR. Free, no signup, no upload. Pages are re-saved as images. Works offline.',
    intro:
      'Pick a scanned PDF. Each selected page is read with English OCR on this device and saved again as a 144 DPI image with an invisible text layer. Try a few pages first on a long file.',
    steps: [
      'Open the scan and enter the password if the file is locked.',
      'Type a short page list for a first test, such as 1-2. A blank field processes every page, and a list exports only those pages.',
      'Wait for the on-device recognition. The English model is bundled with the site, so the step works after Ready offline.',
      'Download and search for a word you can see. Blur, skew, handwriting, and unusual type reduce accuracy.',
    ],
    faq: [
      [
        'How do I make a scanned PDF searchable?',
        'Run this tool and download the new PDF. You can then search and copy the recognized English words. The visible page is a new 144 DPI image, not the original scan pixels.',
      ],
      [
        'Which languages does OCR support?',
        'English. The bundled model is the English one. Other languages are not included, and non-Latin characters in the result can become question marks in the text layer.',
      ],
      [
        'Why is the recognized text wrong in places?',
        'Blur, skew, handwriting, and decorative type confuse the recognizer. Check names, amounts, and dates yourself. The text layer is invisible Helvetica drawn on top of the image.',
      ],
      [
        'Will the file get bigger?',
        'It can. Each page is a PNG at 144 DPI plus the text layer, so a compact scan can grow. Compress PDF can shrink it afterward and will remove the text layer again.',
      ],
      [
        'Can I get the text as a TXT or Word file?',
        'Run Extract text from PDF or PDF to Word on the OCR result. Both read the new text layer. Word still makes one paragraph per line.',
      ],
    ],
    related: [
      ['extract-text', 'Extract text from PDF'],
      ['pdf-to-word', 'PDF to Word'],
      ['images-to-pdf', 'JPG to PDF'],
      ['scan-to-pdf', 'Scan to PDF'],
      ['compress-pdf', 'Compress PDF'],
    ],
  },
  'extract-text': {
    title: 'Extract Text From PDF to TXT, Free | Anywhere PDF',
    h1: 'Extract Text From a PDF',
    meta: 'Pull the text out of a PDF and download a TXT file. Free, no signup, no upload. A scan needs English OCR first. The export works offline now.',
    intro:
      'Choose the pages and download their text layer as a .txt file. If the file is empty, the PDF is probably a scan. Run OCR PDF first. OCR is English.',
    steps: [
      'Open the PDF and enter the password if needed.',
      'Leave Pages blank for the whole file, or type the pages to read.',
      'Download the TXT. Multi-column pages can come out in an order that does not match the visual reading order.',
    ],
    faq: [
      [
        'How do I extract text from a PDF?',
        'Run the tool and open the .txt file. You get the text layer, with pages separated by a blank line.',
      ],
      [
        'Why is my extracted file empty?',
        'A scanned PDF often has no selectable text. Run OCR PDF, then extract text from that copy.',
      ],
      [
        'Will the reading order be correct?',
        'It follows the order the PDF stores the text, which can scramble columns. Read the output before you rely on it.',
      ],
      [
        'Can I extract text from only some pages?',
        'Type those pages in Pages. A blank field reads every page.',
      ],
    ],
    related: [
      ['ocr-pdf', 'OCR PDF'],
      ['pdf-to-word', 'PDF to Word'],
      ['summarize-pdf', 'Summarize a PDF'],
      ['pdf-to-html', 'PDF to HTML'],
      ['redaction-checker', 'Find text in a PDF'],
    ],
  },
  'pdf-to-audio': {
    title: 'Read a PDF Aloud, Private, Offline | Anywhere PDF',
    h1: 'Read a PDF Aloud',
    meta: 'Listen to a PDF with a speech voice installed on your device. Free, no signup, no upload. No audio file is created. A local voice is required. Works offline.',
    intro:
      'Choose pages and the text is spoken by a voice already on your device. Playback stays in the browser. An MP3 or WAV is not created. A remote voice is not used. A scan needs OCR first.',
    steps: [
      'Open a PDF with selectable text and enter the password if needed.',
      'Choose the pages to read. A blank field reads the whole text layer.',
      'Start playback. Stop playback ends the session. If you see an error about no local speech voice, this browser has no installed voice marked as local.',
    ],
    faq: [
      [
        'How do I make my computer read a PDF aloud?',
        'Open the PDF and start the tool. The first local voice whose language starts with English is used. If none is English, the first local voice is used.',
      ],
      [
        'Can I download the audio as MP3?',
        'No. Speech plays in the browser. The tool does not write an audio file.',
      ],
      [
        'Why does it say no local voice is available?',
        'The browser must expose a voice with local service. A remote voice is refused so the audio is not sent off the device. Try a browser or device that has a local voice installed.',
      ],
      [
        'Does it work on scanned PDFs?',
        'Only after the pages have text. Run OCR PDF first. If the text layer is empty, playback stops and tells you there is nothing to read.',
      ],
    ],
    related: [
      ['extract-text', 'Extract text from PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['summarize-pdf', 'Summarize a PDF'],
      ['pdf-to-word', 'PDF to Word'],
      ['pdf-to-html', 'PDF to HTML'],
    ],
  },
  'summarize-pdf': {
    title: 'Summarize a PDF Without AI or Upload | Anywhere PDF',
    h1: 'Summarize a PDF Without AI or Upload',
    meta: 'Get five sentences from a PDF, scored on this device with no AI service. Free, no signup, no upload. Selectable text is required. Works offline.',
    intro:
      'The tool scores sentences by how often their longer words appear in the document, keeps the top five, and lists them in their original order. It does not write new sentences and it does not call an AI model.',
    steps: [
      'Open a PDF with selectable text. Enter the password if needed.',
      'Choose the pages to score, or leave Pages blank for the whole file.',
      'Download the TXT. You get up to five sentences, separated by blank lines, in the order they appeared.',
    ],
    faq: [
      [
        'How does the PDF summary work?',
        'Sentences are split on periods, question marks, and exclamation marks. Words of five letters or more are counted. Each sentence is scored by the average frequency of those words, and the five highest scores are kept.',
      ],
      [
        'Does it use AI or send my text anywhere?',
        'No AI model is called. The count runs in this browser on the text layer. The host does not receive the PDF.',
      ],
      [
        'How long is the summary?',
        'Up to five sentences from the text you selected. A short page may return fewer. The sentences are copied, not paraphrased.',
      ],
      [
        'Can it summarize a scanned PDF?',
        'Run OCR PDF first so there is text to score. OCR is English. Then summarize that file. Read the source before you treat five sentences as the whole document.',
      ],
    ],
    related: [
      ['extract-text', 'Extract text from PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['pdf-to-audio', 'Read a PDF aloud'],
      ['compare-pdfs', 'Compare two PDFs'],
      ['pdf-to-word', 'PDF to Word'],
    ],
  },
  'compare-pdfs': {
    title: 'Compare Two PDFs Side by Side | Anywhere PDF',
    h1: 'Compare Two PDF Files',
    meta: 'Compare two PDFs page by page in a side-by-side HTML report. Free, no signup, no upload. Image-only changes are missed. The compare runs offline.',
    intro:
      'Add two PDFs. The HTML report labels each page as the same text, different text, or present in only one file, and shows both texts side by side. Individual words are not highlighted. Images are not compared.',
    steps: [
      'Add two PDFs. The first file in the list is the left column.',
      'Use the same password for both, or unlock a file that needs a different password before you add it.',
      'Open the HTML report. A blank Pages field covers the longer of the two files. Pages past the end of one file are marked as only in the other file.',
    ],
    faq: [
      [
        'How do I compare two PDF files?',
        'Add both files and open the HTML report. Each page has a status and two text columns.',
      ],
      [
        'Does it show which words changed?',
        'No. A page is marked same text or different text. The columns show the full text. Changed words are not highlighted inside the line.',
      ],
      [
        'Does it detect image or layout differences?',
        'No. Two pages with the same text and different pictures are marked the same. Look at the pages when the change might be visual.',
      ],
      [
        'Which file is shown on the left?',
        'The first file in the list. Put the baseline first. If the second file uses another password, unlock it first. The tool reports that case.',
      ],
    ],
    related: [
      ['extract-text', 'Extract text from PDF'],
      ['merge-pdf', 'Merge PDF'],
      ['ocr-pdf', 'OCR PDF'],
      ['summarize-pdf', 'Summarize a PDF'],
      ['redaction-checker', 'Find text in a PDF'],
    ],
  },
  'gst-invoice': {
    title: 'Simple INR Invoice PDF, Free, Offline | Anywhere PDF',
    h1: 'Create a Simple INR Invoice PDF',
    meta: 'Make a one-item invoice PDF with quantity, unit price, and one tax rate, in INR. Free, no signup, no upload. It is not a full GST invoice. Works offline.',
    intro:
      'Enter the supplier, buyer, one item, quantity, unit price, and one tax rate. You get a plain text invoice with a subtotal, a tax line, and a total in INR. There is no CGST, SGST, or IGST split, no HSN code, and no second line item.',
    steps: [
      'Fill in supplier, buyer, description, quantity, unit price, and tax rate. Invoice number, date, and GSTIN can be blank. The PDF still prints a GSTIN line.',
      'Use digits for quantity, price, and rate. The rupee sign is not in the font. Type INR amounts as numbers. The PDF writes the letters INR.',
      'Download the PDF and read the totals. Quantity times unit price is the subtotal. The tax rate is applied to that subtotal.',
    ],
    faq: [
      [
        'How do I create an invoice PDF for free?',
        'Fill in the parties, one item, the quantity, the unit price, and one tax rate, then download. The page is a text invoice on A4.',
      ],
      [
        'Is this a GST-compliant invoice?',
        'No. It is a simple one-line invoice. It does not split CGST, SGST, and IGST, and it has no HSN or SAC, no place of supply, and no multi-item table. Check the fields your filing requires.',
      ],
      [
        'Can I add several items or tax lines?',
        'No. One description, one quantity, one price, and one rate. A second item needs a second PDF, or text you add in Create a PDF from text.',
      ],
      [
        'Can I use the rupee symbol?',
        'No. The symbol is outside the Latin font and the tool stops with an error. Amounts are labeled INR in the PDF.',
      ],
    ],
    related: [
      ['create-pdf', 'Create a PDF from text'],
      ['merge-pdf', 'Merge PDF'],
      ['add-watermark', 'Add a watermark to a PDF'],
      ['page-numbers', 'Add page numbers to a PDF'],
      ['compress-pdf', 'Compress PDF'],
    ],
  },
};

export const hubs = [
  {
    slug: 'split-pdf-tools',
    title: 'Split PDF: 5 Free Ways, No Upload | Anywhere PDF',
    meta: 'Split a PDF by page, size, bookmark, phrase, or into two files. Free, no signup, no upload. Pick the split that matches the file. Works offline.',
    h1: 'Split a PDF Your Way',
    intro:
      'Five tools split a PDF, and they do different jobs. One gives you a page each or a single range. The others cut on file size, bookmarks, a phrase, or a halfway page count. The file stays on this device.',
    body: [
      'Use Split PDF when you want every page as its own file, or one PDF that holds a list such as 1,4-6. A list returns one PDF. A blank Pages field returns a ZIP of single pages. Extract pages from a PDF is the same copy operation aimed at the pages you want to keep.',
      'Use Split PDF by size when an email cap is the constraint. The limit is in KB, and 1 MB is 1,024 KB. The cap applies to each PDF inside the ZIP, not to the ZIP itself. A page bigger than the cap stops the run.',
      'Use Split PDF by bookmarks when the outline marks chapters. Only top-level bookmarks count. Use Split PDF by text when a repeated phrase marks the next section. The phrase can sit anywhere on the page, and a scan needs OCR first. Split a PDF in half divides the page list into two files. It does not cut a page down the middle.',
    ],
    toolIds: [
      'split-pdf',
      'split-pdf-by-text',
      'split-pdf-by-bookmarks',
      'split-pdf-in-half',
      'split-pdf-by-size',
      'extract-pdf-pages',
    ],
    faq: [
      [
        'Which split tool should I open?',
        'Blank Pages on Split PDF makes one file per page. A typed range makes one PDF. Size, bookmarks, a phrase, and a halfway cut are the other four tools.',
      ],
      [
        'Can I split every N pages?',
        'No. There is no every-five-pages mode. Type the ranges yourself in Split PDF, or use Split PDF by size when the limit is bytes rather than a page count.',
      ],
      [
        'Does splitting upload the PDF?',
        'The split runs in the browser. After the status reads Ready offline, it works with no connection.',
      ],
      [
        'Will the pages lose quality?',
        'These split tools copy pages. They do not redraw them as images. Compress PDF is the tool that turns pages into JPEGs.',
      ],
    ],
  },
  {
    slug: 'pdf-to-image',
    title: 'PDF to Image: JPG or PNG, Offline | Anywhere PDF',
    meta: 'Convert PDF pages to JPG or PNG, one page or a ZIP. Free, no signup, no upload. Choose 72 to 600 DPI. The images are made on your device, offline too.',
    h1: 'Convert PDF to Image (JPG or PNG)',
    intro:
      'Three tools paint PDF pages as images. PDF to JPG and PDF to PNG return one file for one page and a ZIP for more. PDF pages as images always returns a ZIP of PNGs. None of them unpacks pictures that were embedded in the PDF.',
    body: [
      'Pick JPG when you want a smaller photograph-style file. JPEG quality is 85%. Pick PNG when you want a lossless image on a white background. The background is not transparent. Resolutions are 72, 144, 300, and 600 DPI. A large page at 600 DPI can run out of canvas memory.',
      'JPG to PDF goes the other direction and places each picture on an A4 page. Compress PDF also paints pages, as JPEGs inside a new PDF, and returns the original if the copy is not smaller.',
    ],
    toolIds: ['pdf-to-jpg', 'pdf-to-png', 'pdf-to-image-zip', 'images-to-pdf'],
    faq: [
      [
        'How do I turn a PDF into pictures?',
        'Open PDF to JPG or PDF to PNG, set the resolution, and download. One page is a single image. Several pages are a ZIP named page-001 and up.',
      ],
      [
        'JPG or PNG?',
        'JPG is smaller at a fixed quality of 85%. PNG is lossless and painted on white. Use the ZIP tool when you want an archive even for one PNG page.',
      ],
      [
        'Can I pull out the photos inside a PDF?',
        'No. These tools render the whole page. They do not extract the original embedded image objects.',
      ],
    ],
  },
  {
    slug: 'convert-to-pdf',
    title: 'Convert to PDF: JPG, Word, Excel, Text | Anywhere PDF',
    meta: 'Convert JPG, Word, Excel, PowerPoint, EPUB, and text files to PDF. Free, no signup, no upload. Office files keep text. Images land on A4. Works offline.',
    h1: 'Convert Files to PDF',
    intro:
      'Pick the tool that matches the file you have. Pictures become A4 pages. Office, EPUB, and text files are printed as Latin text in a standard font. Layout, images inside those documents, and non-Latin scripts are outside what these converters draw.',
    body: [
      'JPG to PDF takes JPEG, PNG, and other images the browser can decode. Each image is centered on A4, portrait or landscape to match the picture, scaled down if it is large, and not enlarged if it is small. Phone photos can land sideways. Scan to PDF takes one camera photo and uses the same page rules.',
      'Word to PDF reads .docx paragraph text. Excel to PDF prints saved .xlsx values with cells separated by bars. PowerPoint to PDF prints slide text and skips notes. EPUB to PDF prints chapter text from a DRM-free book. TXT, Markdown, HTML, and CSV print source text. Markdown is not rendered. HTML is not fetched from a URL. Create a PDF from text is the same printer for words you paste.',
      'If the error lists characters, the text uses a script the built-in font cannot draw. Cyrillic, Greek, Hindi, Chinese, Arabic, and emoji stop the run. The file is not uploaded in any of these cases.',
    ],
    toolIds: [
      'images-to-pdf',
      'scan-to-pdf',
      'word-to-pdf',
      'excel-to-pdf',
      'pptx-to-pdf',
      'ebook-to-pdf',
      'txt-to-pdf',
      'markdown-to-pdf',
      'html-to-pdf',
      'csv-to-pdf',
      'create-pdf',
      'gst-invoice',
    ],
    faq: [
      [
        'Which converter should I use?',
        'Images go to JPG to PDF. A .docx goes to Word to PDF. A pasted paragraph goes to Create a PDF from text. Match the extension to the tool. .doc, .xls, and .ppt are not accepted.',
      ],
      [
        'Will my Word file look the same?',
        'No. You get the paragraph text. Pictures and the original layout are left out. The same limit applies to Excel, PowerPoint, and EPUB.',
      ],
      [
        'Do these tools work offline?',
        'After the status reads Ready offline, the conversions run with no connection. The files stay in the browser.',
      ],
    ],
  },
  {
    slug: 'convert-from-pdf',
    title: 'Convert PDF to Word, Excel, JPG | Anywhere PDF',
    meta: 'Convert a PDF to Word, Excel, PowerPoint, JPG, PNG, HTML, or EPUB. Free, no signup, no upload. Text exports skip layout. Images paint the page. Works offline.',
    h1: 'Convert PDF to Other Formats',
    intro:
      'Text tools read the selectable text and write a new file. Image tools paint the page. A scan has no text layer until you run OCR, and OCR is English. None of the text exporters rebuild columns, fonts, or pictures.',
    body: [
      'PDF to Word writes one paragraph per extracted line, with a page break between PDF pages. PDF to Excel guesses rows and columns from text positions and stores every cell as text. PDF to PowerPoint puts the page text on one slide per page. PDF to HTML and PDF to EPUB keep the text in a single simple document. Extract text from PDF downloads a .txt file.',
      'PDF to JPG and PDF to PNG paint pages at 72, 144, 300, or 600 DPI. One page downloads alone. Several pages download as a ZIP. They do not extract embedded images.',
    ],
    toolIds: [
      'pdf-to-word',
      'pdf-to-excel',
      'pdf-to-pptx',
      'pdf-to-jpg',
      'pdf-to-png',
      'pdf-to-html',
      'pdf-to-epub',
      'extract-text',
    ],
    faq: [
      [
        'Can I convert a PDF to Word and keep the layout?',
        'No. You get editable text, one paragraph per line. Images and tables are not rebuilt. A scan needs OCR PDF first.',
      ],
      [
        'How do I get pictures of the pages?',
        'Use PDF to JPG or PDF to PNG. Set the DPI before you download.',
      ],
      [
        'Is the PDF uploaded?',
        'The conversion runs in the browser. After Ready offline, it works with no connection.',
      ],
    ],
  },
  {
    slug: 'edit-pdf',
    title: 'Edit a PDF: Add Text, Sign, Number | Anywhere PDF',
    meta: 'Add text, a typed signature, a watermark, or page numbers. Free, no signup, no upload. Existing sentences stay put. These edits run offline.',
    h1: 'Edit a PDF Without Uploading It',
    intro:
      'These tools add something to a PDF. They do not rewrite a sentence that is already on the page. You can add a line of text, a typed name, a text watermark, page numbers, a footer, or form values when the PDF already has fields.',
    body: [
      'Add text to a PDF draws 12 point Helvetica at the offsets you type. Sign a PDF draws 20 point Times italic. A watermark is 27 point text at 28% opacity, centered and horizontal. Page numbers and Bates IDs sit at the bottom center. The footer is one centered line. There is no header control.',
      'Fill a PDF form expects JSON of internal field names. Flatten PDF redraws pages as images. Crop PDF margins sets a uniform crop box, and the hidden content can remain in the file. Rotate PDF turns pages and keeps text selectable. Edit PDF metadata changes title, author, subject, or creator.',
    ],
    toolIds: [
      'edit-pdf-text',
      'sign-pdf',
      'add-watermark',
      'page-numbers',
      'headers-footers',
      'fill-pdf-form',
      'crop-resize-pdf',
      'rotate-pdf',
      'edit-pdf-metadata',
    ],
    faq: [
      [
        'Can I change the words already in the PDF?',
        'No. Add text places a new line on top. The original text stays. Redact PDF is the tool that blacks out a phrase and saves image pages.',
      ],
      [
        'Can I draw my signature?',
        'No. You type a name. There is no certificate and no uploaded signature image.',
      ],
      [
        'Are the edits uploaded?',
        'They run in the browser. The site does not add a watermark of its own. A mark appears when you type one.',
      ],
    ],
  },
  {
    slug: 'secure-pdf',
    title: 'Protect, Unlock, and Redact PDFs | Anywhere PDF',
    meta: 'Password-protect a PDF, remove a known password, redact a phrase, or clear metadata. Free, no signup, no upload. The file stays on your device. Works offline.',
    h1: 'PDF Security Tools',
    intro:
      'Protect a PDF with a password you choose, or remove a password you already know. Redact a phrase by covering it and saving image pages. Clear six metadata fields when the risk is the document properties, not the words on the page.',
    body: [
      'Password protection uses AES-256 in the browser. The password must be 1 to 127 bytes and must not start with @ or -. A forgotten password cannot be recovered. Unlock PDF needs the password that opens the file. It does not guess.',
      'Redact PDF matches selectable text, draws a black box on the matched characters when the font can be measured, and exports the selected pages as images. Find text in a PDF lists page numbers before and after. Flatten PDF turns pages into images without searching for a phrase. Clearing metadata empties title, author, subject, keywords, creator, and producer. Dates and XMP can remain.',
    ],
    toolIds: [
      'encrypt-pdf',
      'unlock-pdf',
      'redact-pdf',
      'redaction-checker',
      'privacy-scanner',
      'flatten-pdf',
    ],
    faq: [
      [
        'How do I lock a PDF?',
        'Open Protect a PDF, type a new password, and download the encrypted file. Test the password before you delete the unlocked copy.',
      ],
      [
        'How do I remove a password?',
        'Open Unlock a PDF and type the password you know. An unknown password cannot be cracked here.',
      ],
      [
        'Does a black box in a normal editor count as redaction?',
        'A box drawn on top of text can leave the text underneath. This redact tool rebuilds the selected pages as images with no text layer. Still read the result, because a missed phrase stays visible.',
      ],
    ],
  },
  {
    slug: 'organize-pdf',
    title: 'Organize PDF Pages: Reorder, Delete | Anywhere PDF',
    meta: 'Reorder, delete, extract, rotate, crop, or merge PDF pages. Free, no signup, no upload. You type page numbers. There is no thumbnail board. Works offline.',
    h1: 'Organize PDF Pages',
    intro:
      'Put pages in a new order, drop the ones you do not want, or pull a few into a new file. You type the numbers. Merge joins whole files. Rotate turns pages without redrawing them. Crop and resize change the visible page, not the byte size.',
    body: [
      'Reorder PDF pages takes a full order such as 4,1-3. Pages you omit are dropped. A descending range such as 8-5 reverses that span. Delete PDF pages removes the numbers you type and errors if you try to delete everything. Extract pages keeps the numbers you type, in that order.',
      'Interleave PDFs alternates pages from two or more files, which is the usual fix for front and back scans. Multiple pages per sheet builds an A4 portrait PDF with 2, 4, 6, 9, or 16 pages on a sheet. Compress PDF is the separate tool for a smaller file, and it turns pages into images.',
    ],
    toolIds: [
      'merge-pdf',
      'split-pdf',
      'organize-pages',
      'delete-pdf-pages',
      'extract-pdf-pages',
      'rotate-pdf',
      'alternate-mix-pdf',
      'crop-resize-pdf',
      'resize-pdf',
      'multiple-pages-per-sheet',
      'workflow',
      'compare-pdfs',
      'pdf-to-zip',
    ],
    faq: [
      [
        'How do I rearrange PDF pages?',
        'Open Reorder PDF pages and type the new order. There is no drag-and-drop thumbnail view.',
      ],
      [
        'How do I delete one page?',
        'Open Delete PDF pages and type that page number. The field lists pages to remove, not pages to keep.',
      ],
      [
        'How do I make the file smaller while I organize it?',
        'Organize tools copy pages. Use Compress PDF when you want fewer bytes. Compress replaces pages with JPEG images.',
      ],
    ],
  },
  {
    slug: 'offline-pdf-tools',
    title: 'Offline PDF Tools, No Internet Needed | Anywhere PDF',
    meta: 'Use PDF tools with no connection after one online visit. Free, no signup, no upload. Merge, compress, OCR, and passwords run once the cache is ready.',
    h1: 'PDF Tools That Work Offline',
    intro:
      'Open Anywhere PDF once while you are online and wait until the status reads Ready offline. The tools then run from the cache. Your PDFs stay on the device. Clearing site data removes the cache, and you load the site again to restore it.',
    body: [
      'All 60 tools are in that cache, including English OCR, AES-256 passwords, and Office text conversion. Read aloud still needs a speech voice installed on the device. A remote voice is not used.',
      'The first visit is the heavy one, because the cache includes the OCR data and the password engine. After Ready offline, turn the connection off and open a tool to confirm it. If the status says Preparing offline cache, the download is still in progress.',
    ],
    toolIds: [
      'merge-pdf',
      'split-pdf',
      'compress-pdf',
      'pdf-to-word',
      'images-to-pdf',
      'ocr-pdf',
      'encrypt-pdf',
      'unlock-pdf',
      'rotate-pdf',
      'page-numbers',
    ],
    faq: [
      [
        'How do I know the tools are ready offline?',
        'The status reads Ready offline. Preparing offline cache means the download is still running. Offline means the browser itself has no connection.',
      ],
      [
        'Which tools work with no connection?',
        'All 60, after the cache is complete. Read aloud also needs a local speech voice.',
      ],
      [
        'What if I clear the browser data?',
        'The cache is gone. Visit the site online again and wait for Ready offline before you rely on a connection-free session.',
      ],
    ],
  },
];

export const guides = [
  {
    slug: 'merge-pdf-without-uploading',
    title: 'Merge PDF Files Without Uploading | Anywhere PDF',
    meta: 'Merge PDF files in the browser without an upload or an account. Set the order and download one PDF. The same merge works offline after your first visit.',
    h1: 'How to Merge PDF Files Without Uploading Them',
    intro:
      'Open Merge PDF, add the files from this device, and download one PDF. The join runs in the tab. You can watch the network panel while it runs and confirm the documents are not posted anywhere.',
    sections: [
      {
        heading: 'Put the files in reading order',
        body: [
          'Add two or more PDFs. One file also runs, and you get that file back as the download. Extra files are appended from the top of the list to the bottom. Up and Down move a row. Remove drops a file you added by mistake.',
          'There is no password box on Merge PDF. A locked file has to go through Unlock PDF first. You type the password you already know, download the open copy, and then merge that copy.',
        ],
      },
      {
        heading: 'Check that nothing was uploaded',
        body: [
          'Open the browser tools, choose the network panel, and start the merge. You should see the app assets if they are not cached yet. You should not see your PDF leave as a request body. After the status reads Ready offline, disconnect and merge again. The same download should appear.',
          'Save the merged file before you close the tab. The site does not keep the source PDFs. Favorites stored in the browser are tool shortcuts, not your documents.',
        ],
      },
      {
        heading: 'When the page order is still wrong',
        body: [
          'Merge follows file order, not a page-by-page shuffle inside a file. If one PDF has its own pages out of order, open Reorder PDF pages on that file and type the order, such as 4,1-3, then merge the result.',
          'Front and back scans are a different pattern. Interleave PDFs takes a page from each file in turn. If the back scan runs last-page-first, reverse it with a descending range before you interleave.',
        ],
      },
    ],
    toolIds: ['merge-pdf', 'unlock-pdf', 'organize-pages', 'alternate-mix-pdf', 'compress-pdf'],
  },
  {
    slug: 'compress-a-pdf',
    title: 'Compress a PDF: Text Becomes an Image | Anywhere PDF',
    meta: 'Compress a PDF with Light, Medium, or Heavy. Pages become JPEG images, so text selection is lost. Free, no upload. A larger copy returns the original file.',
    h1: 'How to Compress a PDF',
    intro:
      'Open Compress PDF and pick Light, Medium, or Heavy. The tool redraws each page as a JPEG. That is why the file can shrink, and why you can no longer select the text. There is no control that targets 200 KB or any other exact size.',
    sections: [
      {
        heading: 'What the three settings do',
        body: [
          'Light renders at 144 DPI with JPEG quality 85%. Medium uses 110 DPI and 65%. Heavy uses 85 DPI and 45%. Start with Light when small type has to stay readable. Move to Heavy when the file still will not fit.',
          'A blank Pages field includes the whole PDF. A list such as 1-3 exports only those pages, which is a second way to cut bytes if the rest of the file can wait.',
        ],
      },
      {
        heading: 'When you get the original file back',
        body: [
          'If the JPEG copy is the same size or larger, the download is your original file and the status says no smaller output was found. Text-heavy pages often grow when they become pictures. Heavy is the next try. Split PDF by size is the other try when you must stay under a cap and you still need selectable text.',
          'Split by size takes the cap in KB. 1 MB is 1,024 KB. A 10 MB email limit is 10240. The cap applies to each PDF inside the ZIP, not to the ZIP total.',
        ],
      },
      {
        heading: 'Getting search back',
        body: [
          'The compressed PDF has no text layer. OCR PDF can add an English one. It redraws the pages again at 144 DPI, so you may give back some of the size you saved. Run OCR on the pages you will search, not on a hundred-page file, the first time.',
          'PDF info reports the byte size and the page count if you want a number before and after. It does not shrink anything.',
        ],
      },
    ],
    toolIds: ['compress-pdf', 'split-pdf-by-size', 'ocr-pdf', 'pdf-size-analyzer'],
  },
  {
    slug: 'password-protect-a-pdf',
    title: 'Add an AES-256 Password to a PDF | Anywhere PDF',
    meta: 'Add an AES-256 password to a PDF in your browser. The password stays on the device. A lost password cannot be recovered. Free, no signup. Works offline.',
    h1: 'How to Password Protect a PDF',
    intro:
      'Open Protect a PDF, type a new password, and download the encrypted file. The lock is AES-256, applied by a qpdf build that runs in the browser. Test the download before you delete the unlocked original.',
    sections: [
      {
        heading: 'Rules for the password',
        body: [
          'The new password must be 1 to 127 UTF-8 bytes. It cannot contain a null character, and it cannot start with @ or -. Those two characters are rejected because the encryption tool would treat them as syntax.',
          'If the PDF is already locked, type the current password as well. The download then opens with the new password. The site does not store either one.',
        ],
      },
      {
        heading: 'What the lock does not do',
        body: [
          'You do not get separate switches for printing or copying. A random owner password is generated and thrown away, so those permission flags are not something you can set here. The password you chose is the one that opens the file.',
          'A lost password cannot be looked up. Keep the password in a place you control, or keep an unlocked copy. Unlock PDF only helps when you still know the password.',
        ],
      },
      {
        heading: 'Try it offline',
        body: [
          'Wait until the status reads Ready offline, then disconnect and protect a small file. The password engine is part of the cache. The PDF and the password stay in the tab.',
        ],
      },
    ],
    toolIds: ['encrypt-pdf', 'unlock-pdf', 'add-watermark', 'redact-pdf'],
  },
  {
    slug: 'remove-a-pdf-password',
    title: 'Remove a Known Password From a PDF | Anywhere PDF',
    meta: 'Remove a PDF password you already know and download an open copy. Free, no signup, no upload. Unknown passwords are not guessed. The unlock runs on your device.',
    h1: 'How to Remove a Password From a PDF You Know',
    intro:
      'Open Unlock PDF, type the password that opens the file, and download a copy without encryption. The original locked file stays where it was. If you do not know the password, this page cannot find it.',
    sections: [
      {
        heading: 'The password you type',
        body: [
          'Use the password you would type to open the PDF in a viewer. A wrong password is reported. The tool does not try a list of guesses and does not offer a reset.',
          'The password is used in the browser and is not stored. After Ready offline, the same step works with the connection off.',
        ],
      },
      {
        heading: 'Restrictions and damaged files',
        body: [
          'This path is for a file that asks for a password before it opens. A file that opens with no password but blocks printing was not part of the tested path. Open the download in your viewer and see what it allows before you depend on it.',
          'If the unlocked file still opens with errors, Repair PDF can re-save a document the browser can read. It cannot rebuild pages the parser cannot see. Merge, compress, and text export all accept the unlocked copy.',
        ],
      },
    ],
    toolIds: ['unlock-pdf', 'encrypt-pdf', 'repair-pdf', 'merge-pdf'],
  },
  {
    slug: 'redact-a-pdf',
    title: 'Redact PDF Text So the Words Are Gone | Anywhere PDF',
    meta: 'Redact a phrase by covering the match and saving pages as images. Free, no upload. Review the download. Hyphens and scans can be missed. Works offline.',
    h1: 'How to Redact a PDF',
    intro:
      'A black rectangle drawn in an ordinary editor can leave the words in the file. Redact PDF covers each match it finds and saves the selected pages as images with no text layer. You still have to read the images, because a miss stays visible.',
    sections: [
      {
        heading: 'What gets covered',
        body: [
          'Type the phrase. The search ignores letter case and extra spaces. It joins text pieces on a line, and a line break counts as a space. When the font can be measured, the black box covers the matched characters plus a small margin. When the font cannot be measured, the box covers the whole text segment.',
          'Hyphenated words, ligatures, odd encodings, and scans can miss. A scan has no text to search until you run OCR PDF, which is English and replaces the page with its own image. Redact that copy, then look at it.',
        ],
      },
      {
        heading: 'What the download contains',
        body: [
          'The selected pages are 144 DPI images. A page list exports only those pages, so a blank field is how you keep the whole document. The text layer is gone on the exported pages, which means copy and search no longer see the old words. It also means a missed phrase is a picture of the phrase, sitting in the open.',
          'Find text in a PDF lists page numbers for a phrase before you redact, and again afterward. After a full-file redact, a second search should have no text layer to match. Metadata can still hold a title or author. Clear those six fields with PDF metadata if the properties are part of the risk. Dates and XMP can remain.',
        ],
      },
      {
        heading: 'A check before you send the file',
        body: [
          'Open the download and read every page at a size where you can see the type. Search the original for variant spellings and hyphen breaks. If the phrase was not found, the tool stops and you still have the original. There is no hand-drawn box. You redact by phrase.',
        ],
      },
    ],
    toolIds: ['redact-pdf', 'redaction-checker', 'ocr-pdf', 'privacy-scanner', 'flatten-pdf'],
  },
  {
    slug: 'make-a-scanned-pdf-searchable',
    title: 'Make a Scanned PDF Searchable | Anywhere PDF',
    meta: 'Make a scanned PDF searchable with English OCR on your device. Pages are re-saved at 144 DPI with a text layer. Free, no upload. Try a few pages first.',
    h1: 'How to Make a Scanned PDF Searchable',
    intro:
      'Open OCR PDF, start with one or two pages, and download the new file. You can then search the English words the recognizer found. The page you see is a new 144 DPI image, not the original scan at its old resolution.',
    sections: [
      {
        heading: 'Run a short test first',
        body: [
          'Type 1-2 in Pages. A blank field sends every page through recognition, and a long scan can take a while and use a lot of memory. The English model is bundled, so the step works after Ready offline with no connection.',
          'Open the download and search for a word you can see on the page. Blur, skew, handwriting, and decorative type produce wrong words. Check names and amounts yourself. The text layer is invisible Helvetica. Characters outside that font can become question marks.',
        ],
      },
      {
        heading: 'Text, Word, and size',
        body: [
          'Extract text from PDF downloads a .txt file from the new text layer. PDF to Word makes a DOCX with one paragraph per line. Both fail to see words on a scan you have not sent through OCR.',
          'The OCR file can be larger than the scan, because each page is a PNG plus text. Compress PDF can shrink it and will remove the text layer, because compress saves JPEGs with no text. If you need both a small file and search, decide which one matters for the copy you send.',
        ],
      },
    ],
    toolIds: ['ocr-pdf', 'extract-text', 'pdf-to-word', 'compress-pdf', 'scan-to-pdf'],
  },
  {
    slug: 'jpg-to-pdf',
    title: 'Convert JPG to PDF on Phone or Desktop | Anywhere PDF',
    meta: 'Convert JPG and PNG images to one PDF. Each picture is placed on an A4 page. Free, no signup, no upload. Phone photos can need a rotate. Works offline.',
    h1: 'How to Convert JPG to PDF',
    intro:
      'Open JPG to PDF, add the pictures, set the order, and download one PDF. JPEG and PNG are embedded as stored. Other formats are used when the browser can decode them. The file is built on this device.',
    sections: [
      {
        heading: 'What the page looks like',
        body: [
          'Each image gets its own A4 page. A wide image gets landscape A4. A tall image gets portrait A4. The picture is centered. If it is larger than the page it is scaled down. If it is smaller it stays small, with empty page around it. There is no margin field and no Letter size on this tool.',
          'EXIF orientation is not applied. A phone photo can appear on its side. Rotate PDF turns the page afterward. That rotation is stored in the PDF and does not resample the image.',
        ],
      },
      {
        heading: 'Several photos, one file',
        body: [
          'Add every picture in one run and use Up and Down. Scan to PDF is the one-photo path from the phone camera. Merge those one-page PDFs if you shot them separately. OCR PDF can add English search afterward, and it will redraw the pages at 144 DPI.',
          'Compress PDF is available if the image PDF is heavy. It will JPEG the pages again, which can help or can be skipped when the tool returns the original because the copy was not smaller.',
        ],
      },
    ],
    toolIds: ['images-to-pdf', 'scan-to-pdf', 'rotate-pdf', 'merge-pdf', 'ocr-pdf'],
  },
  {
    slug: 'scanned-pdf-to-word',
    title: 'Turn a Scanned PDF Into Word Text | Anywhere PDF',
    meta: 'Turn a scanned PDF into Word text with English OCR, then PDF to Word. Each line becomes a paragraph. Free, no upload. Both steps work offline.',
    h1: 'How to Convert a Scanned PDF to Word',
    intro:
      'A scan has no text layer, so PDF to Word has nothing useful to export until OCR PDF has read the pages. Run OCR first, check a page, then convert that file to DOCX. You get editable lines, not a twin of the scan.',
    sections: [
      {
        heading: 'Two steps, in this order',
        body: [
          'Open OCR PDF and process a short range before the whole file. The model is English. Each page is saved again at 144 DPI with invisible text on top. Search the download for a word you can see. If the word is wrong, the Word file will be wrong in the same place.',
          'Open PDF to Word on the OCR result. Each extracted line becomes its own paragraph, and each PDF page starts a new page in the DOCX. Images of the scan are not placed in the Word file. Columns and tables are not rebuilt.',
        ],
      },
      {
        heading: 'If you only need the words',
        body: [
          'Extract text from PDF writes a .txt file from the same text layer and skips Word. Use that when you want to paste a passage and you do not need a DOCX.',
          'Both exports need selectable text. Running PDF to Word on the original scan skips the recognition step and the DOCX comes back empty or thin.',
        ],
      },
    ],
    toolIds: ['ocr-pdf', 'pdf-to-word', 'extract-text'],
  },
  {
    slug: 'shrink-a-pdf-for-email',
    title: 'Shrink a PDF to Fit an Email Limit | Anywhere PDF',
    meta: 'Shrink a PDF for email with Compress PDF or a KB size split. Compress turns pages into images. Split keeps the original pages. Free, no upload, offline.',
    h1: 'How to Reduce a PDF for an Email Limit',
    intro:
      'Two tools address a file that will not attach. Compress PDF redraws pages as JPEGs and can make one smaller file. Split PDF by size keeps the original pages and cuts them into parts under a KB limit you type.',
    sections: [
      {
        heading: 'Compress when images are acceptable',
        body: [
          'Try Light first, then Medium, then Heavy. Heavy is 85 DPI and JPEG quality 45%, which is hard on small type. If the copy is not smaller, you receive the original and a note that says so. There is no field for 200 KB or any other target.',
          'The compressed file has no selectable text. That matters if the recipient has to search or copy a clause. OCR PDF can add English text back and may increase the size again.',
        ],
      },
      {
        heading: 'Split when the text has to stay',
        body: [
          'Open Split PDF by size and type the cap in KB. 1 MB is 1,024 KB, so a 10 MB limit is 10240 and a 5 MB limit is 5120. You get a ZIP of PDFs. Each PDF is under the cap. The ZIP itself can be larger than the cap, so attach the PDFs, not the whole archive, if the mailbox measures each file.',
          'A single page larger than the cap stops the tool and names the page. Compress that file, or raise the cap. PDF info shows the current size in bytes if you want the number before you choose.',
        ],
      },
    ],
    toolIds: ['compress-pdf', 'split-pdf-by-size', 'pdf-size-analyzer', 'ocr-pdf'],
  },
  {
    slug: 'check-a-pdf-tool-for-uploads',
    title: 'Check That a PDF Tool Stays on Device | Anywhere PDF',
    meta: 'Check that a PDF stays on your device. Watch the network panel during a run, then repeat after Ready offline with the connection off. No account is required.',
    h1: 'How to Check That a PDF Tool Is Not Uploading Your File',
    intro:
      'Anywhere PDF processes the file in the browser. You can confirm that yourself. Open the network panel, run a tool, and look for a request that carries the PDF. Then run the same tool after the cache is ready and the connection is off.',
    sections: [
      {
        heading: 'Watch the first run',
        body: [
          'Open the browser developer tools and select the network panel. Clear it. Open Merge PDF or any other tool, add a small PDF, and run it. Requests you see should be the site itself if something was not cached: script, style, and the engines. Your PDF should not show up as an uploaded body.',
          'Passwords typed into Protect PDF or Unlock PDF are used in the tab. They are not written into the site storage. Workflow presets remember step choices, not the file and not watermark wording.',
        ],
      },
      {
        heading: 'Repeat with no connection',
        body: [
          'Wait until the status reads Ready offline. Turn the connection off, or refuse the network in the browser tools, and run the tool again. A result that still downloads is running from the cache. If the status still says Preparing offline cache, the first download is unfinished and an offline run can fail.',
          'Clearing site data deletes that cache. Load the site online again before you depend on a connection-free session. Read aloud is the extra case: it also refuses a remote speech voice, and it fails if the device has no local voice.',
        ],
      },
    ],
    toolIds: ['merge-pdf', 'encrypt-pdf', 'ocr-pdf', 'pdf-to-audio'],
  },
  {
    slug: 'use-anywhere-pdf-offline',
    title: 'Use Anywhere PDF With No Connection | Anywhere PDF',
    meta: 'Use Anywhere PDF after the status reads Ready offline. All 60 tools, including English OCR and passwords, run from the cache on your device.',
    h1: 'How to Use Anywhere PDF Offline',
    intro:
      'Visit the site while you are online and wait for Ready offline. That label means the service worker has cached the files the tools need. You can then open tools and process PDFs with no connection.',
    sections: [
      {
        heading: 'The status line',
        body: [
          'Preparing offline cache means the download is still going. Ready offline means the cache is in place. Offline means the browser has no connection. A first visit can move through Preparing and land on Ready while you are still online. Leave the tab open until it does.',
          'The cache includes the page tools, the English OCR data, and the password engine. It is a large download on purpose so the later visits do not fetch those files again.',
        ],
      },
      {
        heading: 'Install and site data',
        body: [
          'The site includes a web app manifest with a standalone display mode. Your browser decides whether to offer an install button. An installed icon still needs the same cache. Installing does not create a second copy of your PDFs.',
          'If you clear site data, the Ready offline cache is gone and the tools cannot run with no connection until you visit online again. Favorites stored in the browser are cleared by that same action. Download any result you need before you clear data or close a tab. The site does not keep your source files.',
        ],
      },
    ],
    toolIds: ['merge-pdf', 'compress-pdf', 'ocr-pdf', 'encrypt-pdf', 'pdf-to-word'],
  },
  {
    slug: 'page-numbers-watermark-footer',
    title: 'Add Page Numbers, a Watermark, a Footer | Anywhere PDF',
    meta: 'Add page numbers, a watermark, and a footer in one workflow or alone. Numbers sit at the bottom center. The watermark is centered. Free and offline.',
    h1: 'How to Add Page Numbers, a Watermark, and a Footer',
    intro:
      'Page numbers, a watermark, and a footer are three tools, and the workflow builder can run them in one pass with rotate, compress, and flatten. Each mark has a fixed position. You type the words. The site does not add a mark of its own.',
    sections: [
      {
        heading: 'Page numbers and Bates IDs',
        body: [
          'Add page numbers writes plain digits at the bottom center, starting at the number you type. To skip a cover, enter 2-20 in Pages and set the start to 1 if that second page should read 1. The font is 12 point Helvetica. Page 1 of 10 is not a supported pattern.',
          'Bates numbering writes a prefix plus six digits, such as DOC-000001, in the same bottom-center slot. Each run starts at 000001. Merge the files first if you need one sequence across several PDFs.',
        ],
      },
      {
        heading: 'Watermark and footer',
        body: [
          'The watermark is one line, 27 point, 28% opacity, horizontal, in the middle of the page. The line stays horizontal. A logo file is rejected. The footer is one centered line at the bottom, the same band as the page numbers, so stacking both on one page will overlap. Run them on purpose and look at the result.',
          'The PDF workflow builder can chain rotate, compress, watermark, page numbers, and flatten, up to eight steps, on one file. Compress and flatten turn pages into images. If you still need selectable text, put those steps last or leave them out. Watermark wording is not saved in the preset.',
        ],
      },
    ],
    toolIds: ['page-numbers', 'add-watermark', 'headers-footers', 'bates-numbering', 'workflow'],
  },
];
