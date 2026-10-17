import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('workbench_exposes_single_file_case_archive_export_and_restore',async()=>{
 const compiled=await readFile('dist/ui/CasefileDesk.js','utf8');
 assert.match(compiled,/Download ZIP backup/);
 assert.match(compiled,/Restore from ZIP backup/);
 assert.match(compiled,/unpackCasefileArchive/);
});
