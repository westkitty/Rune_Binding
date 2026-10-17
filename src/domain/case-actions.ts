import {validateCaseBundle} from './schema.js';
import type {CaseBundle,SourceInput,WitnessInput,EvidenceLinkInput} from './schema.js';
import {newEntityId,nextDisplayId} from './ids.js';
function next(bundle:CaseBundle){return structuredClone(bundle)}
export function addSource(bundle:CaseBundle,input:SourceInput):CaseBundle{
 if(!input.title?.trim())throw Error('Source title required');const b=next(bundle);
 b.sources.push({...input,title:input.title.trim(),id:newEntityId(),displayId:nextDisplayId(b,'SRC')});return validateCaseBundle(b);
}
export function addWitness(bundle:CaseBundle,input:WitnessInput):CaseBundle{
 if(!input.label?.trim())throw Error('Witness label required');const b=next(bundle);
 b.witnesses.push({...input,id:newEntityId(),displayId:nextDisplayId(b,'WIT')});return validateCaseBundle(b);
}
export function attachEvidence(bundle:CaseBundle,input:EvidenceLinkInput):CaseBundle{
 const b=next(bundle);b.evidenceLinks.push({...input,id:newEntityId()});return validateCaseBundle(b);
}

import type {ClaimInput,ReadingAlternativeInput,SearchReceiptInput} from './schema.js';
export function addClaim(bundle:CaseBundle,input:ClaimInput):CaseBundle{
 if(!input.statement?.trim())throw Error('Claim text required');const b=next(bundle);
 b.claims.push({...input,statement:input.statement.trim(),id:newEntityId(),displayId:nextDisplayId(b,'CLM'),reviewStatus:'DRAFT',verdict:'UNVERIFIED',provenance:'PU'});return validateCaseBundle(b);
}
export function addReadingAlternative(bundle:CaseBundle,input:ReadingAlternativeInput):CaseBundle{
 if(!input.literal.trim())throw Error('Literal reading required');const b=next(bundle);
 b.readingAlternatives.push({...input,id:newEntityId()});return validateCaseBundle(b);
}
export function addSearchReceipt(bundle:CaseBundle,input:SearchReceiptInput):CaseBundle{
 if(!input.corpus?.trim()||!input.query?.trim()||!input.coverageNotes?.trim())throw Error('Search corpus, exact query and coverage limitations required');
 if(input.executionMode!=='USER_REPORTED')throw Error('Tool-verified searches require an actual verified search adapter, unavailable in K1');
 if(!['NO_MATCH_IN_SCOPE','MATCH_FOUND','NOT_SEARCHED','UNAVAILABLE'].includes(input.outcome))throw Error('Invalid bounded search outcome');
 const b=next(bundle);b.searchReceipts.push({...input,id:newEntityId()});return validateCaseBundle(b);
}
