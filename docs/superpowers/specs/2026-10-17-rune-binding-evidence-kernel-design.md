# Rune Binding Evidence Kernel — Superpowers Design Specification

**Date:** 2026-10-17  
**Design status:** Proposed written specification; **AWAITING USER REVIEW**  
**Superpowers stage:** Architectural design approved in conversation; written-spec review is the next gate.  
**Scope:** One source image or historical witness → annotated symbol → atomic claims → evaluated evidence → reproducible casefile.  
**Code status:** No product implementation, repository creation, dependencies, tests, commits, or deployment authorized or performed by this specification.

## 1. Authority, context, and design intent

### Source-of-truth hierarchy for this design

1. The user's agreed **casefile-first architectural direction** (current conversation) governs product scope.
2. `Rune_Binding_OMNI_Research_Protocol_v3.md` governs research methods, epistemic limits, terminology, and protected outputs. SHA-256: `96973ed5867cf1fa77edfbd0dcc4c29e2f80edd32eb37f52d94f3f27fda9b665`.
3. `Rune_Binding_OMNI_v3_Feature_Register.json` governs the stable F-01–F-36 feature IDs and their priority/acceptance intent. SHA-256: `ee5e440a8415d0a717a8507fa30a1b22b3b8925561e416ed2f83b589569e9f43`.
4. The v2 protocol and original research brief remain inherited research-scope references. Their extensive A–R report deliverables are **not** automatically features of this first software slice.
5. Outside archives (Runor, RuneS-DB, Rundata, Menota, EpiDoc, IIIF, W3C Web Annotation) are *methodological comparators and future source candidates*, not preconnected services or proof of individual rune claims.

A design decision herein is **proposed**, not a historical finding, product implementation, or replacement for the research protocol. No original user-supplied rune-image pixels were inspected as part of this design; no image-specific historical verdict is authorized by it.

### Product statement

Rune Binding is a **local-first, inspectable evidence workbench** for historians, curious readers, and practitioners investigating assertions about runes, bind-runes, magical staves, inscription readings, and modern rune-inspired symbols. It lets one person document *what was actually observed*, *what was inferred*, *what remains unknown*, and *which source supports each claim*, then produce a portable casefile that a second researcher can audit.

**Core rule:** Graphic form, textual reading, linguistic meaning, practical purpose, date/origin, and documented transmission are six independent claim dimensions. Neither visual similarity nor the presence of runic letters proves antiquity, a specific magical effect, or an unbroken historical lineage.

The workbench is not a rune divination service, an automated ancient-magic verifier, a source-rehoster, or a substitute for qualified editorial interpretation. Contemporary creative rune-binding remains valid as a **separately labeled modern practice**, not as evidence for ancient uses.

## 2. Problem, users, and outcomes

### Problem

Existing web symbol charts often compress several unrelated propositions into one caption: a drawing, a rune name, an asserted period, a supposed ritual purpose, and a claim of ancient continuity. Screenshots lose source context; copied charts look like independent evidence; manuscript page numbers and folios get confused; later reproductions are mistaken for early witnesses; incomplete searches are mistaken for disproving historical existence. The v3 protocol prescribes rigorous investigation but does not itself execute a durable evidence workflow.

### Primary jobs

- **Investigator:** import one user-owned or lawfully accessed image, highlight a particular design, and record exactly which historical proposition is under review.
- **Evidence editor:** attach source and witness details, distinguish direct evidence from quotations, secondary research, and independent-modern repetitions, preserve alternative readings, and record search limits.
- **Critical reader:** examine a conclusion and reach the cited source/page/region, including denied or unavailable-source states.
- **Modern practitioner (later stage):** create original symbolic art and document authorship and intent without mislabeling it as ancient; **not part of this kernel's first release**.

### Minimum successful user journey

Given a local image labeled “Viking protection bind-rune,” the user can: (1) import it privately; (2) draw one region; (3) enter separate historical form, chronology, and function claims; (4) attach one or more cited witnesses, or record the absence/inaccessibility of witnesses; (5) see which claims are supportable, contested, or unresolved; (6) export a Markdown casefile plus a structured JSON evidence record. A reviewer can understand every disposition without seeing the user's earlier chats.

