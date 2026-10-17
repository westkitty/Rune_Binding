import type {AssetRecord,CaseBundle,ItemRecord} from './schema.js';
/** Select an explicit source image while remaining robust to removed selections. */
export function chooseAnnotationAsset(assets:readonly AssetRecord[],id:string|null):AssetRecord|null{
 return assets.find(asset=>asset.id===id)??assets[0]??null;
}
export function findImageItem(bundle:Pick<CaseBundle,'items'>,asset:AssetRecord|null):ItemRecord|undefined{
 return asset?bundle.items.find(item=>item.assetId===asset.id):undefined;
}
