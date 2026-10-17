import { evidenceCounts } from './independence.js';
export function evaluateCase(bundle) {
    const issues = [];
    function flag(claimId, ruleId, severity, message, ids = [], fields = []) { issues.push({ claimId, ruleId, severity, message, affectedRecordIds: ids, fieldPaths: fields }); }
    for (const claim of bundle.claims) {
        const links = bundle.evidenceLinks.filter(x => x.claimId === claim.id);
        const supports = links.filter(x => x.relation === 'SUPPORTS');
        const located = supports.filter(l => {
            const s = bundle.sources.find(x => x.id === l.sourceId);
            return !!s && ['ORIGINAL_BYTES_VIEWED', 'FACSIMILE_VIEWED', 'EDITION_VIEWED'].includes(s.sourceInspection) && !!l.locator?.literal.trim() && !!l.witnessId;
        });
        if (['ATTESTED', 'SCHOLARLY_RECONSTRUCTION'].includes(claim.verdict) && !located.length)
            flag(claim.id, 'CITATION', 'BLOCK', 'Strong historical verdict lacks a located, inspected underlying witness.', supports.map(x => x.id), ['claims.verdict', 'evidenceLinks.locator']);
        if (claim.dimension === 'PURPOSE' && claim.verdict === 'ATTESTED' && !located.length)
            flag(claim.id, 'CATEGORY_FIREWALL', 'BLOCK', 'A rune name or contemporary intention does not establish historically attested magical purpose.', [claim.id], ['claims.dimension', 'claims.verdict']);
        if (claim.dimension === 'PURPOSE' && claim.modernIntent && claim.verdict === 'ATTESTED')
            flag(claim.id, 'CATEGORY_FIREWALL', 'BLOCK', 'Contemporary intent cannot automatically become an ancient purpose.', [claim.id], ['claims.modernIntent']);
        if (claim.dimension === 'TRANSMISSION' && supports.some(x => x.transmissionMode !== 'DOCUMENTED'))
            flag(claim.id, 'TRANSMISSION_CHAIN', 'WARNING', 'Resemblance or unresolved copying is not a documented transmission chain.', supports.map(x => x.id), ['evidenceLinks.transmissionMode']);
        if (claim.dimension === 'DATE' && claim.date?.notAfter !== null && claim.date?.notAfter !== undefined) {
            for (const link of supports) {
                const w = bundle.witnesses.find(x => x.id === link.witnessId);
                if (w?.date?.notBefore !== null && w?.date?.notBefore !== undefined && claim.date.notAfter < w.date.notBefore)
                    flag(claim.id, 'CHRONOLOGY', 'WARNING', 'Later surviving copy cannot independently establish the asserted earlier practice or creation date.', [w.id, link.id], ['claims.date', 'witnesses.date']);
            }
        }
        const counts = evidenceCounts(bundle, claim.id);
        if (counts.unresolvedDependence > 0 && counts.publications > 0)
            flag(claim.id, 'INDEPENDENCE', 'WARNING', 'Some publication relationships are unresolved; count is not independent confirmation.', links.map(x => x.id), ['evidenceLinks.lineageFamilyId']);
        const item = bundle.items.find(x => x.id === claim.itemId), asset = bundle.assets.find(x => x.id === item?.assetId);
        if (claim.dimension === 'FORM' && asset && asset.pixelStatus !== 'ORIGINAL_BYTES_LOCAL' && asset.pixelStatus !== 'EPHEMERAL_PREVIEW')
            flag(claim.id, 'MISSING_PIXELS', 'BLOCK', 'Original image pixels unavailable: visual claim cannot be checked against this item.', [asset.id], ['assets.pixelStatus']);
        if (claim.reviewStatus === 'REVIEWED' && claim.verdict === 'UNVERIFIED')
            flag(claim.id, 'CITATION', 'PASS', 'Human-reviewed unresolved finding is a valid research result.', [claim.id], ['claims.verdict']);
        if (bundle.searchReceipts.some(x => x.claimId === claim.id && x.outcome === 'NO_MATCH_IN_SCOPE'))
            flag(claim.id, 'NEGATIVE_SEARCH', 'PASS', 'No match in searched scope; this does not prove a symbol never existed.', bundle.searchReceipts.filter(x => x.claimId === claim.id).map(x => x.id), ['searchReceipts.outcome']);
    }
    return issues.sort((a, b) => (a.claimId || '').localeCompare(b.claimId || '') || a.ruleId.localeCompare(b.ruleId) || a.affectedRecordIds.join(',').localeCompare(b.affectedRecordIds.join(',')));
}
