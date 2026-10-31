const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert');
const {chromium}=require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const root=path.resolve('outputs/Sijill');
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  if(!url.pathname.startsWith('/Sijill/')){res.writeHead(404).end();return;}
  const relative=decodeURIComponent(url.pathname.slice('/Sijill/'.length))||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png'};
  try{res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}
 });
 await new Promise(resolve=>server.listen(8767,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const context=await browser.newContext({viewport:{width:1360,height:1000}});
  const page=await context.newPage();const errors=[];const external=[];
  page.on('pageerror',e=>errors.push(e.message));
  context.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8767/'))external.push(r.url());});
  await page.goto('http://127.0.0.1:8767/Sijill/');
  await page.waitForFunction(()=>document.getElementById('loadingOverlay').style.display==='none',null,{timeout:90000});
  await page.getByRole('status').filter({hasText:'جاهز للعمل دون إنترنت'}).waitFor({timeout:90000});
  const initial=await page.evaluate(async()=>{
   const reg=await navigator.serviceWorker.ready;const cache=await caches.open('sijill-static:'+reg.scope+':2.1.0-research');
   const urls=(await cache.keys()).map(r=>r.url);const manifest=await fetch('manifest.webmanifest').then(r=>r.json());
   // Persist a synthetic pseudonym only. This is not participant data.
   localStorage.setItem('sijill_students_v1',JSON.stringify([{id:'pwa-test',name:'SYNTHETIC PWA TEST',descriptor:Array(128).fill(0),studentId:''}]));
   return {scope:reg.scope,urls,manifest,controlled:!!navigator.serviceWorker.controller};
  });
  assert(initial.scope.endsWith('/Sijill/'));assert(initial.controlled);
  assert.equal(initial.urls.length,15);assert(initial.urls.every(x=>x.includes('/Sijill/')));
  assert(!initial.urls.some(x=>/csv|backup|research_v2|students_v1/.test(x)));
  assert.equal(initial.manifest.display,'standalone');assert.equal(initial.manifest.start_url,'./');
  await page.getByRole('button',{name:'طريقة التثبيت وحماية البيانات',exact:true}).click();
  await page.getByRole('heading',{name:'تثبيت سجلّ والعمل دون إنترنت',exact:true}).waitFor();
  await page.getByRole('button',{name:'إغلاق',exact:true}).click();
  await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('loadingOverlay').style.display==='none',null,{timeout:90000});
  await page.getByRole('status').filter({hasText:'جاهز للعمل دون إنترنت'}).waitFor({timeout:20000});
  const offline=await page.evaluate(async()=>{
   const blank=document.createElement('canvas');blank.width=blank.height=160;
   const result=await faceapi.detectAllFaces(blank,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
   return {students:JSON.parse(localStorage.getItem('sijill_students_v1')),blankDetections:result.length,status:document.getElementById('networkState').textContent,modelsLoaded:true};
  });
  assert.equal(offline.students[0].id,'pwa-test');assert.equal(offline.blankDetections,0);assert(offline.status.includes('دون اتصال'));
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert(mobile.scroll<=mobile.width+1,JSON.stringify(mobile));
  await page.screenshot({path:'work/pwa-mobile-offline.png',fullPage:true});
  await page.setViewportSize({width:1360,height:1000});
  await page.screenshot({path:'work/pwa-desktop-offline.png',fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  const result={version:'2.1.0-research',staticAssets:initial.urls.length,subpathScope:true,offlineReload:true,modelsLoadedOffline:true,actualBlankInferenceOffline:true,syntheticRosterPreserved:true,mobileViewport:mobile,noPageErrors:true,noExternalRequests:true,limits:'Software checks on Edge desktop including a simulated mobile viewport. No physical mobile devices, participant accuracy or spoof resistance were tested.'};
  fs.writeFileSync('work/pwa-test-results.json',JSON.stringify(result,null,2));console.log(result);
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
