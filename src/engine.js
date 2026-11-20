import {EncryptedPDFError, PDFDocument, StandardFonts, degrees, rgb} from 'pdf-lib';
import JSZip from 'jszip';

const PDF = 'application/pdf';
const result = (name, bytes, type=PDF) => ({name, blob:new Blob([bytes],{type})});
const saved = async (doc,name='document.pdf') => result(name,await doc.save({useObjectStreams:true}));
async function unlocked(file,password=''){
  const {changePassword}=await import('./password.js');
  const output=await changePassword(file,{password});
  return new File([output.blob],output.name,{type:PDF});
}
const isEncryptedError=error=>error instanceof EncryptedPDFError || error?.message?.startsWith('Input document to `PDFDocument.load` is encrypted.');
async function read(file,password,loadOptions){
  try{
    return {doc:await PDFDocument.load(await file.arrayBuffer(),loadOptions),input:file};
  }catch(error){
    if(!isEncryptedError(error)) throw error;
  }
  const input=await unlocked(file,password);
  try{
    return {doc:await PDFDocument.load(await input.arrayBuffer(),loadOptions),input};
  }catch(error){
    if(isEncryptedError(error)) throw new Error('The browser could not process this PDF’s encryption.');
    throw error;
  }
}
// Upright (as displayed) size of a page, and a converter from upright points to default user space (honours CropBox and /Rotate)
function pageView(page){
  const box=page.getCropBox(),angle=((page.getRotation().angle%360)+360)%360;
  const [width,height]=angle%180?[box.height,box.width]:[box.width,box.height];
  const toUser=(x,y)=>{
    const [u,v]={0:[x,y],90:[box.width-y,x],180:[box.width-x,box.height-y],270:[y,box.height-x]}[angle]??[x,y];
    return {x:box.x+u,y:box.y+v};
  };
  return {box,angle,width,height,toUser};
}
const cleanText = (font, text) => Array.from(text, char => {
  try { font.encodeText(char); return char; } catch { return '?'; }
}).join('');

function range(spec,count){
  if(!count) throw new Error('This PDF has no pages.');
  if(!spec?.trim()) return Array.from({length:count},(_,i)=>i);
  return spec.split(',').flatMap(part=>{
    const match=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if(!match) throw new Error('Enter page numbers or ranges such as 1,3-5.');
    const first=Number(match[1]),last=Number(match[2]??match[1]);
    if(Math.min(first,last)<1||Math.max(first,last)>count) throw new Error('Choose pages between 1 and '+count+'.');
    return Array.from({length:Math.abs(last-first)+1},(_,i)=>first-1+i*Math.sign(last-first));
  });
}

