import JSZip from 'jszip';

const wordType='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const excelType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const slidesType='application/vnd.openxmlformats-officedocument.presentationml.presentation';
const scrub=value=>String(value).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'');
const xml=value=>scrub(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const declaration='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const office='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const relationships='http://schemas.openxmlformats.org/package/2006/relationships';
const workbookNs='http://schemas.openxmlformats.org/spreadsheetml/2006/main';

function nodes(parent,name){
  return [...parent.getElementsByTagNameNS('*',name)];
}
async function parsed(zip,path,required=true){
  const part=zip.file(path);
  if(!part){
    if(required) throw new Error('The document is missing '+path+'.');
    return null;
  }
  const bytes=await part.async('uint8array');
  if(bytes.length>32*1024*1024)throw new Error('An individual document part is too large.');
  const result=new DOMParser().parseFromString(new TextDecoder().decode(bytes),'application/xml');
  if(result.querySelector('parsererror'))throw new Error('A document part contains invalid XML.');
  return result;
}

// ECMA-376 built-in ids. A numFmt entry for the same id is a custom format and wins.
const builtInCodes={
  14:'m/d/yy',15:'d-mmm-yy',16:'d-mmm',17:'mmm-yy',
  18:'h:mm AM/PM',19:'h:mm:ss AM/PM',20:'h:mm',21:'h:mm:ss',
  22:'m/d/yy h:mm',45:'mm:ss',46:'[h]:mm:ss',47:'mmss.0',
};
function scanTokens(code){
  const tokens=[];
  for(let i=0;i<code.length;){
    const c=code[i];
    if(c==='"'){const end=code.indexOf('"',i+1);i=end<0?code.length:end+1;continue;}
    if(c==='\\'||c==='_'||c==='*'){i+=2;continue;}
    if(c==='['){
      const end=code.indexOf(']',i+1);
      const body=code.slice(i+1,end<0?code.length:end);
      if(/^h+$/i.test(body))tokens.push('[h]');
      else if(/^m+$/i.test(body))tokens.push('[m]');
      else if(/^s+$/i.test(body))tokens.push('[s]');
      i=end<0?code.length:end+1;
      continue;
    }
    if(/^am\/pm/i.test(code.slice(i))){i+=5;continue;}
    if(/^a\/p/i.test(code.slice(i))){i+=3;continue;}
    if(/[ymdhs]/i.test(c)){
      let j=i+1;
      while(j<code.length&&code[j].toLowerCase()===c.toLowerCase())j++;
      tokens.push(code.slice(i,j).toLowerCase());
      i=j;
      continue;
    }
    i++;
  }
  return tokens;
}
function describeFormat(code){
  if(!code)return null;
  const tokens=scanTokens(code);
  if(tokens.some(token=>token.startsWith('['))){
    return {kind:'elapsed',seconds:tokens.includes('[s]')||tokens.some(token=>token[0]==='s'),code};
  }
  const kinds=tokens.map((token,index)=>{
    if(token[0]!=='m')return token[0];
    if(token.length>=3)return 'M';
    const prev=tokens.slice(0,index).reverse().find(item=>/^[ymdhs]/.test(item[0]));
    const next=tokens.slice(index+1).find(item=>/^[ymdhs]/.test(item[0]));
    if((prev&&prev[0]==='h')||(next&&next[0]==='s'))return 'min';
    return 'M';
  });
  const date=kinds.some(kind=>kind==='y'||kind==='d'||kind==='M');
  const time=kinds.some(kind=>kind==='h'||kind==='min'||kind==='s');
  if(!date&&!time)return null;
  const seconds=kinds.includes('s');
  if(date&&time)return {kind:'datetime',seconds,code};
  if(date)return {kind:'date',seconds:false,code};
  return {kind:'time',seconds,code};
}
function dateStyles(styles){
  const dates=new Map();
  if(!styles)return dates;
  const formats=new Map(nodes(styles,'numFmt').map(fmt=>[Number(fmt.getAttribute('numFmtId')),fmt.getAttribute('formatCode')??'']));
  const xfs=nodes(styles,'cellXfs')[0];
  if(!xfs)return dates;
  nodes(xfs,'xf').forEach((xf,index)=>{
    const id=Number(xf.getAttribute('numFmtId')??0);
    const spec=describeFormat(formats.has(id)?formats.get(id):builtInCodes[id]);
    if(spec)dates.set(index,spec);
  });
  return dates;
}
const pad=value=>String(value).padStart(2,'0');
function clock(secs,seconds){
  const text=pad(Math.floor(secs/3600))+':'+pad(Math.floor(secs/60)%60);
  return seconds?text+':'+pad(secs%60):text;
}
function elapsed(total,spec){
  if(/\[h+\]/i.test(spec.code)){
    const hours=Math.floor(total/3600),mins=Math.floor(total/60)%60,secs=total%60;
    if(spec.seconds)return hours+':'+pad(mins)+':'+pad(secs);
    if(/m/i.test(spec.code.replace(/\[[^\]]*\]/g,'')))return hours+':'+pad(mins);
    return String(hours);
  }
  if(/\[m+\]/i.test(spec.code)){
    const mins=Math.floor(total/60);
    return spec.seconds?mins+':'+pad(total%60):String(mins);
  }
  return String(total);
}
function excelDay(days,date1904){
  if(days<0)return null;
  try{
    let iso;
    if(date1904)iso=new Date(Date.UTC(1904,0,1)+days*864e5).toISOString().slice(0,10);
    else if(days===60)iso='1900-02-29'; // Excel's 1900 system counts a non-existent leap day.
    else iso=new Date(Date.UTC(1899,11,days<60?31:30)+days*864e5).toISOString().slice(0,10);
    const year=Number(iso.slice(0,4));
    return year>=1&&year<=9999?iso:null;
  }catch{return null;}
}
function formatExcel(serial,date1904,spec){
  if(!spec||!Number.isFinite(serial)||serial<0||serial>=2958466)return null;
  const total=Math.round(serial*86400);
  if(!Number.isSafeInteger(total)||total<0)return null;
  const days=Math.floor(total/86400);
  const secs=total-days*86400;
  if(spec.kind==='time')return clock(secs,spec.seconds);
  if(spec.kind==='elapsed')return elapsed(total,spec);
  const date=excelDay(days,date1904);
  if(!date)return null;
  if(spec.kind==='date')return date;
  return date+' '+clock(secs,spec.seconds);
}

