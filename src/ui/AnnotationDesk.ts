import type {AssetRecord,RegionRecord,NormalizedPoint} from '../domain/schema.js';
import {normalizeRegion,screenToNormalizedPoint} from '../domain/regions.js';
export function AnnotationDesk({asset,regions,onChange,imageUrl,itemId}:{asset:AssetRecord|null;regions:RegionRecord[];onChange:(r:RegionRecord)=>void;imageUrl?:string;itemId?:string}):HTMLElement{
 const section=document.createElement('section');section.className='pane';section.setAttribute('aria-label','Image annotation');
 const h=document.createElement('h3');h.textContent='Region annotation';section.append(h);
 if(!asset){const p=document.createElement('p');p.textContent='Import a local image before placing a region.';section.append(p);return section}
 if(!imageUrl){const p=document.createElement('p');p.textContent='Original image bytes are unavailable on this device. Annotation is blocked until they are restored.';p.className='notice warning';section.append(p);return section}
 const stage=document.createElement('div');stage.className='image-stage';stage.setAttribute('aria-label','Original image region selection');
 const img=document.createElement('img');img.src=imageUrl;img.alt='Imported research image; mark a region below';img.draggable=false;img.style.width='100%';img.style.display='block';img.style.userSelect='none';stage.append(img);
 const overlay=document.createElement('div');overlay.className='region-overlay';stage.append(overlay);
 const zoomRow=document.createElement('label');zoomRow.textContent='Zoom ';const zoom=document.createElement('input');zoom.type='range';zoom.min='1';zoom.max='3';zoom.step='.25';zoom.value='1';zoom.setAttribute('aria-label','Image zoom');zoomRow.append(zoom);section.append(zoomRow);
 let start:NormalizedPoint|null=null;
 function add(a:NormalizedPoint,b:NormalizedPoint){try{const r=normalizeRegion(a,b,asset.sha256,{width:asset.width,height:asset.height},asset.orientation);r.itemId=itemId;onChange(r)}catch(e){message.textContent=String(e)}}
 function point(e:PointerEvent){const rect=img.getBoundingClientRect();return screenToNormalizedPoint(e.clientX,e.clientY,{left:rect.left,top:rect.top,displayWidth:rect.width/Number(zoom.value),displayHeight:rect.height/Number(zoom.value),zoom:Number(zoom.value),panX:0,panY:0})}
 stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;start=point(e);stage.setPointerCapture(e.pointerId)});
 stage.addEventListener('pointerup',e=>{if(!start)return;const end=point(e);add(start,end);start=null;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId)});
 zoom.addEventListener('input',()=>{img.style.transformOrigin='top left';img.style.transform=`scale(${zoom.value})`;overlay.style.transformOrigin='top left';overlay.style.transform=`scale(${zoom.value})`});
 section.append(stage);
 const controls=document.createElement('div');controls.className='region-numeric';const inputs:HTMLInputElement[]=[];
 for(const [label,val] of [['X',.1],['Y',.1],['Width',.35],['Height',.35]] as const){const l=document.createElement('label');l.textContent=label;const input=document.createElement('input');input.type='number';input.min='0';input.max='1';input.step='.01';input.value=String(val);input.setAttribute('aria-label','Region '+label);l.append(input);inputs.push(input);controls.append(l)}
 const commit=document.createElement('button');commit.type='button';commit.textContent='Save region';commit.addEventListener('click',()=>{const [x,y,w,h]=inputs.map(x=>Number(x.value));add({x,y},{x:x+w,y:y+h})});controls.append(commit);section.append(controls);
 const message=document.createElement('p');message.setAttribute('role','status');section.append(message);
 for(const r of regions.filter(r=>r.imageSha256===asset.sha256)){const box=document.createElement('div');box.className='region-box';box.style.cssText=`left:${r.x*100}%;top:${r.y*100}%;width:${r.w*100}%;height:${r.h*100}%`;box.title='Region '+r.id;overlay.append(box)}
 return section;
}
