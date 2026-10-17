export function parseClaimDateFields(v) {
    const before = v.notBefore.trim(), after = v.notAfter.trim();
    if (!before && !after)
        return undefined;
    const parse = (raw) => { if (!raw)
        return null; if (!/^-?\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)))
        throw Error('Year must be a valid integer'); return Number(raw); };
    const notBefore = parse(before), notAfter = parse(after);
    if (notBefore !== null && notAfter !== null && notBefore > notAfter)
        throw Error('Invalid date range: earliest year must precede latest year');
    const subjects = ['OBJECT', 'SURVIVING_COPY', 'STATEMENT', 'PRACTICE'];
    const precisions = ['EXACT', 'RANGE', 'APPROXIMATE', 'UNKNOWN'];
    if (!subjects.some(x => x === v.dateSubject) || !precisions.some(x => x === v.precision))
        throw Error('Invalid date subject or precision');
    if (v.caveat.length > 3000)
        throw Error('Date qualification too long');
    return { notBefore, notAfter, dateSubject: v.dateSubject, precision: v.precision, caveat: v.caveat };
}
function inputValue(d, k) { return String(d.get(k) || ''); }
function select(root, key) { const el = root.querySelector(key); if (!el)
    throw Error('Missing ' + key); return el; }
function option(value, label) { const o = document.createElement('option'); o.value = value; o.textContent = label; return o; }
function addOptions(sel, entries) { for (const r of entries)
    sel.append(option(r.id, r.label)); }
function formError(form, err) { const p = form.querySelector('[role="status"]'); if (p)
    p.textContent = String(err); }
