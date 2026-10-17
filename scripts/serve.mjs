import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
const base=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png'};
const server=createServer(async(req,res)=>{
  try {
    const url=new URL(req.url??'/', 'http://localhost');
    const p=resolve(base,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if (!p.startsWith(base+'/') && p!==base) {res.writeHead(403).end();return}
    const bytes=await readFile(p);res.writeHead(200,{'content-type':types[extname(p)]??'application/octet-stream','cache-control':'no-store'}).end(bytes);
  } catch {res.writeHead(404).end('Not found');}
});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('http://127.0.0.1:'+(process.env.PORT||4173)));
