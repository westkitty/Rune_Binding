/* Canonical JSON with sorted keys and stable-ID record collections. No clock/randomness. */
function stable(value) {
    if (Array.isArray(value)) {
        const copy = value.map(stable);
        if (copy.every(x => !!x && typeof x === 'object' && !Array.isArray(x) && typeof x.id === 'string'))
            copy.sort((a, b) => String(a.id).localeCompare(String(b.id), 'en'));
        return copy;
    }
    if (value && typeof value === 'object') {
        const b = value;
        return Object.fromEntries(Object.keys(b).sort().filter(k => b[k] !== undefined).map(k => [k, stable(b[k])]));
    }
    if (typeof value === 'number' && !Number.isFinite(value))
        throw Error('Nonfinite value in canonical JSON');
    return value;
}
export function canonicalJson(value) { return JSON.stringify(stable(value), null, 2) + '\n'; }
export async function sha256(bytes) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array(bytes)))).map(b => b.toString(16).padStart(2, '0')).join(''); }
export function utf8(text) { return new TextEncoder().encode(text); }
