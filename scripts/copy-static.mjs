import { cp, copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, extname } from 'node:path';
const root='dist';
await mkdir(root,{recursive:true});
await copyFile('index.html',join(root,'index.html'));
await copyFile('src/app.css',join(root,'app.css'));
await cp('public',root,{recursive:true});
const assets=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const file=join(dir,e.name);if(e.isDirectory())await walk(file);else if(['.js','.css','.html','.webmanifest','.svg','.png'].includes(extname(file))&&e.name!=='sw.js')assets.push({path:'./'+relative(root,file).replaceAll('\\','/'),bytes:await readFile(file)})}}
await walk(root);assets.sort((a,b)=>a.path.localeCompare(b.path,'en'));
const hash=createHash('sha256');for(const a of assets){hash.update(a.path);hash.update(a.bytes)}
const key='rune-binding-shell-'+hash.digest('hex').slice(0,16);
const sw=`const KEY=${JSON.stringify(key)};\nconst ASSETS=${JSON.stringify(['./',...assets.map(x=>x.path)])};\nself.addEventListener('install',e=>{e.waitUntil(caches.open(KEY).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});\nself.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('rune-binding-shell-')&&k!==KEY).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});\nself.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(url.origin!==location.origin||e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(v=>v||fetch(e.request)))});\n`;
await writeFile(join(root,'sw.js'),sw);
console.log(`Cached ${assets.length+1} local static resources under ${key}`);
