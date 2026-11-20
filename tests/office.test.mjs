// Excel/XLSX import: date, time and elapsed formats, date1904. No build needed.
import assert from 'node:assert/strict';
import {test} from 'node:test';
import JSZip from 'jszip';

function node(name){
  const el={name,attrs:{},children:[],text:''};
  el.getAttribute=key=>el.attrs[key]??null;
  el.getElementsByTagNameNS=(_ns,wanted)=>collect(el,wanted);
  Object.defineProperty(el,'textContent',{get(){return el.text+el.children.map(child=>child.textContent).join('');}});
  return el;
}
function collect(el,name){
  const out=[];
  for(const child of el.children){
    if(child.name===name)out.push(child);
    out.push(...collect(child,name));
  }
  return out;
}
function parseXml(xml){
  const root=node('#doc');
  root.querySelector=()=>null;
  const stack=[root];
  const re=/<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<\/([^\s>]+)>|<([^\s>/]+)([^>]*?)(\/?)>|([^<]+)/g;
  let match;
  while((match=re.exec(xml))){
    if(match[1]){stack.pop();continue;}
    if(match[2]){
      const el=node(match[2].split(':').pop());
      const attrs=/([\w:.-]+)="([^"]*)"/g;
      let attr;
      while((attr=attrs.exec(match[3])))el.attrs[attr[1]]=attr[2];
      stack.at(-1).children.push(el);
      if(match[4]!=='/')stack.push(el);
      continue;
    }
    if(match[5]&&match[5].trim())stack.at(-1).text+=match[5].trim();
  }
  return root;
}
globalThis.DOMParser=class{parseFromString(xml){return parseXml(xml);}};
const {officeImport}=await import('../src/office.js');

function sheetXml(cells){
  return '<?xml version="1.0"?><worksheet><sheetData>'+cells.map((cell,index)=>`<row r="${index+1}"><c r="A${index+1}" s="${cell.s}"><v>${cell.v}</v></c></row>`).join('')+'</sheetData></worksheet>';
}
async function read({date1904=false,numFmts=[],xfs,cells}){
  const zip=new JSZip();
  zip.file('xl/workbook.xml','<?xml version="1.0"?><workbook>'+(date1904?'<workbookPr date1904="1"/>':'')+'</workbook>');
  const fmts=numFmts.map(fmt=>`<numFmt numFmtId="${fmt.id}" formatCode="${fmt.code}"/>`).join('');
  zip.file('xl/styles.xml','<?xml version="1.0"?><styleSheet>'+(fmts?`<numFmts>${fmts}</numFmts>`:'')+`<cellXfs>${xfs.map(id=>`<xf numFmtId="${id}"/>`).join('')}</cellXfs></styleSheet>`);
  zip.file('xl/worksheets/sheet1.xml',sheetXml(cells));
  const bytes=await zip.generateAsync({type:'uint8array'});
  const text=await officeImport({name:'book.xlsx',arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)});
  return text.split('\n').slice(1);
}

function check(name,actual,expected){
  assert.strictEqual(actual,expected,name);
}

test('built-in date, time and elapsed formats',async()=>{
const builtin=await read({
  xfs:[14,21,46,20,22,45,47],
  cells:[
    {s:0,v:'43831'},
    {s:1,v:'0.5'},
    {s:2,v:'2.5'},
    {s:0,v:'60'},
    {s:3,v:'0.5'},
    {s:4,v:'43831.5'},
    {s:5,v:'0.5'},
    {s:6,v:'0.5'},
    {s:0,v:'-1'},
    {s:1,v:'-0.25'},
    {s:0,v:'2958466'},
  ],
});
check('43831 date',builtin[0],'2020-01-01');
check('0.5 hh:mm:ss',builtin[1],'12:00:00');
check('2.5 [h]:mm:ss',builtin[2],'60:00:00');
check('60 leap day',builtin[3],'1900-02-29');
check('time without seconds',builtin[4],'12:00');
check('date-time without seconds',builtin[5],'2020-01-01 12:00');
check('mm:ss includes hours and seconds',builtin[6],'12:00:00');
check('mmss.0',builtin[7],'12:00:00');
check('negative date left raw',builtin[8],'-1');
check('negative time left raw',builtin[9],'-0.25');
check('out of range left raw',builtin[10],'2958466');
});

test('date1904 workbooks',async()=>{
const nineteen=await read({
  date1904:true,
  xfs:[14],
  cells:[{s:0,v:'0'},{s:0,v:'60'},{s:0,v:'59'}],
});
check('date1904 zero',nineteen[0],'1904-01-01');
check('date1904 60 is not the fake leap day',nineteen[1],'1904-03-01');
check('date1904 real leap day',nineteen[2],'1904-02-29');
});

test('custom number formats',async()=>{
const custom=await read({
  numFmts:[
    {id:14,code:'hh:mm:ss'},
    {id:164,code:'0.00'},
    {id:165,code:'[h]:mm:ss'},
    {id:166,code:'yyyy-mm-dd hh:mm:ss'},
    {id:167,code:'yyyy-mm-dd hh:mm'},
  ],
  xfs:[14,164,165,166,167],
  cells:[
    {s:0,v:'0.5'},
    {s:1,v:'43831'},
    {s:2,v:'2.5'},
    {s:3,v:'43831.5'},
    {s:4,v:'43831.5'},
  ],
});
check('custom format overrides built-in 14',custom[0],'12:00:00');
check('numeric custom format stays raw',custom[1],'43831');
check('custom elapsed',custom[2],'60:00:00');
check('date-time with seconds',custom[3],'2020-01-01 12:00:00');
check('date-time without seconds',custom[4],'2020-01-01 12:00');
});
