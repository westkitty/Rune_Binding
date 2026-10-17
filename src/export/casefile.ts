import type {CaseBundle,AssetRecord} from '../domain/schema.js';
import {validateCaseBundle} from '../domain/schema.js';
import {canUseAsset,canDistributePixels} from '../domain/rights.js';
import {evaluateCase} from '../domain/safeguards.js';
import {deriveRecheckFlags} from '../domain/review.js';
import {canonicalJson,sha256,utf8} from './canonical.js';
export type ExportOptions={mode:'PRIVATE_BACKUP'|'SHAREABLE';includeMedia:boolean;includeMetadata?:boolean;allowIncomplete?:boolean;frozenRevision?:number};
export type CompiledCasefile={files:Record<string,Uint8Array>;omissions:string[];complete:boolean};
function escape(s:unknown):string{return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replace(/[\r\n\u2028\u2029]+/g,' ').replace(/[\\`*_\[\]#]/g,'\\$&')}
function makeMarkdown(bundle:CaseBundle,omissions:string[],mode:ExportOptions['mode']):string{
 const issues=evaluateCase(bundle),recheck=new Set(deriveRecheckFlags(bundle));const rows=[`# Casefile: ${escape(bundle.case.title)}`,'',`Case ID: ${escape(bundle.case.id)}  `,`Revision: ${bundle.case.revision}  `,`Mode: ${mode}  `,'','**Editorial notice:** Structural evidence checks are not historical proof. Verdicts are entered by a human editor.','','## Individual claims',''];
 for(const c of [...bundle.claims].sort((a,b)=>a.displayId.localeCompare(b.displayId))){rows.push(`### ${escape(c.displayId)} — ${escape(c.dimension)}`,`**Proposition:** ${escape(c.statement)}`,`**Verdict:** ${escape(c.verdict)} · **Review:** ${escape(c.reviewStatus)}${recheck.has(c.id)?' · NEEDS_RECHECK':''}`,`**Provenance:** ${escape(c.provenance)}`);
 const item=bundle.items.find(x=>x.id===c.itemId);rows.push(`**Item:** ${escape(item?.displayId||'Missing item')}`);
 for(const l of bundle.evidenceLinks.filter(x=>x.claimId===c.id)){const s=bundle.sources.find(x=>x.id===l.sourceId),w=bundle.witnesses.find(x=>x.id===l.witnessId);rows.push(`- ${escape(l.relation)}: ${escape(s?.title||'Missing source')} (${escape(s?.sourceInspection||'NOT_ACCESSED')}); witness ${escape(w?.label||'not established')}; locator ${l.locator?escape(l.locator.kind+': '+l.locator.literal):'not supplied'}; lineage ${escape(l.lineageFamilyId||s?.familyId||'unresolved')}`)}
 for(const n of bundle.searchReceipts.filter(x=>x.claimId===c.id))rows.push(`- Search: ${escape(n.corpus)}, query ${escape(n.query)}, filters ${escape(n.filters)}, outcome ${n.outcome==='NO_MATCH_IN_SCOPE'?'no match in searched scope':escape(n.outcome)}, attribution ${escape(n.executionMode)}, limitations ${escape(n.coverageNotes)}`);
 for(const ev of bundle.reviewEvents.filter(x=>x.claimId===c.id))rows.push(`- Review event: ${escape(ev.actor)} (${escape(ev.reviewedAt)}) — ${escape(ev.verdict)}; ${escape(ev.rationale)}`);
 for(const iss of issues.filter(x=>x.claimId===c.id))rows.push(`- Rule ${escape(iss.ruleId)} [${iss.severity}]: ${escape(iss.message)}`);
 rows.push('')}
 rows.push('## Image rights and incomplete material','');if(!omissions.length)rows.push('No recorded omissions for this export mode.');for(const o of omissions)rows.push(`- ${escape(o)}`);
 rows.push('','## Limits','',`This file does not validate rune readings, ancient dates, or magical efficacy. Searches were not performed automatically by the K1 compiler.`,``, `Research record SHA, source revisions, and media digests appear in the accompanying manifest.`,'');return rows.join('\n')
}
export async function compileCasefile(bundle:CaseBundle,availableMedia:ReadonlyMap<string,Uint8Array>,options:ExportOptions):Promise<CompiledCasefile>{
 validateCaseBundle(bundle);
 if(options.frozenRevision!==undefined&&bundle.case.revision!==options.frozenRevision)throw Error('Case revision has changed since export request');
 const clone=structuredClone(bundle),files:Record<string,Uint8Array>={},omissions:string[]=[];
 if(options.includeMetadata===false){throw Error('K1 needs case metadata for a meaningful export; select a complete or explicitly incomplete mode')}
 for(const a of clone.assets){const media=availableMedia.get(a.sha256);const canMeta=canUseAsset(a.rights,'METADATA_EXPORT').allowed;
  if(!canMeta){if(!options.allowIncomplete)throw Error('Incomplete export: asset metadata permission unknown or denied; explicitly allow incomplete export');const digest=a.sha256;const regionIds=clone.regions.filter(r=>r.imageSha256===digest).map(r=>r.id);clone.regions=clone.regions.filter(r=>r.imageSha256!==digest);for(const i of clone.items)i.regionIds=i.regionIds.filter(id=>!regionIds.includes(id));a.filename='[Withheld asset metadata]';a.sha256='0'.repeat(64);a.width=0;a.height=0;a.sourceUrl=undefined;a.orientation='WITHHELD';a.pixelStatus='MISSING';omissions.push(`Asset ${a.id}: metadata withheld (not a complete round-trip)`);continue}
  const allowed=options.mode==='SHAREABLE'?canDistributePixels(a.rights):canUseAsset(a.rights,'IMAGE_EXPORT').allowed;
  if(options.includeMedia&&allowed&&media){const digest=await sha256(media);if(digest===a.sha256){files[`media/${a.sha256}.${a.mime==='image/jpeg'?'jpg':a.mime==='image/webp'?'webp':'png'}`]=new Uint8Array(media)}else omissions.push(`Asset ${a.id}: media integrity mismatch; excluded`)}
  else if(options.includeMedia){omissions.push(`Asset ${a.id}: pixels omitted (${!allowed?'rights do not authorize this mode':'original bytes unavailable'})`)}
  else if(a.pixelStatus==='ORIGINAL_BYTES_LOCAL')omissions.push(`Asset ${a.id}: pixel bytes not requested in this export`);
  if(!Object.keys(files).some(name=>name.startsWith('media/'+a.sha256))){a.pixelStatus='MISSING'}
 }
 validateCaseBundle(clone);
 omissions.sort();const complete=omissions.length===0;
 files['casefile.json']=utf8(canonicalJson(clone));files['casefile.md']=utf8(makeMarkdown(clone,omissions,options.mode));
 const manifestFiles=[];
 for(const name of Object.keys(files).sort()){const bytes=files[name];manifestFiles.push({name,sha256:await sha256(bytes),size:bytes.length})}
 const manifest={manifestVersion:1,caseId:bundle.case.id,schemaVersion:1,sourceRevision:bundle.case.revision,exportMode:options.mode,complete,omissions,files:manifestFiles};
 files['manifest.json']=utf8(canonicalJson(manifest));return {files,omissions,complete};
}
