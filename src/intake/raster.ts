import type {AssetRecord,MediaPayload,RightsPolicy} from '../domain/schema.js';
import {canUseAsset} from '../domain/rights.js';
import {newEntityId} from '../domain/ids.js';
const MAX_BYTES=20*1024*1024;const MAX_PIXELS=40_000_000;
function ascii(b:Uint8Array,p:number,n:number){return String.fromCharCode(...b.slice(p,p+n))}
function u32(b:Uint8Array,p:number){return (b[p]*2**24+b[p+1]*2**16+b[p+2]*2**8+b[p+3])>>>0}
function sizeFromHeader(b:Uint8Array):{mime:string;width:number;height:number}{
 if(b.length>=24&&b[0]===137&&ascii(b,1,3)==='PNG'&&ascii(b,4,4)==='\r\n\x1a\n'&&ascii(b,12,4)==='IHDR'){return {mime:'image/png',width:u32(b,16),height:u32(b,20)}}
 if(b.length>=20&&ascii(b,0,4)==='RIFF'&&ascii(b,8,4)==='WEBP'){
  if(ascii(b,12,4)==='VP8X'&&b.length>=30){return {mime:'image/webp',width:1+b[24]+b[25]*256+b[26]*65536,height:1+b[27]+b[28]*256+b[29]*65536}}
  if(ascii(b,12,4)==='VP8 '&&b.length>=30){return {mime:'image/webp',width:(b[26]+b[27]*256)&0x3fff,height:(b[28]+b[29]*256)&0x3fff}}
  if(ascii(b,12,4)==='VP8L'&&b.length>=25){const x=b[21]+b[22]*256+b[23]*65536+b[24]*16777216;return {mime:'image/webp',width:1+(x&0x3fff),height:1+((x>>14)&0x3fff)}}
 }
 if(b.length>=4&&b[0]===255&&b[1]===216){let p=2;while(p+9<b.length){if(b[p]!==255){p++;continue}const marker=b[p+1];if(marker===0xda||marker===0xd9)break;if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)){return {mime:'image/jpeg',width:b[p+7]*256+b[p+8],height:b[p+5]*256+b[p+6]}}if(marker===0x01||(marker>=0xd0&&marker<=0xd7)){p+=2;continue}const len=b[p+2]*256+b[p+3];if(len<2||p+len+2>b.length)break;p+=len+2}}
 throw Error('Unsupported or damaged raster signature');
}
export async function prepareRaster(file:File,rights:RightsPolicy):Promise<{asset:AssetRecord;media:MediaPayload|null}>{
 if(file.size<=0||file.size>MAX_BYTES)throw Error('Image too large or empty');
 const bytes=new Uint8Array(await file.arrayBuffer());const dimensions=sizeFromHeader(bytes);
 if(file.type&&file.type!==dimensions.mime)throw Error('Image MIME does not match signature');
 if(dimensions.width<1||dimensions.height<1||dimensions.width*dimensions.height>MAX_PIXELS)throw Error('Image dimensions exceed pixel limit');
 if(typeof createImageBitmap==='function'){try{const bitmap=await createImageBitmap(new Blob([new Uint8Array(bytes)],{type:dimensions.mime}));if(bitmap.width*bitmap.height>MAX_PIXELS||bitmap.width!==dimensions.width||bitmap.height!==dimensions.height)throw Error('Image dimensions inconsistent');bitmap.close()}catch(e){throw Error('Failed to decode or validate raster image: '+String(e))}}
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const save=canUseAsset(rights,'STORE').allowed;
 const asset:AssetRecord={id:newEntityId(),displayId:'IMG-001',filename:file.name.slice(0,250),sha256:hash,mime:dimensions.mime,width:dimensions.width,height:dimensions.height,orientation:'AS_DECODED_EXIF_UNVERIFIED',pixelStatus:save?'ORIGINAL_BYTES_LOCAL':'EPHEMERAL_PREVIEW',rights};
 return {asset,media:save?{sha256:hash,bytes}:null};
}
