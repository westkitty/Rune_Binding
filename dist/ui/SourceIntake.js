import { emptyRights } from '../domain/rights.js';
import { localImageConsent } from '../domain/quick-start.js';
function field(selector, root) { const el = root.querySelector(selector); if (!el)
    throw Error('Missing form field ' + selector); return el; }
function status(root, message) { const p = root.querySelector('[role="status"]'); if (p)
    p.textContent = message; }
export function SourceIntake({ bundle, onSource, onWitness, onRaster, onViewRights }) {
    const section = document.createElement('section');
    section.className = 'panel-grid';
    section.setAttribute('aria-label', 'Source and witness intake');
    const source = document.createElement('form');
    source.className = 'pane';
    source.innerHTML = '<h3>Source publication</h3><label>Source title<input name="title" required maxlength="1500" placeholder="Edition, article, catalogue…"></label><label>Source URL (optional)<input name="url" type="url" placeholder="https://…"></label><label>Inspection state<select name="sourceInspection"><option value="NOT_ACCESSED">Not accessed</option><option value="METADATA_ONLY">Metadata only</option><option value="SECONDARY_SUMMARY">Secondary summary</option><option value="EDITION_VIEWED">Edition viewed</option><option value="FACSIMILE_VIEWED">Facsimile viewed</option><option value="ORIGINAL_BYTES_VIEWED">Original bytes viewed</option></select></label><label>Known publishing / copying family<input name="familyId" placeholder="Leave empty when unknown"></label><button type="submit">Add source</button><p role="status" class="form-status"></p>';
    source.addEventListener('submit', async (e) => { e.preventDefault(); const data = new FormData(source); try {
        await onSource({ title: String(data.get('title') || ''), url: String(data.get('url') || '') || undefined, sourceInspection: String(data.get('sourceInspection')), familyId: String(data.get('familyId') || '') || undefined });
        source.reset();
    }
    catch (err) {
        status(source, String(err));
    } });
    const witness = document.createElement('form');
    witness.className = 'pane';
    witness.innerHTML = '<h3>Historical witness</h3><p class="caption">A witness is an actual object, inscription, or manuscript—not a website mentioning it.</p><label>Object or manuscript label<input name="label" required placeholder="e.g. unidentified carved object"></label><div class="two"><label>Not before (year)<input name="notBefore" type="number" placeholder="Unknown"></label><label>Not after (year)<input name="notAfter" type="number" placeholder="Unknown"></label></div><label>Identity notes<textarea name="identityNotes" rows="2" placeholder="Physical context or unresolved identification"></textarea></label><button type="submit">Add witness</button><p role="status" class="form-status"></p>';
    witness.addEventListener('submit', async (e) => { e.preventDefault(); const d = new FormData(witness); const before = String(d.get('notBefore') || ''); const after = String(d.get('notAfter') || ''); try {
        await onWitness({ label: String(d.get('label') || ''), identityNotes: String(d.get('identityNotes') || ''), date: before || after ? { notBefore: before ? Number(before) : null, notAfter: after ? Number(after) : null, dateSubject: 'OBJECT', precision: 'RANGE', caveat: 'Entered by case editor' } : undefined });
        witness.reset();
    }
    catch (err) {
        status(witness, String(err));
    } });
    const image = document.createElement('form');
    image.className = 'pane';
    image.innerHTML = '<h3>Original image</h3><p class="caption">PNG, JPEG or WebP, up to 20 MiB and 40 megapixels. Files never leave this browser.</p><label>Choose raster image<input type="file" name="image" accept="image/png,image/jpeg,image/webp" required></label><label>Image rights basis<textarea name="basis" rows="2" placeholder="Your image, permission notice, usage terms…"></textarea></label><div class="rights-grid"></div><button type="submit">Import image</button><p role="status" class="form-status"></p>';
    const rightsGrid = field('.rights-grid', image);
    const labels = [['view', 'Display locally'], ['store', 'Store original locally'], ['referenceLink', 'Link to source'], ['metadataExport', 'Export source metadata'], ['imageExport', 'Export image bytes'], ['redistribute', 'Redistribute image']];
    for (const [key, label] of labels) {
        const l = document.createElement('label');
        l.textContent = label;
        const sel = document.createElement('select');
        sel.name = key;
        for (const [val, text] of [['UNKNOWN', 'Unknown'], ['ALLOW', 'Allowed (evidence required)'], ['DENY', 'Denied']]) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = text;
            sel.append(opt);
        }
        l.append(sel);
        rightsGrid.append(l);
    }
    image.addEventListener('submit', async (e) => { e.preventDefault(); const d = new FormData(image); const file = d.get('image'); if (!(file instanceof File) || file.size === 0)
        return; const rights = emptyRights(); for (const [key] of labels) {
        rights[key] = String(d.get(key) || 'UNKNOWN');
    } rights.basis = String(d.get('basis') || ''); try {
        await onRaster(file, rights);
        image.reset();
    }
    catch (err) {
        status(image, String(err));
    } });
    const quick = document.createElement('section');
    quick.className = 'pane span-all simple-intake';
    quick.innerHTML = '<p class="eyebrow">START HERE</p><h2>Show us the symbol.</h2><p>Add a photo or screenshot. You can mark the interesting part and come back for detailed source records later.</p><label>Choose your image<input name="quick-image" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="caption">Selecting an image authorizes private on-device viewing and storage only. It does not authorize redistribution.</p><p role="status" class="form-status"></p>';
    const quickFile = field('[name="quick-image"]', quick);
    quickFile.addEventListener('change', async () => { const file = quickFile.files?.[0]; if (!file)
        return; quickFile.disabled = true; status(quick, 'Checking image…'); try {
        await onRaster(file, localImageConsent());
    }
    catch (error) {
        status(quick, String(error));
    }
    finally {
        quickFile.disabled = false;
        quickFile.value = '';
    } });
    section.append(quick);
    const advanced = document.createElement('details');
    advanced.className = 'span-all advanced-evidence';
    const summary = document.createElement('summary');
    summary.textContent = 'Detailed research: sources, physical witnesses, and image rights';
    advanced.append(summary, source, witness, image);
    section.append(advanced);
    if (bundle.assets.length) {
        const access = document.createElement('form');
        access.className = 'pane span-all';
        access.innerHTML = '<h3>Change local viewing</h3><p class="caption">For already imported images, you can authorize or restrict viewing on this device. This is your explicit local inspection decision, not a copyright license or permission to redistribute.</p><label>Image<select name="assetId" required></select></label><label>Local inspection permission<select name="view"><option value="UNKNOWN">Unknown / not granted</option><option value="ALLOW">Allow local viewing</option><option value="DENY">Deny local viewing</option></select></label><label>Reason for this decision<input name="reason" maxlength="1000" required placeholder="e.g. I authorize inspection of my own photograph"></label><button type="submit">Save local viewing decision</button><p role="status" class="form-status"></p>';
        const options = field('[name="assetId"]', access), decision = field('[name="view"]', access);
        for (const asset of bundle.assets) {
            const opt = document.createElement('option');
            opt.value = asset.id;
            opt.textContent = asset.displayId + ' · ' + asset.filename;
            options.append(opt);
        }
        const sync = () => { decision.value = bundle.assets.find(a => a.id === options.value)?.rights.view ?? 'UNKNOWN'; };
        options.addEventListener('change', sync);
        sync();
        access.addEventListener('submit', async (e) => { e.preventDefault(); const d = new FormData(access); try {
            await onViewRights(String(d.get('assetId') || ''), String(d.get('view') || 'UNKNOWN'), String(d.get('reason') || ''));
            access.reset();
        }
        catch (err) {
            status(access, String(err));
        } });
        advanced.append(access);
    }
    const listing = document.createElement('div');
    listing.className = 'pane span-all';
    const h = document.createElement('h3');
    h.textContent = 'Recorded sources and witnesses';
    listing.append(h);
    const ul = document.createElement('ul');
    ul.className = 'compact-list';
    for (const s of bundle.sources) {
        const li = document.createElement('li');
        li.textContent = `${s.displayId} · ${s.title} — ${s.sourceInspection.replaceAll('_', ' ').toLowerCase()}`;
        ul.append(li);
    }
    for (const w of bundle.witnesses) {
        const li = document.createElement('li');
        li.textContent = `${w.displayId} · ${w.label} — independent physical witness record`;
        ul.append(li);
    }
    for (const a of bundle.assets) {
        const li = document.createElement('li');
        li.textContent = `${a.displayId} · ${a.filename} — ${a.pixelStatus.replaceAll('_', ' ').toLowerCase()}`;
        ul.append(li);
    }
    if (!ul.children.length) {
        const li = document.createElement('li');
        li.textContent = 'No sources, witnesses or images recorded yet.';
        ul.append(li);
    }
    listing.append(ul);
    section.append(listing);
    return section;
}
