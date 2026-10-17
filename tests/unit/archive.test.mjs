import test from 'node:test';
import assert from 'node:assert/strict';
import {createBlankCase} from '../../dist/domain/schema.js';
import {compileCasefile} from '../../dist/export/casefile.js';
import {parseCasefileImport} from '../../dist/export/import-casefile.js';
const pkg=await import('../../dist/export/archive.js').catch(()=>null);
const encoder=new TextEncoder();
test('single_zip_archive_is_stable_and_restores_a_real_casefile',async()=>{
 assert.ok(pkg?.packCasefileArchive,'ZIP packer required');assert.ok(pkg?.unpackCasefileArchive,'ZIP reader required');
 const b=createBlankCase('Synthetic case archive');
 const compiled=await compileCasefile(b,new Map(),{mode:'PRIVATE_BACKUP',includeMedia:false});
 const a=pkg.packCasefileArchive(compiled.files),again=pkg.packCasefileArchive(compiled.files);
 assert.deepEqual(a,again);assert.deepEqual([...a.slice(0,4)],[80,75,3,4]);
 const decoded=pkg.unpackCasefileArchive(a);
 assert.deepEqual(Object.keys(decoded).sort(),Object.keys(compiled.files).sort());
 for(const key of Object.keys(compiled.files))assert.deepEqual(decoded[key],compiled.files[key]);
 const imported=await parseCasefileImport(decoded['casefile.json'],decoded['manifest.json'],new Map(Object.entries(decoded).filter(([name])=>name.startsWith('media/'))));
 assert.equal(imported.bundle.case.id,b.case.id);assert.equal(imported.complete,true);
});
test('archive rejects path traversal and unexpected files',()=>{
 assert.ok(pkg?.packCasefileArchive);
 assert.throws(()=>pkg.packCasefileArchive({'../../secret.txt':encoder.encode('oops')}),/unsafe|name|file/i);
 assert.throws(()=>pkg.packCasefileArchive({'media/../../escape.png':encoder.encode('oops')}),/unsafe|name|file/i);
});
test('archive validates stored bytes with CRC and refuses truncation',()=>{
 assert.ok(pkg?.unpackCasefileArchive);
 const files={'casefile.json':encoder.encode('a'), 'casefile.md':encoder.encode('b'), 'manifest.json':encoder.encode('c')};
 const valid=pkg.packCasefileArchive(files);
 const corrupted=new Uint8Array(valid);corrupted[30+'casefile.json'.length]^=0x20;
 assert.throws(()=>pkg.unpackCasefileArchive(corrupted),/CRC|integrity|mismatch/i);
 assert.throws(()=>pkg.unpackCasefileArchive(valid.slice(0,-5)),/zip|central|end|truncat/i);
});

test('ZIP headers use a valid deterministic DOS date',()=>{
 assert.ok(pkg?.packCasefileArchive);
 const files={'casefile.json':encoder.encode('a'),'casefile.md':encoder.encode('b'),'manifest.json':encoder.encode('c')};
 const bytes=pkg.packCasefileArchive(files),v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 assert.equal(v.getUint16(12,true),33,'1980-01-01 is earliest valid ZIP date');
});
