import type {RightsPolicy,RightsValue} from './schema.js';
export type RightsAction='REFERENCE_LINK'|'VIEW'|'STORE'|'METADATA_EXPORT'|'IMAGE_EXPORT'|'REDISTRIBUTE';
const KEY:Record<RightsAction,keyof RightsPolicy>={REFERENCE_LINK:'referenceLink',VIEW:'view',STORE:'store',METADATA_EXPORT:'metadataExport',IMAGE_EXPORT:'imageExport',REDISTRIBUTE:'redistribute'};
export function emptyRights():RightsPolicy{return {referenceLink:'UNKNOWN',view:'UNKNOWN',store:'UNKNOWN',metadataExport:'UNKNOWN',imageExport:'UNKNOWN',redistribute:'UNKNOWN',basis:''}}
export function canUseAsset(rights:RightsPolicy,action:RightsAction):{allowed:boolean;reason:string}{const v=rights[KEY[action]] as RightsValue;return {allowed:v==='ALLOW',reason:v==='ALLOW'?'Permission explicitly recorded':v==='DENY'?'Permission denied':'Permission unverified; unknown is not consent'}}
export function canDistributePixels(rights:RightsPolicy):boolean{return canUseAsset(rights,'IMAGE_EXPORT').allowed&&canUseAsset(rights,'REDISTRIBUTE').allowed}
