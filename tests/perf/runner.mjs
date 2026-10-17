import {performance} from 'node:perf_hooks';
import {createHash} from 'node:crypto';
import {cpus} from 'node:os';
import {syntheticCase} from '../fixtures/evidence-cases.mjs';
import {compileCasefile} from '../../dist/export/casefile.js';
import {canonicalJson,sha256} from '../../dist/export/canonical.js';
function timings(v){const a=[...v].sort((x,y)=>x-y);const q=p=>a[Math.min(a.length-1,Math.ceil((p/100)*a.length)-1)];return {samples:a.length,minMs:a[0],p50Ms:q(50),p95Ms:q(95),maxMs:a.at(-1)};}
export async function runBenchmarks(){
 const records=10000,searchIndex=new Map();for(let i=0;i<records;i++)searchIndex.set('SRC-'+i.toString().padStart(5,'0'),{id:i,category:'SYNTHETIC'});
 const searchTimes=[];for(let i=0;i<2000;i++){const id='SRC-'+(i*8191%records).toString().padStart(5,'0');const start=performance.now();const value=searchIndex.get(id);searchTimes.push(performance.now()-start);if(!value||value.category!=='SYNTHETIC')throw Error('Index lookup mismatch')}
 const bundle=syntheticCase(100);const media=new Map();const compilerTimes=[];let outputHash='';
 for(let i=0;i<20;i++){const start=performance.now();const output=await compileCasefile(bundle,media,{mode:'SHAREABLE',includeMedia:false,frozenRevision:0});compilerTimes.push(performance.now()-start);const hash=await sha256(output.files['casefile.json']);if(outputHash&&hash!==outputHash)throw Error('Non-deterministic export');outputHash=hash}
 const inputDigest=createHash('sha256').update(canonicalJson(bundle)).digest('hex');
 return {runtime:{kind:'NODE_PROXY',browserVerified:false,node:process.version,platform:process.platform,arch:process.arch,cpuCount:cpus().length,caseGeneration:'SYNTHETIC_NO_HISTORICAL_EVIDENCE'},targets:{indexedSearchP95Ms:250,compilerP95Ms:2000},search:{records,...timings(searchTimes)},compiler:{claimCount:100,...timings(compilerTimes)},fixtureHash:inputDigest,outputHash};
}
