import { validateCaseBundle } from './schema.js';
const KEY = { REFERENCE_LINK: 'referenceLink', VIEW: 'view', STORE: 'store', METADATA_EXPORT: 'metadataExport', IMAGE_EXPORT: 'imageExport', REDISTRIBUTE: 'redistribute' };
export function emptyRights() { return { referenceLink: 'UNKNOWN', view: 'UNKNOWN', store: 'UNKNOWN', metadataExport: 'UNKNOWN', imageExport: 'UNKNOWN', redistribute: 'UNKNOWN', basis: '' }; }
export function canUseAsset(rights, action) { const v = rights[KEY[action]]; return { allowed: v === 'ALLOW', reason: v === 'ALLOW' ? 'Permission explicitly recorded' : v === 'DENY' ? 'Permission denied' : 'Permission unverified; unknown is not consent' }; }
export function canDistributePixels(rights) { return rights.basis.trim().length > 0 && canUseAsset(rights, 'IMAGE_EXPORT').allowed && canUseAsset(rights, 'REDISTRIBUTE').allowed; }
/** A deliberate local-view decision does not grant public distribution or rewrite source history. */
export function changeImageViewRight(bundle, assetId, view, reason) {
    if (!['ALLOW', 'DENY', 'UNKNOWN'].includes(view))
        throw Error('Invalid view right');
    const note = reason.trim();
    if (note.length < 8 || note.length > 1000)
        throw Error('Explicit local-view reason or basis required');
    const next = structuredClone(bundle);
    const asset = next.assets.find(a => a.id === assetId);
    if (!asset)
        throw Error('Unknown source image');
    const prior = asset.rights.basis.trim();
    const addition = `Local view ${view}: ${note}`;
    const basis = prior ? prior + ' | ' + addition : addition;
    if (basis.length > 3000)
        throw Error('Rights basis log is full; preserve earlier history');
    asset.rights.view = view;
    asset.rights.basis = basis;
    return validateCaseBundle(next);
}
