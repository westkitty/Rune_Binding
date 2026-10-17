import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
test('public_publish_script_refuses_missing_authorized_github_cli',async()=>{
 const path='scripts/publish-public.sh';
 const script=await readFile(path,'utf8');
 assert.match(script,/westkitty\/Rune_Binding/);
 assert.match(script,/gh auth status/);
 assert.match(script,/git push -u origin main/);
 assert.doesNotMatch(script,/--force/);
 assert.equal(spawnSync('sh',['-n',path],{encoding:'utf8'}).status,0);
});
