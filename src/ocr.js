import {createWorker} from 'tesseract.js';
export async function createOcr(progress){
  const root=new URL(import.meta.env.BASE_URL,document.baseURI);
  const asset=path=>new URL('ocr/'+path,root).href;
  const worker=await createWorker('eng',1,{
    workerPath:asset('worker.min.js'),
    corePath:asset('tesseract-core-lstm.wasm.js'),
    langPath:asset(''),
    workerBlobURL:false,
    gzip:true,
    logger:message=>{if(message.status)progress(message.status+' '+Math.round((message.progress||0)*100)+'%');},
  });
  return {
    async recognize(canvas){
      const {data}=await worker.recognize(canvas,{}, {text:true,blocks:true});
      return (data.blocks??[]).flatMap(block=>block.paragraphs.flatMap(paragraph=>paragraph.lines.flatMap(line=>line.words)));
    },
    close:()=>worker.terminate(),
  };
}
