import { defineConfig } from 'vite';
import { existsSync, readdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { resolve, relative, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { deployment, emptySeoContent, prerender, seoContentPath } from './prerender.mjs';

let projectRoot, outputDir, site, seoContent;
const missingSeo = '\0anywherepdf:empty-seo-content';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'seo-content',
      configResolved(config) {
        projectRoot = config.root;
        if (config.command === 'build') {
          const path = seoContentPath(projectRoot);
          // Share the same source snapshot with the prerenderer and the client bundle.
          seoContent = existsSync(path) ? readFileSync(path, 'utf8') : emptySeoContent;
        }
      },
      resolveId(id) {
        if (id !== './seo-content.js') return;
        const path = seoContentPath(projectRoot);
        if (seoContent === undefined && !existsSync(path)) return missingSeo;
        if (seoContent !== undefined) return path;
      },
      load(id) {
        if (id === missingSeo) return emptySeoContent;
        if (seoContent !== undefined && id === seoContentPath(projectRoot)) return seoContent;
      },
    },
    {
      name: 'anywherepdf-offline',
      apply: 'build',
      configResolved(config) {
        site = deployment();
        outputDir = resolve(config.root, config.build.outDir);
      },
      async closeBundle() {
        const root = outputDir;
        for (const dir of ['cmaps', 'standard_fonts'])
          cpSync(resolve('node_modules/pdfjs-dist', dir), resolve(root, dir), { recursive: true });
        cpSync(
          resolve('node_modules/tesseract.js/dist/worker.min.js'),
          resolve(root, 'ocr/worker.min.js'),
        );
        cpSync(
          resolve('node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js'),
          resolve(root, 'ocr/tesseract-core-lstm.wasm.js'),
        );
        function files(dir) {
          return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
            const path = resolve(dir, entry.name);
            return entry.isDirectory() ? files(path) : [path];
          });
        }
        for (const name of ['qpdf.js', 'qpdf.wasm', 'LICENSE'])
          cpSync(resolve('node_modules/@jspawn/qpdf-wasm', name), resolve(root, 'qpdf', name));
        await prerender(root, projectRoot, site, seoContent);
        // Every runtime file is essential, including 404.html. sw.js stays network-only so updates are not pinned.
        const paths = files(root)
          .filter(path => !['sw.js', '_headers', '_redirects'].includes(basename(path)))
          .sort();
        const hash = createHash('sha256');
        for (const path of paths)
          hash.update(relative(root, path) + '\0').update(readFileSync(path));
        const cache = hash.digest('hex').slice(0, 16);
        // Cloudflare Pages redirects /index.html to /, so cache directory URLs instead.
        const assets = paths.map(path =>
          ('./' + relative(root, path).replaceAll('\\', '/')).replace(/(^|\/)index\.html$/, '$1'),
        );
        writeFileSync(
          resolve(root, 'sw.js'),
          `
const PREFIX='anywherepdf:'+self.registration.scope+':';
const LEGACY_PREFIXES=['freebiepdf:','paperdesk:'].map(prefix=>prefix+self.registration.scope+':');
const NAME=PREFIX+${JSON.stringify(cache)};
const ASSETS=${JSON.stringify(assets)};
function pause(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function clean(response){
  if(!response.redirected)return response;
  return new Response(await response.blob(),{status:response.status,statusText:response.statusText,headers:response.headers});
}
async function store(cache,url){
  let error;
  for(let attempt=0;attempt<4;attempt++){
    try{
      const response=await fetch(url,{cache:'reload',priority:'low'});
      if(!response.ok)throw new Error('Could not cache '+url+' ('+response.status+')');
      const body=await clean(response);
      if(body.redirected)throw new Error('Could not cache '+url);
      await cache.put(url,body);
      return;
    }catch(err){
      error=err;
      if(attempt<3)await pause(200*2**attempt);
    }
  }
  throw error;
}
async function precache(cache){
  const queue=ASSETS.slice();
  let failure;
  async function worker(){
    while(!failure){
      const url=queue.shift();
      if(!url)return;
      try{await store(cache,url);}catch(error){failure??=error;}
    }
  }
  await Promise.all(Array.from({length:Math.min(8,queue.length)},()=>worker()));
  if(failure)throw failure;
}
function scopeURL(path){return new URL(path,self.registration.scope);}
function navigation(request){
  const url=new URL(request.url);
  const scope=new URL(self.registration.scope);
  const rel=url.pathname.startsWith(scope.pathname)?url.pathname.slice(scope.pathname.length):url.pathname.replace(/^\\//,'');
  const leaf=rel.split('/').pop()||'';
  const extension=/\\.[a-z0-9]+$/i.test(leaf);
  let bare=rel;
  if(bare.endsWith('/index.html'))bare=bare.slice(0,-10);
  else if(bare==='index.html')bare='';
  const directory=bare===''||bare.endsWith('/')?bare:bare+'/';
  const directoryAsset='./'+directory;
  if(ASSETS.includes(directoryAsset)||!extension){
    const canonical=scopeURL(directoryAsset);
    const known=ASSETS.includes(directoryAsset);
    if(known&&canonical.pathname!==url.pathname){
      const redirect=new URL(canonical);
      redirect.search=url.search;
      return {lookup:canonical.href,known,redirect:redirect.href};
    }
    return {lookup:canonical.href,known};
  }
  const file=new URL(url.href);
  file.search='';file.hash='';
  return {lookup:file.href,known:ASSETS.includes('./'+rel)};
}
async function fromNetwork(request){
  const response=await fetch(request);
  return response.redirected?clean(response):response;
}
async function navigate(request,cache){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),3000);
  try{
    return await fetch(request,{signal:controller.signal,cache:'no-cache'});
  }catch{
    const target=navigation(request);
    if(target.redirect)return Response.redirect(target.redirect,308);
    const cached=await cache.match(target.lookup);
    if(cached)return cached;
    if(!target.known){
      const page=await cache.match('./404.html');
      if(page)return new Response(await page.blob(),{status:404,statusText:'Not Found',headers:page.headers});
    }
    return Response.error();
  }finally{
    clearTimeout(timeout);
  }
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(NAME);
  try{await precache(cache);}catch(error){await caches.delete(NAME);throw error;}
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==NAME&&[PREFIX,...LEGACY_PREFIXES].some(prefix=>key.startsWith(prefix))).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{
  if(event.data?.type!=='anywherepdf-cache-check')return;
  event.waitUntil((async()=>{
    const cache=await caches.open(NAME);
    const hits=await Promise.all(ASSETS.map(url=>cache.match(url).then(Boolean)));
    const missing=hits.reduce((count,hit)=>count+(hit?0:1),0);
    event.source?.postMessage({type:'anywherepdf-cache-status',id:event.data.id,ok:missing===0,missing});
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(NAME).then(async cache=>{
    try{
      if(request.mode==='navigate')return await navigate(request,cache);
      return await cache.match(request)||await fromNetwork(request);
    }catch{return Response.error();}
  }).catch(()=>Response.error()));
});
`,
        );
      },
    },
  ],
});
