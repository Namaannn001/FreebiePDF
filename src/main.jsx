import React, {useEffect, useRef, useState} from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import {all,byId,catalog,workflowTools} from './catalog.js';
import {guide} from './guides.js';
import {websiteFaq} from './site-content.js';
import * as seo from './seo-content.js';
import './style.css';

const href = id => id ? 'tools/'+id+'/' : './';
export const brandName=seo.brand?.name??'Anywhere PDF';
// Storage keys keep the legacy "freebiepdf.web.*" prefix so saved stars and workflows survive the rebrand.
const home={
  kind:'home',path:'',title:'Free Offline PDF Tools | '+brandName,
  meta:`Merge, split, compress, edit, and convert PDFs for free with ${all.length} browser-based tools. Files stay on your device and the tools work offline.`,
  h1:'PDF tools',hero:`Edit, merge, and convert PDFs free in your browser. Use all ${all.length} tools offline after the first visit.`,
  sections:[],...seo.home,
  faq:seo.home?.faq??websiteFaq,
};
const toolPages=all.map(tool=>{
  const content=seo.toolSeo?.[tool.id];
  const fallback=content?.steps&&content?.faq?null:guide(tool);
  return {
    kind:'tool',path:href(tool.id),tool,
    title:content?.title??`${tool.title} Online, Free | ${brandName}`,
    meta:content?.meta??`${tool.description} Use ${brandName} free in your browser. Works offline after the first visit.`,
    h1:content?.h1??tool.title,intro:content?.intro??tool.description,
    steps:content?.steps??fallback.steps,faq:content?.faq??fallback.questions,
    related:content?.related??(Object.values(catalog).find(list=>list.includes(tool))??[])
      .filter(entry=>entry.id!==tool.id).slice(0,3).map(entry=>[entry.id,entry.title]),
  };
});
const toolsById=new Map(toolPages.map(page=>[page.tool.id,page]));
const hubs=(seo.hubs??[]).map(hub=>({...hub,kind:'hub',path:hub.slug+'/'}));
const pageTitleKey=title=>title.trim().toLowerCase().replace(/\s+/g,' ');
const landingTitles=new Set([home,...toolPages,...hubs].map(page=>pageTitleKey(page.title)));
const guides=(seo.guides??[]).map(article=>({
  ...article,kind:'guide',path:'guides/'+article.slug+'/',
  // A distinct guide heading can disambiguate an editorial title shared with a tool.
  title:landingTitles.has(pageTitleKey(article.title))?`${article.h1} | ${brandName}`:article.title,
}));
export const pages=[home,...toolPages,...hubs,...guides];
const pagesByPath=new Map(pages.map(page=>[page.path,page]));
const categoryHubs=new Map(Object.entries(catalog).flatMap(([name,tools])=>{
  const preferred={'Organize':'organize-pdf','Edit & protect':'edit-pdf','Convert':'convert-pdf'}[name];
  const ids=new Set(tools.map(tool=>tool.id));
  // If there's no single category hub, pick the hub covering the most tools in this category.
  const coverage=hub=>(hub.toolIds??[]).filter(id=>ids.has(id)).length;
  const hub=hubs.find(hub=>hub.slug===preferred)??hubs.filter(hub=>coverage(hub)>0).sort((a,b)=>coverage(b)-coverage(a))[0];
  return hub?[[name,hub]]:[];
}));
export function breadcrumbs(page){
  if(page===home)return [];
  const category=page.tool&&Object.keys(catalog).find(name=>catalog[name].includes(page.tool));
  const hub=page.tool&&(categoryHubs.get(category)?.toolIds?.includes(page.tool.id)
    ?categoryHubs.get(category):hubs.find(hub=>hub.toolIds?.includes(page.tool.id)));
  return [{path:'',name:'All tools'},...(hub?[{path:hub.path,name:hub.h1}]:[]),{path:page.path,name:page.h1}];
}

function browserRoute(){
  const base=new URL(document.baseURI);
  const path=location.pathname.slice(base.pathname.length).replace(/(^|\/)index\.html$/,'$1');
  return path&& !path.endsWith('/')?path+'/':path;
}

