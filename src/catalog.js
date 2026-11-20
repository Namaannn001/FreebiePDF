const pdf='application/pdf,.pdf';
const text=(key,label,placeholder='',type='text')=>({key,label,placeholder,type});
const select=(key,label,choices)=>({key,label,choices});
const pages=text('pages','Pages','All pages, or e.g. 1,3-5');
const password=text('password','Current PDF password','If required','password');
const label=text('text','Text');
const dpi=select('dpi','Resolution',['144','72','300','600']);
const positions=[text('x','Left offset (pt)','36','number'),text('y','Top offset (pt)','54','number')];
const tool=(id,title,description,format,fields=[],extra={})=>({id,title,description,format,fields,accept:pdf,...extra});
export const catalog={
  'Organize':[
    tool('merge-pdf','Merge PDFs','Join PDF files in the order you choose.','PDF',[],{multiple:true}),
    tool('split-pdf','Split PDF','Extract a range or download individual PDFs.','ZIP / PDF',[pages]),
    tool('compress-pdf','Compress PDF','Reduce file size by rasterizing pages at a lower resolution.','PDF',[select('preset','Quality',['Light','Medium','Heavy']),password]),
    tool('alternate-mix-pdf','Interleave PDFs','Alternate pages from multiple source documents.','PDF',[],{multiple:true}),
    tool('extract-pdf-pages','Extract pages','Write selected pages to a new PDF.','PDF',[pages]),
    tool('delete-pdf-pages','Delete pages','Remove pages using page numbers or ranges.','PDF',[pages]),
    tool('organize-pages','Reorder pages','Set the page order with ranges such as 4,1-3.','PDF',[pages]),
    tool('rotate-pdf','Rotate pages','Turn all or selected pages.','PDF',[pages,select('preset','Angle',['90','180','270'])]),
    tool('split-pdf-by-text','Split by text','Start a new file at a repeated phrase.','ZIP',[pages,text('text','Section marker'),password]),
    tool('split-pdf-by-bookmarks','Split by bookmarks','Make one section per top-level bookmark.','ZIP',[pages]),
    tool('split-pdf-in-half','Split in half','Divide pages into two PDF files.','ZIP',[pages]),
    tool('split-pdf-by-size','Split by file size','Group pages into parts under a size limit.','ZIP',[pages,text('text','Maximum part size (KB)','2048','number')]),
    tool('multiple-pages-per-sheet','Pages per sheet','Fit multiple source pages on each printed sheet.','PDF',[pages,select('preset','Pages per sheet',['4','2','6','9','16'])]),
    tool('crop-resize-pdf','Crop margins','Trim the visible margins by a uniform amount.','PDF',[pages,text('text','Margin (points)','18','number')]),
    tool('resize-pdf','Resize pages','Fit the selected pages to a standard paper size.','PDF',[pages,select('preset','Paper size',['A4','Letter','Legal','A5'])]),
    tool('flip-pdf','Flip pages','Mirror PDF page images horizontally or vertically.','PDF',[pages,select('preset','Direction',['Horizontal','Vertical','Both']),password]),
    tool('workflow','Workflow builder','Chain PDF operations and download the final file.','PDF',[password],{workflow:true}),
    tool('pdf-to-zip','Bundle PDFs in ZIP','Archive your original PDFs in one ZIP file.','ZIP',[],{multiple:true}),
  ],
  'Edit & protect':[
    tool('edit-pdf-text','Add PDF text','Place a text overlay at a specified position.','PDF',[pages,label,...positions]),
    tool('sign-pdf','Type a signature','Place a typed visual signature on selected pages.','PDF',[pages,text('text','Signature text'),...positions]),
    tool('add-watermark','Add a watermark','Stamp selected pages with translucent text.','PDF',[pages,text('text','Watermark text')]),
    tool('page-numbers','Add page numbers','Number pages from a value you choose.','PDF',[pages,text('text','Starting number','1','number')]),
    tool('bates-numbering','Bates numbering','Add sequential IDs with an optional prefix.','PDF',[pages,text('text','Prefix','DOC-')]),
    tool('headers-footers','Add a footer','Place a line of text at the bottom of each page.','PDF',[pages,text('text','Footer text')]),
    tool('fill-pdf-form','Fill a PDF form','Set named fields and optionally flatten the form.','PDF',[text('text','Field values as JSON','{"name":"Ada"}','textarea'),select('preset','Form mode',['Preserve fields','Flatten'])]),
    tool('flatten-pdf','Flatten PDF','Render pages and annotations into a static image-based PDF.','PDF',[pages,password]),
    tool('invert-pdf','Recolor pages','Render a negative, grayscale or sepia copy.','PDF',[pages,select('preset','Color mode',['Negative','Grayscale','Sepia']),password]),
    tool('edit-pdf-metadata','Edit metadata','Change title, author, subject, and creator.','PDF',[text('text','Metadata as JSON','{"title":"Report","author":"Ada"}','textarea')]),
    tool('privacy-scanner','Inspect PDF metadata','Inspect or clear standard metadata fields.','JSON / PDF',[select('preset','Mode',['Report only','Clear standard metadata'])]),
    tool('pdf-size-analyzer','Analyze PDF size','See file size, page count, and standard metadata.','JSON'),
    tool('redaction-checker','Check searchable text','Find pages that still contain a specified phrase.','JSON',[pages,text('text','Phrase to search'),password]),
    tool('redact-pdf','Redact matching text','Black out every match of a phrase and export selected pages as images. Review every result.','PDF',[pages,text('text','Phrase to redact'),password]),
    tool('encrypt-pdf','Encrypt PDF','Protect a document with AES-256 encryption.','PDF',[password,text('text','New PDF password','','password')]),
    tool('unlock-pdf','Unlock PDF','Save an unencrypted copy using the current password.','PDF',[password]),
    tool('repair-pdf','Rewrite PDF','Resave a document the browser parser can read.','PDF'),
  ],
  'Convert':[
    tool('images-to-pdf','Images to PDF','Turn JPEG, PNG, WebP, and supported image files into a PDF.','PDF',[],{accept:'image/*',multiple:true}),
    tool('scan-to-pdf','Camera to PDF','Capture a photo using your device’s camera picker.','PDF',[],{accept:'image/*',capture:true}),
    tool('create-pdf','Create a PDF','Write plain text and save it as a PDF.','PDF',[text('text','Document text','','textarea')],{noFile:true}),
    tool('txt-to-pdf','Text to PDF','Convert a UTF-8 text file to a PDF.','PDF',[],{accept:'.txt,text/plain'}),
    tool('markdown-to-pdf','Markdown source to PDF','Print the literal Markdown source as text.','PDF',[],{accept:'.md,.markdown'}),
    tool('html-to-pdf','HTML text to PDF','Extract and print visible document text.','PDF',[],{accept:'.html,.htm'}),
    tool('csv-to-pdf','CSV source to PDF','Print the CSV source as text.','PDF',[],{accept:'.csv,text/csv'}),
    tool('word-to-pdf','Word to PDF','Reflow DOCX text into a PDF.','PDF',[],{accept:'.docx'}),
    tool('excel-to-pdf','Excel to PDF','Reflow XLSX worksheet values into a PDF.','PDF',[],{accept:'.xlsx'}),
    tool('pptx-to-pdf','PowerPoint to PDF','Reflow text from PPTX slides into a PDF.','PDF',[],{accept:'.pptx'}),
    tool('ebook-to-pdf','EPUB to PDF','Reflow EPUB chapters into a PDF.','PDF',[],{accept:'.epub'}),
    tool('pdf-to-jpg','PDF to JPG','Render pages as JPEG files.','JPG / ZIP',[pages,dpi,password]),
    tool('pdf-to-png','PDF to PNG','Render pages as PNG files.','PNG / ZIP',[pages,dpi,password]),
    tool('pdf-to-image-zip','PDF pages to ZIP','Download PNG page images in one archive.','ZIP',[pages,dpi,password]),
    tool('pdf-to-word','PDF to Word','Export searchable text as an editable DOCX.','DOCX',[pages,password]),
    tool('pdf-to-excel','PDF to Excel','Export positioned text rows to XLSX.','XLSX',[pages,password]),
    tool('pdf-to-pptx','PDF to PowerPoint','Export editable text, one slide per page.','PPTX',[pages,password]),
    tool('pdf-to-html','PDF to HTML','Download searchable text as a standalone page.','HTML',[pages,password]),
    tool('pdf-to-epub','PDF to EPUB','Convert searchable text to an e-reader document.','EPUB',[pages,password]),
    tool('ocr-pdf','OCR PDF','Make English scanned pages searchable with on-device OCR.','PDF',[pages,password]),
    tool('extract-text','Extract text','Download the PDF text layer.','TXT',[pages,password]),
    tool('pdf-to-audio','Read PDF aloud','Speak searchable text with a local device voice. Remote voices are never used.','AUDIO',[pages,password]),
    tool('summarize-pdf','Summarize text','Rank representative sentences without sending text to an AI service.','TXT',[pages,password]),
    tool('compare-pdfs','Compare PDF text','Generate a side-by-side report of searchable text.','HTML',[pages,password],{multiple:true}),
  ],
  'Business':[
    tool('gst-invoice','Create an INR invoice','Export an invoice with quantity, price, and tax totals.','PDF',[
      text('number','Invoice number'),text('date','Invoice date','','date'),text('supplier','Supplier'),
      text('gstin','GSTIN'),text('buyer','Buyer'),text('item','Description'),text('quantity','Quantity','','number'),
      text('price','Unit price (INR)','','number'),text('rate','Tax rate (%)','','number'),
    ],{noFile:true}),
  ],
};
export const all=Object.values(catalog).flat();
export const byId=new Map(all.map(entry=>[entry.id,entry]));
export const workflowTools=['rotate-pdf','compress-pdf','add-watermark','page-numbers','flatten-pdf'];
