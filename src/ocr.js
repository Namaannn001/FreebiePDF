import {createWorker} from 'tesseract.js';

function kill(worker){
  try{worker?.terminate?.();}catch{/* already stopped */}
}

export async function createOcr(progress,timeoutMs=60000){
  const root=new URL(import.meta.env.BASE_URL,document.baseURI);
  const asset=path=>new URL('ocr/'+path,root).href;
  // tesseract.js 6.0.1 createWorker does not resolve until language data loads, and its
  // public Worker type hides the thread. The browser build calls `new Worker` synchronously
  // before returning that promise, so we capture the instance here.
  // Guaranteed: on timeout or startup failure the captured Worker is terminated immediately.
  // If createWorker later resolves, terminate() runs again. If it later rejects, that
  // rejection is observed. errorHandler only fails the startup race; after startup it is
  // a no-op, so a later recognize error cannot become an unhandled rejection.
  const NativeWorker=globalThis.Worker;
  let thread;
  if(typeof NativeWorker==='function'){
    function CapturedWorker(...args){
      const created=new NativeWorker(...args);
      thread??=created;
      return created;
    }
    CapturedWorker.prototype=NativeWorker.prototype;
    globalThis.Worker=CapturedWorker;
  }
  let fail,timer,abandoned=false,listen=true,worker;
  const broken=new Promise((_,reject)=>{fail=reject;});
  const limit=new Promise((_,reject)=>{timer=setTimeout(reject,timeoutMs,new Error('Timed out'));});
  let starting;
  try{
    starting=createWorker('eng',1,{
      workerPath:asset('worker.min.js'),
      corePath:asset('tesseract-core-lstm.wasm.js'),
      langPath:asset(''),
      workerBlobURL:false,
      gzip:true,
      logger:message=>{if(message.status)progress(message.status+' '+Math.round((message.progress||0)*100)+'%');},
      errorHandler(error){if(listen)fail(error);},
    }).then(created=>{
      if(abandoned){
        listen=false;
        kill(thread);
        return Promise.resolve(created.terminate?.()).catch(()=>{}).then(()=>created);
      }
      listen=false;
      return created;
    },error=>{
      kill(thread);
      throw error;
    });
  }finally{
    if(typeof NativeWorker==='function')globalThis.Worker=NativeWorker;
  }
  try{
    worker=await Promise.race([starting,limit,broken]);
    if(abandoned||!worker?.recognize)throw new Error('abandoned');
    listen=false;
  }catch{
    abandoned=true;
    listen=false;
    kill(thread);
    starting?.catch(()=>{});
    throw new Error('Could not start on-device OCR. Reload the page and try again.');
  }finally{clearTimeout(timer);}
  return {
    async recognize(canvas){
      const {data}=await worker.recognize(canvas,{}, {text:true,blocks:true});
      return (data.blocks??[]).flatMap(block=>block.paragraphs.flatMap(paragraph=>paragraph.lines.flatMap(line=>line.words)));
    },
    close:()=>worker.terminate(),
  };
}