Successful casefiles **must be allowed to conclude `UNVERIFIED`**, and the user can still finish and export them. Completion of a *casefile record* does not mean the historical claim is proven.

## 3. Boundaries and staging

### Included in kernel slice K1

1. Create, reopen, and locally persist a case.
2. Import a PNG/JPEG/WebP image; preserve original bytes where local storage and source permissions allow. Link-only external image records are permitted without claiming pixel inspection.
3. Create/edit one or more rectangular image regions and link them to visible symbol items; coordinate mapping remains stable through zoom/resize. More complex polygons and automatic tracing are later features.
4. Create typed `SOURCE`, `WITNESS`, `DESIGN`, `IMAGE`, `ITEM`, and `CLAIM` records. Do not conflate a catalogue record with an original historical object or a source with its asserted interpretation.
5. Record supporting, conflicting, and merely contextual evidence, including exact locators, source lineage, dating bounds, and limited access states.
6. Store a manual provenance verdict with reason; run deterministic **structural** checks for date contradiction, prohibited claim-category promotion, missing citations, missing rights grants, and unproven transmission edges.
7. Record negative-search receipts and `not searched` separately from `searched, no match`.
8. Save crash-tolerant checkpoints and preserve review events/superseded verdicts.
9. Generate offline, deterministic, rights-filtered `casefile.md`, `casefile.json`, and `manifest.json`; support data-record re-import without falsely promising that nonredistributable media can be embedded.
10. Provide usable responsive UI, keyboard alternatives to pointer drawing, and clearly visible blocked/unresolved findings.

### Explicitly NOT in K1

- Bulk ingestion or scraping of external archives; claims of official corpus integrations, IIIF availability, EpiDoc conformance, or universal coverage.
- OCR, machine vision classification, automatic stroke ancestry, automatic translation, or AI-generated source citations.
- Independent external expert review, automatic origin certification, or calculated numerical certainty.
- Complex rune-design studio, public publishing server, collaboration, accounts, cloud sync, mobile push, graph-layout editor, source harvesting, geographic maps, and complete A–R book-length synthesis.
- Automatic magic-effect classifications or a table equating modern intention keywords with Viking-Age spell effects.

### Foundation closure after K1, before historical-research release

The v3 feature register marks **15 items P0**; this slice is not a waiver. K1 is **a testable vertical slice**, not Phase-A certification. Remaining P0 scope must be tracked as `NOT YET IMPLEMENTED` until separate design/plan/testing cycles close it. Particularly, full script/period linting (F-13) and reversible transliteration (F-14) are *not* replaced by simplistic automatic checks. K1 can store researcher-provided script/readings and must label them **manual/unverified** unless supported by a cited witness and human review; it may not auto-certify philological correctness. A dedicated later P0 closure cycle implements those validators.

## 4. Architectural approach and trade-offs

### Three approaches already considered

- **A — Documentation-only workflow:** faithful to existing research prompt, minimal engineering, but weak durability and machine-readable lineage.
- **B — Local-first Evidence Kernel (selected for design):** structured local records, explicit source permissions, reproducible exports, constrained complexity.
- **C — Fully federated research platform:** tempting breadth but remote access, licensing, reconciliation, and maintenance risks overwhelm a first demonstration.

### Proposed runtime decision — for written-spec review

**K1 target:** a single-user, installable, offline-capable **browser workbench** with TypeScript domain logic, a responsive interface, browser-local IndexedDB metadata, and content-hashed local asset blobs; never require an account or remote API. This deployment choice is **an explicit adaptation** of v3's suggested SQLite + content-addressed local file store. It minimizes first-release installation friction and makes the golden path accessible on desktop and mobile browsers. The domain types, export semantics, and storage interface remain independent of IndexedDB so a later native SQLite backend can preserve evidence semantics.

**Why not promise SQLite in-browser now?** Browser file APIs and SQLite-WASM storage support vary by environment, and adding a multi-backend persistence layer to K1 increases failure surface. The proposed adapter preserves a future SQLite mapping without claiming that it is built. Browser storage can be evicted; the UI must expose persistence status and require durable export/backup rather than claim archival-grade permanence.