let renderer;
async function getRenderer(){
  renderer ??= Promise.all([import('pdfjs-dist/build/pdf.mjs'),import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(([engine,worker])=>{
    engine.GlobalWorkerOptions.workerSrc=worker.default;
    return engine;
  });
  return renderer;
}

async function withRender(file,options,work){
  const engine=await getRenderer();
  const base=new URL(import.meta.env.BASE_URL,document.baseURI);
  const task=engine.getDocument({data:new Uint8Array(await file.arrayBuffer()),password:options.password||undefined,
    isEvalSupported:false,cMapUrl:new URL('cmaps/',base).href,cMapPacked:true,standardFontDataUrl:new URL('standard_fonts/',base).href});
  try { return await work(await task.promise); }
  finally { await task.destroy(); }
}

async function render(page,dpi){
  const scale=Number(dpi||144)/72;
  const viewport=page.getViewport({scale});
  if(viewport.width*viewport.height>40_000_000) throw new Error('Choose a lower resolution for this page.');
  const canvas=document.createElement('canvas');
  canvas.width=Math.ceil(viewport.width);
  canvas.height=Math.ceil(viewport.height);
  await page.render({canvasContext:canvas.getContext('2d'),viewport,background:'white'}).promise;
  return canvas;
}
const canvasBlob=(canvas,type,quality)=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not encode the image.')),type,quality));
const downloadZip=async (zip,name)=>result(name,await zip.generateAsync({type:'uint8array',compression:'DEFLATE'}),'application/zip');

async function imagesToPdf(files){
  const output=await PDFDocument.create();
  for(const file of files){
    let embedded;
    if(file.type==='image/jpeg'||/\.jpe?g$/i.test(file.name)) embedded=await output.embedJpg(await file.arrayBuffer());
    else if(file.type==='image/png'||/\.png$/i.test(file.name)) embedded=await output.embedPng(await file.arrayBuffer());
    else {
      const bitmap=await createImageBitmap(file);
      const canvas=document.createElement('canvas');
      canvas.width=bitmap.width;
      canvas.height=bitmap.height;
      canvas.getContext('2d').drawImage(bitmap,0,0);
      bitmap.close();
      embedded=await output.embedPng(await (await canvasBlob(canvas,'image/png')).arrayBuffer());
    }
    const w=embedded.width*.75,h=embedded.height*.75,landscape=embedded.width>embedded.height;
    const [pw,ph]=landscape?[841.89,595.28]:[595.28,841.89],scale=Math.min(1,pw/w,ph/h);
    const page=output.addPage([pw,ph]);
    page.drawImage(embedded,{x:(pw-w*scale)/2,y:(ph-h*scale)/2,width:w*scale,height:h*scale});
  }
  return saved(output,'images.pdf');
}

async function createPdf(text){
  // Built-in PDF fonts only cover Windows-1252, so refuse text that would be garbled
  const unsupported=[...new Set(text.match(/[^\t\n\r\x20-\x7e\xa0-\xff€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/gu)??[])];
  if(unsupported.length) throw new Error('This text contains characters the built-in PDF font cannot show: '+unsupported.slice(0,10).join(', ')+(unsupported.length>10?' …':'')+'. Use only Latin characters, or print to PDF from your browser instead.');
  const {jsPDF}=await import('jspdf');
  const doc=new jsPDF({unit:'pt',format:'a4'});
  doc.setFontSize(11);
  let y=56;
  for(const source of text.replace(/\r/g,'').split('\n')){
    const lines=doc.splitTextToSize(source||' ',500);
    for(const line of lines){
      if(y>785){doc.addPage();y=56;}
      doc.text(line,48,y);
      y+=15;
    }
  }
  return result('document.pdf',doc.output('arraybuffer'));
}

async function copyPages(doc,indices,name){
  const output=await PDFDocument.create();
  for(const page of await output.copyPages(doc,indices)) output.addPage(page);
  return saved(output,name);
}

const renderModes=new Set(['pdf-to-jpg','pdf-to-png','pdf-to-image-zip','extract-text','pdf-to-html','pdf-to-audio','summarize-pdf','pdf-to-epub','pdf-to-word','pdf-to-excel','pdf-to-pptx','redaction-checker','compare-pdfs','compress-pdf','invert-pdf','flip-pdf','flatten-pdf','redact-pdf','ocr-pdf']);
const escapeHtml=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const textPage=async page=>{
  const content=await page.getTextContent();
  return content.items.map(item=>('str' in item?item.str+(item.hasEOL?'\n':' '):'')).join('').trim();
};
// Joins text items, then finds case-insensitive, whitespace-normalized phrase matches and maps them back to item character spans
function findPhrase(items,phrase){
  const runs=[];let source='';
  for(const item of items){
    if(!('str' in item)) continue;
    const previous=runs[runs.length-1]?.item;
    if(previous&&(previous.hasEOL||
      Math.abs(item.transform[5]-previous.transform[5])>Math.max(item.height,previous.height)/2||
      item.transform[4]<previous.transform[4])) source+='\n';
    else if(previous&&item.transform[4]-previous.transform[4]-previous.width>previous.height*.2) source+=' ';
    runs.push({item,start:source.length});
    source+=item.str;
  }
  let folded='',map=[],gap=false;
  for(let i=0;i<source.length;i++){
    if(/\s/.test(source[i])){gap=folded.length>0;continue;}
    if(gap){folded+=' ';map.push(-1);gap=false;}
    const lower=source[i].toLowerCase();
    folded+=lower.length===1?lower:source[i];map.push(i);
  }
  const needle=phrase.replace(/\s+/g,' ').trim().toLowerCase();
  const spans=[];
  for(let at=folded.indexOf(needle);at>=0;at=folded.indexOf(needle,at+1)) spans.push([map[at],map[at+needle.length-1]+1]);
  const boxes=[];
  for(const [from,to] of spans) for(const {item,start} of runs){
    const a=Math.max(from,start),b=Math.min(to,start+item.str.length);
    if(a<b) boxes.push({item,from:a-start,to:b-start});
  }
  return {matches:spans.length,boxes};
}

function redactionBounds({item,from,to},page,context){
  const pad=Math.max(2.5,item.height*.1);
  const whole=[-pad,item.width+pad];
  if((from===0&&to===item.str.length)||item.dir!=='ltr'||!page.commonObjs.has(item.fontName)) return whole;
  const font=page.commonObjs.get(item.fontName);
  if(font.isType3Font||!context.measureText||!item.height) return whole;
  const family=font.systemFontInfo?.css||(font.loadedName&&font.fallbackName&&`"${font.loadedName}", ${font.fallbackName}`);
  if(!family) return whole;
  const previous=context.font;
  context.font=`${font.italic?'italic':'normal'} ${font.black?'900':font.bold?'bold':'normal'} ${item.height}px ${family}`;
  try{
    const full=context.measureText(item.str).width;
    const start=context.measureText(item.str.slice(0,from)).width;
    const end=context.measureText(item.str.slice(0,to)).width;
    if(!(full>0&&start>=0&&end>start&&end<=full)) return whole;
    const scale=item.width/full;
    return [start*scale-pad,end*scale+pad];
  }catch{
    return whole;
  }finally{context.font=previous;}
}

async function splitBySize(doc,indices,limit){
  if(!Number.isFinite(limit)||limit<=0) throw new Error('Enter a positive file size in KB.');
  const zip=new JSZip();
  let offset=0,part=1;
  while(offset<indices.length){
    const remaining=indices.length-offset;
    // Copy each candidate as a batch so shared resources are serialized only once.
    const measure=async count=>(await copyPages(doc,indices.slice(offset,offset+count),'part.pdf')).blob;
    let count=1,best=await measure(count);
    if(best.size>limit) throw new Error('Page '+(indices[offset]+1)+' is '+best.size+' bytes on its own and exceeds the size limit.');
    let next=Math.min(remaining,count*2);
    while(next>count){
      const candidate=await measure(next);
      if(candidate.size>limit) break;
      best=candidate;
      count=next;
      next=Math.min(remaining,count*2);
    }
    while(next-count>1){
      const middle=Math.floor((count+next)/2);
      const candidate=await measure(middle);
      if(candidate.size>limit) next=middle;
      else{count=middle;best=candidate;}
    }
    zip.file('part-'+part+'.pdf',new Uint8Array(await best.arrayBuffer()));
    part++;
    offset+=count;
  }
  return downloadZip(zip,'pdf-parts.zip');
}

export async function runTool(id,files,options={},progress=()=>{}){
  const file=files[0],text=options.text??'',preset=options.preset, pages=options.pages;
  if(id==='create-pdf') return createPdf(text);
  if(id==='gst-invoice'){
    const quantity=Number(options.quantity),price=Number(options.price),rate=Number(options.rate);
    if(!options.supplier||!options.buyer||!options.item||!(quantity>0)||!(price>=0)||!(rate>=0)) throw new Error('Enter the invoice details, quantity, price, and tax rate.');
    const amount=quantity*price,tax=amount*rate/100;
    if(!Number.isFinite(amount+tax)) throw new Error('Invoice values are too large.');
    return createPdf([`TAX INVOICE  ${options.number||''}`,options.date||'',`Supplier: ${options.supplier}`,`GSTIN: ${options.gstin||''}`,`Buyer: ${options.buyer}`,'',options.item,`Quantity: ${quantity}    Unit price: INR ${price.toFixed(2)}`,`Subtotal: INR ${amount.toFixed(2)}`,`Tax (${rate}%): INR ${tax.toFixed(2)}`,`Total: INR ${(amount+tax).toFixed(2)}`].join('\n'));
  }
  if(!file) throw new Error('Choose a file first.');
  if(id==='encrypt-pdf'||id==='unlock-pdf'){
    const {changePassword}=await import('./password.js');
    return changePassword(file,{password:options.password,text,encrypt:id==='encrypt-pdf'});
  }
  if(['word-to-pdf','excel-to-pdf','pptx-to-pdf','ebook-to-pdf'].includes(id)){
    const {officeImport}=await import('./office.js');
    return createPdf(await officeImport(file));
  }
  if(['images-to-pdf','scan-to-pdf'].includes(id)) return imagesToPdf(files);
  if(['txt-to-pdf','markdown-to-pdf','html-to-pdf','csv-to-pdf'].includes(id)){
    let value=await file.text();
    if(id==='html-to-pdf'){
      const template=document.createElement('template');
      template.innerHTML=value;
      template.content.querySelectorAll('script,style,template,noscript,title').forEach(node=>node.remove());
      value=template.content.textContent;
    }
    return createPdf(value);
  }
  if(id==='pdf-to-zip'){
    const zip=new JSZip();
    files.forEach((input,i)=>zip.file(String(i+1).padStart(2,'0')+'-'+input.name.replace(/[\\/:]/g,'_'),input));
    return downloadZip(zip,'documents.zip');
  }
  if(id==='workflow'){
    const steps=options.steps??[];
    if(!steps.length||steps.length>8) throw new Error('Add one to eight operations.');
    let {input}=await read(file,options.password);
    for(const step of steps){
      progress('Running '+step.label+'…');
      const processed=await runTool(step.id,[input],{...step});
      input=new File([processed.blob],processed.name,{type:PDF});
    }
    return {name:'workflow.pdf',blob:input};
  }
  if(renderModes.has(id)){
    return withRender(file,options,async doc=>{
      if(id==='compare-pdfs'){
        if(files.length!==2) throw new Error('Choose exactly two PDFs.');
        let sections;
        try{
          sections=await withRender(files[1],options,async second=>{
            const indices=range(pages,Math.max(doc.numPages,second.numPages));
            const values=[];
            for(const i of indices){
              const number=i+1;
              progress('Reading page '+number+'…');
              const left=number<=doc.numPages?await textPage(await doc.getPage(number)):null;
              const right=number<=second.numPages?await textPage(await second.getPage(number)):null;
              const status=left===null?'only in second file':right===null?'only in first file':left===right?'same text':'different text';
              values.push('<h2>Page '+number+' · '+status+'</h2><div><pre>'+escapeHtml(left??'')+'</pre><pre>'+escapeHtml(right??'')+'</pre></div>');
            }
            return values;
          });
        }catch(error){
          if(error?.name==='PasswordException') throw new Error('The second PDF needs a different password; unlock it first with Unlock PDF.');
          throw error;
        }
        return result('compare.html','<!doctype html><meta charset="utf-8"><title>Compare PDFs</title><style>body{font:16px system-ui;padding:20px}div{display:grid;grid-template-columns:1fr 1fr;gap:15px}pre{white-space:pre-wrap;background:#eee;padding:10px}</style>'+sections.join(''),'text/html;charset=utf-8');
      }
      const indices=range(pages,doc.numPages);
      if(['extract-text','pdf-to-html','pdf-to-audio','summarize-pdf','pdf-to-epub','pdf-to-word','pdf-to-excel','pdf-to-pptx','redaction-checker'].includes(id)){
        const texts=[];
        for(const i of indices){progress('Reading page '+(i+1)+'…');texts.push(await textPage(await doc.getPage(i+1)));}
        const full=texts.join('\n\n');
        if(['pdf-to-word','pdf-to-excel','pdf-to-pptx'].includes(id)){
          const {officeExport}=await import('./office.js');
          return officeExport(id,texts,await availableRows());
        }
        async function availableRows(){
          if(id!=='pdf-to-excel') return [];
          const sheets=[];
          for(const i of indices){
            const content=await (await doc.getPage(i+1)).getTextContent();
            const lines=new Map();
            for(const item of content.items){
              if(!('str' in item)||!item.str.trim()) continue;
              const y=Math.round(item.transform[5]/3)*3;
              const items=lines.get(y)||[];
              items.push(item);lines.set(y,items);
            }
            const rows=[...lines.entries()].sort(([a],[b])=>b-a).map(([,items])=>{
              const cells=[];let previous;
              for(const item of items.sort((a,b)=>a.transform[4]-b.transform[4])){
                const gap=previous?item.transform[4]-previous.transform[4]-previous.width:Infinity;
                if(gap>12) cells.push(item.str);
                else cells[cells.length-1]+=' '+item.str;
                previous=item;
              }
              return cells;
            });
            sheets.push(rows);
          }
          return sheets;
        }
        if(id==='pdf-to-audio') return {speech:full};
        if(id==='redaction-checker'){
          if(!text.trim()) throw new Error('Enter a phrase to search.');
          const matches=indices.filter((i,j)=>texts[j].toLocaleLowerCase().includes(text.toLocaleLowerCase())).map(i=>i+1);
          return result('text-search.json',JSON.stringify({matches,coverage:'Searchable text only'},null,2),'application/json');
        }
        if(id==='summarize-pdf'){
          const sentences=full.replace(/\s+/g,' ').match(/[^.!?]+[.!?]?/g)??[];
          const counts=new Map();
          const words=line=>line.toLowerCase().match(/\p{L}{5,}/gu)??[];
          words(full).forEach(w=>counts.set(w,(counts.get(w)||0)+1));
          const ranked=sentences.map((s,i)=>({s,i,score:words(s).reduce((sum,w)=>sum+(counts.get(w)||0),0)/Math.max(1,words(s).length)}));
          return result('summary.txt',ranked.sort((a,b)=>b.score-a.score).slice(0,5).sort((a,b)=>a.i-b.i).map(row=>row.s.trim()).join('\n\n'),'text/plain;charset=utf-8');
        }
        if(id==='pdf-to-epub'){
          const zip=new JSZip(), uid='urn:uuid:'+crypto.randomUUID();
          zip.file('mimetype','application/epub+zip',{compression:'STORE'});
          zip.file('META-INF/container.xml','<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="book.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
          zip.file('book.opf',`<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">${uid}</dc:identifier><dc:title>Anywhere PDF document</dc:title><dc:language>en</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/,'Z')}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="doc" href="doc.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="doc"/></spine></package>`);
          zip.file('nav.xhtml','<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol><li><a href="doc.xhtml">Document</a></li></ol></nav></body></html>');
          zip.file('doc.xhtml','<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Document</title></head><body><pre>'+escapeHtml(full.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,''))+'</pre></body></html>');
          return result('document.epub',await zip.generateAsync({type:'uint8array'}),'application/epub+zip');
        }
        if(id==='pdf-to-html') return result('export.html','<!doctype html><meta charset="utf-8"><title>PDF text</title><pre style="white-space:pre-wrap">'+escapeHtml(full)+'</pre>','text/html;charset=utf-8');
        return result('extracted.txt',full,'text/plain;charset=utf-8');
      }
      const archive=new JSZip();
      const output=await PDFDocument.create();
      let ocr, redactions=0;
      try {
        if(id==='ocr-pdf'){
          const {createOcr}=await import('./ocr.js');
          ocr=await createOcr(progress);
        }
        for(const i of indices){
          progress('Processing page '+(i+1)+'…');
          const page=await doc.getPage(i+1);
          const isExport=id.startsWith('pdf-to-');
          const dpi=isExport?options.dpi:(id==='compress-pdf'?({Light:144,Medium:110,Heavy:85}[preset]??110):144);
          let canvas=await render(page,dpi);
          if(id==='invert-pdf'||id==='flip-pdf'){
            const transformed=document.createElement('canvas');
            transformed.width=canvas.width; transformed.height=canvas.height;
            const context=transformed.getContext('2d');
            if(id==='invert-pdf') context.filter=({Negative:'invert(1)',Grayscale:'grayscale(1)',Sepia:'sepia(1)'})[preset]??'invert(1)';
            else{
              const x=preset!=='Vertical',y=preset!=='Horizontal';
              context.translate(x?canvas.width:0,y?canvas.height:0);context.scale(x?-1:1,y?-1:1);
            }
            context.drawImage(canvas,0,0);canvas=transformed;
          }
          if(id==='redact-pdf'){
            if(!text.trim())throw new Error('Enter a phrase to redact.');
            const content=await page.getTextContent();
            const viewport=page.getViewport({scale:2});
            const context=canvas.getContext('2d');
            context.fillStyle='black';
            const {matches,boxes}=findPhrase(content.items,text);
            redactions+=matches;
            for(const box of boxes){
              const {item}=box;
              const [a,b,c,d,x,y]=item.transform;
              const basis=Math.hypot(a,b)||1;
              const up=Math.hypot(c,d)||1;
              const u=[a/basis,b/basis],v=[c/up*item.height,d/up*item.height];
              const [s,e]=redactionBounds(box,page,context);
              const x0=x+u[0]*s,y0=y+u[1]*s,span=[u[0]*(e-s),u[1]*(e-s)];
              const points=[[x0-v[0]*.22,y0-v[1]*.22],[x0+span[0]-v[0]*.22,y0+span[1]-v[1]*.22],
                [x0+span[0]+v[0]*1.2,y0+span[1]+v[1]*1.2],[x0+v[0]*1.2,y0+v[1]*1.2]].map(point=>viewport.convertToViewportPoint(...point));
              context.beginPath();
              points.forEach(([px,py],i)=>i?context.lineTo(px,py):context.moveTo(px,py));
              context.closePath();context.fill();
            }
          }
          const jpg=id==='pdf-to-jpg'||id==='compress-pdf';
          const mime=jpg?'image/jpeg':'image/png';
          const enc=await canvasBlob(canvas,mime,preset==='Heavy'?.45:preset==='Medium'?.65:.85);
          if(isExport){
            const name='page-'+String(i+1).padStart(3,'0')+(jpg?'.jpg':'.png');
            if(indices.length===1&&id!=='pdf-to-image-zip') return {name,blob:enc};
            archive.file(name,new Uint8Array(await enc.arrayBuffer()));
          }else{
            const image=jpg?await output.embedJpg(await enc.arrayBuffer()):await output.embedPng(await enc.arrayBuffer());
            const viewport=page.getViewport({scale:1});
            const dest=output.addPage([viewport.width,viewport.height]);
            dest.drawImage(image,{x:0,y:0,width:viewport.width,height:viewport.height});
            if(ocr){
              const textFont=await output.embedFont(StandardFonts.Helvetica);
              const matches=await ocr.recognize(canvas);
              for(const word of matches){
                const box=word.bbox,scaleX=viewport.width/canvas.width,scaleY=viewport.height/canvas.height;
                const value=cleanText(textFont,word.text);
                if(value) dest.drawText(value,{x:box.x0*scaleX,y:viewport.height-box.y1*scaleY,size:Math.max(2,(box.y1-box.y0)*scaleY),font:textFont,opacity:0});
              }
            }
          }
          canvas.width=0;canvas.height=0;
        }
      } finally { if(ocr) await ocr.close(); }
      if(id.startsWith('pdf-to-')) return downloadZip(archive,'page-images.zip');
      if(id==='redact-pdf'&&!redactions) throw new Error('Phrase not found on the selected pages.');
      const rendered=await saved(output,id+'.pdf');
      if(id==='compress-pdf'&&rendered.blob.size>=file.size) return {name:'original-size.pdf',blob:file,note:'No smaller output was found. Returned the original.'};
      return rendered;
    });
  }
  const reportsMetadata=id==='pdf-size-analyzer'||(id==='privacy-scanner'&&preset!=='Clear standard metadata');
  const {doc,input}=await read(file,options.password,reportsMetadata?{updateMetadata:false}:undefined);
  const indices=range(pages,doc.getPageCount());
  if(id==='merge-pdf'||id==='alternate-mix-pdf'){
    const others=await Promise.all(files.slice(1).map(file=>read(file,options.password)));
    const docs=[doc,...others.map(({doc})=>doc)],output=await PDFDocument.create();
    const copied=await Promise.all(docs.map(input=>output.copyPages(input,input.getPageIndices())));
    if(id==='merge-pdf') copied.flat().forEach(page=>output.addPage(page));
    else for(let i=0;i<Math.max(...copied.map(a=>a.length));i++) for(const list of copied) if(list[i]) output.addPage(list[i]);
    return saved(output,'combined.pdf');
  }
  if(id==='split-pdf'&&!pages?.trim()){
    const zip=new JSZip();
    for(const index of indices){
      const part=await copyPages(doc,[index],'page.pdf');
      zip.file('page-'+String(index+1).padStart(3,'0')+'.pdf',new Uint8Array(await part.blob.arrayBuffer()));
    }
    return downloadZip(zip,'split-pages.zip');
  }
  if(id==='split-pdf-by-size') return splitBySize(doc,indices,Number(text||2048)*1024);
  if(['split-pdf-in-half','split-pdf-by-text','split-pdf-by-bookmarks'].includes(id)){
    const groups=[];
    if(id==='split-pdf-in-half'){
      if(indices.length<2) throw new Error('Choose at least two pages.');
      const middle=Math.ceil(indices.length/2);groups.push(indices.slice(0,middle),indices.slice(middle));
    }else if(id==='split-pdf-by-bookmarks'){
      await withRender(input,options,async source=>{
        const outline=await source.getOutline()??[];
        const markers=new Set();
        for(const item of outline){
          const dest=typeof item.dest==='string'?await source.getDestination(item.dest):item.dest;
          const ref=dest?.[0];
          if(typeof ref==='number')markers.add(ref);
          else if(ref?.num!==undefined)markers.add(await source.getPageIndex(ref));
        }
        if(!markers.size) throw new Error('No usable top-level bookmarks were found.');
        let current=[];
        for(const i of indices){
          if(current.length&&markers.has(i)){groups.push(current);current=[];}
          current.push(i);
        }
        if(current.length)groups.push(current);
      });
    }else if(id==='split-pdf-by-text'){
      if(!text.trim()) throw new Error('Enter a phrase that starts a section.');
      await withRender(input,options,async source=>{
        let current=[];
        for(const i of indices){
          const pageText=await textPage(await source.getPage(i+1));
          if(current.length&&pageText.toLocaleLowerCase().includes(text.toLocaleLowerCase())){groups.push(current);current=[];}
          current.push(i);
        }
        if(current.length)groups.push(current);
      });
    }
    const zip=new JSZip();
    for(let i=0;i<groups.length;i++){
      const part=await copyPages(doc,groups[i],'part.pdf');zip.file('part-'+(i+1)+'.pdf',new Uint8Array(await part.blob.arrayBuffer()));
    }
    return downloadZip(zip,'pdf-parts.zip');
  }
  if(['split-pdf','extract-pdf-pages','organize-pages','delete-pdf-pages'].includes(id)){
    if(id==='delete-pdf-pages'&&!pages?.trim()) throw new Error('Enter the pages to delete.');
    const keep=id==='delete-pdf-pages'?doc.getPageIndices().filter(i=>!indices.includes(i)):indices;
    if(!keep.length) throw new Error('The result needs at least one page.');
    return copyPages(doc,keep,'pages.pdf');
  }
  if(id==='multiple-pages-per-sheet'||id==='resize-pdf'){
    const count=id==='resize-pdf'?1:Number(preset??4);
    if(![1,2,4,6,9,16].includes(count)) throw new Error('Choose a supported layout.');
    const [width,height]=id==='resize-pdf'?({Letter:[612,792],Legal:[612,1008],A5:[420,595]}[preset]??[595,842]):[595,842];
    const cols=Math.ceil(Math.sqrt(count)),rows=Math.ceil(count/cols),output=await PDFDocument.create();
    for(let start=0;start<indices.length;start+=count){
      const target=output.addPage([width,height]);
      for(const [slot,index] of indices.slice(start,start+count).entries()){
        const source=doc.getPage(index);
        if(!source.node.Contents()) continue;
        const box=source.getCropBox(),angle=((source.getRotation().angle%360)+360)%360;
        const embedded=await output.embedPage(source,{left:box.x,bottom:box.y,right:box.x+box.width,top:box.y+box.height});
        const cellW=width/cols,cellH=height/rows;
        const sideways=angle%180!==0;
        const shownW=sideways?embedded.height:embedded.width,shownH=sideways?embedded.width:embedded.height;
        const factor=Math.min((cellW-20)/shownW,(cellH-20)/shownH);
        const left=(slot%cols)*cellW+(cellW-shownW*factor)/2;
        const bottomY=height-(Math.floor(slot/cols)+1)*cellH+(cellH-shownH*factor)/2;
        // Where the crop box corner lands on the upright page; drawPage then rotates the content by -angle so it matches the on-screen orientation
        const [ox,oy]={0:[0,0],90:[0,box.width],180:[box.width,box.height],270:[box.height,0]}[angle]??[0,0];
        target.drawPage(embedded,{x:left+ox*factor,y:bottomY+oy*factor,xScale:factor,yScale:factor,rotate:degrees(-angle)});
      }
    }
    return saved(output,'layout.pdf');
  }
  if(id==='pdf-size-analyzer'||id==='privacy-scanner'){
    const metadata={title:doc.getTitle(),author:doc.getAuthor(),subject:doc.getSubject(),keywords:doc.getKeywords(),creator:doc.getCreator(),producer:doc.getProducer()};
    if(id==='pdf-size-analyzer'||preset!=='Clear standard metadata'){
      const payload={bytes:file.size,pages:doc.getPageCount(),metadata};
      return result('report.json',JSON.stringify(payload,null,2),'application/json');
    }
    doc.setTitle('');doc.setAuthor('');doc.setSubject('');doc.setKeywords([]);doc.setCreator('');doc.setProducer('');
    return saved(doc,'metadata-cleared.pdf');
  }
  if(id==='edit-pdf-metadata'){
    const value=JSON.parse(text);
    if(!value||Array.isArray(value)||typeof value!=='object') throw new Error('Enter a JSON object.');
    for(const [key,setter] of Object.entries({title:'setTitle',author:'setAuthor',subject:'setSubject',creator:'setCreator'})){
      if(typeof value[key]==='string')doc[setter](value[key]);
    }
    return saved(doc,'metadata.pdf');
  }
  if(id==='fill-pdf-form'){
    const data=JSON.parse(text),form=doc.getForm();
    if(!data||Array.isArray(data)||typeof data!=='object') throw new Error('Enter a JSON object with field names.');
    let found=0;
    for(const field of form.getFields()){
      if(!Object.hasOwn(data,field.getName()))continue;
      const value=data[field.getName()];
      if(typeof field.setText==='function')field.setText(String(value));
      else if(typeof field.check==='function') (value?field.check():field.uncheck());
      else if(typeof field.select==='function')field.select(value);
      else continue;
      found++;
    }
    if(!found) throw new Error('No supported fields matched.');
    if(preset==='Flatten')form.flatten();
    return saved(doc,'filled.pdf');
  }
  const font=await doc.embedFont(id==='sign-pdf'?StandardFonts.TimesRomanItalic:StandardFonts.Helvetica);
  for(const [j,index] of indices.entries()){
    const page=doc.getPage(index),{box,width,height,toUser,angle}=pageView(page);
    if(id==='rotate-pdf')page.setRotation(degrees((page.getRotation().angle+Number(preset||90))%360));
    else if(id==='crop-resize-pdf'){
      const margin=Number(text||18);
      if(!Number.isFinite(margin)||margin<0||margin*2>=Math.min(box.width,box.height))throw new Error('Enter a margin smaller than half the page size.');
      page.setCropBox(box.x+margin,box.y+margin,box.width-2*margin,box.height-2*margin);
    }else if(['edit-pdf-text','sign-pdf','add-watermark','page-numbers','bates-numbering','headers-footers'].includes(id)){
      let label=text;
      if(id==='page-numbers'){
        const number=Number(text||1);
        if(!Number.isSafeInteger(number))throw new Error('Enter a valid starting page number.');
        label=String(number+j);
      }
      if(id==='bates-numbering')label=text+String(j+1).padStart(6,'0');
      if(!label.trim())throw new Error('Enter the text to add.');
      const size=id==='add-watermark'?27:id==='sign-pdf'?20:12;
      const value=cleanText(font,label),top=id==='edit-pdf-text'||id==='sign-pdf';
      const x=top?Number(options.x||36):Math.max(12,(width-font.widthOfTextAtSize(value,size))/2);
      const y=top?height-Number(options.y||54):id==='add-watermark'?height/2:24;
      if(!Number.isFinite(x+y)||x<0||y<0||x>=width||y>=height)throw new Error('The text position is outside one of the pages.');
      const at=toUser(x,y);
      page.drawText(value,{font,size,x:at.x,y:at.y,rotate:degrees(angle),color:rgb(.12,.26,.23),opacity:id==='add-watermark'?.28:1,maxWidth:Math.max(1,width-x-8)});
    }else if(id!=='repair-pdf') throw new Error('This workflow is unavailable.');
  }
  return saved(doc,id+'.pdf');
}
