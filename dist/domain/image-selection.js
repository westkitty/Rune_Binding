/** Select an explicit source image while remaining robust to removed selections. */
export function chooseAnnotationAsset(assets, id) {
    return assets.find(asset => asset.id === id) ?? assets[0] ?? null;
}
export function findImageItem(bundle, asset) {
    return asset ? bundle.items.find(item => item.assetId === asset.id) : undefined;
}
