import test from 'node:test';import assert from 'node:assert/strict';
import * as desk from '../../dist/ui/ClaimLedger.js';
const parseClaimDateFields=(...args)=>{assert.equal(typeof desk.parseClaimDateFields,'function','Date claim parser not implemented');return desk.parseClaimDateFields(...args)};
test('structured_date_claim_preserves_range_and_subject',()=>{const result=parseClaimDateFields({notBefore:'790',notAfter:'930',dateSubject:'SURVIVING_COPY',precision:'RANGE',caveat:'Dated copy, not the origin of the practice'});assert.deepEqual(result,{notBefore:790,notAfter:930,dateSubject:'SURVIVING_COPY',precision:'RANGE',caveat:'Dated copy, not the origin of the practice'})});
test('omitted_date_fields_do_not_invent_a_historic_date',()=>{assert.equal(parseClaimDateFields({notBefore:'',notAfter:'',dateSubject:'OBJECT',precision:'UNKNOWN',caveat:''}),undefined)});
test('reversed_date_claim_range_is_refused',()=>{assert.throws(()=>parseClaimDateFields({notBefore:'930',notAfter:'790',dateSubject:'PRACTICE',precision:'RANGE',caveat:''}),/range/i)});
