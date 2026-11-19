import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {all,byId,catalog,workflowTools} from './catalog.js';
import {guide} from './guides.js';
import {websiteFaq} from './site-content.js';
import './style.css';

const href = id => id ? 'tools/'+id+'/' : './';
const tag=()=>{
  if(location.hash.startsWith('#/'))return location.hash.slice(2);
  return location.pathname.match(/\/tools\/([a-z0-9-]+)(?:\/|\/index\.html)?$/)?.[1]??'';
};
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

function useRoute(serverRoute){
  const [route,setRoute]=useState(()=>typeof window==='undefined'?serverRoute:tag());
  useEffect(()=>{
    function change(){setRoute(tag());if(!location.hash||location.hash.startsWith('#/'))window.scrollTo(0,0);}
    window.addEventListener('hashchange',change);
    window.addEventListener('popstate',change);
    return ()=>{
      window.removeEventListener('hashchange',change);
      window.removeEventListener('popstate',change);
    };
  },[]);
  return route;
}

function useOffline(){
  const [state,setState]=useState(typeof window==='undefined'||navigator.onLine?'Preparing offline cache':'Offline');
  useEffect(()=>{
    function offline(){setState('Offline');}
    function ready(){setState(navigator.onLine?'Ready offline':'Offline');}
    if('serviceWorker' in navigator && import.meta.env.PROD){
      navigator.serviceWorker.register(new URL('./sw.js',document.baseURI)).then(async()=>{
        await navigator.serviceWorker.ready;
        ready();
      }).catch(()=>setState('Browser processing'));
    }else setState('Browser processing');
    window.addEventListener('online',ready);
    window.addEventListener('offline',offline);
    return ()=>{
      window.removeEventListener('online',ready);
      window.removeEventListener('offline',offline);
    };
  },[]);
  return state;
}

const categoryColors = {'Organize':'violet','Edit & protect':'rose','Convert':'blue','Business':'amber'};
const categoryMarks = {'Organize':'▤','Edit & protect':'◇','Convert':'⇄','Business':'▦'};
const pinned = ['merge-pdf','split-pdf','compress-pdf','ocr-pdf'];

function Sidebar({route,section,choose,favorites,visible,close}){
  return <aside className={'sidebar'+(visible?' sidebar-open':'')} aria-label="Workspace navigation">
    <div className="sidebar-brand"><a className="brand" href={href()} onClick={event=>choose('All tools',event)}><span className="logo-mark" aria-hidden="true"><i/><i/></span>FreebiePDF</a>
      <button className="mobile-close icon-button" type="button" aria-label="Close navigation" onClick={close}>×</button></div>
    <div className="nav-block"><p className="nav-label">Workspace</p>
      <a className={'side-link'+(!route&&section==='All tools'?' current':'')} href={href()} onClick={event=>choose('All tools',event)}><span aria-hidden="true">◫</span>All tools</a>
      <a className={'side-link'+(!route&&section==='Starred'?' current':'')} href={href()} onClick={event=>choose('Starred',event)}><span aria-hidden="true">☆</span>Starred<span className="side-count">{favorites.length||''}</span></a>
    </div>
    <div className="nav-block"><p className="nav-label">Categories</p>
      {Object.entries(catalog).map(([name,tools])=><a className={'side-link'+(!route&&section===name?' current':'')} href={href()} onClick={event=>choose(name,event)} key={name}>
        <span aria-hidden="true">{categoryMarks[name]}</span>{name}<span className="side-count">{tools.length}</span>
      </a>)}
    </div>
    <div className="nav-block nav-quick"><p className="nav-label">Quick access</p>
      {pinned.map(id=><a className={'side-link'+(id===route?' current':'')} href={href(id)} key={id} onClick={close}><span aria-hidden="true">·</span>{byId.get(id).title}</a>)}
    </div>
    <div className="sidebar-foot"><span className="privacy-mark" aria-hidden="true">◈</span><div><strong>On-device processing</strong><small>Files stay in your browser.</small></div></div>
  </aside>;
}

