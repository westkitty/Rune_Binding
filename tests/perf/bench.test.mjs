import test from 'node:test';import assert from 'node:assert/strict';
import {runBenchmarks} from './runner.mjs';
import {syntheticCase} from '../fixtures/evidence-cases.mjs';
import {compileCasefile} from '../../dist/export/casefile.js';
import {evaluateCase} from '../../dist/domain/safeguards.js';
import {sha256} from '../../dist/export/canonical.js';

test('indexed_lookup_10k_1k_samples_and_compiler_100_claims_are_measured', async()=>{
 const r=await runBenchmarks();
 assert.ok(r,'Missing actual measured performance result');
 assert.equal(r.search.records,10000);assert.ok(r.search.samples>=1000);assert.ok(r.compiler.claimCount===100&&r.compiler.samples>=10);
 for(const item of [r.search,r.compiler])assert.ok(item.minMs<=item.p50Ms&&item.p50Ms<=item.p95Ms&&item.p95Ms<=item.maxMs);
 assert.ok(r.search.p95Ms<250,`Indexed lookup p95 ${r.search.p95Ms}ms exceeded 250ms`);
 assert.ok(r.compiler.p95Ms<2000,`Compiler p95 ${r.compiler.p95Ms}ms exceeded 2s`);
 assert.equal(r.runtime.kind,'NODE_PROXY');assert.equal(r.runtime.browserVerified,false);
 assert.match(r.fixtureHash,/^[a-f0-9]{64}$/);assert.match(r.outputHash,/^[a-f0-9]{64}$/);
});
test('case_journey_reaches_reviewable_unverified_output_and_no_auto_historical_verdict',async()=>{
 const bundle=syntheticCase(100);const issues=evaluateCase(bundle);assert.ok(Array.isArray(issues));
 assert.ok(bundle.claims.every(x=>x.verdict==='UNVERIFIED'&&x.reviewStatus==='DRAFT'));
 assert.notEqual(bundle.witnesses[0].id,bundle.witnesses[1].id);
 const compiled=await compileCasefile(bundle,new Map(),{mode:'SHAREABLE',includeMedia:false,frozenRevision:0});
 const md=new TextDecoder().decode(compiled.files['casefile.md']);assert.match(md,/UNVERIFIED/);assert.match(md,/Structural evidence checks are not historical proof/);
 const compiledAgain=await compileCasefile(bundle,new Map(),{mode:'SHAREABLE',includeMedia:false,frozenRevision:0});
 for(const name of Object.keys(compiled.files))assert.deepEqual(compiled.files[name],compiledAgain.files[name]);
});
test('no_forbidden_media_in_output',async()=>{
 const bundle=syntheticCase(1),payload=new TextEncoder().encode('SECRET-FIXTURE-MEDIA-BYTES-NOT-FOR-PUBLIC-EXPORT');const digest=await sha256(payload);
 bundle.assets.push({id:'asset-secret',displayId:'IMG-001',filename:'secret.png',sha256:digest,mime:'image/png',width:1,height:1,orientation:'UP',pixelStatus:'ORIGINAL_BYTES_LOCAL',rights:{referenceLink:'UNKNOWN',view:'ALLOW',store:'ALLOW',metadataExport:'ALLOW',imageExport:'DENY',redistribute:'DENY',basis:'Synthetic denied-media test'}});
 const compiled=await compileCasefile(bundle,new Map([[digest,payload]]),{mode:'SHAREABLE',includeMedia:true});assert.equal(compiled.complete,false);
 assert.deepEqual(Object.keys(compiled.files).sort(),['casefile.json','casefile.md','manifest.json']);
 assert.ok(compiled.omissions.some(x=>x.includes('pixels omitted')));
 assert.ok(!Object.values(compiled.files).some(x=>new TextDecoder().decode(x).includes('SECRET-FIXTURE-MEDIA-BYTES')));
});
