import { validateCaseBundle } from '../domain/schema.js';
export class ConflictError extends Error {
    constructor(message = 'Conflicting case revision or entity identity') { super(message); this.name = 'ConflictError'; }
}
export function mutated(current, update) {
    const next = update(structuredClone(current));
    if (next.case.id !== current.case.id)
        throw new ConflictError('Case identity cannot change');
    if (next.schemaVersion !== 1)
        throw new ConflictError('Unsupported schema migration');
    if (JSON.stringify(next.reviewEvents.slice(0, current.reviewEvents.length)) !== JSON.stringify(current.reviewEvents))
        throw new ConflictError('Review history append-only');
    if (next.reviewEvents.length < current.reviewEvents.length)
        throw new ConflictError('Review history cannot shrink');
    next.case.revision = current.case.revision + 1;
    next.case.updatedAt = new Date().toISOString();
    validateCaseBundle(next);
    return next;
}
function validateMedia(media) { for (const m of media) {
    if (!/^[a-f0-9]{64}$/.test(m.sha256) || !(m.bytes instanceof Uint8Array) || m.bytes.byteLength > 20 * 1024 * 1024)
        throw Error('Invalid media payload');
} }
export class MemoryCaseRepository {
    cases = new Map();
    media = new Map();
    operations = new Map();
    async listCases() { return [...this.cases.values()].map(v => structuredClone(v.case)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }
    async getCase(id) { const r = this.cases.get(id); return r ? structuredClone(r) : null; }
    async createCase(bundle, media = []) { validateCaseBundle(bundle); validateMedia(media); if (this.cases.has(bundle.case.id))
        throw new ConflictError('Existing case ID'); this.cases.set(bundle.case.id, structuredClone(bundle)); for (const m of media)
        this.media.set(m.sha256, new Uint8Array(m.bytes)); }
    async mutateCase(id, revision, mutationId, update, media = []) {
        if (!mutationId || mutationId.length > 200)
            throw Error('Mutation ID required');
        const key = id + '|' + mutationId;
        const existing = this.cases.get(id);
        if (!existing)
            throw new ConflictError('Missing case');
        if (this.operations.has(key))
            return structuredClone(existing);
        if (existing.case.revision !== revision)
            throw new ConflictError('Stale revision');
        validateMedia(media);
        const next = mutated(existing, update);
        this.cases.set(id, structuredClone(next));
        for (const m of media)
            this.media.set(m.sha256, new Uint8Array(m.bytes));
        this.operations.set(key, 'done');
        return structuredClone(next);
    }
    async getMedia(digest) { const value = this.media.get(digest); return value ? new Uint8Array(value) : null; }
    async storageHealth() { return { available: true, mode: 'EPHEMERAL', usage: null, quota: null, persisted: false, warning: 'Ephemeral mode: export a backup. Data may not survive restart.' }; }
}
