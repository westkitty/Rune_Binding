/* Rune Binding: evidence categories are independent; structural validation is not historical verification. */
export const DIMENSIONS=['FORM','READING','NAME','MEANING','DATE','PURPOSE','TRANSMISSION'] as const;
export type ClaimDimension=typeof DIMENSIONS[number];
export const VERDICTS=['ATTESTED','SCHOLARLY_RECONSTRUCTION','PLAUSIBLE_HYPOTHESIS','LATER_HISTORICAL_TRADITION','MODERN_DOCUMENTED','UNVERIFIED','CONTRADICTED_MISATTRIBUTED'] as const;
export type EvidenceVerdict=typeof VERDICTS[number];
export const REVIEW_STATES=['DRAFT','EVIDENCE_PENDING','READY_FOR_REVIEW','REVIEWED','BLOCKED','SUPERSEDED'] as const;
export type ReviewStatus=typeof REVIEW_STATES[number];
export const INSPECTION=['ORIGINAL_BYTES_VIEWED','FACSIMILE_VIEWED','EDITION_VIEWED','METADATA_ONLY','SECONDARY_SUMMARY','NOT_ACCESSED'] as const;
export type Inspection=typeof INSPECTION[number];
export type RightsValue='ALLOW'|'DENY'|'UNKNOWN';
export type RightsPolicy={referenceLink:RightsValue;view:RightsValue;store:RightsValue;metadataExport:RightsValue;imageExport:RightsValue;redistribute:RightsValue;basis:string};
export type DateRange={notBefore:number|null;notAfter:number|null;dateSubject:'OBJECT'|'SURVIVING_COPY'|'STATEMENT'|'PRACTICE';precision:'EXACT'|'RANGE'|'APPROXIMATE'|'UNKNOWN';caveat:string};
export type Locator={kind:'FOLIO'|'PRINTED_PAGE'|'LINE'|'IMAGE_REGION'|'OTHER';literal:string;regionId?:string};
export type CaseHeader={id:string;title:string;revision:number;createdAt:string;updatedAt:string};
export type SourceInput={title:string;url?:string;sourceInspection:Inspection;access?:'AVAILABLE'|'NOT_ACCESSED'|'DENIED'|'UNAVAILABLE';familyId?:string;notes?:string;observedAt?:string};
export type SourceRecord=SourceInput & {id:string;displayId:string};
export type WitnessInput={label:string;date?:DateRange;identityNotes?:string;sourceIds?:string[]};
export type WitnessRecord=WitnessInput & {id:string;displayId:string};
export type AssetRecord={id:string;displayId:string;filename:string;sha256:string;mime:string;width:number;height:number;orientation:string;pixelStatus:'ORIGINAL_BYTES_LOCAL'|'EPHEMERAL_PREVIEW'|'LINK_ONLY'|'MISSING';rights:RightsPolicy;sourceUrl?:string};
export type DesignRecord={id:string;displayId:string;label:string;notes:string;itemIds:string[]};
export type ItemRecord={id:string;displayId:string;label:string;assetId?:string;regionIds:string[]};
export type NormalizedPoint={x:number;y:number};
export type ImageViewport={left:number;top:number;displayWidth:number;displayHeight:number;zoom:number;panX:number;panY:number};
export type RegionRecord={id:string;imageSha256:string;imageWidth:number;imageHeight:number;orientation:string;x:number;y:number;w:number;h:number;itemId?:string};
export type ClaimInput={itemId:string;dimension:ClaimDimension;statement:string;script?:string;date?:DateRange;dependsOn?:string[];modernIntent?:boolean};
export type ClaimRecord=ClaimInput & {id:string;displayId:string;verdict:EvidenceVerdict;provenance:'P0'|'P1'|'P2'|'P3'|'P4'|'P5'|'PU';reviewStatus:ReviewStatus;reviewDigest?:string};
export type EvidenceLinkInput={claimId:string;sourceId:string;witnessId?:string;relation:'SUPPORTS'|'REFUTES'|'CONTEXT';locator?:Locator;lineageFamilyId?:string;transmissionMode?:'DOCUMENTED'|'RESEMBLANCE'|'UNRESOLVED'};
export type EvidenceLinkRecord=EvidenceLinkInput & {id:string};
export type ReadingAlternativeInput={claimId:string;kind:'TRANSCRIPTION'|'TRANSLITERATION'|'TRANSLATION';literal:string;notes?:string};
export type ReadingAlternativeRecord=ReadingAlternativeInput & {id:string};
export type SearchReceiptInput={claimId:string;corpus:string;query:string;filters:string;checkedAt:string;access:'AVAILABLE'|'DENIED'|'UNAVAILABLE'|'UNKNOWN';coverageNotes:string;outcome:'NO_MATCH_IN_SCOPE'|'MATCH_FOUND'|'NOT_SEARCHED'|'UNAVAILABLE';executionMode:'USER_REPORTED'|'TOOL_VERIFIED'};
export type SearchReceiptRecord=SearchReceiptInput & {id:string};
export type ReviewEvent={id:string;claimId:string;actor:string;priorStatus:ReviewStatus;nextStatus:ReviewStatus;previousVerdict:EvidenceVerdict;verdict:EvidenceVerdict;rationale:string;reviewedAt:string;dependencyDigest:string};
export type TransmissionEdge={id:string;displayId:string;fromWitnessId:string;toWitnessId:string;basis:'DOCUMENTED'|'RESEMBLANCE'|'UNRESOLVED';sourceId?:string};
export type CaseBundle={schemaVersion:1;case:CaseHeader;sources:SourceRecord[];witnesses:WitnessRecord[];designs:DesignRecord[];assets:AssetRecord[];items:ItemRecord[];regions:RegionRecord[];claims:ClaimRecord[];evidenceLinks:EvidenceLinkRecord[];edges:TransmissionEdge[];searchReceipts:SearchReceiptRecord[];reviewEvents:ReviewEvent[];readingAlternatives:ReadingAlternativeRecord[]};
export type EvidenceIssue={ruleId:string;claimId:string|null;severity:'PASS'|'WARNING'|'BLOCK';message:string;affectedRecordIds:string[];fieldPaths:string[]};
export type MediaPayload={sha256:string;bytes:Uint8Array};

