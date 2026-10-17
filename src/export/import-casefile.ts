import {validateCaseBundle} from '../domain/schema.js';
import type {CaseBundle,MediaPayload} from '../domain/schema.js';
import type {CaseRepository} from '../storage/case-repository.js';
import {canonicalJson,sha256} from './canonical.js';
export type ImportPreview={bundle:CaseBundle;errors:string[];missingMedia:string[];redactedFields:string[];complete:boolean;media:ReadonlyMap<string,Uint8Array>};
export type ImportResult={status:'IMPORTED'|'IDENTICAL'|'CONFLICT'|'REVIEW_REQUIRED';caseId:string;missingMedia:string[];message:string};
const decoder=new TextDecoder('utf-8',{fatal:true});
export async function parseCasefileImport(casefileJson:Uint8Array,manifestJson:Uint8Array,mediaFiles:ReadonlyMap<string,Uint8Array>):Promise<ImportPreview>{
 if(casefileJson.length>10*1024*1024||manifestJson.length>2*1024*1024)throw Error('Import JSON too large');
 let raw:unknown,manifest:unknown;try{raw=JSON.parse(decoder.decode(casefileJson));manifest=JSON.parse(decoder.decode(manifestJson))}catch{throw Error('Invalid JSON in casefile or manifest')}
 if(!manifest||typeof manifest!=='object'||Array.isArray(manifest))throw Error('Invalid manifest');const m=manifest as Record<string,unknown>;
 if(m.manifestVersion!==1||m.schemaVersion!==1)throw Error('Unsupported casefile manifest schema');
 const bundle=validateCaseBundle(raw);
 if(m.caseId!==bundle.case.id||m.sourceRevision!==bundle.case.revision)throw Error('Case identity or revision mismatch');
 if(!Array.isArray(m.files)||m.files.length>5000)throw Error('Invalid manifest file list');
 const missingMedia:string[]=[],media=new Map<string,Uint8Array>();const names=new Set<string>();let presentJson=false,presentMd=false;
 for(const f of m.files){if(!f||typeof f!=='object')throw Error('Invalid manifest file entry');const e=f as Record<string,unknown>;if(typeof e.name!=='string'||typeof e.sha256!=='string'||typeof e.size!=='number'||names.has(e.name))throw Error('Malformed or duplicate manifest entries');names.add(e.name);
  if(!/^[a-f0-9]{64}$/.test(e.sha256)||e.size<0||e.size>20*1024*1024)throw Error('Invalid file integrity descriptor');
  if(e.name==='manifest.json')throw Error('Recursive manifest hash forbidden');
  if(e.name==='casefile.json'){presentJson=true;if((await sha256(casefileJson))!==e.sha256||casefileJson.length!==e.size)throw Error('Casefile digest/integrity mismatch')}
  else if(e.name==='casefile.md'){presentMd=true;/* Companion Markdown may be imported separately; hash remains recorded but is not required as input here. */}
  else if(e.name.startsWith('media/')){if(!/^media\/[a-f0-9]{64}\.(png|jpg|webp)$/.test(e.name))throw Error('Unsafe media name');const mbytes=mediaFiles.get(e.name);if(!mbytes){missingMedia.push(e.name);continue}if(mbytes.length!==e.size||await sha256(mbytes)!==e.sha256)throw Error('Media digest/integrity mismatch');media.set(e.name,new Uint8Array(mbytes))}
  else throw Error('Unsupported file in manifest');
 }
 if(!presentJson||!presentMd)throw Error('Casefile metadata files missing from manifest');
 const omissions=Array.isArray(m.omissions)?m.omissions.filter(x=>typeof x==='string').map(String):[];
 return {bundle,errors:[],missingMedia,redactedFields:omissions,complete:!!m.complete&&omissions.length===0&&missingMedia.length===0,media};
}
export async function applyCasefileImport(repository:CaseRepository,preview:ImportPreview,choice:'CREATE_NEW'|'MERGE_IDENTICAL'|'REVIEW_CONFLICTS'):Promise<ImportResult>{
 const bundle=validateCaseBundle(preview.bundle);if(preview.errors.length)throw Error('Invalid import preview');const existing=await repository.getCase(bundle.case.id);
 if(existing){if(canonicalJson(existing)===canonicalJson(bundle))return {status:'IDENTICAL',caseId:bundle.case.id,missingMedia:preview.missingMedia,message:'Identical imported case is already present.'};return {status:'CONFLICT',caseId:bundle.case.id,missingMedia:preview.missingMedia,message:'Case ID collides with different local records; no data was changed.'}}
 if(choice==='REVIEW_CONFLICTS')return {status:'REVIEW_REQUIRED',caseId:bundle.case.id,missingMedia:preview.missingMedia,message:'Preview only; no changes written.'};
 const payloads:MediaPayload[]=[];for(const [name,bytes] of preview.media){const sha=name.match(/^media\/([a-f0-9]{64})\./)?.[1];if(!sha||await sha256(bytes)!==sha)throw Error('Imported media filename/digest mismatch');payloads.push({sha256:sha,bytes})}
 await repository.createCase(bundle,payloads);
 return {status:'IMPORTED',caseId:bundle.case.id,missingMedia:preview.missingMedia,message:preview.complete?'Complete metadata and permitted media restored.':'Case imported with declared missing or withheld media/metadata; restoration incomplete.'};
}