**Suggested implementation family for a future plan:** TypeScript + a lightweight browser UI (React is reasonable, not mandatory) + IndexedDB + a pure deterministic evidence/compiler module. Framework/library and exact version selection must be verified when the implementation plan is authorized; no dependency is installed here.

### Logical component boundaries

```text
Local image upload / manual source record / allowed deep link
                         |
            [Intake + permission checker]
                         |
           [Source / witness / asset store]
                         |
             [Image region annotator]
                         |
        [Typed claims + evidence relations]
                         |
          [Deterministic safeguards engine]
                         |
            [Editorial review events]
                         |
        [Version-pinned casefile compiler]
                         |
        [Rights-filtered export / re-import]

Shared foundation: local storage adapter, content digests,
source-lineage register, change journal, and accessibility layer.
```

- **Intake:** parse and validate input, assign stable internal identities, compute digest, attach rights/access status. Must not infer legal rights from a public URL or automatically fetch it.
- **Record store:** persist normalized entities, immutable source snapshots when permitted, indexes, and atomic review events. Storage implementations must not decide claim truth.
- **Region annotator:** link a visible image coordinate selector to an image digest, original dimensions, orientation metadata, and display transformation; missing image bytes are visible as a blocked condition.
- **Claims:** keep verbatim proposition, claimant, temporal range, explicit dimension, supporting/conflicting evidence, and interpretation distinct.
- **Safeguards:** deterministic, reason-bearing checks with outcomes `PASS`, `WARNING`, `BLOCK`; do not manufacture expert judgments.
- **Editorial review:** human chooses claim verdict and signs a timestamped local event with rationale; no anonymous automated historical certification.
- **Compiler:** pure transformation of frozen case revision + source manifest → portable outputs; no network access during compile; renders unresolved records without filling gaps.
- **Import/export:** validates schema, permissions, asset list, hashes, IDs and citations; preserves record versions and reports unavailable external media.

## 5. Domain record contract

The v3 `SRC-###`, `WIT-###`, `DES-###`, `CLM-###`, `EDGE-###`, `IMG-###`, and `ITEM-###` namespaces are preserved as **human-facing identifiers**. Internal stable IDs are opaque and never generated from mutable names or dates; display IDs remain unique in a project. Import collisions are surfaced as reviewable conflicts, not silently overwritten or auto-merged.

| Entity | Required content | Principal invariant |
|---|---|---|
| `Case` | Internal ID, title, created/updated timestamps, revision, case scope | A change creates a new case revision; prior signed conclusions remain inspectable. |
| `Source (SRC)` | Issuer/author, exact citation, URL if any, source type, access state, rights policy, provenance family | A bibliographic citation and the primary historical witness it discusses are distinct. |
| `SourceSnapshot` | Source ID, checked-at, digest if bytes read, exact locator, source version/access notes, permitted byte reference | A URL alone is not a verified image, text, folio, or personally viewed witness. |
| `Witness (WIT)` | Physical object/manuscript/printed/web witness type, collection, external aliases, date range, date confidence, context | Same title or glyph design is insufficient to merge witness identities. |
| `Asset (IMG)` | User-local image ID, digest, MIME, original width/height, rights, pixel status | Missing bytes cannot be described as visually examined. |
| `Item (ITEM)` | Parent image, label/transcribed caption, region ID, visibility status | A screenshot with five labeled symbols supports five item-level records, not one blanket verdict. |
| `Region` | Image digest, image dimensions, normalized x/y/width/height, transform/orientation, selector version | Coordinates reference original pixels; visual resizing must not change their meaning. |
| `Design (DES)` | Graphic observations, classification (`rune`, `ligature`, `same-stave`, `cipher`, `galdrastafur`, `nonrunic`, `uncertain`), variants | Form classification is not a reading, date, purpose, or genealogical conclusion. |
| `Claim (CLM)` | Exact assertion, attribution, typed dimension, subject ID, claimed period, review state, verdict, confidence rationale, P-scale if used | No promotion across evidence dimensions without a distinct supported claim. |
| `EvidenceLink` | Claim, source/witness ID, exact page/folio/line/region locator, relation `SUPPORTS`, `REFUTES`, `CONTEXT`, lineage ID, inspected state | Repeated sites from one source family are not independent witnesses. |
| `ReadingAlternative` | Design/witness, script, direction, diplomatic reading, transliteration, normalization, translation, uncertainty and editor | An English gloss cannot silently become an original runic reading. |
| `TransmissionEdge (EDGE)` | From/to designs or witnesses, type, cited chain, status | Resemblance alone never upgrades to `DOCUMENTED_COPYING`. |
| `SearchReceipt` | Query, source/corpus, filters, date, coverage, access result, searched count if known, limitations, execution mode (`USER_REPORTED` or `TOOL_VERIFIED`) | `NO_MATCH_IN_SCOPE` cannot be rendered as `NEVER_EXISTED`; manual searches are not silently labeled independently verified. |
| `ReviewEvent` | Actor (local editor label), claim, old/new disposition, rationale, time, dependent-record digest | Changing a claim appends history; no destructive edit to an earlier approved verdict. |
| `ExportManifest` | Format version, compiler version, case revision, record digests, included/omitted files, rights decisions | Export states precisely which bytes were omitted and why. |

