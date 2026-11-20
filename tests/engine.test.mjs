// Engine tests: runs src/engine.js tools in Node against real pdf-lib, pdf.js, qpdf (wasm) and a canvas.
// No build needed. Needs the installed dependencies (npm ci); @napi-rs/canvas comes with pdfjs-dist.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {registerHooks, createRequire} from 'node:module';
import {join} from 'node:path';
import {test} from 'node:test';
import {createContext, runInContext} from 'node:vm';
import {pathToFileURL} from 'node:url';
import {root} from './helpers.mjs';

const require=createRequire(join(root,'package.json'));
const {PDFDocument,StandardFonts}=require('pdf-lib');
const JSZip=require('jszip');
const {createCanvas,DOMMatrix,ImageData,Path2D}=require('@napi-rs/canvas');
Object.assign(globalThis,{DOMMatrix,ImageData,Path2D});
const pdfjs=await import(pathToFileURL(require.resolve('pdfjs-dist/legacy/build/pdf.mjs')));
const assets=join(root,'node_modules','pdfjs-dist')+'/';
const workerSrc=pathToFileURL(require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
pdfjs.GlobalWorkerOptions.workerSrc=workerSrc;
let stripEOL=false;
let withoutMeasurement=false;
function getPDF(data){
  const task=pdfjs.getDocument({...data, useSystemFonts:false, standardFontDataUrl:assets+'standard_fonts/', cMapUrl:assets+'cmaps/'});
  if(stripEOL||withoutMeasurement){
    task.promise.then(doc=>{
      const getPage=doc.getPage.bind(doc);
      doc.getPage=async n=>{
        const page=await getPage(n);
        if(stripEOL){
          const getText=page.getTextContent.bind(page);
          page.getTextContent=async (...args)=>{
            const content=await getText(...args);
            for(const item of content.items) item.hasEOL=false;
            return content;
          };
        }
        if(withoutMeasurement){
          const render=page.render.bind(page);
          page.render=options=>{
            const task=render(options);
            task.promise.then(()=>{options.canvasContext.measureText=undefined;});
            return task;
          };
        }
        return page;
      };
    });
  }
  return task;
}
globalThis.testPdfjs=pdfjs;
globalThis.getPDF=getPDF;
globalThis.document={
  baseURI:'http://test.local/',
  createElement(tag){
    assert.equal(tag,'canvas');
    const canvas=createCanvas(1,1);
    canvas.toBlob=callback=>callback(new Blob([canvas.toBuffer('image/png')]));
    return canvas;
  },
};
registerHooks({
  resolve(specifier,context,next){
    if(specifier==='pdfjs-dist/build/pdf.mjs'){
      return {url:'data:text/javascript,'+encodeURIComponent('export const getDocument=globalThis.getPDF; export const GlobalWorkerOptions=globalThis.testPdfjs.GlobalWorkerOptions;'),shortCircuit:true};
    }
    if(specifier.endsWith('pdf.worker.min.mjs?url')) return {url:'data:text/javascript,'+encodeURIComponent('export default '+JSON.stringify(workerSrc)),shortCircuit:true};
    return next(specifier,context);
  },
  load(url,context,next){
    const loaded=next(url,context);
    if(url.endsWith('/src/engine.js')||url.endsWith('/src/password.js')){
      return {...loaded,source:loaded.source.toString().replaceAll('import.meta.env.BASE_URL','"/"')};
    }
    return loaded;
  },
});

const workerCode=readFileSync(join(root,'public','qpdf','worker.js'),'utf8');
const qpdfCode=readFileSync(require.resolve('@jspawn/qpdf-wasm/qpdf.js'),'utf8');
const wasmBinary=readFileSync(require.resolve('@jspawn/qpdf-wasm/qpdf.wasm'));
function vmBytes(scope,bytes){
  scope.fixtureBytes=Array.from(bytes);
  return runInContext('new Uint8Array(fixtureBytes)',scope);
}
function workerScope(postMessage){
  const scope=createContext({URL,crypto,TextDecoder,TextEncoder,fetch:async url=>{assert.equal(url,"http://test.local/qpdf/qpdf.wasm");return new Response(wasmBinary,{headers:{"Content-Type":"application/wasm"}});},console:{log(){},warn(){},error(){}},
    location:{href:'http://test.local/qpdf/worker.js'},postMessage});
  scope.self=scope;
  scope.importScripts=path=>{
    assert.equal(path,'./qpdf.js');
    runInContext(qpdfCode,scope);
  };
  return scope;
}
globalThis.Worker=class {
  constructor(url){
    assert.equal(url.pathname,'/qpdf/worker.js');
    this.scope=workerScope(data=>this.onmessage({data}));
    runInContext(workerCode,this.scope);
  }
  postMessage(data){ this.scope.onmessage({data}).catch(error=>this.onerror(error)); }
  terminate(){}
};

const {runTool}=await import(pathToFileURL(join(root,'src','engine.js')));
const file=bytes=>new File([bytes],'fixture.pdf',{type:'application/pdf'});
const open=async blob=>PDFDocument.load(await blob.arrayBuffer());
function pdfError(message){return error=>error instanceof Error && error.message===message;}
async function fixture(linesByPage){
  const doc=await PDFDocument.create();
  const font=await doc.embedFont(StandardFonts.Helvetica);
  for(const lines of linesByPage){
    const page=doc.addPage([240,180]);
    for(const [text,x=20,y=120,size=14] of lines) page.drawText(text,{font,x,y,size});
  }
  return {file:file(await doc.save({useObjectStreams:false})),font};
}
async function raster(blob){
  const task=getPDF({data:new Uint8Array(await blob.arrayBuffer())});
  try{
    const page=await (await task.promise).getPage(1);
    const viewport=page.getViewport({scale:2});
    const canvas=createCanvas(viewport.width,viewport.height),context=canvas.getContext('2d');
    await page.render({canvasContext:context,viewport,background:'white'}).promise;
    return (x,y)=>Array.from(context.getImageData(Math.round(x*2),Math.round((180-y)*2),1,1).data);
  }finally{await task.destroy();}
}
const black=[0,0,0,255],white=[255,255,255,255];
async function redact(input,text){
  return (await runTool('redact-pdf',[input],{text})).blob;
}
test('redaction covers glyph boxes, preserves neighbours, splits lines',async()=>{
  const size=14,x=20,y=120;
  const first=await fixture([[['WWWiii',x,y,size]]]);
  const p1=await raster(await redact(first.file,'WWW'));
  const w1=x+first.font.widthOfTextAtSize('WWW',size);
  for(let px=x;px<w1;px+=.5) assert.deepEqual(p1(px,y+12),black,'WWW at '+px);
  assert.deepEqual(p1(w1+4,y+12),white,'preserve iii');
  const original=await raster(first.file);
  let glyphPixels=0;
  for(let py=y-2;py<=y+13;py+=.5){
    for(let px=x;px<w1;px+=.5){
      if(original(px,py)[0]===255)continue;
      glyphPixels++;
      assert.deepEqual(p1(px,py),black,'original WWW ink is covered');
    }
  }
  assert.ok(glyphPixels>100);

  const second=await fixture([[['iiiiiiWW',x,y,size]]]);
  const p2=await raster(await redact(second.file,'WW'));
  const w2=x+second.font.widthOfTextAtSize('iiiiii',size);
  const e2=x+second.font.widthOfTextAtSize('iiiiiiWW',size);
  for(let px=w2;px<e2;px+=.5) assert.deepEqual(p2(px,y+12),black,'WW at '+px);
  assert.deepEqual(p2(w2-4,y+12),white,'preserve iiiiii');

  const across=await fixture([[['Alpha',20,120],['Beta',90,90]]]);
  stripEOL=true;
  const crossed=await redact(across.file,'Alpha Beta');
  const noJoin=await fixture([[['World',20,120],['xx',20,90]]]);
  await assert.rejects(redact(noJoin.file,'Worldxx'),pdfError('Phrase not found on the selected pages.'));
  const sameBaseline=await fixture([[['World',100,120],['xx',20,120]]]);
  await assert.rejects(redact(sameBaseline.file,'Worldxx'),pdfError('Phrase not found on the selected pages.'));
  stripEOL=false;
  const p3=await raster(crossed);
  for(const [word,left,base] of [['Alpha',20,120],['Beta',90,90]]){
    const right=left+across.font.widthOfTextAtSize(word,14);
    for(let px=left;px<right;px+=.5) assert.deepEqual(p3(px,base+12),black,word+' at '+px);
  }
  assert.deepEqual(p3(95,132),white);
  assert.deepEqual(p3(25,102),white);
  withoutMeasurement=true;
  const fallback=await redact(first.file,'WWW');
  withoutMeasurement=false;
  assert.deepEqual((await raster(fallback))(w1+4,y+12),black,'fallback covers whole item');
});

const source=(await fixture([[['Fixture']]])).file;
const encrypt=async text=>file((await runTool('encrypt-pdf',[source],{text})).blob);
const protectedFile=await encrypt('secret');
test('password errors and round trips',async()=>{
  const missing='This PDF is password protected. Enter its password.',wrong='Incorrect PDF password.';
  await assert.rejects(runTool('unlock-pdf',[protectedFile]),pdfError(missing));
  await assert.rejects(runTool('unlock-pdf',[protectedFile],{password:'wrong'}),pdfError(wrong));
  for(const password of ['secret','line\nbreak','line\rbreak','line\r\nbreak','🙂🧪 café']){
    const input=password==='secret'?protectedFile:await encrypt(password);
    await assert.rejects(open(input),/is encrypted/);
    if(/[\r\n]/.test(password)) await assert.rejects(runTool('unlock-pdf',[input],{password:'line'}),pdfError(wrong));
    const {blob}=await runTool('unlock-pdf',[input],{password});
    assert.equal((await open(blob)).getPageCount(),1);
  }
  for(const text of ['@bad','-bad']) await assert.rejects(runTool('encrypt-pdf',[source],{text}),pdfError('The new password cannot start with @ or -.'));
  const brokenLength=Buffer.from(Buffer.from(await source.arrayBuffer()).toString('latin1').replace(/\/Length (\d+)/,(_,length)=>'/Length '+ '1'.padEnd(length.length)),'latin1');
  const linked=workerScope(()=>assert.fail('unexpected postMessage'));
  linked.importScripts('./qpdf.js');
  const qpdf=await linked.Module({noInitialRun:true});
  qpdf.FS.writeFile('/input.pdf',vmBytes(linked,brokenLength));
  assert.equal(qpdf.callMain(['/input.pdf','--decrypt','/output.pdf']),2);
  await assert.rejects(runTool('unlock-pdf',[file(brokenLength)]),pdfError('The browser could not process this PDF’s encryption.'));
});
test('encrypted input works for rotate, workflow and merge',async()=>{
  const scope=workerScope(()=>assert.fail('unexpected postMessage'));
  scope.importScripts('./qpdf.js');
  const qpdf=await scope.Module({noInitialRun:true});
  qpdf.FS.writeFile('/input.pdf',new Uint8Array(await source.arrayBuffer()));
  assert.equal(qpdf.callMain(['/input.pdf','--encrypt','','owner-password','256','--','/output.pdf']),0);
  const blankEncrypted=file(qpdf.FS.readFile('/output.pdf'));
  await assert.rejects(open(blankEncrypted),/is encrypted/);
  const steps=[{id:'rotate-pdf',label:'Rotate',preset:90},{id:'rotate-pdf',label:'Rotate',preset:90}];
  for(const [id,options,angle] of [['rotate-pdf',{preset:90},90],['workflow',{steps},180]]){
    for(const [input,password] of [[blankEncrypted,undefined],[protectedFile,'secret']]){
      const {blob}=await runTool(id,[input],{...options,password});
      assert.equal((await open(blob)).getPage(0).getRotation().angle,angle);
    }
    await assert.rejects(runTool(id,[protectedFile],options),pdfError('This PDF is password protected. Enter its password.'));
    await assert.rejects(runTool(id,[protectedFile],{...options,password:'wrong'}),pdfError('Incorrect PDF password.'));
  }
  for(const [input,password] of [[blankEncrypted,undefined],[protectedFile,'secret']]){
    const merged=await runTool('merge-pdf',[source,input],{password});
    assert.equal((await open(merged.blob)).getPageCount(),2);
  }
  await assert.rejects(runTool('merge-pdf',[source,protectedFile]),pdfError('This PDF is password protected. Enter its password.'));
});
test('split by size uses real sizes and keeps selection order',async()=>{
  const order=[7,2,4,1,3,6,5];
  const input=(await fixture(Array.from({length:order.length},(_,i)=>[[String(i+1)]]))).file;
  const pages=order.join(',');
  const combined=(await runTool('extract-pdf-pages',[input],{pages})).blob;
  const split=async (bytes,spec=pages)=>{
    const {blob}=await runTool('split-pdf-by-size',[input],{pages:spec,text:String(bytes/1024)});
    const zip=await JSZip.loadAsync(await blob.arrayBuffer());
    return Promise.all(Object.values(zip.files).map(entry=>entry.async('uint8array')));
  };
  const one=await split(combined.size);
  assert.equal(one.length,1);
  assert.equal(one[0].byteLength,combined.size);
  const smaller=(await runTool('extract-pdf-pages',[input],{pages:order.slice(0,3).join(',')})).blob.size;
  const parts=await split(smaller);
  assert.ok(parts.length>1);
  const actual=[];
  for(const bytes of parts){
    assert.ok(bytes.byteLength<=smaller);
    const {blob}=await runTool('extract-text',[file(bytes)]);
    actual.push(...(await blob.text()).match(/\d+/g));
  }
  assert.deepEqual(actual,order.map(String));
  const single=(await runTool('extract-pdf-pages',[input],{pages:'7'})).blob.size;
  await assert.rejects(split(single-1),pdfError('Page 7 is '+single+' bytes on its own and exceeds the size limit.'));
});
test('compare reports pages present in only one file',async()=>{
  const one=(await fixture([[['Same']]])).file;
  const two=(await fixture([[['Same']],[],[['Extra']]])).file;
  const report=async (left,right,pages)=>(await runTool('compare-pdfs',[left,right],{pages})).blob.text();
  const headings=html=>Array.from(html.matchAll(/<h2>([^<]+)<\/h2>/g),m=>m[1]);
  assert.deepEqual(headings(await report(one,two,'')),['Page 1 · same text','Page 2 · only in second file','Page 3 · only in second file']);
  assert.deepEqual(headings(await report(two,one,'3-2')),['Page 3 · only in first file','Page 2 · only in first file']);
  assert.deepEqual(headings(await report(two,two,'2')),['Page 2 · same text']);
  const different=(await fixture([[['Different']]])).file;
  assert.deepEqual(headings(await report(one,different,'1')),['Page 1 · different text']);
});
