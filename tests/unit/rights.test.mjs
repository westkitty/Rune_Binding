import test from 'node:test';import assert from 'node:assert/strict';
import {canUseAsset,emptyRights} from '../../dist/domain/rights.js';
test('unknown_rights_never_embed_pixels',()=>{const rights=emptyRights();assert.equal(canUseAsset(rights,'IMAGE_EXPORT').allowed,false);assert.equal(canUseAsset(rights,'STORE').allowed,false);assert.equal(canUseAsset({...rights,store:'ALLOW'},'STORE').allowed,true)});
test('restricted_rights_need_specific_permission',()=>{const rights={...emptyRights(),imageExport:'ALLOW',redistribute:'UNKNOWN'};assert.equal(canUseAsset(rights,'IMAGE_EXPORT').allowed,true);assert.equal(canUseAsset(rights,'REDISTRIBUTE').allowed,false)});
