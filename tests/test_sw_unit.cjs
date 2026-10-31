// Deterministic service-worker logic checks; these do not replace browser/device tests.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
(async()=>{
 const root=fs.existsSync('outputs/Sijill/sw.js')?'outputs/Sijill':'.';
 const scope='https://example.test/Sijill/';const prefix='sijill-static:'+scope+':';
 const stores=new Map();const listeners={};let networkCalls=0,reply;
 const cacheFor=name=>{if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return {addAll:async urls=>{for(const url of urls)m.set(url,{url,body:path.basename(url)});},match:async req=>m.get(typeof req==='string'?req:req.url)};};
 stores.set(prefix+'old',new Map());stores.set('another-app',new Map());stores.set('sijill-static:https://example.test/Other/:old',new Map());
 const sandbox={URL,Response,fetch:async()=>{networkCalls++;throw Error('NETWORK OFFLINE');},caches:{open:async n=>cacheFor(n),keys:async()=>[...stores.keys()],delete:async n=>stores.delete(n)},self:{registration:{scope},location:new URL(scope+'sw.js'),clients:{claim:async()=>{}},addEventListener:(name,fn)=>listeners[name]=fn}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),sandbox);
 let pending;listeners.install({waitUntil:p=>pending=p});await pending;
 const active=stores.get(prefix+'2.1.0-research');assert.equal(active.size,15);
 listeners.activate({waitUntil:p=>pending=p});await pending;
 assert(!stores.has(prefix+'old'));assert(stores.has('another-app'));assert(stores.has('sijill-static:https://example.test/Other/:old'));
 listeners.message({data:{type:'SIJILL_OFFLINE_CHECK'},ports:[{postMessage:r=>reply=r}],waitUntil:p=>pending=p});await pending;assert(reply.complete);assert.equal(reply.count,15);
 const respond=async req=>{let p;listeners.fetch({request:req,respondWith:x=>p=x});return p?await p:null;};
 const offlinePage=await respond({method:'GET',mode:'navigate',url:scope});assert.equal(offlinePage.body,'index.html');
 for(const filename of ['vendor/face-api.min.js','models/face_recognition_model-shard1']){const r=await respond({method:'GET',url:scope+filename});assert(r,filename);}
 assert.equal(networkCalls,0);
 assert.equal(await respond({method:'POST',url:scope+'index.html'}),null);
 assert.equal(await respond({method:'GET',url:scope+'private-backup.json'}),null);
 assert.equal(await respond({method:'GET',url:'https://other.test/index.html'}),null);
 active.delete(scope+'icon-192.png');listeners.message({data:{type:'SIJILL_OFFLINE_CHECK'},ports:[{postMessage:r=>reply=r}],waitUntil:p=>pending=p});await pending;assert(!reply.complete);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');
 for(const icon of manifest.icons){const bytes=fs.readFileSync(path.join(root,icon.src));const size=Number(icon.sizes.split('x')[0]);assert.equal(bytes.readUInt32BE(16),size);assert.equal(bytes.readUInt32BE(20),size);}
 console.log('PASS: cache completeness, offline shell/model/library responses, scope isolation, non-static exclusion, manifest and PNG dimensions. Simulated worker logic only.');
})().catch(e=>{console.error(e);process.exitCode=1});