export function ClaimLedger({ bundle, onItem, onClaim, onLink, onReading, onSearch }) {
    const root = document.createElement('div');
    root.className = 'panel-grid';
    root.setAttribute('aria-label', 'Claim ledger');
    const intro = document.createElement('section');
    intro.className = 'pane span-all claim-intro';
    intro.innerHTML = '<p class="eyebrow">QUESTION THE CLAIM</p><h2>What are people saying about this symbol?</h2><p>Write one claim. We will keep it marked <strong>unverified</strong> until you examine sources. Dates and technical details can wait.</p>';
    root.append(intro);
    const tools = document.createElement('details');
    tools.className = 'span-all advanced-evidence';
    tools.open = bundle.items.length === 0;
    const summary = document.createElement('summary');
    summary.textContent = bundle.items.length ? 'More research tools and additional symbols' : 'First, describe the mark you are investigating';
    tools.append(summary);
    root.append(tools);
    const item = document.createElement('form');
    item.className = 'pane';
    item.innerHTML = '<h3>Mark or item</h3><label>Item label<input name="label" placeholder="Item 1: nested glyph" required></label><button type="submit">Add item</button><p role="status" class="form-status"></p>';
    item.addEventListener('submit', async (e) => { e.preventDefault(); try {
        await onItem(inputValue(new FormData(item), 'label'));
        item.reset();
    }
    catch (err) {
        formError(item, err);
    } });
    tools.append(item);
    const claim = document.createElement('form');
    claim.className = 'pane';
    claim.innerHTML = '<p class="eyebrow">ATOMIC HISTORICAL CLAIM</p><h3>What do you want to verify?</h3><label>Item<select name="itemId" required></select></label><label>Dimension<select name="dimension"><option>FORM</option><option>READING</option><option>NAME</option><option selected>MEANING</option><option>DATE</option><option>PURPOSE</option><option>TRANSMISSION</option></select></label><label>Exact proposition<textarea name="statement" maxlength="5000" required rows="3" placeholder="What exactly is alleged?" ></textarea></label><label>Script or rune family (manual)<input name="script" placeholder="Unknown"></label><fieldset class="date-fields"><legend>Historical dating — optional and explicitly qualified</legend><div class="two"><label>Earliest year (negative for BCE)<input name="notBefore" type="number" step="1" placeholder="Unknown"></label><label>Latest year<input name="notAfter" type="number" step="1" placeholder="Unknown"></label><label>What is being dated?<select name="dateSubject"><option value="OBJECT">Physical object</option><option value="SURVIVING_COPY">Surviving copy</option><option value="STATEMENT">Textual statement</option><option value="PRACTICE">Alleged practice</option></select></label><label>Dating precision<select name="precision"><option value="UNKNOWN">Unknown</option><option value="RANGE">Date range</option><option value="APPROXIMATE">Approximate</option><option value="EXACT">Exact</option></select></label></div><label>Caveat about the dated evidence<input name="caveat" maxlength="3000" placeholder="Copy date ≠ date of tradition"></label></fieldset><label class="check"><input type="checkbox" name="modernIntent"> Modern symbolic intent (not ancient attestation)</label><button type="submit">Record claim</button><p role="status" class="form-status"></p>';
    const more = document.createElement('details');
    more.className = 'claim-more';
    const moreSummary = document.createElement('summary');
    moreSummary.textContent = 'Optional details: script, date, or modern intent';
    more.append(moreSummary);
    const scriptField = select(claim, '[name="script"]');
    const scriptLabel = scriptField.closest('label');
    const dateFields = select(claim, '.date-fields');
    const modernField = select(claim, '[name="modernIntent"]');
    const modernLabel = modernField.closest('label');
    if (scriptLabel)
        more.append(scriptLabel);
    more.append(dateFields);
    if (modernLabel)
        more.append(modernLabel);
    const submitClaim = select(claim, 'button[type="submit"]');
    claim.insertBefore(more, submitClaim);
    addOptions(select(claim, '[name="itemId"]'), bundle.items.map(x => ({ id: x.id, label: `${x.displayId} ${x.label}` })));
    claim.addEventListener('submit', async (e) => { e.preventDefault(); const d = new FormData(claim); try {
        await onClaim({ itemId: inputValue(d, 'itemId'), dimension: inputValue(d, 'dimension'), statement: inputValue(d, 'statement'), script: inputValue(d, 'script') || undefined, date: parseClaimDateFields({ notBefore: inputValue(d, 'notBefore'), notAfter: inputValue(d, 'notAfter'), dateSubject: inputValue(d, 'dateSubject'), precision: inputValue(d, 'precision'), caveat: inputValue(d, 'caveat') }), modernIntent: d.has('modernIntent') });
        claim.reset();
    }
    catch (err) {
        formError(claim, err);
    } });
    root.append(claim);
    const citations = document.createElement('details');
    citations.className = 'span-all advanced-evidence';
    const citationsSummary = document.createElement('summary');
    citationsSummary.textContent = 'Evidence citations, alternative readings, and search history';
    citations.append(citationsSummary);
    root.append(citations);
    const evidence = document.createElement('form');
    evidence.className = 'pane';
    evidence.innerHTML = '<h3>Evidence citation</h3><label>Claim<select name="claimId" required></select></label><label>Source publication<select name="sourceId" required></select></label><label>Underlying witness (optional)<select name="witnessId"><option value="">Unresolved / none</option></select></label><label>Relationship<select name="relation"><option value="CONTEXT">Context only</option><option value="SUPPORTS">Supports</option><option value="REFUTES">Contradicts</option></select></label><div class="two"><label>Locator kind<select name="kind"><option value="">Unlocated</option><option value="FOLIO">Manuscript folio</option><option value="PRINTED_PAGE">Printed page</option><option value="LINE">Inscription line</option><option value="IMAGE_REGION">Image region</option><option value="OTHER">Other locator</option></select></label><label>Literal locator<input name="literal" placeholder="e.g. 26v"></label></div><label>Documented shared source family<input name="lineageFamilyId" placeholder="Unknown by default"></label><button type="submit">Attach evidence</button><p role="status" class="form-status"></p>';
    addOptions(select(evidence, '[name="claimId"]'), bundle.claims.map(x => ({ id: x.id, label: `${x.displayId} ${x.dimension}` })));
    addOptions(select(evidence, '[name="sourceId"]'), bundle.sources.map(x => ({ id: x.id, label: `${x.displayId} ${x.title}` })));
    addOptions(select(evidence, '[name="witnessId"]'), bundle.witnesses.map(x => ({ id: x.id, label: `${x.displayId} ${x.label}` })));
    evidence.addEventListener('submit', async (e) => { e.preventDefault(); const d = new FormData(evidence); try {
        await onLink({ claimId: inputValue(d, 'claimId'), sourceId: inputValue(d, 'sourceId'), witnessId: inputValue(d, 'witnessId') || undefined, relation: inputValue(d, 'relation'), locator: inputValue(d, 'kind') && inputValue(d, 'literal') ? { kind: inputValue(d, 'kind'), literal: inputValue(d, 'literal') } : undefined, lineageFamilyId: inputValue(d, 'lineageFamilyId') || undefined });
        evidence.reset();
    }
    catch (err) {
        formError(evidence, err);
    } });
    citations.append(evidence);
    const reading = document.createElement('form');
    reading.className = 'pane';
    reading.innerHTML = '<h3>Alternative reading</h3><label>Claim<select name="claimId" required></select></label><label>Kind<select name="kind"><option>TRANSCRIPTION</option><option>TRANSLITERATION</option><option>TRANSLATION</option></select></label><label>Literal form<input name="literal" required></label><label>Editorial notes<input name="notes" placeholder="Manual; not philologically certified"></label><button type="submit">Add alternative</button><p role="status" class="form-status"></p>';
    addOptions(select(reading, '[name="claimId"]'), bundle.claims.filter(c => c.dimension === 'READING').map(c => ({ id: c.id, label: `${c.displayId} ${c.statement.slice(0, 55)}` })));
    reading.addEventListener('submit', async (e) => { e.preventDefault(); const d = new FormData(reading); try {
        await onReading({ claimId: inputValue(d, 'claimId'), kind: inputValue(d, 'kind'), literal: inputValue(d, 'literal'), notes: inputValue(d, 'notes') });
    }
    catch (err) {
        formError(reading, err);
    } });
    citations.append(reading);
    const search = document.createElement('form');
    search.className = 'pane span-all';
    search.innerHTML = '<h3>Search coverage receipt</h3><p class="caption">Record exactly where and how you searched. A negative result is not proof of nonexistence.</p><div class="two"><label>Claim<select name="claimId" required></select></label><label>Corpus or collection<input name="corpus" required placeholder="Search database"></label><label>Exact query<input name="query" required placeholder="Quoted literal search string"></label><label>Filters<input name="filters" placeholder="Period, language, holdings"></label><label>Access state<select name="access"><option>AVAILABLE</option><option>DENIED</option><option>UNAVAILABLE</option><option>UNKNOWN</option></select></label><label>Outcome<select name="outcome"><option value="NOT_SEARCHED">Not yet searched</option><option value="NO_MATCH_IN_SCOPE">No match in searched scope</option><option value="MATCH_FOUND">Match found</option><option value="UNAVAILABLE">Source unavailable</option></select></label></div><label>Coverage limitations<textarea name="coverageNotes" required rows="2" placeholder="What was excluded or inaccessible?"></textarea></label><button type="submit">Record search receipt</button><p role="status" class="form-status"></p>';
    addOptions(select(search, '[name="claimId"]'), bundle.claims.map(c => ({ id: c.id, label: `${c.displayId} ${c.dimension}` })));
    search.addEventListener('submit', async (e) => { e.preventDefault(); const d = new FormData(search); try {
        await onSearch({ claimId: inputValue(d, 'claimId'), corpus: inputValue(d, 'corpus'), query: inputValue(d, 'query'), filters: inputValue(d, 'filters'), access: inputValue(d, 'access'), outcome: inputValue(d, 'outcome'), coverageNotes: inputValue(d, 'coverageNotes'), checkedAt: new Date().toISOString(), executionMode: 'USER_REPORTED' });
    }
    catch (err) {
        formError(search, err);
    } });
    citations.append(search);
    const listing = document.createElement('section');
    listing.className = 'pane span-all';
    const h = document.createElement('h3');
    h.textContent = 'Claims on record';
    listing.append(h);
    if (!bundle.claims.length) {
        const p = document.createElement('p');
        p.textContent = 'Your first claim will appear here. You can add sources when you are ready.';
        listing.append(p);
    }
    for (const c of bundle.claims) {
        const block = document.createElement('article');
        block.className = 'claim-row';
        const title = document.createElement('strong');
        title.textContent = c.displayId + ' · ' + c.dimension;
        const para = document.createElement('p');
        para.textContent = c.statement;
        const badge = document.createElement('span');
        badge.className = 'state-badge';
        badge.textContent = c.verdict.replaceAll('_', ' ').toLowerCase() + ' / ' + c.reviewStatus.toLowerCase();
        block.append(title, badge, para);
        listing.append(block);
    }
    root.append(listing);
    return root;
}
