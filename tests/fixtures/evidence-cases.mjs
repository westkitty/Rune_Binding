import {createBlankCase} from '../../dist/domain/schema.js';
export function syntheticCase(n=100){
 const b=createBlankCase('Synthetic benchmark only — NOT HISTORICAL EVIDENCE');
 b.case.id='synthetic-k1-benchmark';b.case.createdAt='2026-01-01T00:00:00.000Z';b.case.updatedAt=b.case.createdAt;
 b.items.push({id:'item-benchmark',displayId:'ITEM-001',label:'Synthetic glyph',regionIds:[]});
 for(let i=1;i<=n;i++)b.claims.push({id:`claim-${String(i).padStart(4,'0')}`,displayId:`CLM-${String(i).padStart(4,'0')}`,itemId:'item-benchmark',dimension:['FORM','READING','DATE','PURPOSE','TRANSMISSION'][i%5],statement:`Synthetic claim ${i}: no historical identification is asserted`,verdict:'UNVERIFIED',provenance:'PU',reviewStatus:'DRAFT'});
 b.sources.push({id:'source-a',displayId:'SRC-001',title:'Shared catalogue title',sourceInspection:'NOT_ACCESSED',familyId:'family-a'});
 b.sources.push({id:'source-b',displayId:'SRC-002',title:'Shared catalogue title',sourceInspection:'NOT_ACCESSED',familyId:'family-b'});
 b.witnesses.push({id:'witness-a',displayId:'WIT-001',label:'Object A'});
 b.witnesses.push({id:'witness-b',displayId:'WIT-002',label:'Object B'});
 return b;
}
