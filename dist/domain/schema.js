/* Rune Binding: evidence categories are independent; structural validation is not historical verification. */
export const DIMENSIONS = ['FORM', 'READING', 'NAME', 'MEANING', 'DATE', 'PURPOSE', 'TRANSMISSION'];
export const VERDICTS = ['ATTESTED', 'SCHOLARLY_RECONSTRUCTION', 'PLAUSIBLE_HYPOTHESIS', 'LATER_HISTORICAL_TRADITION', 'MODERN_DOCUMENTED', 'UNVERIFIED', 'CONTRADICTED_MISATTRIBUTED'];
export const REVIEW_STATES = ['DRAFT', 'EVIDENCE_PENDING', 'READY_FOR_REVIEW', 'REVIEWED', 'BLOCKED', 'SUPERSEDED'];
export const INSPECTION = ['ORIGINAL_BYTES_VIEWED', 'FACSIMILE_VIEWED', 'EDITION_VIEWED', 'METADATA_ONLY', 'SECONDARY_SUMMARY', 'NOT_ACCESSED'];
const MAX_RECORDS = 50000;
const STRINGS = 15000;
function error(msg) { throw Error(msg); }
function record(o, label) { if (!o || typeof o !== 'object' || Array.isArray(o))
    error('invalid ' + label); return o; }
function string(v, label, max = STRINGS) { if (typeof v !== 'string' || v.length > max)
    error('invalid ' + label); }
function number(v, label) { if (typeof v !== 'number' || !Number.isFinite(v))
    error('invalid ' + label); }
function dateRange(v) { if (v === undefined)
    return; const d = record(v, 'date'); const a = d.notBefore, b = d.notAfter; if (a !== null) {
    number(a, 'date notBefore');
    if (!Number.isInteger(a))
        error('invalid year');
} if (b !== null) {
    number(b, 'date notAfter');
    if (!Number.isInteger(b))
        error('invalid year');
} if (a !== null && b !== null && a > b)
    error('invalid date range'); if (!['OBJECT', 'SURVIVING_COPY', 'STATEMENT', 'PRACTICE'].includes(String(d.dateSubject)))
    error('invalid date subject'); }
