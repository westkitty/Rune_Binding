const KEY='rune-binding-shell-1';const ASSETS=['./','./index.html','./app.css','./main.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(KEY).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==KEY).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(url.origin!==location.origin||e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(v=>v||fetch(e.request)));});