### Epistemic states and state machines

These are separate fields, not interchangeable badges:

- `claim_type`: `FORM | READING | NAME | MEANING | DATE | PURPOSE | TRANSMISSION`.
- `evidence_verdict`: `ATTESTED | SCHOLARLY_RECONSTRUCTION | PLAUSIBLE_HYPOTHESIS | LATER_HISTORICAL_TRADITION | MODERN_DOCUMENTED | UNVERIFIED | CONTRADICTED_MISATTRIBUTED`.
- `review_state`: `DRAFT | EVIDENCE_PENDING | READY_FOR_REVIEW | REVIEWED | BLOCKED | SUPERSEDED`.
- `confidence`: `HIGH | MEDIUM | LOW | UNRESOLVED` with required free-text rationale for any non-`UNRESOLVED` value.
- `provenance_score`: `P5 | P4 | P3 | P2 | P1 | P0 | PU`, optional and scoped to a **specified origin assertion**, never an overall score of religious or artistic value.
- `dimension_status`: `DOCUMENTED | RECONSTRUCTED | DISPUTED | NOT_ESTABLISHED` applied separately to form, function, date, and transmission.
- `source_inspection`: `ORIGINAL_BYTES_VIEWED | FACSIMILE_VIEWED | EDITION_VIEWED | METADATA_ONLY | SECONDARY_SUMMARY | NOT_ACCESSED`.

Only the local human editor can transition a claim to `REVIEWED`. `BLOCKED` means a particular needed evidence path is unavailable; it does not turn a claim into `CONTRADICTED_MISATTRIBUTED`. A reviewed claim invalidated by a changed citation becomes `NEEDS_RECHECK` **as a derived workflow flag**, while the prior event remains in review history; this does not silently overwrite its epistemic verdict.

### Dates and chronology

A dated witness stores `not_before`, `not_after`, date precision, whether the range dates the **surviving copy, object, statement, or hypothesized practice**, and the relevant historical calendar/era notes. Open bounds and unknown dates remain legal values. Comparisons only fire on genuinely comparable, non-null bounds. A seventeenth-century surviving drawing cannot, **on its own**, prove an identical design existed in the Viking Age; it can demonstrate later attestation. `earliest located` is a result of a declared search, **not** `first invented`.

### Source independence and lineage

Record `underlying_witness_id` separately from `source_publication_id`. Two catalogues referring to one stone are two catalogue records but *one* physical witness. Ten sites copying one modern chart are one dependent claim family unless independence is demonstrated. Unknown dependence remains `UNRESOLVED`, not arbitrarily clustered or independent. The UI shows counts of **documents found**, **underlying witnesses identified**, and **independent support lineages** separately.

## 6. Source and rights handling

