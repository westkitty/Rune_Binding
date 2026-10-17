import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
test('sources_expose_explicit_local_view_rights_change_for_past_imports',async()=>{
 const source=await readFile('dist/ui/SourceIntake.js','utf8');
 const app=await readFile('dist/app.js','utf8');
 assert.match(source,/Change local viewing/);
 assert.match(source,/onViewRights/);
 assert.match(app,/changeImageViewRight/);
 assert.match(app,/Update image access/);
});