function Dashboard({favorites,toggle,filter,setFilter}){
  const [query,setQuery]=useState('');
  const search=useRef(null);
  useEffect(()=>{
    function shortcut(event){
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search.current?.focus();}
    }
    document.addEventListener('keydown',shortcut);
    return ()=>document.removeEventListener('keydown',shortcut);
  },[]);
  const categories=['All tools',...Object.keys(catalog),'Starred'];
  const groups=Object.entries(catalog).filter(([name])=>['All tools','Starred',name].includes(filter)).map(([name,list])=>[
    name,list.filter(tool=>(filter!=='Starred'||favorites.includes(tool.id))&&[tool.title,tool.description,tool.id].join(' ').toLowerCase().includes(query.trim().toLowerCase())),
  ]).filter(([,list])=>list.length);
  const count=groups.reduce((sum,[,list])=>sum+list.length,0);
  return <>
    <section className="hero">
      <div className="hero-content"><h1>PDF tools</h1><p>Edit, merge, and convert PDFs free in your browser. Use all 60 tools offline after the first load.</p>
        <label className="searchbox"><span aria-hidden="true" className="search-icon"/><span className="sr-only">Find a tool</span><input ref={search} type="search" placeholder="Search PDF tools" value={query} onChange={event=>setQuery(event.target.value)}/><kbd aria-hidden="true">Ctrl K</kbd></label>
      </div>
      <div className="quick-panel"><h2>Quick actions</h2>{pinned.slice(0,3).map(id=><a key={id} href={href(id)}><span className={'quick-mark '+id} aria-hidden="true"/><span>{byId.get(id).title}</span><span className="quick-format">{id==='split-pdf'?'ZIP / PDF':'PDF'}</span></a>)}</div>
    </section>
    <section id="catalog" aria-labelledby="catalog-title">
      <div className="catalog-heading"><h2 id="catalog-title">{query.trim()?'Search results':'Tool library'}</h2><p>{count} {count===1?'tool':'tools'}</p></div>
      <nav className="filter-nav" aria-label="Tool categories">{categories.map(name=><button type="button" aria-pressed={filter===name} key={name} onClick={()=>setFilter(name)}>{name}</button>)}</nav>
      {groups.map(([category,list])=><section className="group" key={category}><div className="group-heading"><span className={'category-icon '+categoryColors[category]} aria-hidden="true">{categoryMarks[category]}</span><h3>{category}</h3></div><div className="grid">
        {list.map(tool=><div className="tool-tile" key={tool.id}>
          <a className="card" href={href(tool.id)}><div className="card-top"><span className={'tool-icon '+categoryColors[category]} aria-hidden="true">{categoryMarks[category]}</span><span className="format">{tool.format}</span></div><strong>{tool.title}</strong><span>{tool.description}</span></a>
          <button className="favorite icon-button" type="button" aria-label={(favorites.includes(tool.id)?'Unstar ':'Star ')+tool.title} aria-pressed={favorites.includes(tool.id)} onClick={()=>toggle(tool.id)}>{favorites.includes(tool.id)?'★':'☆'}</button>
        </div>)}
      </div></section>)}
      {!groups.length&&<div className="empty-state"><strong>{filter==='Starred'&&!query?'No starred tools yet':'No matching tools'}</strong><p>{filter==='Starred'&&!query?'Star a tool to save it here.':'Try a different search term or category.'}</p></div>}
    </section>
    <section id="common-questions" className="site-faq help-panel faq" aria-labelledby="site-faq-title">
      <h2 id="site-faq-title">FreebiePDF FAQ</h2>
      <p className="faq-intro">How offline access, privacy, and file processing work.</p>
      {websiteFaq.map(([question,answer],index)=><details key={question} open={index===0?true:undefined}><summary>{question}</summary><p>{answer}</p></details>)}
    </section>
  </>;
}

