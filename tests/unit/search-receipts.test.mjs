import test from 'node:test';import assert from 'node:assert/strict';
import {createBlankCase} from '../../dist/domain/schema.js';import {addSearchReceipt} from '../../dist/domain/case-actions.js';
function base(){const b=createBlankCase('Search');b.items.push({id:'i1',displayId:'ITEM-001',label:'Glyph',regionIds:[]});b.claims.push({id:'c1',displayId:'CLM-001',itemId:'i1',dimension:'FORM',statement:'Old glyph?',verdict:'UNVERIFIED',provenance:'PU',reviewStatus:'DRAFT'});return b}
const input={claimId:'c1',corpus:'Runor',query:'abc',filters:'period=pre-modern',checkedAt:'2026-10-17',access:'AVAILABLE',coverageNotes:'Only publicly indexed',outcome:'NO_MATCH_IN_SCOPE',executionMode:'USER_REPORTED'};
test('zero_result_search_preserves_scope_and_limitations',()=>{const b=addSearchReceipt(base(),input);assert.equal(b.searchReceipts[0].coverageNotes,'Only publicly indexed');assert.equal(b.searchReceipts[0].outcome,'NO_MATCH_IN_SCOPE')});
test('not_searched_distinct_from_no_match',()=>{const b=addSearchReceipt(base(),{...input,outcome:'NOT_SEARCHED'});assert.notEqual(b.searchReceipts[0].outcome,'NO_MATCH_IN_SCOPE')});
test('manual_receipt_cannot_claim_tool_verified',()=>{assert.throws(()=>addSearchReceipt(base(),{...input,executionMode:'TOOL_VERIFIED'}),/verified/i)});
test('failed_access_preserves_unavailable_state',()=>{const b=addSearchReceipt(base(),{...input,outcome:'UNAVAILABLE',access:'DENIED'});assert.equal(b.searchReceipts[0].access,'DENIED')});
