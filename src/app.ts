import {createBlankCase,validateCaseBundle} from './domain/schema.js';
import type {CaseBundle,RegionRecord,MediaPayload,AssetRecord} from './domain/schema.js';
import {newEntityId,nextDisplayId} from './domain/ids.js';
import {addSource,addWitness,addClaim,addReadingAlternative,attachEvidence,addSearchReceipt} from './domain/case-actions.js';
import {reviewClaim} from './domain/review.js';
import {prepareRaster} from './intake/raster.js';
import {openCaseRepository} from './storage/indexeddb-repository.js';
import {MemoryCaseRepository} from './storage/case-repository.js';
import type {CaseRepository,StorageHealth} from './storage/case-repository.js';
import {applyCasefileImport} from './export/import-casefile.js';
import type {ImportPreview,ImportResult} from './export/import-casefile.js';
import {CaseShelf} from './ui/CaseShelf.js';
import {SourceIntake} from './ui/SourceIntake.js';
import {AnnotationDesk} from './ui/AnnotationDesk.js';
import {ClaimLedger} from './ui/ClaimLedger.js';
import {ReviewDesk} from './ui/ReviewDesk.js';
import {CasefileDesk} from './ui/CasefileDesk.js';
const root=document.getElementById('app')!;
let repo:CaseRepository,active:CaseBundle|null=null;
let health:StorageHealth={available:false,mode:'UNAVAILABLE',usage:null,quota:null,persisted:null,warning:'Storage initializing'};
let view:'shelf'|'sources'|'annotations'|'claims'|'review'|'casefile'='shelf';
let notice='';const objectUrls=new Map<string,string>();
function label(text:string,tag='span',className=''){const e=document.createElement(tag);e.textContent=text;if(className)e.className=className;return e}
async function refreshHealth(){try{health=await repo.storageHealth()}catch{health={available:false,mode:'UNAVAILABLE',usage:null,quota:null,persisted:null,warning:'Storage status unavailable. Export frequently.'}}}
async function cases(){return repo.listCases()}
async function persistStorage(){try{const ok=await navigator.storage?.persist?.();notice=ok?'Browser granted persistent storage preference. Keep exporting backups.':'Browser did not grant persistent storage. Export backups to protect your cases.'}catch{notice='Persistent storage API unavailable. Export casefiles for backup.'}await render()}
async function navigate(page:typeof view){view=page;await render()}
async function createCase(title:string){const b=createBlankCase(title);await repo.createCase(b);active=b;view='claims';notice='Case created locally. Start by recording a source or item.';await render()}
async function openCase(id:string){const b=await repo.getCase(id);if(!b)throw Error('Case not found');active=b;view='claims';notice='Opened case '+b.case.title;await render()}
async function save(update:(b:CaseBundle)=>CaseBundle,media:MediaPayload[]=[]){if(!active)throw Error('No active case');const id=active.case.id;
 try{const out=await repo.mutateCase(id,active.case.revision,newEntityId(),update,media);active=out;notice='Saved revision '+out.case.revision+' to local storage.';await render()}catch(err){notice='Save not completed: '+String(err);await render();throw err}}
