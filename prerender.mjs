import { buildSync } from 'esbuild';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { all } from './src/catalog.js';
import { guide } from './src/guides.js';
import { websiteFaq } from './src/site-content.js';

const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
// Tool pages use a relative base. /tools/x and /tools/x/index.html both need to become /tools/x/ before any asset loads.
export const slashGuard="<script>if(!location.pathname.endsWith('/'))location.replace(location.pathname.replace(/\\/index\\.html$/,'').replace(/\\/?$/,'/')+location.search+location.hash);</script>";
export function homeHref(){
  const origin=siteRoot();
  return origin?origin.pathname:'/';
}
export function notFoundDocument(home=homeHref()){
  return '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | FreebiePDF</title>'
    +'<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#101010;color:#ededed;font:16px/1.5 system-ui,sans-serif;text-align:center}main{padding:24px}h1{font-size:1.5rem;margin:8px 0}a{color:#e0e0e0}</style>'
    +'</head><body><main><strong>FreebiePDF</strong><h1>Page not found</h1><p><a href="'+esc(home)+'">Back to all PDF tools</a></p></main></body></html>\n';
}
const homepageTitle='Free Offline PDF Tools | FreebiePDF';
const homepageDescription='Merge, split, compress, edit, and convert PDFs for free with 60 browser-based tools. Files stay on your device. FreebiePDF works offline after the first visit.';
const faqSchema=items=>({
  '@type':'FAQPage',
  mainEntity:items.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}})),
});

function siteRoot(){
  if(!process.env.SITE_URL?.trim())return null;
  const value=new URL(process.env.SITE_URL.trim());
  if(value.protocol!=='https:'||value.search||value.hash||value.username||value.password)
    throw new Error('SITE_URL must be the public HTTPS URL, without a query, fragment, or credentials.');
  value.pathname=value.pathname.replace(/\/?$/,'/');
  return value;
}

export async function prerender(root){
  const origin=siteRoot();
  const template=readFileSync(resolve(root,'index.html'),'utf8');
  const directory=mkdtempSync(resolve('.freebiepdf-render-'));
  const entry=resolve(directory,'app.mjs');
  try{
    const bundle=buildSync({
      entryPoints:['src/main.jsx'],bundle:true,format:'esm',platform:'node',write:false,
      loader:{'.css':'empty'},external:['react','react-dom/client','./engine.js'],
      define:{'import.meta.env.PROD':'false'},
    });
    writeFileSync(entry,bundle.outputFiles[0].text);
    const {App}=await import(pathToFileURL(entry).href);
    const pages=[{slug:'',path:'',title:homepageTitle,description:homepageDescription,faq:websiteFaq},
      ...all.map(tool=>({slug:tool.id,path:'tools/'+tool.id+'/',title:tool.title+' Online, Free | FreebiePDF',
        description:tool.description+' Use FreebiePDF free in your browser. Works offline after the first load.',
        faq:guide(tool).questions,tool}))];
    for(const page of pages){
      const base=page.slug?'../../':'./';
      const canonical=origin?new URL(page.path,origin).href:null;
      const software={'@type':'SoftwareApplication',name:page.tool?page.tool.title+' by FreebiePDF':'FreebiePDF',
        description:page.description,applicationCategory:'UtilitiesApplication',operatingSystem:'Web browser',
        isAccessibleForFree:true,offers:{'@type':'Offer',price:0,priceCurrency:'USD'},
        ...(canonical?{url:canonical}:{})};
      const schema={'@context':'https://schema.org','@graph':[software,faqSchema(page.faq),
        ...(!page.slug?[{'@type':'WebSite',name:'FreebiePDF',description:page.description,...(canonical?{url:canonical}:{})}]:[]),
        ...(canonical&&page.slug?[{'@type':'BreadcrumbList',itemListElement:[
          {'@type':'ListItem',position:1,name:'FreebiePDF',item:origin.href},
          {'@type':'ListItem',position:2,name:page.tool.title,item:canonical},
        ]}]:[])]};
      const tags=[
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="FreebiePDF">',
        '<meta property="og:title" content="'+esc(page.title)+'">',
        '<meta property="og:description" content="'+esc(page.description)+'">',
        '<meta name="twitter:card" content="'+(origin?'summary_large_image':'summary')+'">',
        '<meta name="twitter:title" content="'+esc(page.title)+'">',
        '<meta name="twitter:description" content="'+esc(page.description)+'">',
        ...(canonical?[
          '<link rel="canonical" href="'+esc(canonical)+'">',
          '<meta property="og:url" content="'+esc(canonical)+'">',
          '<meta property="og:image" content="'+esc(new URL('social-preview.png',origin).href)+'">',
          '<meta property="og:image:alt" content="FreebiePDF offline PDF tools">',
          '<meta name="twitter:image" content="'+esc(new URL('social-preview.png',origin).href)+'">',
        ]:[]),
        '<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>',
      ].join('\n');
      const markup=renderToString(React.createElement(App,{serverRoute:page.slug}));
      const html=template.replace(/<base href="[^"]*">/,'<base href="'+base+'">')
        .replace(/<title>[^<]*<\/title>/,'<title>'+esc(page.title)+'</title>')
        .replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+esc(page.description)+'">')
        .replace('<head>',()=>'<head>'+(page.slug?slashGuard:''))
        .replace('</head>',()=>tags+'\n</head>')
        .replace('<div id="root"></div>',()=>'<div id="root">'+markup+'</div>');
      const destination=resolve(root,page.path);
      mkdirSync(destination,{recursive:true});
      writeFileSync(resolve(destination,'index.html'),html);
    }
    writeFileSync(resolve(root,'404.html'),notFoundDocument(origin?origin.pathname:'/'));
    writeFileSync(resolve(root,'robots.txt'),'User-agent: *\nAllow: /\n'+(origin?'Sitemap: '+new URL('sitemap.xml',origin).href+'\n':''));
    if(origin){
      const items=pages.map(page=>'<url><loc>'+esc(new URL(page.path,origin).href)+'</loc></url>').join('\n');
      writeFileSync(resolve(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+items+'\n</urlset>\n');
    }
  } finally{
    if(existsSync(entry))unlinkSync(entry);
    rmdirSync(directory);
  }
}
