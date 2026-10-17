import { newEntityId } from './ids.js';
export function screenToNormalizedPoint(clientX, clientY, v) {
    if (!Number.isFinite(v.zoom) || v.zoom <= 0 || v.displayWidth <= 0 || v.displayHeight <= 0)
        throw Error('Invalid image viewport');
    return { x: (clientX - v.left - v.panX) / (v.displayWidth * v.zoom), y: (clientY - v.top - v.panY) / (v.displayHeight * v.zoom) };
}
export function normalizeRegion(a, b, imageSha256, dimensions, orientation) {
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), w = Math.abs(a.x - b.x), h = Math.abs(a.y - b.y);
    if (![x, y, w, h].every(Number.isFinite) || x < 0 || y < 0 || x + w > 1.000000001 || y + h > 1.000000001 || w <= 0 || h <= 0)
        throw Error('Region outside original-image normalized bounds');
    if (!/^[a-f0-9]{64}$/.test(imageSha256) || dimensions.width <= 0 || dimensions.height <= 0)
        throw Error('Original image identity required');
    return { id: newEntityId(), imageSha256, imageWidth: dimensions.width, imageHeight: dimensions.height, orientation, x, y, w, h };
}
