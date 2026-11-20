# FreebiePDF Web

FreebiePDF Web is a static React and Vite application. Its browser-side engines include pdf-lib for PDF structure, PDF.js for text and canvas rendering, jsPDF for creating PDFs, Tesseract.js for English OCR, and a single-threaded qpdf WebAssembly worker for passwords. Browser workers, fonts, OCR data, and WebAssembly files ship with the site. Visitors do not need Python, Node.js, an account, or an API key.

## Publish the built website

1. Extract **FreebiePDF-Web-Deploy.zip**.
2. Drag its **dist** folder into [Netlify Drop](https://app.netlify.com/drop), or upload the contents of **dist** to any static HTTPS host.
3. Open the public URL provided by your host and wait for **Ready offline**. That status means the service worker is active and has cached every file the app needs. If a download fails, installation fails and the next visit tries again. You can share that URL with anyone.

The site can run at a domain root or under a subdirectory. Serve `.js` and `.mjs` files with JavaScript MIME types and `.wasm` as `application/wasm`. Keep the deployed folder structure intact and leave `sw.js` revalidatable. Each tool has a prerendered page under `tools/<tool-name>/`. Enable normal static directory index serving so those URLs resolve to the included `index.html` files. No SPA rewrite is required.

## Build or run the source

Use Node.js 22 or 24 and npm. From the extracted source folder:

```powershell
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

The production build is written to **dist**. Source-based hosting can use `npm run build` as the build command and `dist` as the output directory. The source archive includes Netlify and Vercel configuration.

## Configure search and social metadata

The deployment archive already contains crawlable HTML for the homepage and each tool, unique titles and descriptions, and structured data for the visible FAQs. To enable canonical URLs, the XML sitemap, and the social sharing image URL, rebuild with your real public HTTPS URL. From PowerShell:

```powershell
npm ci
$env:SITE_URL = "https://your-domain.example/"
npm run build
```

Set the same `SITE_URL` value in your host's build environment if you deploy from source. Include the deployment subdirectory in that value if applicable. Upload the regenerated `dist` and submit its sitemap to your search engine webmaster tools. If deploying under a subdirectory, the domain owner can link to that sitemap from the root `robots.txt`. Search indexing, rankings, and AI citations depend on the platform.

## Deploy to Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `SITE_URL=https://your-domain.example/` (required for canonical URLs, the sitemap, and the social image URL), and optionally `NODE_VERSION=22`.

No `_redirects` file or Wrangler configuration is needed. Pages serves the clean tool URLs and the generated `404.html` automatically.

## What this release supports

- Core page operations, workflows, OCR, AES-256 passwords, text redaction, PDF and image conversion, Office/EPUB text exports, and local favorites. Every tool page includes instructions, output information, related tools, and expandable questions and answers.
- Files are processed by the browser. The app does not send them to a remote API. Hosting serves the application files. The offline cache stores those application files, while preferences are kept in localStorage.
- OCR is English. PDF-to-Office exports prioritize editable content. Office-to-PDF handles DOCX, XLSX, and PPTX and reflows text rather than reproducing the original layout. HTML, Markdown, and CSV inputs are text-oriented.
- Raster tools may remove text selectability and interactive features. Phrase redaction can miss text split across separate PDF runs and does not handle scanned text directly. Review the output before sharing.
- The web edition does not include Gemini chat, local audio transcription, P2P sharing, collaborative sessions, or POS inventory. Signatures are typed visual marks. Rich in-place editing, legacy Office formats, and MOBI/AZW3 are outside this release.