**K1 supports manual, read-only citation entry and local lawful image import.** No unsupported API or authentication assumptions. Later adapters to Runor, RuneS-DB, Rundata, Handrit, and IIIF require individual feasibility, reuse-terms and fixture proof. Menota/EpiDoc are editorial standards to study, not automatic live data providers.

Rights policy expresses capabilities individually:

- `may_reference_link`
- `may_view_locally`
- `may_store_local_copy`
- `may_include_metadata_export`
- `may_embed_image_export`
- `may_redistribute_image`

Unknown rights are **not equivalent to permission**. An externally hosted image may be deep-linked where allowed while its pixels are excluded from exported packs. The import flow records operator-supplied rights evidence, restrictions, and an `UNKNOWN` possibility; it never infers blanket redistribution permission from site visibility or successful downloading. A local user upload may be retained privately under the user's control subject to storage rules but is not automatically published or redistributed.

No automatic fetching behind paywalls, login bypass, robots circumvention, or rehosting restricted manuscript images. Rights policy runs at **intake, thumbnail/cached use, and export**. Denied media appears as a text citation plus an omission reason when that is permitted.

## 7. Evidence evaluation and review

### Deterministic rules included in K1

1. **Category firewall:** a name/gloss/modern prosperity keyword cannot justify an ancient ritual `PURPOSE` without an independent purpose claim and appropriate witness.
2. **Chronology rule:** a later-known graphic cannot by itself demonstrate an earlier event or invention; distinguish first *located* occurrence from source date and presumed origin.
3. **Transmission rule:** two resembling designs may be tagged `SIMILAR`, not `DOCUMENTED_COPYING`, without an identified chain and source links.
4. **Source-independence rule:** multiple publications derived from one object or chart cannot inflate independent evidence counts.
5. **Citation completeness:** historically material propositions with no located inspectable source are labeled `UNVERIFIED` or `EVIDENCE_PENDING`; a URL alone is not a pinpoint citation.
6. **Negative-search rule:** failed or zero-result searches must record corpus, query, filters, date, and coverage caveat, never universal impossibility.
7. **Identity rule:** ambiguous same-name artefacts are never merged automatically; edits require human selection; identical-content reimports may be recognized by hash, not title.
8. **Rights rule:** source-image bytes omitted when policy does not permit the export use.
9. **Change propagation:** when a source or witness date is corrected, dependent claims are marked `NEEDS_RECHECK`, not silently rewritten.
10. **Missing-pixels rule:** if the actual image cannot be viewed, visual-form assertions are blocked while unrelated contextual research remains available.

These rules are **lint**, not a machine-generated historical verdict. The UI presents exact detected condition, affected claim IDs, supporting field values, and the narrow action needed; it does not use a single opaque authenticity score.

### Editor workflow

The editor can select a claim, view the original proposition verbatim and its evidence/limitations, set a reasoned editorial disposition, attach an alternative, and sign a new `ReviewEvent`. A `REVIEWED` + `ATTESTED` historical claim requires an identified source/witness, a specific locator, and an inspection state that supports the claimed dimension; otherwise the editor may retain the assertion as a hypothesis or `UNVERIFIED`, but cannot certify it as directly witnessed. An editor cannot bypass an unmet source-rights requirement by choosing a stronger verdict. The workbench must not silently revise that disposition after a later import or schema migration. If the user publishes an export with blocked material, the export itself must clearly show the block and cannot describe the case as fully verified.

## 8. User experience contract

### Primary surfaces

1. **Case shelf:** recent local cases, save/backup status, source-count and unresolved-count summaries; create or import case.
2. **Evidence desk:** main image viewer with zoom/pan, region drawing and accessible numeric-coordinate edit; left-side symbol/item list; source-identity chip and original-pixel status.
3. **Claim ledger:** per-item claims grouped by FORM, READING, NAME, MEANING, DATE, PURPOSE, TRANSMISSION; evidence links and independent-lineage counts; visible uncertainty and missing-locator states.
4. **Review workspace:** exact citations and issue list with `PASS`, `WARNING`, `BLOCK`; manual verdict history; compare competing explanations without collapsing them.
5. **Casefile preview/export:** readable generated document with linked evidence, search coverage, blocked sections, and export omission list; choose JSON/Markdown, and include only lawfully permitted assets.

