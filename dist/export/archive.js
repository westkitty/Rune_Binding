/** A minimal, deterministic ZIP/STORE container for the exact files emitted by the casefile compiler.
 * The no-compression format avoids dependencies and zip-bomb amplification. The manifest still
 * provides independent SHA-256 integrity for each included artifact.
 */
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const MAX_TOTAL = 128 * 1024 * 1024;
const MAX_FILES = 512;
const MAX_FILE = 20 * 1024 * 1024;
const REQUIRED = ['casefile.json', 'casefile.md', 'manifest.json'];
const allowed = (name) => REQUIRED.includes(name) || /^media\/[0-9a-f]{64}\.(png|jpg|webp)$/.test(name);
const TABLE = new Uint32Array(256);
for (let i = 0; i < TABLE.length; i++) {
    let n = i;
    for (let j = 0; j < 8; j++)
        n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
    TABLE[i] = n >>> 0;
}
function crc32(bytes) { let crc = 0xffffffff; for (const b of bytes)
    crc = TABLE[(crc ^ b) & 255] ^ (crc >>> 8); return (crc ^ 0xffffffff) >>> 0; }
function checkFiles(files) {
    const names = Object.keys(files).sort();
    if (names.length < 3 || names.length > MAX_FILES || REQUIRED.some(r => !names.includes(r)))
        throw Error('Casefile archive requires casefile.json, casefile.md and manifest.json');
    let total = 22;
    return names.map(name => {
        const bytes = files[name];
        if (!allowed(name) || !ArrayBuffer.isView(bytes) || !(bytes instanceof Uint8Array))
            throw Error('Unsafe or unsupported casefile archive name or bytes: ' + name);
        const nameBytes = encoder.encode(name);
        if (bytes.length > MAX_FILE || nameBytes.length > 0xffff)
            throw Error('Casefile archive entry exceeds size limit');
        total += 76 + nameBytes.length * 2 + bytes.length;
        if (total > MAX_TOTAL)
            throw Error('Casefile archive exceeds 128 MiB limit');
        return { name, nameBytes, bytes, crc: crc32(bytes) };
    });
}
export function packCasefileArchive(files) {
    const records = checkFiles(files);
    const size = records.reduce((sum, r) => sum + 76 + r.nameBytes.length * 2 + r.bytes.length, 22);
    const out = new Uint8Array(size), v = new DataView(out.buffer);
    let position = 0;
    const locations = [];
    for (const r of records) {
        locations.push(position);
        v.setUint32(position, 0x04034b50, true);
        v.setUint16(position + 4, 20, true);
        v.setUint16(position + 6, 0, true);
        v.setUint16(position + 8, 0, true);
        v.setUint16(position + 12, 33, true);
        v.setUint32(position + 14, r.crc, true);
        v.setUint32(position + 18, r.bytes.length, true);
        v.setUint32(position + 22, r.bytes.length, true);
        v.setUint16(position + 26, r.nameBytes.length, true);
        v.setUint16(position + 28, 0, true);
        position += 30;
        out.set(r.nameBytes, position);
        position += r.nameBytes.length;
        out.set(r.bytes, position);
        position += r.bytes.length;
    }
    const centralStart = position;
    for (let i = 0; i < records.length; i++) {
        const r = records[i];
        v.setUint32(position, 0x02014b50, true);
        v.setUint16(position + 4, 20, true);
        v.setUint16(position + 6, 20, true);
        v.setUint16(position + 8, 0, true);
        v.setUint16(position + 10, 0, true);
        v.setUint16(position + 14, 33, true);
        v.setUint32(position + 16, r.crc, true);
        v.setUint32(position + 20, r.bytes.length, true);
        v.setUint32(position + 24, r.bytes.length, true);
        v.setUint16(position + 28, r.nameBytes.length, true);
        v.setUint32(position + 42, locations[i], true);
        position += 46;
        out.set(r.nameBytes, position);
        position += r.nameBytes.length;
    }
    const centralSize = position - centralStart;
    v.setUint32(position, 0x06054b50, true);
    v.setUint16(position + 8, records.length, true);
    v.setUint16(position + 10, records.length, true);
    v.setUint32(position + 12, centralSize, true);
    v.setUint32(position + 16, centralStart, true);
    position += 22;
    if (position !== out.length)
        throw Error('Archive size accounting mismatch');
    return out;
}
export function unpackCasefileArchive(bytes) {
    if (bytes.length < 22 || bytes.length > MAX_TOTAL)
        throw Error('Unsupported ZIP archive size');
    const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), end = bytes.length - 22;
    if (v.getUint32(end, true) !== 0x06054b50 || v.getUint16(end + 20, true) !== 0 || v.getUint16(end + 4, true) !== 0 || v.getUint16(end + 6, true) !== 0)
        throw Error('ZIP end-of-central-directory missing or unsupported');
    const count = v.getUint16(end + 10, true), firstCount = v.getUint16(end + 8, true);
    const centralLength = v.getUint32(end + 12, true), centralStart = v.getUint32(end + 16, true);
    if (count !== firstCount || count < 3 || count > MAX_FILES || centralStart + centralLength !== end)
        throw Error('Invalid ZIP central directory');
    const files = Object.create(null);
    let pos = centralStart;
    for (let i = 0; i < count; i++) {
        if (pos + 46 > end || v.getUint32(pos, true) !== 0x02014b50)
            throw Error('Invalid ZIP central entry');
        const flags = v.getUint16(pos + 8, true), method = v.getUint16(pos + 10, true);
        const crc = v.getUint32(pos + 16, true), sizeCompressed = v.getUint32(pos + 20, true), size = v.getUint32(pos + 24, true);
        const nameSize = v.getUint16(pos + 28, true), extra = v.getUint16(pos + 30, true), comment = v.getUint16(pos + 32, true);
        const start = v.getUint32(pos + 42, true), endName = pos + 46 + nameSize;
        if (flags !== 0 || method !== 0 || size !== sizeCompressed || size > MAX_FILE || endName + extra + comment > end || !nameSize)
            throw Error('Unsupported or unsafe ZIP entry');
        const name = decoder.decode(bytes.subarray(pos + 46, endName));
        if (!allowed(name) || Object.hasOwn(files, name))
            throw Error('Unsafe or duplicate ZIP file name');
        if (start + 30 > centralStart || v.getUint32(start, true) !== 0x04034b50)
            throw Error('ZIP local header missing');
        const localNameSize = v.getUint16(start + 26, true), localExtra = v.getUint16(start + 28, true);
        if (v.getUint16(start + 6, true) !== 0 || v.getUint16(start + 8, true) !== 0 || v.getUint32(start + 14, true) !== crc || v.getUint32(start + 18, true) !== size || v.getUint32(start + 22, true) !== size || localNameSize !== nameSize)
            throw Error('ZIP local metadata mismatch');
        const bodyStart = start + 30 + localNameSize + localExtra;
        if (bodyStart + size > centralStart || decoder.decode(bytes.subarray(start + 30, start + 30 + localNameSize)) !== name)
            throw Error('ZIP local file bounds or name mismatch');
        const data = bytes.slice(bodyStart, bodyStart + size);
        if (crc32(data) !== crc)
            throw Error('ZIP stored-byte CRC integrity mismatch');
        files[name] = data;
        pos = endName + extra + comment;
    }
    if (pos !== end || REQUIRED.some(name => !Object.hasOwn(files, name)))
        throw Error('ZIP missing required casefile files or invalid central directory');
    return files;
}