function redirectLegacyHash(){
  if(!location.hash.startsWith('#/'))return false;
  const tool=byId.get(location.hash.slice(2));
  if(!tool)return false;
  const target=new URL(href(tool.id),document.baseURI);
  target.search=location.search;
  location.replace(target.href);
  return true;
}
const initial=fields=>Object.fromEntries(fields.filter(field=>field.choices).map(field=>[field.key,field.choices[0]]));
const load=(key,fallback)=>{
  try {
    const saved=localStorage.getItem(key);
    if(saved!==null)return JSON.parse(saved)??fallback;
    // Preserve preferences for users upgrading from the previous website name.
    const previous=localStorage.getItem(key.replace(/^freebiepdf\./,'paperdesk.'));
    return previous===null?fallback:JSON.parse(previous)??fallback;
  } catch {return fallback;}
};
const store=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
// Some browsers return no voices until 'voiceschanged' fires, so wait briefly for them.
function speechVoices(){
  const synth=window.speechSynthesis;
  if(!synth)return Promise.resolve([]);
  if(synth.getVoices().length)return Promise.resolve(synth.getVoices());
  return new Promise(resolve=>{
    const done=()=>{clearTimeout(timer);synth.removeEventListener('voiceschanged',done);resolve(synth.getVoices());};
    const timer=setTimeout(done,2000);
    synth.addEventListener('voiceschanged',done);
  });
}
// Split text on sentence or word boundaries so each utterance stays well under Chrome's ~15s cutoff.
function speechChunks(text,max=200){
  const chunks=[];
  for(let rest=text.trim();rest;){
    if(rest.length<=max){chunks.push(rest);break;}
    const head=rest.slice(0,max);
    const sentence=[...head.matchAll(/[.!?]\s/g)].pop();
    const space=head.search(/\s\S*$/);
    const cut=sentence?sentence.index+1:space>0?space:max;
    chunks.push(rest.slice(0,cut).trim());
    rest=rest.slice(cut).trim();
  }
  return chunks;
}
export function offlineLabel(kind,onLine){
  if(kind==='unsupported')return 'Browser processing';
  if(!onLine)return 'Offline';
  return kind==='ready'?'Ready offline':'Preparing offline cache';
}
export function confirmOfflineCache(worker,timeout=5000){
  const id=crypto.randomUUID();
  return new Promise(resolve=>{
    const timer=setTimeout(finish,timeout,false);
    function finish(ok){
      clearTimeout(timer);
      navigator.serviceWorker.removeEventListener('message',onMessage);
      resolve(ok===true);
    }
    function onMessage(event){
      if(event.data?.type!=='anywherepdf-cache-status'||event.data.id!==id)return;
      finish(event.data.ok===true);
    }
    navigator.serviceWorker.addEventListener('message',onMessage);
    try{worker.postMessage({type:'anywherepdf-cache-check',id});}
    catch{finish(false);}
  });
}
export function watchOffline(setState){
  let cancel=false,generation=0;
  const show=kind=>{if(!cancel)setState(offlineLabel(kind,navigator.onLine));};
  async function confirm(){
    const gen=++generation;
    if(!('serviceWorker' in navigator)||!import.meta.env.PROD){show('unsupported');return;}
    try{
      const registration=await navigator.serviceWorker.register(new URL('./sw.js',document.baseURI));
      await navigator.serviceWorker.ready;
      if(cancel||gen!==generation)return;
      const worker=navigator.serviceWorker.controller||registration.active;
      if(!worker){show('preparing');return;}
      const ready=await confirmOfflineCache(worker);
      if(cancel||gen!==generation)return;
      show(ready?'ready':'preparing');
    }catch{if(!cancel&&gen===generation)show('unsupported');}
  }
  function offline(){if(!cancel)setState('Offline');}
  function start(){
    window.addEventListener('online',confirm);
    navigator.serviceWorker?.addEventListener('controllerchange',confirm);
    confirm();
  }
  if(document.readyState==='complete')start();
  else window.addEventListener('load',start,{once:true});
  window.addEventListener('offline',offline);
  return ()=>{
    cancel=true;
    window.removeEventListener('load',start);
    window.removeEventListener('online',confirm);
    window.removeEventListener('offline',offline);
    navigator.serviceWorker?.removeEventListener('controllerchange',confirm);
  };
}
// Only a voice with localService===true is used. Remote voices stay unused so playback works offline and audio is not sent off-device.
export function beginReadAloud({text,voices,synth,Utterance,session,utterances,alive,onComplete,onStop}){
  const local=(voices??[]).filter(voice=>voice.localService===true);
  if(!synth||typeof Utterance!=='function'||!local.length)return {error:'No local speech voice is available on this device. Read aloud will not use a remote voice.'};
  if(!String(text??'').trim())return {error:'This PDF has no searchable text to read aloud.'};
  const voice=local.find(item=>item.lang?.toLowerCase().startsWith('en'))??local[0];
  const id=session.current;
  const parts=speechChunks(String(text));
  const queued=parts.map((part,index)=>{
    const utterance=new Utterance(part);
    utterance.voice=voice;
    utterance.onend=()=>{
      if(session.current!==id)return;
      const at=utterances.current.indexOf(utterance);
      if(at>=0)utterances.current.splice(at,1);
      if(index===parts.length-1&&alive())onComplete();
    };
    utterance.onerror=()=>{
      if(session.current!==id)return;
      session.current+=1;
      utterances.current=[];
      synth.cancel();
      if(alive())onStop();
    };
    return utterance;
  });
  utterances.current=queued;
  for(const utterance of queued)synth.speak(utterance);
  return {ok:true,voice};
}
export function drawerFocusables(panel){
  if(!panel?.querySelectorAll)return [];
  return [...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')]
    .filter(el=>el.tabIndex!==-1&&!el.hasAttribute?.('disabled')&&!el.closest?.('[hidden]'));
}
export function DrawerScrim({onClose}){
  return <button className="sidebar-scrim" type="button" tabIndex={-1} aria-hidden="true" onMouseDown={event=>event.preventDefault()} onClick={onClose}/>;
}
export function openMobileDrawer(panel){
  panel?.setAttribute('role','dialog');
  panel?.setAttribute('aria-modal','true');
  panel?.setAttribute('aria-label','Workspace navigation');
}
export function closeMobileDrawer(panel){
  panel?.removeAttribute('role');
  panel?.removeAttribute('aria-modal');
}
export function trapDrawerTab(event,panel){
  if(event.key!=='Tab'||!panel)return;
  const items=drawerFocusables(panel);
  const active=document.activeElement;
  if(!items.length){event.preventDefault();return;}
  const first=items[0],last=items.at(-1);
  const outside=!panel.contains(active);
  if(event.shiftKey&&(active===first||outside)){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(active===last||outside)){event.preventDefault();first.focus();}
}

function useOffline(){
  // Start empty so prerendered HTML carries no status text; the effect sets the real label.
  const [state,setState]=useState('');
  useEffect(()=>watchOffline(setState),[]);
  return state;
}

const categoryColors = {'Organize':'violet','Edit & protect':'rose','Convert':'blue','Business':'amber'};
const categoryMarks = {'Organize':'▤','Edit & protect':'◇','Convert':'⇄','Business':'▦'};
const pinned = ['merge-pdf','split-pdf','compress-pdf','ocr-pdf'];
const quickActions=[['merge-pdf','Merge PDF'],['compress-pdf','Compress PDF'],['pdf-to-word','PDF to Word']];
const popular=[quickActions[0],['split-pdf','Split PDF'],quickActions[1],quickActions[2],['pdf-to-jpg','PDF to JPG'],
  ['images-to-pdf','JPG to PDF'],['word-to-pdf','Word to PDF'],['ocr-pdf','OCR PDF'],['encrypt-pdf','Protect PDF'],
  ['unlock-pdf','Unlock PDF'],['rotate-pdf','Rotate PDF'],['page-numbers','Add page numbers to PDF']];
const toolLinks=(ids=[])=>ids.filter(id=>toolsById.has(id)).map(id=>[id,toolsById.get(id).h1]);

function Sidebar({page,filter,favorites,visible,close,drawer}){
  const sideLink=path=>page.path===path?'side-link current':'side-link';
  const current=path=>page.path===path?'page':undefined;
  return <aside id="workspace-sidebar" ref={drawer} className={'sidebar'+(visible?' sidebar-open':'')} aria-label="Workspace sidebar">
    <div className="sidebar-brand"><a className="brand" href={href()}><img src="logo.svg" width="34" height="34" alt=""/>{brandName}</a>
      <button className="mobile-close icon-button" type="button" aria-label="Close navigation" onClick={close}>×</button></div>
    <nav aria-label="Workspace navigation">
    <div className="nav-block"><p className="nav-label">Workspace</p>
      <a className={sideLink('')} aria-current={current('')} href={href()}><span aria-hidden="true">◫</span>All tools</a>
      <a className={'side-link'+(page===home&&filter==='Starred'?' current':'')} href="./?view=starred#catalog"><span aria-hidden="true">☆</span>Starred<span className="side-count">{favorites.length||''}</span></a>
    </div>
    {categoryHubs.size>0&&<div className="nav-block"><p className="nav-label">Categories</p>
      {[...categoryHubs].map(([name,hub])=><a className={sideLink(hub.path)} aria-current={current(hub.path)} href={hub.path} key={name}>
        <span aria-hidden="true">{categoryMarks[name]}</span>{name}
      </a>)}
    </div>}
    <div className="nav-block nav-quick"><p className="nav-label">Quick access</p>
      {pinned.map(id=><a className={sideLink(href(id))} aria-current={current(href(id))} href={href(id)} key={id}><span aria-hidden="true">·</span>{byId.get(id).title}</a>)}
    </div>
    </nav>
    <div className="sidebar-foot"><span className="privacy-mark" aria-hidden="true">◈</span><div><strong>On-device processing</strong><small>Files stay in your browser.</small></div></div>
  </aside>;
}

function Breadcrumbs({page}){
  const trail=breadcrumbs(page);
  return trail.length>0&&<nav className="breadcrumbs" aria-label="Breadcrumb"><ol>
    {trail.map(({path,name},index)=><li key={path}>{index===trail.length-1
      ?<span aria-current="page">{name}</span>:<a href={path||href()}>{name}</a>}</li>)}
  </ol></nav>;
}

function ContentSections({sections=[]}){
  return sections.map(({heading,body})=><section className="content-section" key={heading}>
    <h2>{heading}</h2>{body?.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
  </section>);
}

function Faq({items,id,title='Questions & answers',firstOpen=false}){
  if(!items?.length)return null;
  return <section id={id} className={'help-panel faq'+(id?' site-faq':'')}>
    <h2>{title}</h2>
    {items.map(([question,answer],index)=><details key={question} open={firstOpen&&index===0?true:undefined}>
      <summary>{question}</summary><p>{answer}</p>
    </details>)}
  </section>;
}

function ToolLinks({items}){
  return <ul className="link-list">{items.filter(([id])=>byId.has(id)).map(([id,anchor])=><li key={id}><a href={href(id)}>{anchor}</a></li>)}</ul>;
}

function PageLinks({items}){
  return <ul className="link-list">{items.map(page=><li key={page.path}><a href={page.path}>{page.h1}</a></li>)}</ul>;
}

function Dashboard({favorites,toggle,filter,setFilter}){
  const [query,setQuery]=useState('');
  const search=useRef(null);
  const popularCopy=home.sections?.find(section=>section.heading==='Popular PDF tools');
  const otherSections=home.sections?.filter(section=>section!==popularCopy);
  useEffect(()=>{
    function shortcut(event){
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search.current?.focus();}
    }
    document.addEventListener('keydown',shortcut);
    return ()=>document.removeEventListener('keydown',shortcut);
  },[]);
  const groups=Object.entries(catalog).map(([name,list])=>[
    name,list.filter(tool=>(filter!=='Starred'||favorites.includes(tool.id))&&[tool.title,tool.description,tool.id].join(' ').toLowerCase().includes(query.trim().toLowerCase())),
  ]).filter(([,list])=>list.length);
  const count=groups.reduce((sum,[,list])=>sum+list.length,0);
  return <>
    <section className="hero">
      <div className="hero-content"><h1>{home.h1}</h1><p>{home.hero}</p>
        <label className="searchbox"><span aria-hidden="true" className="search-icon"/><span className="sr-only">Find a tool</span><input ref={search} type="search" placeholder="Search PDF tools" value={query} onChange={event=>setQuery(event.target.value)}/><kbd aria-hidden="true">Ctrl K</kbd></label>
      </div>
      <div className="quick-panel"><h2>Quick actions</h2>{quickActions.map(([id,label])=><a key={id} href={href(id)}>{label}</a>)}</div>
    </section>
    <ContentSections sections={otherSections?.slice(0,1)}/>
    <section className="content-section"><h2>Popular PDF tools</h2>
      {popularCopy?.body?.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
      <ToolLinks items={popular}/>
    </section>
    <section id="catalog" aria-labelledby="catalog-title">
      <div className="catalog-heading"><h2 id="catalog-title">{query.trim()?'Search results':'Tool library'}</h2><p>{count} {count===1?'tool':'tools'}</p></div>
      <div className="filter-nav" role="group" aria-label="Filter tools">{['All tools','Starred'].map(name=><button type="button" aria-pressed={filter===name} key={name} onClick={()=>setFilter(name)}>{name}</button>)}</div>
      {groups.map(([category,list])=>{
        const hub=categoryHubs.get(category);
        return <section className="group" key={category}><div className="group-heading"><span className={'category-icon '+categoryColors[category]} aria-hidden="true">{categoryMarks[category]}</span><h3>{hub?<a href={hub.path}>{category}</a>:category}</h3></div><div className="grid">
        {list.map(tool=><div className="tool-tile" key={tool.id}>
          <a className="card" href={href(tool.id)} aria-labelledby={'card-'+tool.id}><div className="card-top"><span className={'tool-icon '+categoryColors[category]} aria-hidden="true">{categoryMarks[category]}</span><span className="format">{tool.format}</span></div><strong id={'card-'+tool.id}>{tool.title}</strong><span>{tool.description}</span></a>
          <button className="favorite icon-button" type="button" aria-label={(favorites.includes(tool.id)?'Unstar ':'Star ')+tool.title} aria-pressed={favorites.includes(tool.id)} onClick={()=>toggle(tool.id)}>{favorites.includes(tool.id)?'★':'☆'}</button>
        </div>)}
      </div></section>;})}
      {!groups.length&&<div className="empty-state"><strong>{filter==='Starred'&&!query?'No starred tools yet':'No matching tools'}</strong><p>{filter==='Starred'&&!query?'Star a tool to save it here.':'Try a different search term or category.'}</p></div>}
    </section>
    <ContentSections sections={otherSections?.slice(1)}/>
    <Faq id="common-questions" title={`${brandName} FAQ`} items={home.faq} firstOpen/>
  </>;
}

function ToolGuide({page}){
  const {tool,steps,faq,related}=page;
  const articles=guides.filter(article=>article.toolIds?.includes(tool.id));
  return <div className="tool-help">
    <section className="help-panel" aria-labelledby="how-title"><div className="section-label"><span aria-hidden="true">↳</span><h2 id="how-title">How to use it</h2></div>
      <ol className="steps">{steps.map(step=><li key={step}>{step}</li>)}</ol>
      <div className="output-note"><strong>Output</strong><span>{tool.format}</span></div>
    </section>
    <Faq items={faq}/>
    <a href="./#common-questions">Questions about privacy and offline use</a>
    {related.length>0&&<section className="help-panel related"><h2>Related tools</h2><ToolLinks items={related}/></section>}
    {articles.length>0&&<section className="help-panel related"><h2>Guides</h2><PageLinks items={articles}/></section>}
  </div>;
}

function ContentPage({page}){
  const links=toolLinks(page.toolIds);
  const articles=page.kind==='hub'?guides.filter(article=>article.toolIds?.some(id=>page.toolIds?.includes(id))):[];
  return <article className="editorial">
    <header className="tool-intro"><h1>{page.h1}</h1><p>{page.intro}</p></header>
    {page.kind==='guide'&&links.length>0&&<p><a href={href(links[0][0])}>Open {links[0][1]}</a></p>}
    {page.body?.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
    <ContentSections sections={page.sections}/>
    {links.length>0&&<section className="content-section"><h2>{page.kind==='hub'?'PDF tools':'Tools in this guide'}</h2>
      {page.kind==='hub'?<ul className="hub-tools">{links.map(([id,anchor])=><li key={id}><a href={href(id)}>{anchor}</a><p>{byId.get(id).description}</p></li>)}</ul>:<ToolLinks items={links}/>}
    </section>}
    <Faq items={page.faq}/>
    {articles.length>0&&<section className="content-section"><h2>Guides</h2><PageLinks items={articles}/></section>}
  </article>;
}

function SiteFooter(){
  return <footer>
    <nav aria-label="Site links">
      <div><h2>Popular tools</h2><ToolLinks items={popular}/></div>
      {hubs.length>0&&<div><h2>PDF tool collections</h2><PageLinks items={hubs}/></div>}
      {guides.length>0&&<div><h2>Guides</h2><PageLinks items={guides}/></div>}
    </nav>
    <span>{brandName} · {all.length} tools</span><a href="./#common-questions">Privacy and offline access</a>
  </footer>;
}

function Field({field,value,onChange}){
  const {label,type,choices,placeholder}=field;
  return <label>{label}{
    choices?<select value={value??choices[0]} onChange={event=>onChange(event.target.value)}>{choices.map(choice=><option key={choice}>{choice}</option>)}</select>
    :type==='textarea'?<textarea value={value??''} placeholder={placeholder} onChange={event=>onChange(event.target.value)}/>
    :<input type={type} step={type==='number'?'any':undefined} value={value??''} placeholder={placeholder} onChange={event=>onChange(event.target.value)}/>
  }</label>;
}
const newStep=id=>({id,label:byId.get(id).title,...initial(byId.get(id).fields)});
function Workflow({steps,update}){
  return <div>
    {steps.map((step,index)=><div className="workflow-step" key={index}>
      <label>Operation<select value={step.id} onChange={event=>update(steps.map((prev,i)=>i===index?newStep(event.target.value):prev))}>
        {workflowTools.map(id=><option key={id} value={id}>{byId.get(id).title}</option>)}
      </select></label>
      {byId.get(step.id).fields.filter(field=>!['pages','password'].includes(field.key)).map(field=><Field key={field.key} field={field} value={step[field.key]} onChange={value=>update(steps.map((prev,i)=>i===index?{...prev,[field.key]:value}:prev))}/>)}
      <button type="button" disabled={steps.length===1} onClick={()=>update(steps.filter((_,i)=>i!==index))}>Remove</button>
    </div>)}
    <button type="button" disabled={steps.length>=8} onClick={()=>update([...steps,newStep('rotate-pdf')])}>Add operation</button>
  </div>;
}

function Workspace({page}){
  const {tool}=page;
  const [queue,setQueue]=useState([]);
  const [options,setOptions]=useState(()=>initial(tool.fields));
  const [steps,setSteps]=useState(()=>tool.workflow?[newStep('rotate-pdf')]:[]);
  useEffect(()=>{
    if(!tool.workflow)return;
    const list=load('freebiepdf.web.workflow',[]);
    const saved=Array.isArray(list)?list.filter(item=>workflowTools.includes(item?.id)).slice(0,8).map(item=>({...newStep(item.id),preset:item.preset})):[];
    if(saved.length)setSteps(saved);
  },[tool.workflow]);
  const [busy,setBusy]=useState(false);
  const [drag,setDrag]=useState(false);
  const [status,setStatus]=useState('');
  const [error,setError]=useState(false);
  const [download,setDownload]=useState(null);
  const [speaking,setSpeaking]=useState(false);
  const running=useRef(false);
  const mounted=useRef(true);
  const speechSession=useRef(0);
  const speechUtterances=useRef([]);
  function stopSpeech(){
    speechSession.current+=1;
    speechUtterances.current=[];
    window.speechSynthesis?.cancel();
  }
  useEffect(()=>{
    mounted.current=true;
    return ()=>{mounted.current=false;stopSpeech();};
  },[]);
  useEffect(()=>()=>{if(download) URL.revokeObjectURL(download.url);},[download]);
  function add(incoming){
    if(running.current||!incoming.length)return;
    setQueue(current=>tool.multiple?[...current,...incoming]:incoming.slice(0,1));
  }
  function move(index,offset){
    setQueue(current=>{const next=[...current]; [next[index],next[index+offset]]=[next[index+offset],next[index]];return next;});
  }
  async function submit(event){
    event.preventDefault();
    if(running.current)return;
    setDownload(null);setError(false);
    stopSpeech();
    const speechGeneration=speechSession.current;
    setSpeaking(false);setStatus('Processing in this browser…');setBusy(true);running.current=true;
    try {
      const {runTool}=await import('./engine.js');
      if(tool.workflow)store('freebiepdf.web.workflow',steps.map(({id,preset})=>({id,preset})));
      const output=await runTool(tool.id,queue,{...options,steps},message=>{if(mounted.current)setStatus(message);});
      if(!mounted.current)return;
      if(output.speech!==undefined){
        const voices=await speechVoices();
        if(!mounted.current||speechSession.current!==speechGeneration)return;
        const result=beginReadAloud({
          text:output.speech,voices,synth:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance,
          session:speechSession,utterances:speechUtterances,alive:()=>mounted.current,
          onComplete:()=>{setSpeaking(false);setStatus('Playback complete.');},
          onStop:()=>{setSpeaking(false);setStatus('Playback stopped.');},
        });
        if(result.error)throw new Error(result.error);
        setSpeaking(true);setStatus('Reading aloud locally.');
      }else{
        setDownload({name:output.name,url:URL.createObjectURL(output.blob),isPdf:output.name.endsWith('.pdf')});
        setStatus(output.note||'Ready to download.');
      }
    } catch(err){
      if(mounted.current){setError(true);setStatus(err.message||'This file could not be processed.');}
    } finally {if(mounted.current)setBusy(false);running.current=false;}
  }
  return <section id="workspace">
    <div className="tool-intro"><h1>{page.h1}</h1><p id="tool-description">{page.intro}</p></div>
    <div className="tool-layout"><form className="editor-panel" onSubmit={submit}>
      <div className="editor-header"><div><h2>{tool.noFile?'Document details':'Your files'}</h2><p>{tool.noFile?'Fill in the fields below.':'Choose a file from this device to get started.'}</p></div><span className="format">{tool.format}</span></div>
      {!tool.noFile&&<label className={'drop'+(drag?' over':'')} onDragOver={event=>{event.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={event=>{event.preventDefault();setDrag(false);add([...event.dataTransfer.files]);}}>
        <input aria-label={tool.multiple?'Choose files':'Choose a file'} type="file" accept={tool.accept} multiple={tool.multiple} capture={tool.capture?'environment':undefined} disabled={busy} onChange={event=>{add([...event.target.files]);event.target.value='';}}/>
        <span className="upload-mark" aria-hidden="true">⇧</span><b>{tool.multiple?'Choose files':'Choose a file'}</b><span>or drag and drop here</span>
      </label>}
      <ul id="queue">{queue.map((file,index)=><li key={file.name+'-'+index}><span>{file.name} · {Math.max(1,Math.round(file.size/1024))} KB</span>
        {tool.multiple&&<><button type="button" disabled={busy||index===0} onClick={()=>move(index,-1)}>Up</button><button type="button" disabled={busy||index===queue.length-1} onClick={()=>move(index,1)}>Down</button></>}
        <button type="button" disabled={busy} onClick={()=>setQueue(queue.filter((_,i)=>i!==index))}>Remove</button>
      </li>)}</ul>
      <fieldset id="options" disabled={busy} hidden={!tool.fields.length&&!tool.workflow}>
        {tool.fields.map(field=><Field key={field.key} field={field} value={options[field.key]} onChange={value=>setOptions({...options,[field.key]:value})}/>)}
        {tool.workflow&&<Workflow steps={steps} update={setSteps}/>}
      </fieldset>
      <button className="primary" disabled={busy}>{busy?'Working…':tool.title}</button>
      <p id="status" role="status" className={error?'error':''}>{status}</p>
      {speaking&&<button type="button" onClick={()=>{stopSpeech();setSpeaking(false);setStatus('Playback stopped.');}}>Stop playback</button>}
      {download&&<div id="result"><a className="download-link" download={download.name} href={download.url}>Download {download.name}</a>
        {download.isPdf&&<iframe title="Result PDF preview" src={download.url}/>}</div>}
    </form><ToolGuide page={page}/></div>
  </section>;
}

export function App({serverRoute=''}={}){
  const page=pagesByPath.get(serverRoute)??{kind:'missing',path:serverRoute,h1:'Page not found'};
  const offline=useOffline();
  const [filter,setFilter]=useState('All tools');
  const [sidebar,setSidebar]=useState(false);
  const shell=useRef(null), menu=useRef(null), drawer=useRef(null);
  const [favorites,setFavorites]=useState([]);
  useEffect(()=>{
    const value=load('freebiepdf.web.starred',[]);
    if(Array.isArray(value))setFavorites(value);
    if(new URLSearchParams(location.search).get('view')==='starred')setFilter('Starred');
    if(location.hash==='#common-questions') document.getElementById('common-questions')?.scrollIntoView();
    window.addEventListener('hashchange',redirectLegacyHash);
    return ()=>window.removeEventListener('hashchange',redirectLegacyHash);
  },[]);
  useEffect(()=>{
    if(!sidebar)return;
    function escape(event){if(event.key==='Escape')setSidebar(false);}
    document.addEventListener('keydown',escape);
    return ()=>document.removeEventListener('keydown',escape);
  },[sidebar]);
  useEffect(()=>{
    // The drawer is an overlay only at narrow widths, so inert and focus handling apply only there.
    const narrow=window.matchMedia('(max-width: 720px)');
    if(!sidebar||!narrow.matches)return;
    const main=shell.current,panel=drawer.current;
    main?.setAttribute('inert','');
    openMobileDrawer(panel);
    panel?.querySelector('a[href],button')?.focus();
    function onTab(event){trapDrawerTab(event,panel);}
    function leave(){if(!narrow.matches)setSidebar(false);}
    document.addEventListener('keydown',onTab);
    narrow.addEventListener('change',leave);
    return ()=>{
      document.removeEventListener('keydown',onTab);
      narrow.removeEventListener('change',leave);
      closeMobileDrawer(panel);
      main?.removeAttribute('inert');
      if(panel?.contains(document.activeElement)||document.activeElement===document.body)menu.current?.focus();
    };
  },[sidebar]);
  function toggle(id){
    setFavorites(current=>{
      const next=current.includes(id)?current.filter(value=>value!==id):[...current,id];
      store('freebiepdf.web.starred',next);
      return next;
    });
  }
  return <div className="app-shell">
    <a className="skip-link" href={(page.path||href())+'#main-content'} inert={sidebar}>Skip to main content</a>
    {sidebar&&<DrawerScrim onClose={()=>setSidebar(false)}/>}
    <Sidebar page={page} filter={filter} favorites={favorites} visible={sidebar} close={()=>setSidebar(false)} drawer={drawer}/>
    <div className="main-shell" ref={shell}>
      <header className="topbar"><div><button className="menu-button icon-button" ref={menu} type="button" aria-label="Open navigation" aria-controls="workspace-sidebar" aria-expanded={sidebar} onClick={()=>setSidebar(!sidebar)}>☰</button><a href={href()}>Workspace</a></div><span className="local"><i/>{offline}</span></header>
      <main id="main-content" tabIndex={-1}>
        {page.kind==='missing'?<section className="empty-state"><h1>{page.h1}</h1><a href={href()}>Browse all tools</a></section>:<>
          <Breadcrumbs page={page}/>
          {page.kind==='home'?<Dashboard favorites={favorites} toggle={toggle} filter={filter} setFilter={setFilter}/>
            :page.kind==='tool'?<Workspace page={page}/>:<ContentPage page={page}/>}
        </>}
      </main>
      <SiteFooter/>
    </div>
  </div>;
}
if(typeof document!=='undefined'&&!redirectLegacyHash()){
  const root=document.getElementById('root');
  const app=<App serverRoute={root.dataset.route??browserRoute()}/>;
  if(root.hasChildNodes())hydrateRoot(root,app);
  else createRoot(root).render(app);
}
