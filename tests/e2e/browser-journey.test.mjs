import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';

const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function waitFor(fn,timeout=12000){const start=Date.now();let last;while(Date.now()-start<timeout){try{last=await fn();if(last)return last}catch{}await pause(80)}throw Error('Browser expectation timed out: '+String(last))}
async function port(){const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;await new Promise(r=>s.close(r));return p}
async function launch(){
 const dir=await mkdtemp(join(tmpdir(),'rune-cdp-'));
 const webport=await port(), web=spawn('node',['scripts/serve.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(webport)},stdio:'ignore'});
 await waitFor(async()=>{try{const r=await fetch(`http://127.0.0.1:${webport}/`);return r.status===200}catch{return false}});
 const chrome=spawn(process.env.CHROME_BIN||'chromium',['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-allow-origins=*','--remote-debugging-port=0',`--user-data-dir=${dir}`,'about:blank'],{stdio:'ignore'});
 let devPort;
 try{devPort=await waitFor(async()=>{const t=await readFile(join(dir,'DevToolsActivePort'),'utf8');return Number(t.split('\n')[0])})}catch(e){web.kill();chrome.kill();await rm(dir,{recursive:true,force:true});throw e}
 const endpoints=await fetch(`http://127.0.0.1:${devPort}/json/list`).then(r=>r.json());const endpoint=endpoints.find(x=>x.type==='page');
 if(!endpoint?.webSocketDebuggerUrl)throw Error('Missing Chromium page inspector');
 const ws=new WebSocket(endpoint.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 let serial=1;const pending=new Map();ws.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id&&pending.has(msg.id)){const {resolve,reject}=pending.get(msg.id);pending.delete(msg.id);msg.error?reject(Error(msg.error.message)):resolve(msg.result)}};
 const cmd=(method,params={})=>new Promise((resolve,reject)=>{const id=serial++;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
 const evalJs=async js=>{const r=await cmd('Runtime.evaluate',{expression:`(${js})`,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result?.value};
 const close=async()=>{try{ws.close()}catch{}try{chrome.kill('SIGTERM')}catch{}try{web.kill('SIGTERM')}catch{}await pause(160);await rm(dir,{recursive:true,force:true})};
 await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Page.navigate',{url:`http://127.0.0.1:${webport}/`});
 return {cmd,evalJs,close,webport};
}

async function policyBlocked(browser){await pause(450);const body=await browser.evalJs(`document.body?.innerText?.slice(0,500)||''`);return /(?:\bblocked\b|doesn.t allow you to view this site|not allowed to visit)/i.test(body)}

test('browser_case_journey_and_restart_persists_human_review', {timeout:45000}, async(t)=>{
 const browser=await launch();try{
 if(await policyBlocked(browser)){t.skip('Managed Chromium disallows localhost; runtime browser journey remains UNVERIFIED');return;}
 await waitFor(()=>browser.evalJs(`document.querySelector('.case-shelf')!==null`));
 const heading=await browser.evalJs(`document.querySelector('h1')?.textContent`);assert.equal(heading,'Rune Binding');
 await browser.evalJs(`(()=>{const f=document.querySelector('.case-shelf form');f.querySelector('input[name=title]').value='Synthetic rune research';f.requestSubmit();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelector('.case-head h2')?.textContent==='Synthetic rune research'`));
 await browser.evalJs(`(()=>{const f=document.querySelectorAll('.panel-grid form')[0];f.querySelector('input[name=label]').value='Observed glyph';f.requestSubmit();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelectorAll('.panel-grid form')[1]?.querySelector('select[name=itemId] option')!==null`));
 await browser.evalJs(`(()=>{const f=document.querySelectorAll('.panel-grid form')[1];f.querySelector('[name=dimension]').value='FORM';f.querySelector('[name=statement]').value='A curved stroke (synthetic test claim)';f.requestSubmit();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelector('.claim-row')?.textContent.includes('curved stroke')`));
 await browser.evalJs(`(()=>{[...document.querySelectorAll('.workspace-nav button')].find(x=>x.textContent==='Evidence review').click();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelector('.review-form')!==null`));
 await browser.evalJs(`(()=>{const f=document.querySelector('.review-form');f.querySelector('[name=actor]').value='Local editor';f.querySelector('[name=rationale]').value='No inspected historical witness included.';f.requestSubmit();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelector('.claim-row')?.textContent.includes('UNVERIFIED')`));
 await browser.evalJs(`(()=>{[...document.querySelectorAll('.workspace-nav button')].find(x=>x.textContent==='Casefile').click();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelector('[aria-label="Casefile export and restoration"]')!==null`));
 await browser.evalJs(`(()=>{document.querySelector('[aria-label="Casefile export and restoration"] form').requestSubmit();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelectorAll('.exports button').length===4`));
 const shown=await browser.evalJs(`document.querySelector('.export-preview')?.textContent`);assert.match(shown,/No inspected historical witness/);
 await browser.cmd('Page.reload',{ignoreCache:true});await waitFor(()=>browser.evalJs(`document.querySelector('.case-shelf .case-entry')!==null`));
 await browser.evalJs(`(()=>{document.querySelector('.case-shelf .case-entry').click();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelector('.claim-row')?.textContent.includes('curved stroke')`));
 await browser.evalJs(`(()=>{[...document.querySelectorAll('.workspace-nav button')].find(x=>x.textContent==='Evidence review').click();return true})()`);
 await waitFor(()=>browser.evalJs(`document.querySelector('.review-layout')!==null`));
 assert.equal(await browser.evalJs(`document.querySelectorAll('.review-layout .claim-row').length`),1);
 const errors=await browser.evalJs(`document.querySelector('[role=alert]')?.textContent||''`);assert.equal(errors,'');
 }finally{await browser.close()}
});

test('mobile_has_no_horizontal_overflow', {timeout:30000},async(t)=>{const browser=await launch();try{await browser.cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await browser.cmd('Page.reload',{ignoreCache:true});if(await policyBlocked(browser)){t.skip('Managed Chromium disallows localhost; mobile layout remains UNVERIFIED');return;}await waitFor(()=>browser.evalJs(`document.querySelector('.case-shelf')!==null`));const o=await browser.evalJs(`({actual:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})`);assert.ok(o.actual<=o.client+2,JSON.stringify(o))}finally{await browser.close()}});
