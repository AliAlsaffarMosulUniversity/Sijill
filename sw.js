'use strict';
const PREFIX='sijill-static:'+self.registration.scope+':';
const CACHE=PREFIX+'2.1.0-research';
const ASSETS=["./","index.html","pwa.js","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","vendor/face-api.min.js","models/face_landmark_68_model-shard1","models/face_landmark_68_model-weights_manifest.json","models/face_recognition_model-shard1","models/face_recognition_model-shard2","models/face_recognition_model-weights_manifest.json","models/tiny_face_detector_model-shard1","models/tiny_face_detector_model-weights_manifest.json"];
const URLS=ASSETS.map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(URLS))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys()){if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);}await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SIJILL_OFFLINE_CHECK'&&event.ports[0]){event.waitUntil((async()=>{const cache=await caches.open(CACHE);let count=0;for(const url of URLS){if(await cache.match(url))count++;}event.ports[0].postMessage({complete:count===URLS.length,count,total:URLS.length,version:CACHE});})());}});
self.addEventListener('fetch',event=>{const req=event.request;const url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin)return;
// Only this application's static allowlist is cached. No CSV, photos, descriptors or backups.
if(req.mode==='navigate'&&[new URL(self.registration.scope).pathname,new URL('index.html',self.registration.scope).pathname].includes(url.pathname)){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(new URL('index.html',self.registration.scope).href)||fetch(req);})());return;}
if(URLS.includes(url.href)){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(req)||fetch(req);})());}
});
