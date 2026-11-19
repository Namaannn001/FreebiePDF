self.onmessage=async({data})=>{
  const {bytes,password,text,encrypt}=data;
  const messages=[];
  try{
    importScripts('./qpdf.js');
    const runtime=await self.Module({noInitialRun:true,locateFile:()=>new URL('qpdf.wasm',self.location.href).href,
      print:value=>messages.push(value),printErr:value=>messages.push(value)});
    runtime.FS.writeFile('/input.pdf',new Uint8Array(bytes));
    const args=[...(password?['--password='+password]:[]),'/input.pdf'];
    if(encrypt){
      const owner=Array.from(crypto.getRandomValues(new Uint8Array(24)),byte=>byte.toString(16).padStart(2,'0')).join('');
      args.push('--encrypt',text,owner,'256','--');
    }else args.push('--decrypt');
    args.push('/output.pdf');
    runtime.callMain(args);
    const output=runtime.FS.readFile('/output.pdf');
    self.postMessage({output},[output.buffer]);
  }catch(error){
    self.postMessage({error:messages.some(line=>/password/i.test(line))
      ?'The PDF password is missing or incorrect.'
      :'The browser could not process this PDF’s encryption.'});
  }
};