async function importCase(preview:ImportPreview,choice:'CREATE_NEW'|'MERGE_IDENTICAL'|'REVIEW_CONFLICTS'):Promise<ImportResult>{const result=await applyCasefileImport(repo,preview,choice);if(result.status==='IMPORTED'||result.status==='IDENTICAL'){active=await repo.getCase(result.caseId);notice=result.message;view='casefile';await render()}return result}
function nav():HTMLElement{const n=document.createElement('nav');n.className='workspace-nav';n.setAttribute('aria-label','Research workspace');for(const [key,text] of [['shelf','Case shelf'],['sources','Sources'],['annotations','Annotation'],['claims','Claims'],['review','Evidence review'],['casefile','Casefile']] as const){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=view===key?'active':'';if(key!=='shelf'&&!active)b.disabled=true;b.setAttribute('aria-current',view===key?'page':'false');b.addEventListener('click',()=>{void navigate(key)});n.append(b)}return n}
async function getImageUrl(asset:AssetRecord):Promise<string|undefined>{if(objectUrls.has(asset.sha256))return objectUrls.get(asset.sha256);if(asset.rights.view==='DENY')return undefined;const bytes=await repo.getMedia(asset.sha256);if(!bytes)return undefined;const url=URL.createObjectURL(new Blob([new Uint8Array(bytes)],{type:asset.mime}));objectUrls.set(asset.sha256,url);return url}
async function annotationPanel(bundle:CaseBundle):Promise<HTMLElement>{const box=document.createElement('div');box.className='annotation-layout';const h=label('Inspect the original image','h2');const p=label('Regions use original-image coordinates, not window pixels. You can draw or enter X / Y / width / height by keyboard.','p');box.append(h,p);
 if(!bundle.assets.length){box.append(label('Import a raster image on the Sources tab.','p','notice'));return box}
 const a=bundle.assets[0];const item=bundle.items.find(x=>x.assetId===a.id);const preview=await getImageUrl(a);
 box.append(AnnotationDesk({asset:a,regions:bundle.regions,imageUrl:preview,itemId:item?.id,onChange:r=>{void save(b=>{b.regions.push(r);const target=b.items.find(x=>x.id===r.itemId);if(target)target.regionIds.push(r.id);return validateCaseBundle(b)})}}));
 if(bundle.assets.length>1)box.append(label('Only the first imported image is selected in this K1 inspector. Additional images remain in the case record.','p','notice warning'));
 return box;
}
async function render(){await refreshHealth();root.replaceChildren();root.append(nav());if(notice){const bar=label(notice,'p','live-notice');bar.setAttribute('role','status');root.append(bar)}
 if(!active||view==='shelf'){root.append(CaseShelf({cases:await cases(),active,health,onCreate:createCase,onOpen:openCase,onPersist:persistStorage}));return}
 const sub=document.createElement('div');sub.className='case-head';sub.append(label(active.case.title,'h2'),label('REVISION '+active.case.revision+' · LOCAL ONLY','span','eyebrow'));root.append(sub);
 const b=active;
 if(view==='sources')root.append(SourceIntake({bundle:b,onSource:s=>save(x=>addSource(x,s)),onWitness:w=>save(x=>addWitness(x,w)),onRaster:async(file,rights)=>{const {asset,media}=await prepareRaster(file,rights);asset.displayId=nextDisplayId(b,'IMG');const url=URL.createObjectURL(file);objectUrls.set(asset.sha256,url);await save(x=>{x.assets.push(asset);const itemId=newEntityId();x.items.push({id:itemId,displayId:nextDisplayId(x,'ITEM'),label:'Mark in '+file.name,assetId:asset.id,regionIds:[]});return validateCaseBundle(x)},media?[media]:[])}}));
 else if(view==='claims')root.append(ClaimLedger({bundle:b,onItem:name=>save(x=>{x.items.push({id:newEntityId(),displayId:nextDisplayId(x,'ITEM'),label:name,regionIds:[]});return validateCaseBundle(x)}),onClaim:v=>save(x=>addClaim(x,v)),onLink:l=>save(x=>attachEvidence(x,l)),onReading:r=>save(x=>addReadingAlternative(x,r)),onSearch:s=>save(x=>addSearchReceipt(x,s))}));
 else if(view==='annotations')root.append(await annotationPanel(b));
 else if(view==='review')root.append(ReviewDesk({bundle:b,onReview:c=>save(x=>reviewClaim(x,c))}));
 else if(view==='casefile')root.append(CasefileDesk({bundle:b,getMedia:id=>repo.getMedia(id),onImport:importCase}));
}
export async function startApp(){try{repo=await openCaseRepository()}catch(err){repo=new MemoryCaseRepository();notice='Browser storage unavailable; using ephemeral memory. Export before closing.'}
 await render();if('serviceWorker' in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('./sw.js').catch(()=>{notice='Offline installation unavailable; case data may still work while the browser is open.'})}}
