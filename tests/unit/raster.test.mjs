import test from 'node:test';import assert from 'node:assert/strict';
import {prepareRaster} from '../../dist/intake/raster.js';import {emptyRights} from '../../dist/domain/rights.js';
const png=new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,6,0,0,0]);
test('renamed_svg_rejected_despite_image_mime',async()=>{await assert.rejects(()=>prepareRaster(new File(['<svg onload="alert(1)"></svg>'],'bad.png',{type:'image/png'}),emptyRights()),/signature|image/i)});
test('image_mime_and_digest_are_content_bound',async()=>{const r=await prepareRaster(new File([png],'one.png',{type:'image/png'}),emptyRights());assert.equal(r.asset.width,1);assert.equal(r.media,null);const altered=new Uint8Array(png);altered[27]=2;const x=await prepareRaster(new File([altered],'two.png',{type:'image/png'}),emptyRights());assert.notEqual(r.asset.sha256,x.asset.sha256)});
test('decompression_bomb_or_oversize_rejected',async()=>{const large=new Uint8Array(png);large[16]=0x7f;await assert.rejects(()=>prepareRaster(new File([large],'huge.png',{type:'image/png'}),emptyRights()),/pixel|dimension|large/i)});
test('link_only_never_claims_pixels_viewed',async()=>{const r=await prepareRaster(new File([png],'one.png',{type:'image/png'}),emptyRights());assert.equal(r.asset.pixelStatus,'EPHEMERAL_PREVIEW')});
