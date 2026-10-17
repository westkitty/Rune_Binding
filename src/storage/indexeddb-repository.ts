import {validateCaseBundle} from '../domain/schema.js';
import type {CaseBundle,CaseHeader,MediaPayload} from '../domain/schema.js';
import type {CaseRepository,StorageHealth} from './case-repository.js';
import {ConflictError,mutated} from './case-repository.js';
function request<T>(r:IDBRequest<T>):Promise<T>{return new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('IndexedDB request error'))})}
function finished(tx:IDBTransaction):Promise<void>{return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error||Error('Storage transaction aborted'));tx.onerror=()=>{} })}
function openDB(name:string):Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>{const db=r.result;for(const store of ['cases','media','operations'])if(!db.objectStoreNames.contains(store))db.createObjectStore(store)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Storage unavailable'));r.onblocked=()=>reject(Error('Storage upgrade blocked by another open tab'))})}
export async function openCaseRepository(dbName='rune-binding-k1'):Promise<CaseRepository>{if(typeof indexedDB==='undefined')throw Error('IndexedDB unavailable');const db=await openDB(dbName);return new IndexedCaseRepository(db)}
export class IndexedCaseRepository implements CaseRepository{
 constructor(readonly db:IDBDatabase){}
 close(){this.db.close()}
 async listCases():Promise<CaseHeader[]>{const tx=this.db.transaction('cases','readonly');const found=await request(tx.objectStore('cases').getAll()) as CaseBundle[];return found.map(x=>x.case).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))}
 async getCase(id:string):Promise<CaseBundle|null>{const tx=this.db.transaction('cases','readonly');const found=await request(tx.objectStore('cases').get(id));return found?validateCaseBundle(found):null}
 async createCase(bundle:CaseBundle,media:MediaPayload[]=[]):Promise<void>{validateCaseBundle(bundle);const tx=this.db.transaction(['cases','media'],'readwrite');const done=finished(tx);tx.objectStore('cases').add(structuredClone(bundle),bundle.case.id);for(const m of media){if(!/^[a-f0-9]{64}$/.test(m.sha256)||m.bytes.byteLength>20*1024*1024)throw Error('Invalid media payload');tx.objectStore('media').put(m.bytes,m.sha256)}await done}
 async mutateCase(id:string,revision:number,mutationId:string,update:(c:CaseBundle)=>CaseBundle,media:MediaPayload[]=[]):Promise<CaseBundle>{
   if(!mutationId||mutationId.length>200)throw Error('Mutation ID required');for(const m of media){if(!/^[a-f0-9]{64}$/.test(m.sha256)||!(m.bytes instanceof Uint8Array)||m.bytes.byteLength>20*1024*1024)throw Error('Invalid media payload')}
   const tx=this.db.transaction(['cases','media','operations'],'readwrite');const done=finished(tx);const cases=tx.objectStore('cases');const ops=tx.objectStore('operations');const stored=await Promise.all([request(cases.get(id)),request(ops.get(id+'|'+mutationId))]);
   const current=stored[0] as CaseBundle|undefined;
   if(!current){tx.abort();await done.catch(()=>{});throw new ConflictError('Missing case')}
   if(stored[1]){tx.abort();await done.catch(()=>{});return structuredClone(current)}
   if(current.case.revision!==revision){tx.abort();await done.catch(()=>{});throw new ConflictError('Stale revision')}
   let next:CaseBundle;
   try{next=mutated(current,update)}catch(e){tx.abort();await done.catch(()=>{});throw e}
   cases.put(next,id);for(const m of media)tx.objectStore('media').put(m.bytes,m.sha256);ops.put({caseId:id,mutationId,revision:next.case.revision},id+'|'+mutationId);
   await done;return structuredClone(next);
 }
 async getMedia(digest:string){const tx=this.db.transaction('media','readonly');const r=await request(tx.objectStore('media').get(digest));return r?new Uint8Array(r as ArrayBufferLike):null}
 async storageHealth():Promise<StorageHealth>{let usage=null as number|null,quota=null as number|null,persisted=null as boolean|null;try{const e=await navigator.storage?.estimate?.();usage=e?.usage??null;quota=e?.quota??null;persisted=await navigator.storage?.persisted?.()??null}catch{}return {available:true,mode:'PERSISTENT',usage,quota,persisted,warning:'Browser storage may be cleared or evicted. Export backups regularly.'}}
}
