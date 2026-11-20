# Anywhere PDF

Anywhere PDF is a static React and Vite site. The browser does the PDF work: pdf-lib for page structure, PDF.js for text and canvas drawing, jsPDF for new PDFs, Tesseract.js for English OCR, and a qpdf WebAssembly worker for passwords. Fonts, OCR data, and the WebAssembly file ship with the site. A visitor does not install Python or Node.js, and does not need an account or an API key, to use the published site.

## Publish the built website

1. Extract the deploy zip.
2. Drag its **dist** folder into [Netlify Drop](https://app.netlify.com/drop), or upload the contents of **dist** to any static HTTPS host.
3. Open the public URL and wait until the status reads **Ready offline**. That label means the service worker is active and has cached the files the app needs. If a download fails, installation fails and the next visit tries again. You can share that URL.

The site can sit at a domain root or under a subdirectory. Serve `.js` and `.mjs` files with a JavaScript MIME type and `.wasm` as `application/wasm`. Keep the deployed folder structure intact and leave `sw.js` revalidatable. Each tool has a prerendered page under `tools/<tool-name>/`. Enable ordinary static directory index serving so those URLs open the included `index.html` files. A SPA rewrite is not required.

## Build or run the source

Use Node.js 22 or 24 and npm. From the source folder:

```powershell
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

The production build is written to **dist**. Source-based hosting can use `npm run build` as the build command and `dist` as the output directory. The source archive includes Netlify and Vercel configuration.

## Testing

Tests use the built-in Node test runner and need Node 22 or newer after `npm ci`.

- `npm test` runs the unit tests in `tests/`. It needs no build.
- `npm run test:build` builds with `SITE_URL=https://example.com/` and runs the tests that read `dist/` (service worker precache and behavior). Add `-- --no-build` to reuse an existing `dist/`.
- `npm run test:browser` drives headless Chrome through `tests/browser/` (hydration on every page and offline use). It needs a `dist/` built with `SITE_URL` set, so run `npm run test:build` first. It needs Chrome or Chromium on Linux or macOS. Set `CHROME_PATH=/path/to/chrome` if it is not on your `PATH`. It adds no npm dependency.

## Configure search and social metadata

The build writes crawlable HTML for the homepage, each tool, the category hubs, and the guides, with titles and descriptions taken from `src/seo-content.js`. To enable canonical URLs, the XML sitemap, and the social image URL, rebuild with the public HTTPS URL. From PowerShell:

```powershell
npm ci
$env:SITE_URL = "https://your-domain.example/"
npm run build
```

Set the same `SITE_URL` in the host build environment when you deploy from source. Include the deployment subdirectory in that value when the site is not at the host root. Upload the new `dist` and submit its sitemap to your search engine webmaster tools. When the site lives in a subdirectory, link that sitemap from the host root `robots.txt`.

## Deploy to Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `SITE_URL=https://your-domain.example/` (required for canonical URLs, the sitemap, and the social image URL), and optionally `NODE_VERSION=22`.
- Production builds on Pages fail without `SITE_URL`. If your production branch is not `main`, set `PRODUCTION_BRANCH` in both the Production and Preview environments.
- Preview builds without `SITE_URL` use `CF_PAGES_URL` and add `noindex`, so previews stay out of search results. Local builds without `SITE_URL` print a warning and continue.

Pages serves the tool URLs and the generated `404.html`. This repository does not add a `_redirects` file or a Wrangler config for that hosting path.

## What this release supports

- Page tools, a workflow of up to eight steps, English OCR, AES-256 passwords, phrase redaction, image conversion, and Office or EPUB text export. Favorites stay in localStorage on the device.
- The browser processes files. The app does not send them to a remote API. The host serves the application files. The offline cache stores those application files.
- OCR uses the bundled English model and re-saves pages as 144 DPI images with an invisible text layer. PDF to Word, Excel, and PowerPoint export text. Word, Excel, and PowerPoint imports read DOCX, XLSX, and PPTX text and print it in a standard font. HTML, Markdown, and CSV inputs are printed as text, not as a rendered layout.
- Compress, flatten, invert, flip, and redact save pages as images. Text on those pages is not selectable afterward. Redaction covers the matched characters when the font can be measured, joins text on a line, and can miss hyphenated words, unusual encodings, and scans. Read the output before you share it.
- Text placed in a new PDF must fit the Latin Windows-1252 set. Other characters stop the tool with an error. Images to PDF puts each image on an A4 page. A signature is a typed name in Times italic. A watermark appears when you run the watermark tool.
- Read aloud uses a speech voice installed on the device and refuses a remote voice.
- Outside this release: Gemini chat, local audio transcription, peer-to-peer sharing, collaborative sessions, and POS inventory. Also outside it: editing text that is already in the PDF, legacy `.doc`, `.xls`, and `.ppt` files, and MOBI or AZW3.
