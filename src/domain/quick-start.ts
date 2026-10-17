import type {RightsPolicy} from './schema.js';
import {emptyRights} from './rights.js';

/** Invoked only after a user actively chooses an image for a private local study. */
export function localImageConsent():RightsPolicy{
 const policy=emptyRights();
 policy.view='ALLOW';
 policy.store='ALLOW';
 policy.basis='User chose this image for private on-device viewing and storage in Rune Binding; no image export or redistribution permission granted.';
 return policy;
}

export function studyTitleFromImage(filename:string):string{
 const leaf=filename.split(/[\\/]/).pop()??'';
 const cleaned=leaf.replace(/\.(png|jpe?g|webp)$/i,'').replace(/[\x00-\x1f\x7f]/g,'').trim();
 return cleaned?`Study: ${cleaned.slice(0,289)}`:'Untitled symbol study';
}