### Interaction and accessibility

- First-run onboarding is one concise example with **clearly synthetic placeholder data**; no invented rune-history claims.
- Image zoom and pan preserve annotated region coordinates; drawing has touch/mouse and keyboard-accessible coordinate-entry equivalents. No exclusive reliance on hover, tiny handles or color.
- Mobile layout stacks image, item list and claims; controls stay usable without sideways scrolling. Large manuscript zoom is optional and lazy.
- Missing original pixels, insufficient bibliography, unknown rights, offline/unavailable remote link, and uncertain reading are explicitly readable statuses, not hidden tooltips.
- Focus order, accessible labels, announcements for save/export, undo/review history, and reduced-motion mode are required.
- Offline opening of existing local cases should not trigger network; external source links are clearly labeled as externally hosted.

### Scope constraints

No magical visuals or dark ornamental styling should obscure historical uncertainty. A modern design studio, when added later, is a separate mode and data collection, with **new design receipts** never ingested as archaeological witnesses.

## 9. Save, restore, portability and privacy

### Storage

- Single-user browser-local storage by default. Store metadata and permitted image bytes separately but bind them by content hash. IndexedDB operations that update case, evidence and review event must commit atomically or fail as a unit.
- Show storage durability warning when browser storage is unavailable, quota is low, or persistence permission is denied. Exports are a **required recovery path**, not an optional decorative control.
- Schema migrations require a retained pre-migration export/checkpoint, validated round-trip, and an error path that preserves the previous version if possible.
- No mandatory remote sync; no analytics or uploaded user images by default. Opening an external source URL may contact its host and must be user-directed.

### Casefile compilation

Output at minimum:

- `casefile.md`: human-readable findings, source/witness list, image-item annotations, exact claims and reasons, contrary evidence, chronological limitations, negative searches, editorial signature, rights omissions, and unresolved status.
- `casefile.json`: versioned canonical domain records needed to reconstruct claim/evidence relationships and review history.
- `manifest.json`: schema/compiler version, source snapshots and hashes where available, case/revision IDs, timestamps from frozen source events, export contents, omitted assets with reasons, and export integrity digest.

Compiler output order is stable by persistent IDs, not accidental insertion order. For the same frozen case revision, compiler version, rights settings, and included assets, the output payload has identical hashes. Real current time is **not** injected during recompilation; the existing frozen review/export event is reused or excluded from the deterministic payload.

**Re-import guarantee:** case structure, record IDs, claim states, citations, event history, and omission flags round-trip without silent changes. Restricted or link-only image bytes may be unavailable on another device; imported records must state `EXTERNAL_ASSET_REQUIRED` and never report a fully offline visual reproduction. A full-bytes restore is guaranteed only for assets that were lawfully included and whose hashes verify. Re-import of an existing record ID with identical content is idempotent; the same ID with different content creates a visible revision/conflict requiring review, never an overwrite.

### Security

Limit image inputs initially to validated raster files (PNG/JPEG/WebP) with MIME and decoded-size checks; never execute embedded SVG/HTML. Treat imported JSON and copied citations as untrusted data. Display text without unsafe HTML injection, guard external URLs, reject traversal or disguised filenames, and impose tested resource-size limits selected during implementation. No archive ZIP extraction in K1. Export should omit personal notes and private paths by default; a user must opt in to sharing them. Never log source image content or credentials.

## 10. Error and adversarial behavior

