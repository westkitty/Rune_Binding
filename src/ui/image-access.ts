import type {AssetRecord} from '../domain/schema.js';
import {canUseAsset} from '../domain/rights.js';
import {sha256} from '../export/canonical.js';
/** Permission precedes the cache; a previously cached preview grants no rights. */
export async function resolveImageUrl(asset:AssetRecord,
 readMedia:(digest:string)=>Promise<Uint8Array|null>,
 cache:Map<string,string>):Promise<string|undefined>{
 if(!canUseAsset(asset.rights,'VIEW').allowed)return undefined;
 const cached=cache.get(asset.sha256);
 if(cached)return cached;
 const bytes=await readMedia(asset.sha256);
 if(!bytes||await sha256(bytes)!==asset.sha256)return undefined;
 const url=URL.createObjectURL(new Blob([new Uint8Array(bytes)],{type:asset.mime}));
 cache.set(asset.sha256,url);
 return url;
}
