export function evidenceCounts(bundle, claimId) {
    const links = bundle.evidenceLinks.filter(e => e.claimId === claimId);
    const sources = new Set(links.map(x => x.sourceId));
    const witnesses = new Set(links.map(x => x.witnessId).filter(Boolean));
    const families = new Set();
    let unresolved = 0;
    for (const l of links) {
        const source = bundle.sources.find(s => s.id === l.sourceId);
        const key = l.lineageFamilyId || source?.familyId || l.witnessId;
        if (key)
            families.add(key);
        else
            unresolved++;
    }
    return { publications: sources.size, witnesses: witnesses.size, independentLineages: families.size, unresolvedDependence: unresolved };
}
