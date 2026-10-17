import { validateCaseBundle, VERDICTS } from './schema.js';
import { newEntityId } from './ids.js';
function dependencyContent(bundle, id) { const claim = bundle.claims.find(c => c.id === id); if (!claim)
    throw Error('Unknown reviewed claim'); const links = bundle.evidenceLinks.filter(x => x.claimId === id).sort((a, b) => a.id.localeCompare(b.id)); const sources = bundle.sources.filter(x => links.some(l => l.sourceId === x.id)).sort((a, b) => a.id.localeCompare(b.id)); const witnesses = bundle.witnesses.filter(x => links.some(l => l.witnessId === x.id)).sort((a, b) => a.id.localeCompare(b.id)); const search = bundle.searchReceipts.filter(x => x.claimId === id).sort((a, b) => a.id.localeCompare(b.id)); const related = bundle.claims.filter(x => claim.dependsOn?.includes(x.id)).sort((a, b) => a.id.localeCompare(b.id)); const item = bundle.items.find(x => x.id === claim.itemId); const asset = bundle.assets.find(x => x.id === item?.assetId); const regions = bundle.regions.filter(x => item?.regionIds.includes(x.id) || x.itemId === item?.id).sort((a, b) => a.id.localeCompare(b.id)); return JSON.stringify({ statement: claim.statement, dimension: claim.dimension, date: claim.date, script: claim.script, item, asset, regions, links, sources, witnesses, search, related: related.map(r => ({ id: r.id, verdict: r.verdict, reviewStatus: r.reviewStatus })) }); }
export function dependencyDigest(bundle, id) {
    const str = dependencyContent(bundle, id);
    let h = 0xcbf29ce484222325n;
    for (const ch of str) {
        h ^= BigInt(ch.codePointAt(0) || 0);
        h = BigInt.asUintN(64, h * 0x100000001b3n);
    }
    return h.toString(16).padStart(16, '0');
}
export function reviewClaim(bundle, cmd) {
    if (!cmd.actor.trim() || cmd.actor.length > 200)
        throw Error('Human actor required');
    if (!cmd.rationale.trim() || cmd.rationale.length > 5000)
        throw Error('Review rationale required');
    if (!VERDICTS.includes(cmd.verdict))
        throw Error('Invalid verdict');
    if (!Number.isFinite(Date.parse(cmd.reviewedAt)))
        throw Error('Review timestamp required');
    const b = structuredClone(bundle);
    const claim = b.claims.find(x => x.id === cmd.claimId);
    if (!claim)
        throw Error('Unknown claim');
    const links = b.evidenceLinks.filter(l => l.claimId === cmd.claimId);
    const located = links.filter(l => { const s = b.sources.find(x => x.id === l.sourceId); return !!s && ['ORIGINAL_BYTES_VIEWED', 'FACSIMILE_VIEWED', 'EDITION_VIEWED'].includes(s.sourceInspection) && !!l.locator?.literal.trim() && !!l.witnessId; });
    if (cmd.verdict === 'ATTESTED' && !located.some(x => x.relation === 'SUPPORTS'))
        throw Error('ATTESTED requires a located, inspected witness and recorded support');
    if (cmd.verdict === 'CONTRADICTED_MISATTRIBUTED' && !located.some(x => x.relation === 'REFUTES'))
        throw Error('Misattribution verdict requires inspected, located contradicting witness');
    const before = claim.verdict, priorStatus = claim.reviewStatus;
    const digest = dependencyDigest(b, cmd.claimId);
    claim.verdict = cmd.verdict;
    claim.reviewStatus = 'REVIEWED';
    claim.reviewDigest = digest;
    const event = { id: newEntityId(), claimId: cmd.claimId, actor: cmd.actor.trim(), previousVerdict: before, verdict: cmd.verdict, priorStatus, nextStatus: 'REVIEWED', rationale: cmd.rationale.trim(), reviewedAt: cmd.reviewedAt, dependencyDigest: digest };
    b.reviewEvents.push(event);
    return validateCaseBundle(b);
}
export function deriveRecheckFlags(bundle) { return bundle.claims.filter(c => c.reviewStatus === 'REVIEWED' && (!c.reviewDigest || c.reviewDigest !== dependencyDigest(bundle, c.id))).map(c => c.id).sort(); }
