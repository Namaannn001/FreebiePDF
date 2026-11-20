export async function changePassword(file,{password='',text='',encrypt}){
  if(/\x00/.test(password+text))throw new Error('Passwords cannot contain a null character.');
  if(encrypt&&(!text||new TextEncoder().encode(text).length>127))throw new Error('Enter a new password between 1 and 127 UTF-8 bytes.');
  if(encrypt&&/^[@-]/.test(text))throw new Error('The new password cannot start with @ or -.');
  const bytes=await file.arrayBuffer();
  const worker=new Worker(new URL('qpdf/worker.js',new URL(import.meta.env.BASE_URL,document.baseURI)));
  try{
    const output=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('This PDF exceeded the processing time limit.')),45000);
      worker.onmessage=({data})=>{
        clearTimeout(timer);
        if(data.error)reject(new Error(data.error));
        else resolve(data.output);
      };
      worker.onerror=()=>{clearTimeout(timer);reject(new Error('The PDF encryption engine could not start.'));};
      worker.postMessage({bytes,password,text,encrypt},[bytes]);
    });
    return {name:encrypt?'encrypted.pdf':'unlocked.pdf',blob:new Blob([output],{type:'application/pdf'})};
  } finally {worker.terminate();}
}
