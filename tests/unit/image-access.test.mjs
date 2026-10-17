import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {emptyRights,canDistributePixels} from '../../dist/domain/rights.js';
const moduleUnderTest=await import('../../dist/ui/image-access.js').catch(()=>null);
const bytes=new TextEncoder().encode('synthetic asset bytes');
const digest=createHash('sha256').update(bytes).digest('hex');
const rights=(view='ALLOW')=>({...emptyRights(),view,store:'ALLOW',basis:'Source owner recorded authorization'});
const asset=(view='ALLOW')=>({sha256:digest,mime:'image/png',rights:rights(view)});
test('cached pixels must never bypass denied or unknown view rights',async()=>{
 assert.ok(moduleUnderTest?.resolveImageUrl,'view rights resolver is required');
 const cache=new Map([[digest,'blob:cached-image']]);let mediaReads=0;
 const read=async()=>{mediaReads++;return bytes};
 assert.equal(await moduleUnderTest.resolveImageUrl(asset('DENY'),read,cache),undefined);
 assert.equal(await moduleUnderTest.resolveImageUrl(asset('UNKNOWN'),read,cache),undefined);
 assert.equal(mediaReads,0);
});
test('allowed view verifies original pixel digest before caching',async()=>{
 assert.ok(moduleUnderTest?.resolveImageUrl);
 const cache=new Map();const url=await moduleUnderTest.resolveImageUrl(asset(),async()=>bytes,cache);
 assert.match(url||'',/^blob:/);assert.equal(cache.get(digest),url);
 const repeated=await moduleUnderTest.resolveImageUrl(asset(),async()=>{throw Error('should use cached verified URL')},cache);
 assert.equal(repeated,url);URL.revokeObjectURL(url);
 const bad=await moduleUnderTest.resolveImageUrl(asset(),async()=>new TextEncoder().encode('tampered'),new Map());
 assert.equal(bad,undefined);
});
test('public image distribution requires recorded rights basis',()=>{
 const r={...emptyRights(),imageExport:'ALLOW',redistribute:'ALLOW',basis:''};
 assert.equal(canDistributePixels(r),false);
 assert.equal(canDistributePixels({...r,basis:'Photo taken by investigator'}),true);
});
