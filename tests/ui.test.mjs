// UI logic from src/main.jsx: drawer a11y, offline label, read-aloud, cache confirmation. No build needed.
import assert from 'node:assert/strict';
import {mkdirSync,symlinkSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {after,test} from 'node:test';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {root,tempDir} from './helpers.mjs';

const tmp=tempDir('anywherepdf-ui-');
after(tmp.cleanup);
const result=await build({
  absWorkingDir:root,
  entryPoints:['src/main.jsx'],
  bundle:true,
  format:'esm',
  platform:'node',
  write:false,
  outfile:join(tmp.dir,'ui.mjs'),
  logLevel:'silent',
  external:['react','react-dom','react-dom/client'],
  loader:{'.css':'empty'},
  define:{'import.meta.env.PROD':'true'},
  jsx:'automatic',
  plugins:[{name:'external-engine',setup(b){b.onResolve({filter:/engine\.js$/},()=>({path:'./engine.js',external:true}));}}],
});
// The bundle imports react from node_modules, so give the temp dir a link to the repo's copy.
symlinkSync(join(root,'node_modules'),join(tmp.dir,'node_modules'),'junction');
writeFileSync(join(tmp.dir,'ui.mjs'),result.outputFiles[0].text);
const ui=await import(pathToFileURL(join(tmp.dir,'ui.mjs')).href);
function check(name,actual,expected){
  assert.strictEqual(actual,expected,name);
}

test('drawer scrim and dialog attributes',()=>{
const scrim=renderToString(React.createElement(ui.DrawerScrim,{onClose(){}}));
check('scrim tabindex',scrim.includes('tabindex="-1"'),true);
check('scrim aria-hidden',scrim.includes('aria-hidden="true"'),true);
check('scrim not labeled as a stop',scrim.includes('aria-label'),false);

const attrs={};
const panel={
  setAttribute(key,value){attrs[key]=value;},
  removeAttribute(key){delete attrs[key];},
};
ui.openMobileDrawer(panel);
check('dialog role',attrs.role,'dialog');
check('aria-modal',attrs['aria-modal'],'true');
check('dialog label',attrs['aria-label'],'Workspace navigation');
ui.closeMobileDrawer(panel);
check('role removed',attrs.role,undefined);
check('modal removed',attrs['aria-modal'],undefined);
});

test('drawer focus trap',()=>{
function control(tabIndex,extra={}){
  return {tabIndex,disabled:!!extra.disabled,href:extra.href,
    focus(){document.activeElement=this;},
    hasAttribute(name){return name==='disabled'&&this.disabled;},
    closest(){return null;},
  };
}
const first=control(0,{href:'./'});
const middle=control(0);
const last=control(0);
const scrimStop=control(-1);
const drawer={
  nodes:[first,middle,last,scrimStop],
  querySelectorAll(){return this.nodes;},
  contains(node){return this.nodes.includes(node);},
};
globalThis.document={activeElement:first};
function press(shift,active){
  document.activeElement=active;
  let prevented=false;
  ui.trapDrawerTab({key:'Tab',shiftKey:shift,preventDefault(){prevented=true;}},drawer);
  return {prevented,active:document.activeElement};
}
const fromLast=press(false,last);
check('tab wraps to first',fromLast.active===first&&fromLast.prevented,true);
const fromFirst=press(true,first);
check('shift-tab wraps to last',fromFirst.active===last&&fromFirst.prevented,true);
const fromMiddle=press(false,middle);
check('tab inside stays',fromMiddle.prevented,false);
check('middle keeps focus',fromMiddle.active===middle,true);
const outside=press(false,{tabIndex:0,focus(){}});
check('outside tab enters first',outside.active===first&&outside.prevented,true);
check('negative tabindex excluded',ui.drawerFocusables(drawer).includes(scrimStop),false);
});

test('offline label text',()=>{
check('ready online','Ready offline',ui.offlineLabel('ready',true));
check('ready offline still says offline',ui.offlineLabel('ready',false),'Offline');
check('preparing',ui.offlineLabel('preparing',true),'Preparing offline cache');
check('preparing while offline',ui.offlineLabel('preparing',false),'Offline');
check('unsupported',ui.offlineLabel('unsupported',true),'Browser processing');
});

test('read aloud uses local voices only',()=>{
class Utterance{constructor(text){this.text=text;}}
function harness(voices,text='Hello world. '.repeat(40)){
  const session={current:2};
  const utterances={current:[]};
  const spoken=[];
  let cancelled=0;
  const events=[];
  const synth={speak(item){spoken.push(item);},cancel(){cancelled++;}};
  const result=ui.beginReadAloud({
    text,voices,synth,Utterance,session,utterances,alive:()=>true,
    onComplete:()=>events.push('complete'),
    onStop:()=>events.push('stopped'),
  });
  return {result,session,utterances,spoken,events,cancelled:()=>cancelled,synth};
}
const remote=harness([{localService:false,lang:'en-US'}],'Hello');
check('remote voice refused',remote.result.error?.includes('will not use a remote voice'),true);
check('remote voice not spoken',remote.spoken.length,0);
const truthy=harness([{localService:1,lang:'en-US'}],'Hello');
check('localService must be true',Boolean(truthy.result.error),true);
const mixed=harness([
  {localService:false,lang:'en-US'},
  {localService:true,lang:'de-DE'},
  {localService:true,lang:'en-GB'},
]);
check('local english voice',mixed.result.voice.lang,'en-GB');
check('utterances retained',mixed.utterances.current.length>1&&mixed.utterances.current[0]===mixed.spoken[0],true);
mixed.spoken[0].onend();
check('finished utterance released',mixed.utterances.current.includes(mixed.spoken[0]),false);
check('pending utterance retained',mixed.utterances.current.includes(mixed.spoken[1]),true);
mixed.spoken[1].onerror();
check('chunk error cancels',mixed.cancelled(),1);
check('chunk error clears queue',mixed.utterances.current.length,0);
check('chunk error status',mixed.events.at(-1),'stopped');
const before=mixed.events.length;
mixed.spoken.at(-1).onend();
check('cancelled callback ignored',mixed.events.length,before);
const empty=harness([{localService:true,lang:'en-US'}],'   ');
check('empty text',empty.result.error?.includes('searchable text'),true);
});

test('offline cache confirmation and status',async()=>{
const listeners=new Map();
function installNavigator({ok=true,hang=false,active=true,onLine=true}={}){
  listeners.clear();
  const worker={
    postMessage(data){
      if(hang)return;
      const event={data:{type:'anywherepdf-cache-status',id:data.id,ok}};
      for(const fn of [...(listeners.get('message')??[])])fn(event);
    },
  };
  Object.defineProperty(globalThis,'navigator',{configurable:true,writable:true,value:{
    onLine,
    serviceWorker:{
      ready:Promise.resolve(),
      controller:active?worker:null,
      async register(){return {active:active?worker:null};},
      addEventListener(type,fn){
        if(!listeners.has(type))listeners.set(type,new Set());
        listeners.get(type).add(fn);
      },
      removeEventListener(type,fn){listeners.get(type)?.delete(fn);},
    },
  }});
  globalThis.window={addEventListener(){},removeEventListener(){}};
  globalThis.document={readyState:"complete",baseURI:'https://example.com/app/'};
  return worker;
}
const readyWorker=installNavigator();
const confirmed=await ui.confirmOfflineCache(readyWorker,1000);
check('cache confirm true',confirmed,true);
installNavigator({ok:false});
check('cache confirm false',await ui.confirmOfflineCache(navigator.serviceWorker.controller,1000),false);
installNavigator({hang:true});
check('cache confirm timeout',await ui.confirmOfflineCache(navigator.serviceWorker.controller,30),false);

const states=[];
installNavigator({ok:true,onLine:true});
const stopReady=ui.watchOffline(value=>states.push(value));
await new Promise(resolve=>setTimeout(resolve,30));
check('ui ready only after cache confirm',states.at(-1),'Ready offline');
stopReady();

const preparing=[];
installNavigator({ok:false,onLine:true});
const stopPreparing=ui.watchOffline(value=>preparing.push(value));
await new Promise(resolve=>setTimeout(resolve,30));
check('incomplete cache is not ready',preparing.at(-1),'Preparing offline cache');
check('incomplete never said ready',preparing.includes('Ready offline'),false);
stopPreparing();

const offline=[];
installNavigator({ok:true,onLine:false});
const stopOffline=ui.watchOffline(value=>offline.push(value));
await new Promise(resolve=>setTimeout(resolve,30));
check('confirmed cache while offline',offline.at(-1),'Offline');
check('offline does not say ready',offline.includes('Ready offline'),false);
stopOffline();
});
