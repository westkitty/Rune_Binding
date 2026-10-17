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
