import test from 'node:test';
import assert from 'node:assert/strict';
import * as rights from '../../dist/domain/rights.js';
import {createBlankCase} from '../../dist/domain/schema.js';
import {reviewClaim,deriveRecheckFlags} from '../../dist/domain/review.js';
function fixture(){
 const b=createBlankCase('Synthetic viewing rights');
 b.assets.push({id:'a',displayId:'IMG-001',filename:'test.png',sha256:'a'.repeat(64),mime:'image/png',width:1,height:1,orientation:'UP',pixelStatus:'ORIGINAL_BYTES_LOCAL',rights:{...rights.emptyRights()}});
 b.items.push({id:'i',displayId:'ITEM-001',label:'Sample item',assetId:'a',regionIds:[]});
 b.claims.push({id:'c',displayId:'CLM-001',itemId:'i',dimension:'FORM',statement:'Synthetic form observation',verdict:'UNVERIFIED',reviewStatus:'BLOCKED',provenance:'PU'});
 return b;
}
test('investigator can explicitly authorize local inspection without granting image redistribution',()=>{
 assert.ok(rights.changeImageViewRight,'rights change operation required');
 const before=fixture();
 const next=rights.changeImageViewRight(before,'a','ALLOW','I am choosing to inspect this local upload');
 assert.equal(before.assets[0].rights.view,'UNKNOWN');assert.equal(next.assets[0].rights.view,'ALLOW');
 assert.equal(next.assets[0].rights.redistribute,'UNKNOWN');
 assert.equal(next.assets[0].rights.imageExport,'UNKNOWN');
 assert.match(next.assets[0].rights.basis,/local upload/i);
 assert.throws(()=>rights.changeImageViewRight(next,'a','DENY',''),/reason|basis/i);
});
test('changing the image attached to a reviewed claim marks that claim for recheck',()=>{
 assert.ok(rights.changeImageViewRight);
 const b=fixture();const reviewed=reviewClaim(b,{claimId:'c',actor:'Investigator',verdict:'UNVERIFIED',rationale:'No original witness located.',reviewedAt:'2026-10-17T00:00:00Z'});
 assert.deepEqual(deriveRecheckFlags(reviewed),[]);
 const changed=rights.changeImageViewRight(reviewed,'a','ALLOW','Permission for local examination only');
 assert.deepEqual(deriveRecheckFlags(changed),['c']);
});
