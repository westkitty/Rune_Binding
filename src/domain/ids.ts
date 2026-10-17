import type {CaseBundle} from './schema.js';
export function newEntityId():string{return crypto.randomUUID()}
const COLLECTIONS:{[k:string]:keyof CaseBundle}={SRC:'sources',WIT:'witnesses',DES:'designs',CLM:'claims',EDGE:'edges',IMG:'assets',ITEM:'items'};
export function nextDisplayId(bundle:CaseBundle,prefix:'SRC'|'WIT'|'DES'|'CLM'|'EDGE'|'IMG'|'ITEM'):string{
 const key=COLLECTIONS[prefix];const records=(bundle[key]||[]) as Array<{displayId?:string}>;const nums=records.map(x=>Number(x.displayId?.match(/-([0-9]+)$/)?.[1]||0));return `${prefix}-${String(Math.max(0,...nums)+1).padStart(3,'0')}`;
}
