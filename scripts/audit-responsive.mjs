import {spawn} from 'node:child_process';
import {mkdtemp,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const profile=await mkdtemp('/tmp/kuhak-gradient-chrome-');
const chrome=spawn('google-chrome',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${profile}`]);
let ws;
try {
 const endpoint=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(Error('Chrome startup timeout')),15000);chrome.stderr.on('data',chunk=>{output+=chunk;const m=output.match(/DevTools listening on (ws:\/\/\S+)/);if(m){clearTimeout(timer);resolve(m[1]);}});chrome.on('error',reject);});
 ws=new WebSocket(endpoint);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 let id=0;const pending=new Map();const errors=[];const requests=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}};
 const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params,...(sessionId?{sessionId}:{})}));});
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});const call=(m,p)=>send(m,p,sessionId);
 await call('Page.enable');await call('Runtime.enable');await call('Network.enable');await call('Page.addScriptToEvaluateOnNewDocument',{source:`window.__auditCLS=0; new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__auditCLS+=e.value}).observe({type:'layout-shift',buffered:true});`});const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
 const reports=[];const issues=[];
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 const routes=[['/','home'],['/shakchunnir-badhon/','game'],['/shakchunnir-badhon/privacy.html','privacy'],['/404.html','404']];
 const viewports=[[320,740],[360,800],[390,844],[768,1024],[820,1180],[844,390],[1024,768],[1280,800],[1440,1000],[1920,1080]];
 for(const [route,name]of routes){
  for(const [width,height]of viewports){
   await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});
   await call('Page.navigate',{url:'http://127.0.0.1:4321'+route});
   for(let n=0;n<60;n++){await wait(50);if(await evaluate("document.readyState==='complete'&&!!document.querySelector('.language-toggle')"))break;}
   await evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')");
   await wait(100);
   for(const lang of ['en','bn']){
    await evaluate(`if(document.documentElement.lang!=='${lang}')document.querySelector('.language-toggle').click()`);
    const result=await evaluate(`(()=>{
      const width=innerWidth;
      const clipped=[...document.querySelectorAll('h1,h2,h3,p,.hero-content,.viewer-panel')].filter(e=>e.getClientRects().length&&e.clientWidth>0&&e.scrollWidth>e.clientWidth+2).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,70),client:e.clientWidth,scroll:e.scrollWidth}));
      const images=[...document.images].filter(i=>i.getClientRects().length).map(i=>({src:i.currentSrc.split('/').pop(),w:Math.round(i.getBoundingClientRect().width),h:Math.round(i.getBoundingClientRect().height),broken:i.complete&&!i.naturalWidth}));
      const header=document.querySelector('body>header');const links=header?[...header.querySelectorAll('nav>a,nav>div')].map(e=>e.getBoundingClientRect()).filter(r=>r.width):[];
      const navOverlap=links.some((r,i)=>i>0&&r.left<links[i-1].right-1);
      return {overflow:document.documentElement.scrollWidth>width+1,clipped,navOverlap,broken:images.filter(i=>i.broken),tinyImages:images.filter(i=>i.w<40&&i.h<40)};
    })()`);
    const entry={name,width,height,lang,...result};reports.push(entry);
    if(result.overflow||result.clipped.length||result.navOverlap||result.broken.length)issues.push(entry);
    if([320,768,1440].includes(width)&&lang==='en'){
      await evaluate("window.scrollTo({top:0,behavior:'instant'})");const shot=await call('Page.captureScreenshot',{format:'png'});await writeFile(`.astro/responsive-${name}-${width}.png`,Buffer.from(shot.data,'base64'));
      if(name==='home'){
       await evaluate("document.querySelector('footer').scrollIntoView({behavior:'instant',block:'end'})");const shot=await call('Page.captureScreenshot',{format:'png'});await writeFile(`.astro/responsive-footer-${width}.png`,Buffer.from(shot.data,'base64'));
      }
    }
   }
  }
 }
 const galleryChecks=[];
 for(const [width,height]of [[320,740],[390,844],[768,1024],[844,390],[1440,1000]]){
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});
  await call('Emulation.setTouchEmulationEnabled',{enabled:true});
  await call('Page.navigate',{url:'http://127.0.0.1:4321/shakchunnir-badhon/'});
  for(let n=0;n<60;n++){await wait(50);if(await evaluate("document.readyState==='complete'&&!!document.querySelector('.screenshot-viewer')"))break;}
  for(const lang of ['en','bn']){
   await evaluate(`if(document.documentElement.lang!=='${lang}')document.querySelector('.language-toggle').click()`);
   const result=await evaluate(`(async()=>{
    const link=document.querySelector('.screenshot-open');link.click();const dialog=document.querySelector('.screenshot-viewer');const image=dialog.querySelector('.viewer-image');await image.decode();
    const fits=[...dialog.querySelectorAll('button,.viewer-caption,.viewer-image')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.top>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1&&r.width>0&&r.height>0});
    dialog.querySelector('.viewer-next').click();const next=dialog.querySelector('.viewer-count').textContent.startsWith('2');
    dialog.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft'}));const keyboard=dialog.querySelector('.viewer-count').textContent.startsWith('1');
    image.dispatchEvent(new TouchEvent('touchstart',{touches:[new Touch({identifier:1,target:image,clientX:200,clientY:200})]}));
    image.dispatchEvent(new TouchEvent('touchend',{touches:[],changedTouches:[new Touch({identifier:1,target:image,clientX:80,clientY:205})]}));
    const swipe=dialog.querySelector('.viewer-count').textContent.startsWith('2');const uncropped=getComputedStyle(image).objectFit==='contain';dialog.querySelector('.viewer-close').click();
    const restored=!dialog.open&&!document.body.classList.contains('overflow-hidden')&&document.activeElement===link;
    const menu=document.querySelector('header details');let mobileMenu=true;if(innerWidth<768){menu.querySelector('summary').click();mobileMenu=menu.open;menu.querySelector('a[href="#screens"]').click();mobileMenu=mobileMenu&&!menu.open;}
    return {fits,next,keyboard,swipe,uncropped,restored,mobileMenu};
   })()`);
   galleryChecks.push({width,height,lang,...result});
   for(const [key,value]of Object.entries(result))assert(value,`Gallery ${width}×${height} ${lang}: ${key}`);
  }
 }
 await writeFile('.astro/responsive-audit.json',JSON.stringify({checked:reports.length,issues,errors,reports,galleryChecks},null,2));
 assert.equal(issues.length,0,'Responsive layout issues');assert.deepEqual(errors,[]);
 console.log(JSON.stringify({checked:reports.length,issues,errors,galleryChecks},null,2));
}finally{ws?.close();chrome.kill('SIGTERM');}
