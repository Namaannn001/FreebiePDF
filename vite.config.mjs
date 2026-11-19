import {defineConfig} from 'vite';
import {readdirSync,readFileSync,writeFileSync,cpSync} from 'node:fs';
import {resolve,relative,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {prerender} from './prerender.mjs';

let outputDir;

export default defineConfig({
  base:'./',
  plugins:[{
    name:'freebiepdf-offline',
    configResolved(config){outputDir=resolve(config.root,config.build.outDir);},
    async closeBundle(){
      const root=outputDir;
      for(const dir of ['cmaps','standard_fonts'])cpSync(resolve('node_modules/pdfjs-dist',dir),resolve(root,dir),{recursive:true});
      cpSync(resolve('node_modules/tesseract.js/dist/worker.min.js'),resolve(root,'ocr/worker.min.js'));
      cpSync(resolve('node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js'),resolve(root,'ocr/tesseract-core-lstm.wasm.js'));
      function files(dir){
        return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
          const path=resolve(dir,entry.name);
          return entry.isDirectory()?files(path):[path];
        });
      }
      for(const name of ['qpdf.js','qpdf.wasm','LICENSE'])cpSync(resolve('node_modules/@jspawn/qpdf-wasm',name),resolve(root,'qpdf',name));
      await prerender(root);
      const paths=files(root).filter(path=>!['sw.js','_headers','_redirects'].includes(basename(path))).sort();
      const hash=createHash('sha256');
      for(const path of paths) hash.update(readFileSync(path));
      const cache='freebiepdf-'+hash.digest('hex').slice(0,16);
      const assets=paths.map(path=>'./'+relative(root,path).replaceAll('\\','/'));
      writeFileSync(resolve(root,'sw.js'),`
const PREFIX='freebiepdf:'+self.registration.scope+':';
const LEGACY_PREFIX='paperdesk:'+self.registration.scope+':';
const NAME=PREFIX+${JSON.stringify(cache)};
const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install', event=>event.waitUntil(caches.open(NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith(PREFIX)||key.startsWith(LEGACY_PREFIX))&&key!==NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(NAME).then(async cache=>{
    if(request.mode==='navigate'){
      const url=new URL(request.url);
      if(!url.pathname.endsWith('/')&&!url.pathname.endsWith('/index.html'))url.pathname+='/';
      url.search='';url.hash='';
      const page=url.pathname.endsWith('/')?new URL('index.html',url):url;
      return await cache.match(page)||fetch(request);
    }
    return await cache.match(request)||fetch(request);
  }));
});
`);
    }
  }]
});
