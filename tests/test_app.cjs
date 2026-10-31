const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert');
const {chromium}=require('playwright');
(async()=>{
process.chdir(path.resolve(__dirname,'..'));fs.mkdirSync('work',{recursive:true});const root=process.cwd();const requests=[];
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url==='/'?'/index.html':req.url));if(!f.startsWith(root+path.sep)&&f!==root){res.writeHead(403).end();return;}try{res.end(fs.readFileSync(f));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(8766,'127.0.0.1',r));
let browser;
try{
browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1360,height:1000}});const errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
await page.goto('http://127.0.0.1:8766');await page.waitForFunction(()=>document.getElementById('loadingOverlay').style.display==='none',{timeout:60000});
assert.equal(errors.length,0,errors.join(';'));
assert(requests.every(u=>u.startsWith('http://127.0.0.1:8766')));
const result=await page.evaluate(async()=>{
const check=(x,msg)=>{if(!x)throw Error(msg)};localStorage.clear();
const blank=document.createElement('canvas');blank.width=blank.height=160;
const blankDetections=await faceapi.detectAllFaces(blank,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();check(blankDetections.length===0,'blank image should have no detections');
const mk=(id,n)=>({id,name:id,descriptor:Array(128).fill(n),studentId:''});setStudents([mk('st_A',0),mk('st_B',0.2)]);
loopActive=true;document.getElementById('testCondition').value='real';document.getElementById('livenessOn').checked=false;
document.getElementById('rSession').value='S01';document.getElementById('rSubject').value='P001';document.getElementById('rDevice').value='SYNTHETIC TEST';researchRefresh();
const begin=(truth,expected='')=>{document.getElementById('rTruth').value=truth;document.getElementById('rExpected').value=expected;document.getElementById('rStart').click();check(!!researchTrial,'start failed')};
const det=n=>({descriptor:new Float32Array(128).fill(n)});
begin('genuine','st_A');check(document.getElementById('threshold').disabled,'threshold not locked');researchObserve([det(0)],10);check(researchRows().at(-1).outcome==='correct_accept','genuine');
begin('unknown');researchObserve([det(0)],10);check(researchRows().at(-1).outcome==='false_accept','false accept');
begin('unknown');researchObserve([det(0.8)],10);check(researchRows().at(-1).outcome==='correct_reject','unknown rejection');
begin('genuine','st_A');researchObserve([det(0.2)],10);check(researchRows().at(-1).outcome==='wrong_identity','wrong identity');
begin('genuine','st_A');researchObserve([],10);researchFinish('','no_face');check(researchRows().at(-1).outcome==='false_reject','no face');
begin('unknown');researchObserve([det(0),det(0.2)],10);check(researchRows().at(-1).outcome==='invalid','multiple faces');
document.getElementById('livenessOn').checked=true;
begin('genuine','st_A');researchObserve([det(0)],10);check(!!researchTrial,'liveness bypass');finishAttempt(getStudents()[0],'real','passed',['blink'],Date.now()-400,Date.now(),8,true);check(researchRows().at(-1).outcome==='correct_accept','liveness accept');
begin('genuine','st_A');finishAttempt(getStudents()[0],'real','timeout',['blink'],Date.now()-8000,Date.now(),8,true);check(researchRows().at(-1).outcome==='false_reject','timeout');
begin('genuine','st_A');liveState.st_A={...newLiveState(getStudents()[0],Date.now()-20000),frames:10};handleFace(getStudents()[0],{},Date.now(),true,'real',true);check(researchRows().at(-1).reason==='timeout','late liveness completion');
begin('unknown');researchFinish('','aborted');check(researchRows().at(-1).outcome==='invalid','aborted');
check(getAttendance().length===0,'research altered attendance');
const st={frames:0,earHist:[],yawHist:[],lastSeen:0};stepLiveness(st,{ear:.3,yaw:.5},10,false);check(st.frames===0,'unmatched identity advances challenge');
check(csvCell('=1+1').startsWith('"\''),'csv formula');check(csvCell('a"b')==='"a""b"','csv quotes');
const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await backupKey('long test passphrase',salt),data=new TextEncoder().encode('test');
const enc=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,data);const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,enc);check(new TextDecoder().decode(dec)==='test','crypto roundtrip');
let wrong=false;try{const bad=await backupKey('wrong passphrase',salt);await crypto.subtle.decrypt({name:'AES-GCM',iv},bad,enc)}catch{wrong=true}check(wrong,'wrong password accepted');
loopActive=false;
return {checks:18,rows:researchRows().length,modelsLoaded:true,actualBlankImageInference:true,notes:'Synthetic descriptor and decision-path tests, not participant accuracy or camera PAD evaluation'};
});
await page.screenshot({path:'work/app-test.png',fullPage:true});
fs.writeFileSync('work/test-results.json',JSON.stringify({...result,externalRequests:requests.filter(u=>!u.startsWith('http://127.0.0.1:8766')),pageErrors:errors},null,2));console.log(result);
}finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
