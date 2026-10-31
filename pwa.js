'use strict';
(()=>{
 const button=document.getElementById('installApp');const help=document.getElementById('installHelp');const state=document.getElementById('offlineState');const badge=document.getElementById('networkState');let offer=null;
 const installed=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 function sync(){button.textContent=installed()?'التطبيق مثبت':'تثبيت التطبيق';button.disabled=installed();badge.textContent=navigator.onLine?'متصل بالشبكة':'دون اتصال بالشبكة';}
 function showHelp(){if(help.showModal)help.showModal();else help.setAttribute('open','');}
 document.getElementById('installationGuide').addEventListener('click',showHelp);
 document.getElementById('closeInstallHelp').addEventListener('click',()=>{if(help.close)help.close();else help.removeAttribute('open');});
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();offer=event;sync();});
 window.addEventListener('appinstalled',()=>{offer=null;button.textContent='التطبيق مثبت';button.disabled=true;});
 window.addEventListener('online',sync);window.addEventListener('offline',sync);
 button.addEventListener('click',async()=>{if(!offer){showHelp();return;}const pending=offer;offer=null;await pending.prompt();await pending.userChoice;sync();});
 sync();
 if(!('serviceWorker' in navigator)||!isSecureContext){state.textContent='العمل دون إنترنت يتطلب HTTPS أو الخادم المحلي ومتصفحاً يدعم ذلك.';return;}
 state.textContent='جارٍ حفظ ملفات التشغيل والنماذج للعمل دون إنترنت… أبقِ الصفحة مفتوحة.';
 const ready=()=>navigator.serviceWorker.ready.then(reg=>{if(!reg.active)return;const channel=new MessageChannel();const timer=setTimeout(()=>{state.textContent='تعذر تأكيد اكتمال الحفظ. اتصل بالشبكة ثم أعد فتح التطبيق.';},15000);channel.port1.onmessage=event=>{clearTimeout(timer);const result=event.data;state.textContent=result.complete?'جاهز للعمل دون إنترنت: حُفظت ملفات التشغيل والنماذج ('+result.count+'/'+result.total+').':'الحفظ غير مكتمل؛ يلزم الاتصال بالشبكة وإعادة فتح التطبيق.';channel.port1.close();};reg.active.postMessage({type:'SIJILL_OFFLINE_CHECK'},[channel.port2]);});
 navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>{ready().catch(()=>{});const observe=worker=>{if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='redundant')state.textContent='تعذر حفظ بعض الملفات. تحقّق من الاتصال والمساحة ثم أعد فتح التطبيق.';});};observe(reg.installing);reg.addEventListener('updatefound',()=>observe(reg.installing));if(reg.waiting)state.textContent='يتوفر تحديث؛ أغلق كل نوافذ التطبيق ثم افتحه مجدداً.';}).catch(()=>{state.textContent='تعذر تجهيز العمل دون إنترنت؛ يلزم الاتصال بالشبكة حالياً.';});
})();