const expectedArrays = ['sources', 'witnesses', 'designs', 'assets', 'items', 'regions', 'claims', 'evidenceLinks', 'edges', 'searchReceipts', 'reviewEvents', 'readingAlternatives'];
export function validateCaseBundle(value) {
    const b = record(value, 'case');
    if (b.schemaVersion !== 1)
        error('unsupported schema version');
    const c = record(b.case, 'case header');
    string(c.id, 'case ID', 200);
    string(c.title, 'title', 300);
    number(c.revision, 'revision');
    if (!Number.isSafeInteger(c.revision) || c.revision < 0)
        error('invalid revision');
    string(c.createdAt, 'createdAt', 120);
    string(c.updatedAt, 'updatedAt', 120);
    const ids = new Set();
    const displays = new Set();
    for (const name of expectedArrays) {
        const arr = b[name];
        if (!Array.isArray(arr) || arr.length > MAX_RECORDS)
            error('invalid array ' + name);
        for (const raw of arr) {
            const e = record(raw, name);
            string(e.id, 'record ID', 200);
            if (ids.has(e.id))
                error('duplicate id ' + e.id);
            ids.add(e.id);
            if (e.displayId !== undefined) {
                string(e.displayId, 'display ID', 80);
                if (displays.has(e.displayId))
                    error('duplicate display ID ' + e.displayId);
                displays.add(e.displayId);
            }
            for (const [k, v] of Object.entries(e)) {
                if (typeof v === 'string')
                    string(v, k);
                if (k === 'date' && v)
                    dateRange(v);
            }
        }
    }
    const s = b;
    const assetIds = new Set(s.assets.map(x => x.id));
    const itemIds = new Set(s.items.map(x => x.id));
    const srcIds = new Set(s.sources.map(x => x.id));
    const witIds = new Set(s.witnesses.map(x => x.id));
    const claimIds = new Set(s.claims.map(x => x.id));
    const regionIds = new Set(s.regions.map(x => x.id));
    for (const v of s.sources) {
        string(v.title, 'source title', 1500);
        if (!INSPECTION.includes(v.sourceInspection))
            error('invalid inspection state');
    }
    for (const w of s.witnesses) {
        string(w.label, 'witness label', 1500);
        dateRange(w.date);
        for (const id of w.sourceIds || [])
            if (!srcIds.has(id))
                error('invalid witness source ref');
    }
    for (const a of s.assets) {
        string(a.sha256, 'sha256', 64);
        if (!/^[a-f0-9]{64}$/.test(a.sha256))
            error('invalid asset digest');
        number(a.width, 'width');
        number(a.height, 'height');
        if (a.width < 0 || a.height < 0 || a.width * a.height > 40000000)
            error('invalid asset dimensions');
        const rights = record(a.rights, 'rights');
        for (const k of ['referenceLink', 'view', 'store', 'metadataExport', 'imageExport', 'redistribute'])
            if (!['ALLOW', 'DENY', 'UNKNOWN'].includes(String(rights[k])))
                error('invalid right ' + k);
        string(rights.basis, 'rights basis', 3000);
    }
    for (const item of s.items) {
        if (item.assetId && !assetIds.has(item.assetId))
            error('invalid item asset');
        for (const id of item.regionIds)
            if (!regionIds.has(id))
                error('invalid item region');
    }
    for (const r of s.regions) {
        for (const n of [r.x, r.y, r.w, r.h])
            if (typeof n !== 'number' || !Number.isFinite(n))
                error('invalid region');
        if (r.x < 0 || r.y < 0 || r.w <= 0 || r.h <= 0 || r.x + r.w > 1.0000001 || r.y + r.h > 1.0000001)
            error('invalid region bounds');
        if (r.itemId && !itemIds.has(r.itemId))
            error('invalid region item');
    }
    for (const cl of s.claims) {
        if (!itemIds.has(cl.itemId))
            error('invalid claim item');
        if (!DIMENSIONS.includes(cl.dimension))
            error('invalid claim dimension');
        if (!VERDICTS.includes(cl.verdict))
            error('invalid claim verdict');
        if (!REVIEW_STATES.includes(cl.reviewStatus))
            error('invalid claim review');
        if (!/^P[0-5U]$/.test(cl.provenance))
            error('invalid provenance');
        string(cl.statement, 'claim text', 5000);
        dateRange(cl.date);
        for (const id of cl.dependsOn || [])
            if (!claimIds.has(id))
                error('invalid claim dependency');
    }
    for (const link of s.evidenceLinks) {
        if (!claimIds.has(link.claimId) || !srcIds.has(link.sourceId) || (link.witnessId && !witIds.has(link.witnessId)))
            error('invalid evidence reference');
        if (!['SUPPORTS', 'REFUTES', 'CONTEXT'].includes(link.relation))
            error('invalid evidence relation');
        if (link.locator) {
            if (!['FOLIO', 'PRINTED_PAGE', 'LINE', 'IMAGE_REGION', 'OTHER'].includes(link.locator.kind))
                error('invalid locator kind');
            string(link.locator.literal, 'locator', 500);
            if (link.locator.regionId && !regionIds.has(link.locator.regionId))
                error('invalid locator region');
        }
    }
    for (const e of s.reviewEvents) {
        if (!claimIds.has(e.claimId))
            error('invalid review claim');
        if (!VERDICTS.includes(e.verdict) || !REVIEW_STATES.includes(e.nextStatus))
            error('invalid review event');
        string(e.actor, 'review actor', 200);
        string(e.rationale, 'review rationale', 5000);
    }
    for (const p of s.searchReceipts) {
        if (!claimIds.has(p.claimId))
            error('invalid search claim');
        if (!['USER_REPORTED', 'TOOL_VERIFIED'].includes(p.executionMode))
            error('invalid search execution');
    }
    for (const p of s.readingAlternatives)
        if (!claimIds.has(p.claimId))
            error('invalid reading claim');
    for (const edge of s.edges)
        if (!witIds.has(edge.fromWitnessId) || !witIds.has(edge.toWitnessId))
            error('invalid transmission edge');
    return s;
}
export function createBlankCase(title) {
    if (!title.trim() || title.length > 300)
        error('case title required');
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    return { schemaVersion: 1, case: { id, title: title.trim(), revision: 0, createdAt: now, updatedAt: now }, sources: [], witnesses: [], designs: [], assets: [], items: [], regions: [], claims: [], evidenceLinks: [], edges: [], searchReceipts: [], reviewEvents: [], readingAlternatives: [] };
}
export const CaseBundleSchema = { parse: validateCaseBundle, safeParse(value) { try {
        return { success: true, data: validateCaseBundle(value) };
    }
    catch (e) {
        return { success: false, error: String(e) };
    } } };