| Failure/event | User-visible response | Preservation rule |
|---|---|---|
| Image listed but no pixels available | `ORIGINAL PIXELS UNAVAILABLE`; disable witness-level visual judgment | Keep citation and item record. |
| Rights unknown or forbids redistribution | Link-only or metadata-only export with omission record | Do not embed forbidden media bytes. |
| Same object name on two distinct monuments | Suggested alias conflict; ask editor to resolve | No automatic merge or overwritten ID. |
| Five mirror websites reuse one chart | Show five documents, one upstream family when documented | No inflated independent evidence. |
| `26v` versus `page 26` conflict | Locator disagreement warning | Preserve both literal locators; do not substitute. |
| Early-modern manuscript cited as Viking | Chronology warning/blocked inference | Preserve valid later attestation. |
| Source unreachable or access denied | `NOT_ACCESSED` / `LINK_UNAVAILABLE`; show alternate manual citation entry | No invented `FACSIMILE_VIEWED` state. |
| No source found in queried subset | `NO_MATCH_IN_SCOPE` with source/date/query receipt | Do not declare `never existed`. |
| Browser quota, crash, or export interruption | Recover last committed local revision; show backup/restore path | No silently dropped completed review events. |
| Review source changed | `NEEDS_RECHECK` on dependents | Preserve previous human decision and reason. |
| User enters modern rune keyword as Viking ritual fact | Typed-claim firewall; request direct historical purpose evidence | Do not promote name/interpretation into proof. |
| Part of design cropped/damaged | `FORM_UNDETERMINED` annotation | Do not hallucinate strokes. |

## 11. Verification obligations and performance targets

These are **proposed future acceptance thresholds**, not benchmarks obtained today. Actual benchmark machine, browser version, corpus size, dataset hashes, cache state, and network conditions must be recorded at implementation time.

### Golden-path release criteria (K1)

1. A seeded image plus two contradictory historical assertions can be recorded at item level; no blanket verdict across all screenshot symbols.
2. A reviewer can click a claim and see its annotated source image rectangle in original coordinates after resizing and zoom.
3. A second researcher can understand from `casefile.md` why a claim is `ATTESTED`, `UNVERIFIED`, or `CONTRADICTED_MISATTRIBUTED` (as manually reviewed), and see provenance/inspection limits.
4. A manuscript folio and a printed page number remain distinct; conflicting literal locators block an unjustified equivalence claim.
5. Repeated derived web charts cannot be counted as multiple independent historical witnesses.
6. A modern symbol composed of old letterforms is not automatically assigned an ancient creation date or magical purpose.
7. Unlicensed/unverified image bytes are excluded from public-export fixtures; links/metadata remain when permitted.
8. A search with zero results exports the exact negative-search receipt and wording `no match in searched scope`; user-reported searches remain marked user-reported.
9. An injected restart after half a batch retains all committed case IDs and review events without duplication.
10. Identical frozen case revisions produce byte-identical canonical JSON and Markdown; a re-import preserves all nonmedia evidence data.
11. Offline opening, keyboard alternative to image drawing, visible data-recovery warnings, and mobile viewport baseline are demonstrated.
12. Any missing mandatory source, pixel, identity, or permission fails **the affected assertion**, not the entire unrelated case.

### P0 foundation closure criteria (after K1)

All 15 F-IDs marked `P0` in v3 must have explicit linked tests, including F-13 script-period checks, F-14 round-trip transliteration alternatives, and F-36 adversarial fixtures. The full inherited 20-point AT research suite is required for an actual *historical report*; app component completion cannot substitute for researching an inscription. The 16 VX cross-feature fixtures are a design source for regression tests, but their passing is not claimed until run against a real implementation.

### Initial performance targets

- Indexed local claim search on 10,000 metadata records: **p95 less than 250 ms**, measured via at least 1,000 controlled lookups on a declared reference device.
- Casefile regeneration from 100 claims with no remote fetches: **p95 less than 2 seconds**, measured across repeat runs with output hashes.
- Restart at 50% of seeded ingestion: zero lost **committed** records, zero duplicate IDs, and explicit report of incomplete operations.
- No duplicate remote fetches (not applicable to manual-source-only K1; becomes a gate for external adapters).
- Zero false auto-merged distinct witnesses and zero denied-media bytes in exported fixtures.

The objective is not benchmark theater: no latency target overrides source fidelity, export integrity or refusal to invent evidence. A failed performance test produces a measured finding, not a story about hypothetical optimization.

## 12. Feature-registry mapping and dependencies

The v3 IDs are stable. `K1` below means **the initial slice owns a limited capability**; `P0-CLOSURE` means the remainder is still a release gate; `LATER` means no implementation is authorized yet.

