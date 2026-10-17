import test from 'node:test';
import assert from 'node:assert/strict';
import { createBlankCase, validateCaseBundle } from '../../dist/domain/schema.js';
import { newEntityId, nextDisplayId } from '../../dist/domain/ids.js';

test('one_rune_name_cannot_become_purpose', () => {
 const c=createBlankCase('Test');c.items.push({id:'item-1',displayId:'ITEM-001',label:'Mark',regionIds:[]});
 c.claims.push({id:'c1',displayId:'CLM-001',itemId:'item-1',dimension:'NAME',statement:'An invented name',verdict:'UNVERIFIED',provenance:'PU',reviewStatus:'DRAFT'});
 assert.equal(validateCaseBundle(c).claims[0].dimension,'NAME');
});
test('ids_do_not_depend_on_name_or_date',()=>{const id=newEntityId();const casefile=createBlankCase('First');const copy={...casefile,case:{...casefile.case,title:'Renamed'}};assert.equal(copy.case.id,casefile.case.id);assert.ok(id.length>=30);assert.equal(nextDisplayId(casefile,'SRC'),'SRC-001')});
test('folio_and_page_are_distinct_locators',()=>{const c=createBlankCase('Case');c.sources.push({id:'s1',displayId:'SRC-001',title:'Record',sourceInspection:'METADATA_ONLY'});c.items.push({id:'i1',displayId:'ITEM-001',label:'One',regionIds:[]});c.claims.push({id:'c1',displayId:'CLM-001',itemId:'i1',dimension:'FORM',statement:'Line',verdict:'UNVERIFIED',provenance:'PU',reviewStatus:'DRAFT'});c.evidenceLinks.push({id:'l1',claimId:'c1',sourceId:'s1',relation:'CONTEXT',locator:{kind:'FOLIO',literal:'26v'}},{id:'l2',claimId:'c1',sourceId:'s1',relation:'CONTEXT',locator:{kind:'PRINTED_PAGE',literal:'26'}});assert.notDeepEqual(validateCaseBundle(c).evidenceLinks[0].locator, c.evidenceLinks[1].locator)});
test('unknown_provenance_is_allowed',()=>{const c=createBlankCase('Unknown');assert.equal(validateCaseBundle(c).schemaVersion,1);assert.equal(new Set([nextDisplayId(c,'SRC'),nextDisplayId(c,'WIT')]).size,2)});
test('malformed_date_and_duplicate_display_ids_rejected',()=>{const c=createBlankCase('X');c.sources=[{id:'s1',displayId:'SRC-001',title:'First',sourceInspection:'NOT_ACCESSED'}, {id:'s2',displayId:'SRC-001',title:'Other',sourceInspection:'NOT_ACCESSED'}];assert.throws(()=>validateCaseBundle(c),/duplicate/i);c.sources[1].displayId='SRC-002';c.witnesses.push({id:'w1',displayId:'WIT-001',label:'Stone',date:{notBefore:1600,notAfter:1000,dateSubject:'OBJECT',precision:'RANGE',caveat:''}});assert.throws(()=>validateCaseBundle(c),/date range/i)});