const MAX_RECORDS=50000;
const STRINGS=15000;
function error(msg:string):never{throw Error(msg)}
function record(o:unknown,label:string):Record<string,unknown>{if(!o||typeof o!=='object'||Array.isArray(o))error('invalid '+label);return o as Record<string,unknown>}
function string(v:unknown,label:string,max=STRINGS){if(typeof v!=='string'||v.length>max)error('invalid '+label)}
function number(v:unknown,label:string){if(typeof v!=='number'||!Number.isFinite(v))error('invalid '+label)}
function dateRange(v:unknown){if(v===undefined)return;const d=record(v,'date');const a=d.notBefore,b=d.notAfter;if(a!==null){number(a,'date notBefore');if(!Number.isInteger(a as number))error('invalid year')}if(b!==null){number(b,'date notAfter');if(!Number.isInteger(b as number))error('invalid year')}if(a!==null&&b!==null&&(a as number)>(b as number))error('invalid date range');if(!['OBJECT','SURVIVING_COPY','STATEMENT','PRACTICE'].includes(String(d.dateSubject)))error('invalid date subject')}
const expectedArrays=['sources','witnesses','designs','assets','items','regions','claims','evidenceLinks','edges','searchReceipts','reviewEvents','readingAlternatives'] as const;
export function validateCaseBundle(value:unknown):CaseBundle{
 const b=record(value,'case');if(b.schemaVersion!==1)error('unsupported schema version');const c=record(b.case,'case header');string(c.id,'case ID',200);string(c.title,'title',300);number(c.revision,'revision');if(!Number.isSafeInteger(c.revision as number)||(c.revision as number)<0)error('invalid revision');string(c.createdAt,'createdAt',120);string(c.updatedAt,'updatedAt',120);
 const ids=new Set<string>();const displays=new Set<string>();
 for(const name of expectedArrays){const arr=b[name];if(!Array.isArray(arr)||arr.length>MAX_RECORDS)error('invalid array '+name);for(const raw of arr){const e=record(raw,name);string(e.id,'record ID',200);if(ids.has(e.id as string))error('duplicate id '+e.id);ids.add(e.id as string);if(e.displayId!==undefined){string(e.displayId,'display ID',80);if(displays.has(e.displayId as string))error('duplicate display ID '+e.displayId);displays.add(e.displayId as string)}for(const [k,v] of Object.entries(e)){if(typeof v==='string')string(v,k);if(k==='date'&&v)dateRange(v)}}}
 const s=b as unknown as CaseBundle;const assetIds=new Set(s.assets.map(x=>x.id));const itemIds=new Set(s.items.map(x=>x.id));const srcIds=new Set(s.sources.map(x=>x.id));const witIds=new Set(s.witnesses.map(x=>x.id));const claimIds=new Set(s.claims.map(x=>x.id));const regionIds=new Set(s.regions.map(x=>x.id));
 for(const v of s.sources){string(v.title,'source title',1500);if(!INSPECTION.includes(v.sourceInspection))error('invalid inspection state')}
 for(const w of s.witnesses){string(w.label,'witness label',1500);dateRange(w.date);for(const id of w.sourceIds||[])if(!srcIds.has(id))error('invalid witness source ref')}
 for(const a of s.assets){string(a.sha256,'sha256',64);if(!/^[a-f0-9]{64}$/.test(a.sha256))error('invalid asset digest');number(a.width,'width');number(a.height,'height');if(a.width<0||a.height<0||a.width*a.height>40000000)error('invalid asset dimensions');const rights=record(a.rights,'rights');for(const k of ['referenceLink','view','store','metadataExport','imageExport','redistribute'])if(!['ALLOW','DENY','UNKNOWN'].includes(String(rights[k])))error('invalid right '+k);string(rights.basis,'rights basis',3000)}
 for(const item of s.items){if(item.assetId&&!assetIds.has(item.assetId))error('invalid item asset');for(const id of item.regionIds)if(!regionIds.has(id))error('invalid item region')}
 for(const r of s.regions){for(const n of [r.x,r.y,r.w,r.h])if(typeof n!=='number'||!Number.isFinite(n))error('invalid region');if(r.x<0||r.y<0||r.w<=0||r.h<=0||r.x+r.w>1.0000001||r.y+r.h>1.0000001)error('invalid region bounds');if(r.itemId&&!itemIds.has(r.itemId))error('invalid region item')}
 for(const cl of s.claims){if(!itemIds.has(cl.itemId))error('invalid claim item');if(!DIMENSIONS.includes(cl.dimension))error('invalid claim dimension');if(!VERDICTS.includes(cl.verdict))error('invalid claim verdict');if(!REVIEW_STATES.includes(cl.reviewStatus))error('invalid claim review');if(!/^P[0-5U]$/.test(cl.provenance))error('invalid provenance');string(cl.statement,'claim text',5000);dateRange(cl.date);for(const id of cl.dependsOn||[])if(!claimIds.has(id))error('invalid claim dependency')}
 for(const link of s.evidenceLinks){if(!claimIds.has(link.claimId)||!srcIds.has(link.sourceId)||(link.witnessId&&!witIds.has(link.witnessId)))error('invalid evidence reference');if(!['SUPPORTS','REFUTES','CONTEXT'].includes(link.relation))error('invalid evidence relation');if(link.locator){if(!['FOLIO','PRINTED_PAGE','LINE','IMAGE_REGION','OTHER'].includes(link.locator.kind))error('invalid locator kind');string(link.locator.literal,'locator',500);if(link.locator.regionId&&!regionIds.has(link.locator.regionId))error('invalid locator region')}}
 for(const e of s.reviewEvents){if(!claimIds.has(e.claimId))error('invalid review claim');if(!VERDICTS.includes(e.verdict)||!REVIEW_STATES.includes(e.nextStatus))error('invalid review event');string(e.actor,'review actor',200);string(e.rationale,'review rationale',5000)}
 for(const p of s.searchReceipts){if(!claimIds.has(p.claimId))error('invalid search claim');if(!['USER_REPORTED','TOOL_VERIFIED'].includes(p.executionMode))error('invalid search execution')}
 for(const p of s.readingAlternatives)if(!claimIds.has(p.claimId))error('invalid reading claim');
 for(const edge of s.edges)if(!witIds.has(edge.fromWitnessId)||!witIds.has(edge.toWitnessId))error('invalid transmission edge');
 return s;
}
export function createBlankCase(title:string):CaseBundle{
 if(!title.trim()||title.length>300)error('case title required');const now=new Date().toISOString();const id=crypto.randomUUID();
 return {schemaVersion:1,case:{id,title:title.trim(),revision:0,createdAt:now,updatedAt:now},sources:[],witnesses:[],designs:[],assets:[],items:[],regions:[],claims:[],evidenceLinks:[],edges:[],searchReceipts:[],reviewEvents:[],readingAlternatives:[]};
}
export const CaseBundleSchema={parse:validateCaseBundle,safeParse(value:unknown){try{return {success:true,data:validateCaseBundle(value)} as const}catch(e){return {success:false,error:String(e)} as const}}};
