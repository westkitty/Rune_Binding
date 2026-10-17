export function newEntityId() { return crypto.randomUUID(); }
const COLLECTIONS = { SRC: 'sources', WIT: 'witnesses', DES: 'designs', CLM: 'claims', EDGE: 'edges', IMG: 'assets', ITEM: 'items' };
export function nextDisplayId(bundle, prefix) {
    const key = COLLECTIONS[prefix];
    const records = (bundle[key] || []);
    const nums = records.map(x => Number(x.displayId?.match(/-([0-9]+)$/)?.[1] || 0));
    return `${prefix}-${String(Math.max(0, ...nums) + 1).padStart(3, '0')}`;
}