| v3 feature | K1 obligation | Deferred or conditional scope |
|---|---|---|
| F-01 Source adapter contract | Manual source import + normalization contract | Live provider adapters and pagination require independent review. |
| F-02 Cross-corpus identity resolver | Explicit aliases, human-reviewed identity suggestions | Automated resolver and multi-corpus ingestion later. |
| F-05 Rights-aware media gateway | Rights gates at import, local storage, and export | Provider-specific rights verification later. |
| F-07 Region-precise evidence anchors | Stable rectangles and verified image digests | Rich IIIF selector and polygon integration later. |
| F-08 Folio/page-order checker | Preserve distinct locator namespaces and warn on mismatches | Auto-catalogue page mapping later. |
| F-13 Script/period linter | Store script/period fields; no unreviewed auto-certification | Actual phonetic/script compatibility checks in P0-CLOSURE. |
| F-14 Reversible transliteration | Distinct manual transcription/transliteration/translation fields | Round-trip algorithm and test suite in P0-CLOSURE. |
| F-17 Semantic-category firewall | Separate claim dimensions; block forbidden category promotion | Expand language-specific checking with corpus evidence. |
| F-19 Claim dependency propagation | Invalidate dependent claim review flags on change | Richer genealogical graph later. |
| F-20 Chronology contradiction | Dated-range and claim-scope deterministic rules | Complex uncertain dating analysis later. |
| F-21 Source independence | Manual lineage registry + witness-family counts | Semi-automated clustering later. |
| F-23 Transmission burden-of-proof | Resemblance versus documented-copying gate | Specialized transmission research later. |
| F-26 Negative-search receipt | Structured bounded search logs | Automated corpus-coverage estimator later. |
| F-28 Checkpointed queue | Atomic local revision and restart/replay proof | Long-running provider job queue later. |
| F-36 Adversarial fixture gate | K1 fixtures and regression results | Complete inherited 16 VX and 20 AT report gates at proper stages. |

F-03/04/06, F-09–12, F-15/16/18, F-22, F-24–25, F-27, F-29–35 remain in the broader v3 feature register, unchanged and not implied by K1. K1 exists so these can be added to a working foundation rather than a speculative dependency forest.

## 13. Design acceptance and open review decisions

### Written-spec self-review standard

- Every claimed capability above has a use-case, inputs, outputs, error path and proof condition.
- Stable v3 identifiers, historical evidence classes, PU uncertainty and manual-review requirements are preserved.
- No outside archive access, original-image forensics, source scholarship or historical fact-checking is represented as completed.
- The software slice is narrower than the whole 36-feature platform; outstanding P0 gates are visible.
- Casefile export and restoration claims are bounded by image permissions and available bytes.
- The first implementer can translate components into separate reviewed tasks after the user accepts this written specification.

### Decisions to ratify with this spec

1. **K1 before federation:** build one complete casefile path before bulk corpus adapters or visual ancestry methods.
2. **Browser-local first:** adopt an installable TypeScript/IndexedDB workbench for initial desktop/mobile access, knowing SQLite remains a later adapter option and manual export is essential for recovery.
3. **Strict publication discipline:** machine checks may block/fail an assertion, but human review alone decides historical editorial verdicts.
4. **Two authority lanes:** historical evidence and contemporary self-authored creative work never share automatic provenance or effect rules.
5. **One source of research truth:** retain v3 and its feature register; this spec governs only the K1 software architecture, not rewriting historical conclusions.

### Review gate

**Stop here.** The next Superpowers action after the user reviews and approves this **written** spec is `superpowers:writing-plans`, producing task-sized implementation plans with exact paths, interfaces, test-first steps, failure fixtures and an execution-choice gate. A conversational design approval is not approval to code, choose a repo unilaterally, install packages, commit, deploy, or claim the 36 features exist.

**Repository state at authorship:** No current Rune Binding repository was supplied. A read-only GitHub name search for `Rune Binding` under the known account returned no matching repo. This standalone file was therefore created in the artifact workspace at `docs/superpowers/specs/2026-10-17-rune-binding-evidence-kernel-design.md`; **no Git commit has been made**. On implementation planning, resolve the actual repository/working directory before assigning final paths.
