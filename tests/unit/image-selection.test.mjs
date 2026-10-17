import test from 'node:test';
import assert from 'node:assert/strict';
const m=await import('../../dist/domain/image-selection.js').catch(()=>null);
const assets=[{id:'first',filename:'one.png',sha256:'a'.repeat(64)},{id:'second',filename:'two.png',sha256:'b'.repeat(64)}];
test('annotation image picker can select the second and falls back if missing',()=>{
 assert.ok(m?.chooseAnnotationAsset,'image selection helper required');
 assert.equal(m.chooseAnnotationAsset(assets,'second')?.id,'second');
 assert.equal(m.chooseAnnotationAsset(assets,'removed')?.id,'first');
 assert.equal(m.chooseAnnotationAsset([],null),null);
});
test('annotation item association must match selected image rather than first image',()=>{
 assert.ok(m?.findImageItem);
 const b={items:[{id:'i1',assetId:'first'},{id:'i2',assetId:'second'}]};
 assert.equal(m.findImageItem(b,assets[1])?.id,'i2');
 assert.equal(m.findImageItem(b,null),undefined);
});
