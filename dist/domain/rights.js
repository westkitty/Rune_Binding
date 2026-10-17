const KEY = { REFERENCE_LINK: 'referenceLink', VIEW: 'view', STORE: 'store', METADATA_EXPORT: 'metadataExport', IMAGE_EXPORT: 'imageExport', REDISTRIBUTE: 'redistribute' };
export function emptyRights() { return { referenceLink: 'UNKNOWN', view: 'UNKNOWN', store: 'UNKNOWN', metadataExport: 'UNKNOWN', imageExport: 'UNKNOWN', redistribute: 'UNKNOWN', basis: '' }; }
export function canUseAsset(rights, action) { const v = rights[KEY[action]]; return { allowed: v === 'ALLOW', reason: v === 'ALLOW' ? 'Permission explicitly recorded' : v === 'DENY' ? 'Permission denied' : 'Permission unverified; unknown is not consent' }; }
export function canDistributePixels(rights) { return canUseAsset(rights, 'IMAGE_EXPORT').allowed && canUseAsset(rights, 'REDISTRIBUTE').allowed; }