export async function officeImport(file){
  const ext=file.name.split('.').at(-1)?.toLowerCase();
  const zip=await JSZip.loadAsync(await file.arrayBuffer());
  if(ext==='docx'){
    const contents=await parsed(zip,'word/document.xml');
    return nodes(contents,'p').map(p=>nodes(p,'t').map(t=>t.textContent).join('')).join('\n');
  }
  if(ext==='xlsx'){
    const strings=await parsed(zip,'xl/sharedStrings.xml',false);
    const lookup=strings?nodes(strings,'si').map(si=>nodes(si,'t').map(n=>n.textContent).join('')):[];
    const paths=Object.keys(zip.files).filter(path=>/^xl\/worksheets\/sheet\d+\.xml$/.test(path)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
    const styles=await parsed(zip,'xl/styles.xml',false);
    const workbook=await parsed(zip,'xl/workbook.xml',false);
    const dates=dateStyles(styles);
    const date1904=['1','true'].includes(workbook&&nodes(workbook,'workbookPr')[0]?.getAttribute('date1904'));
    const sheets=[];
    for(const [i,path] of paths.entries()){
      const sheet=await parsed(zip,path);
      const rows=nodes(sheet,'row').map(row=>nodes(row,'c').map(cell=>{
        const value=nodes(cell,'v')[0]?.textContent??'';
        const type=cell.getAttribute('t');
        if(type==='s')return lookup[Number(value)]??'';
        if(type==='inlineStr')return nodes(cell,'t').map(node=>node.textContent).join('');
        const serial=Number(value);
        const spec=dates.get(Number(cell.getAttribute('s')));
        if((!type||type==='n')&&value!==''&&spec&&Number.isFinite(serial)){
          const formatted=formatExcel(serial,date1904,spec);
          if(formatted!==null)return formatted;
        }
        return value;
      }).join('  |  '));
      sheets.push('Sheet '+(i+1)+'\n'+rows.join('\n'));
    }
    return sheets.join('\n\n');
  }
  if(ext==='pptx'){
    const paths=Object.keys(zip.files).filter(path=>/^ppt\/slides\/slide\d+\.xml$/.test(path)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
    const slides=[];
    for(const [i,path] of paths.entries()){
      const slide=await parsed(zip,path);
      slides.push('Slide '+(i+1)+'\n'+nodes(slide,'p').map(p=>nodes(p,'t').map(t=>t.textContent).join('')).join('\n'));
    }
    return slides.join('\n\n');
  }
  if(ext==='epub'){
    const container=await parsed(zip,'META-INF/container.xml');
    const packagePath=nodes(container,'rootfile')[0]?.getAttribute('full-path');
    if(!packagePath)throw new Error('This EPUB has no package document.');
    const book=await parsed(zip,packagePath);
    const manifest=new Map(nodes(book,'item').map(item=>[item.getAttribute('id'),item.getAttribute('href')]));
    const chapters=[];
    for(const ref of nodes(book,'itemref')){
      const href=manifest.get(ref.getAttribute('idref'));
      if(!href)continue;
      const origin='https://local.invalid/';
      const target=new URL(href,new URL(packagePath,origin));
      if(target.origin!==new URL(origin).origin)continue;
      const chapter=await parsed(zip,decodeURIComponent(target.pathname).slice(1),false);
      if(chapter) chapters.push(nodes(chapter,'body')[0]?.textContent??'');
    }
    return chapters.join('\n\n');
  }
  throw new Error('Choose a DOCX, XLSX, PPTX, or EPUB file.');
}
function column(index){
  let name='';
  for(let i=index+1;i>0;i=Math.floor((i-1)/26))name=String.fromCharCode(65+(i-1)%26)+name;
  return name;
}
async function spreadsheet(sheets){
  const zip=new JSZip();
  zip.file('[Content_Types].xml',declaration+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'</Types>');
  zip.file('_rels/.rels',declaration+`<Relationships xmlns="${relationships}"><Relationship Id="rId1" Type="${office}/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  zip.file('xl/workbook.xml',declaration+`<workbook xmlns="${workbookNs}" xmlns:r="${office}"><sheets>`+sheets.map((_,i)=>`<sheet name="Page ${i+1}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>');
  zip.file('xl/_rels/workbook.xml.rels',declaration+`<Relationships xmlns="${relationships}">`+sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="${office}/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+'</Relationships>');
  sheets.forEach((rows,i)=>{
    const body=rows.slice(0,1048576).map((row,j)=>`<row r="${j+1}">`+row.slice(0,16384).map((cell,k)=>`<c r="${column(k)}${j+1}" t="inlineStr"><is><t xml:space="preserve">${xml(String(cell).slice(0,32767))}</t></is></c>`).join('')+'</row>').join('');
    zip.file('xl/worksheets/sheet'+(i+1)+'.xml',declaration+`<worksheet xmlns="${workbookNs}"><sheetData>`+body+'</sheetData></worksheet>');
  });
  const bytes=await zip.generateAsync({type:'uint8array',compression:'DEFLATE'});
  return {name:'document.xlsx',blob:new Blob([bytes],{type:excelType})};
}

export async function officeExport(id,texts,sheets){
  if(id==='pdf-to-excel')return spreadsheet(sheets);
  if(id==='pdf-to-word'){
    const {Document,Packer,Paragraph}=await import('docx');
    const children=texts.flatMap((text,i)=>scrub(text).split('\n').map((line,j)=>new Paragraph({text:line,pageBreakBefore:i>0&&j===0})));
    const doc=new Document({sections:[{children}]});
    return {name:'document.docx',blob:new Blob([await Packer.toBlob(doc)],{type:wordType})};
  }
  const {default:PptxGenJS}=await import('pptxgenjs');
  const ppt=new PptxGenJS();
  ppt.layout='LAYOUT_WIDE';
  for(const text of texts){
    const slide=ppt.addSlide();
    slide.addText(scrub(text),{x:.45,y:.4,w:12.4,h:6.6,fontSize:14,breakLine:false,fit:'shrink',valign:'top'});
  }
  const data=await ppt.write({outputType:'arraybuffer'});
  return {name:'document.pptx',blob:new Blob([data],{type:slidesType})};
}
