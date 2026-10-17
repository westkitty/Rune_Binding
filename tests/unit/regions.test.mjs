import test from 'node:test';import assert from 'node:assert/strict';
import {screenToNormalizedPoint,normalizeRegion} from '../../dist/domain/regions.js';
const hash='a'.repeat(64);
test('annotation_survives_zoom_resize_orientation',()=>{const a=screenToNormalizedPoint(300,250,{left:100,top:100,displayWidth:200,displayHeight:150,zoom:2,panX:100,panY:50});assert.equal(a.x,.25);assert.equal(a.y,1/3);const b=normalizeRegion({x:.2,y:.3},{x:.6,y:.9},hash,{width:100,height:60},'ROTATED_90');assert.equal(b.orientation,'ROTATED_90');assert.ok(Math.abs(b.w-.4)<1e-10)});
test('out_of_bounds_rect_rejected',()=>assert.throws(()=>normalizeRegion({x:-.01,y:0},{x:1,y:1},hash,{width:2,height:2},'UP'),/bounds/i));
test('numeric_rect_and_pointer_rect_are_equivalent',()=>{const v={left:10,top:20,displayWidth:500,displayHeight:300,zoom:1,panX:0,panY:0};const p=screenToNormalizedPoint(110,80,v);const q=screenToNormalizedPoint(310,200,v);const r=normalizeRegion(p,q,hash,{width:1000,height:600},'UP');assert.ok(Math.abs(r.x-.2)<1e-9);assert.ok(Math.abs(r.y-.2)<1e-9);assert.ok(Math.abs(r.w-.4)<1e-9)});
