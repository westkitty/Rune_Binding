import test from 'node:test';import assert from 'node:assert/strict';
import * as desk from '../../dist/ui/CasefileDesk.js';
test('original_raster_download_has_correct_content_type',()=>{
 assert.equal(typeof desk.downloadMime,'function','downloadMime must be a testable pure interface');
 assert.equal(desk.downloadMime('media/demo.png'),'image/png');
 assert.equal(desk.downloadMime('media/demo.jpg'),'image/jpeg');
 assert.equal(desk.downloadMime('media/demo.webp'),'image/webp');
 assert.equal(desk.downloadMime('casefile.json'),'application/json');
 assert.equal(desk.downloadMime('casefile.md'),'text/markdown');
 assert.equal(typeof desk.downloadName,'function','Browser downloads need flat names for restore');
 assert.equal(desk.downloadName('media/abcdef.png'),'abcdef.png');
 assert.equal(desk.downloadName('casefile.md'),'casefile.md');
});