function ToolGuide({tool}){
  const {steps,questions}=guide(tool);
  const related=(Object.values(catalog).find(list=>list.some(entry=>entry.id===tool.id))??[]).filter(entry=>entry.id!==tool.id).slice(0,3);
  return <div className="tool-help">
    <section className="help-panel" aria-labelledby="how-title"><div className="section-label"><span aria-hidden="true">↳</span><h2 id="how-title">How to use it</h2></div>
      <ol className="steps">{steps.map(step=><li key={step}>{step}</li>)}</ol>
      <div className="output-note"><strong>Output</strong><span>{tool.format}</span></div>
    </section>
    <section className="help-panel faq" aria-labelledby="faq-title"><div className="section-label"><span aria-hidden="true">?</span><h2 id="faq-title">Questions & answers</h2></div>
      {questions.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
    </section>
    {related.length>0&&<section className="help-panel related" aria-label="Related tools"><h2>Related tools</h2><div>{related.map(entry=><a href={href(entry.id)} key={entry.id}>{entry.title}</a>)}</div></section>}
  </div>;
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

function Workspace({tool}){
  const [queue,setQueue]=useState([]);
  const [options,setOptions]=useState(()=>initial(tool.fields));
  const [steps,setSteps]=useState(()=>{
    const list=load('freebiepdf.web.workflow',[]);
    const saved=Array.isArray(list)?list.filter(item=>workflowTools.includes(item?.id)).slice(0,8).map(item=>({...newStep(item.id),preset:item.preset})):[];
    return saved.length?saved:[newStep('rotate-pdf')];
  });
  const [busy,setBusy]=useState(false);
  const [drag,setDrag]=useState(false);
  const [status,setStatus]=useState('');
  const [error,setError]=useState(false);
  const [download,setDownload]=useState(null);
  const [speaking,setSpeaking]=useState(false);
  const running=useRef(false);
  const mounted=useRef(true);
  useEffect(()=>{
    mounted.current=true;
    return ()=>{mounted.current=false;window.speechSynthesis?.cancel();};
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
    window.speechSynthesis?.cancel();
    setSpeaking(false);setStatus('Processing in this browser…');setBusy(true);running.current=true;
    try {
      const {runTool}=await import('./engine.js');
      if(tool.workflow)store('freebiepdf.web.workflow',steps.map(({id,preset})=>({id,preset})));
      const output=await runTool(tool.id,queue,{...options,steps},message=>{if(mounted.current)setStatus(message);});
      if(!mounted.current)return;
      if(output.speech!==undefined){
        const voices=window.speechSynthesis?.getVoices().filter(voice=>voice.localService)??[];
        if(!voices.length||!output.speech.trim())throw new Error('A local speech voice and searchable PDF text are required.');
        const utterance=new SpeechSynthesisUtterance(output.speech);
        utterance.voice=voices.find(v=>v.lang.startsWith('en'))??voices[0];
        utterance.onend=()=>{if(mounted.current){setSpeaking(false);setStatus('Playback complete.');}};
        utterance.onerror=()=>{if(mounted.current){setSpeaking(false);setStatus('Playback stopped.');}};
        window.speechSynthesis.speak(utterance);
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
    <div className="tool-intro"><a className="backlink" href={href()}>All tools</a><span aria-hidden="true">/</span><span>{tool.title}</span>
      <h1>{tool.title}</h1><p id="tool-description">{tool.description}</p></div>
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
      {speaking&&<button type="button" onClick={()=>{window.speechSynthesis.cancel();setSpeaking(false);setStatus('Playback stopped.');}}>Stop playback</button>}
      {download&&<div id="result"><a className="download-link" download={download.name} href={download.url}>Download {download.name}</a>
        {download.isPdf&&<iframe title="Result PDF preview" src={download.url}/>}</div>}
    </form><ToolGuide tool={tool}/></div>
  </section>;
}

export function App({serverRoute=''}={}){
  const route=useRoute(serverRoute);
  const offline=useOffline();
  const [filter,setFilter]=useState(()=>load('freebiepdf.web.dashboard-filter','All tools'));
  const [sidebar,setSidebar]=useState(false);
  const [favorites,setFavorites]=useState(()=>{const value=load('freebiepdf.web.starred',[]);return Array.isArray(value)?value:[];});
  const tool=byId.get(route);
  useEffect(()=>{
    setSidebar(false);
    if(location.hash.startsWith('#/'))document.title=tool?tool.title+' | FreebiePDF':'Free Offline PDF Tools | FreebiePDF';
  },[tool]);
  useEffect(()=>{
    if(location.hash==='#common-questions') document.getElementById('common-questions')?.scrollIntoView();
  },[route]);
  useEffect(()=>{
    if(!sidebar)return;
    function escape(event){if(event.key==='Escape')setSidebar(false);}
    document.addEventListener('keydown',escape);
    return ()=>document.removeEventListener('keydown',escape);
  },[sidebar]);
  function toggle(id){
    setFavorites(current=>{
      const next=current.includes(id)?current.filter(value=>value!==id):[...current,id];
      store('freebiepdf.web.starred',next);
      return next;
    });
  }
  function choose(name,event){
    if(event&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey))return;
    setFilter(name);store('freebiepdf.web.dashboard-filter',name);setSidebar(false);
    if(event&&!route){event.preventDefault();window.scrollTo(0,0);}
  }
  return <div className="app-shell">
    {sidebar&&<button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={()=>setSidebar(false)}/>}
    <Sidebar route={route} section={filter} choose={choose} favorites={favorites} visible={sidebar} close={()=>setSidebar(false)}/>
    <div className="main-shell">
      <header className="topbar"><div><button className="menu-button icon-button" type="button" aria-label="Open navigation" aria-expanded={sidebar} onClick={()=>setSidebar(!sidebar)}>☰</button><a href={href()} onClick={event=>choose('All tools',event)}>Workspace</a>{tool&&<><span aria-hidden="true">/</span><strong>{tool.title}</strong></>}</div><span className="local"><i/>{offline}</span></header>
      <main>{tool?<Workspace key={route} tool={tool}/>:route?<section className="empty-state"><h1>Tool not found</h1><a href={href()}>Browse all tools</a></section>:<Dashboard favorites={favorites} toggle={toggle} filter={filter} setFilter={setFilter}/>}</main>
      <footer><span>FreebiePDF · {all.length} tools</span><span>Files are processed in your browser.</span></footer>
    </div>
  </div>;
}
if(typeof document!=='undefined')createRoot(document.getElementById('root')).render(<App/>);
