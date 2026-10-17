import test from 'node:test';
import assert from 'node:assert/strict';
import {localImageConsent,studyTitleFromImage} from '../../dist/domain/quick-start.js';
import {canUseAsset,canDistributePixels} from '../../dist/domain/rights.js';

test('quick image import authorizes only on-device viewing and storage',()=>{
 const policy=localImageConsent();
 assert.equal(canUseAsset(policy,'VIEW').allowed,true);
 assert.equal(canUseAsset(policy,'STORE').allowed,true);
 assert.equal(canUseAsset(policy,'IMAGE_EXPORT').allowed,false);
 assert.equal(canUseAsset(policy,'REDISTRIBUTE').allowed,false);
 assert.equal(canDistributePixels(policy),false);
 assert.match(policy.basis,/on.device|local/i);
});

test('quick import creates useful safe title without demanding any text',()=>{
 assert.equal(studyTitleFromImage('my-symbol.png'),'Study: my-symbol');
 assert.equal(studyTitleFromImage('  '),'Untitled symbol study');
 assert.equal(studyTitleFromImage('../../artifact.jpg'),'Study: artifact');
 assert.ok(studyTitleFromImage('x'.repeat(900)+'.png').length<=300);
});
