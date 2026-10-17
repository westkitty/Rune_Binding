# Rune Binding Evidence Kernel K1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one private, offline-capable, accessible rune-evidence investigation from a lawful source image or link through region annotation, typed historical claims, deterministic safeguards, human review, and independently auditable Markdown/JSON casefiles.

**Architecture:** Single-user browser workbench with a pure TypeScript evidence domain, transactional IndexedDB adapter, responsive React UI, and network-free deterministic casefile compiler. Keep graphic observation, reading, date, purpose, and transmission as independently reviewable claims; machine checks lint structure but never pronounce historical truth.

**Tech Stack:** Proposed Vite + React + TypeScript (strict) + Zod + `idb` (IndexedDB adapter), Vitest + `fake-indexeddb` + Testing Library, and Playwright for browser/keyboard/mobile/offline tests. Native Web Crypto for content digests; browser-native service worker/manifest for offline installation. Pin exact compatible dependency versions in `package-lock.json` during implementation after checking the actual Node/browser environment; this plan does **not** claim dependencies have been installed.

**Spec:** `docs/superpowers/specs/2026-10-17-rune-binding-evidence-kernel-design.md` (design SHA-256 `3f7a7eab5d9fad01e3e963d7be70da592181674d619252cde9ec67ac4bed891d`).

**Research authority (preserve bytes):** `docs/research/Rune_Binding_OMNI_Research_Protocol_v3.md` (SHA-256 `96973ed5867cf1fa77edfbd0dcc4c29e2f80edd32eb37f52d94f3f27fda9b665`) and `docs/research/Rune_Binding_OMNI_v3_Feature_Register.json` (SHA-256 `ee5e440a8415d0a717a8507fa30a1b22b3b8925561e416ed2f83b589569e9f43`). These are proposed repository locations for exact, unmodified copies of the already verified artifact-workspace files.

**Current state:** PLANNED ONLY. No Rune Binding repository has been identified, no product code written, no dependencies installed, no TDD cycle executed, and no build/performance claim verified. The user approved the written architectural specification by saying “Go on”; this authorizes writing this plan, not executing it.

## Global Constraints

- **Environment gate:** Before Task 1, resolve the user's actual repository/working directory and check owner, branch, clean/dirty Git state, Node/npm availability, and any existing implementation. Existing code wins over the provisional tree below; reconcile filenames and test commands in a *reviewed amendment* rather than creating a competing project. If no repo exists, STOP and obtain explicit authority for creating a new local or GitHub repository. No implicit GitHub repo creation.
- **Scope:** Implement only design K1; preserve all F-01–F-36 IDs. K1 is **not** complete P0 closure. Do not claim F-13 script-period validation or F-14 round-trip transliteration is implemented; retain manual fields and label them manual/unverified. Do not present all 15 P0 features as finished.
- **Epistemic firewall:** `FORM | READING | NAME | MEANING | DATE | PURPOSE | TRANSMISSION` are separate claim types. Visual resemblance does not prove date, copying, meaning, or magical purpose. A missing witness yields `UNVERIFIED`/blocked, not `CONTRADICTED_MISATTRIBUTED` or “never existed.” Only a named local human editor can create `REVIEWED` editorial verdicts.
- **Historic verdicts:** `ATTESTED | SCHOLARLY_RECONSTRUCTION | PLAUSIBLE_HYPOTHESIS | LATER_HISTORICAL_TRADITION | MODERN_DOCUMENTED | UNVERIFIED | CONTRADICTED_MISATTRIBUTED`; review states are independent (`DRAFT | EVIDENCE_PENDING | READY_FOR_REVIEW | REVIEWED | BLOCKED | SUPERSEDED`), with `NEEDS_RECHECK` *derived*, not a stored overwrite of the historic verdict. Maintain separate P5–P0/PU provenance attribution field.
- **Source identity:** Human-facing IDs retain namespaces `SRC-###`, `WIT-###`, `DES-###`, `CLM-###`, `EDGE-###`, `IMG-###`, `ITEM-###`. Opaque stable internal IDs must not derive from mutable titles/dates. Source publications, underlying witnesses, and evidence-lineage families remain separate. Unknown dependence is `UNRESOLVED`.
- **Locality and rights:** No accounts, analytics, mandatory cloud, automatic archive scraping, network fetch in compiler, licensing inference from visibility, third-party image upload, paywall bypass, unapproved asset redistribution, or automatic provenance classification. Rights are separately recorded for link, local view, local copy, metadata export, image embed, and redistribution; unknown is not permission.
- **Security:** PNG/JPEG/WebP only with magic-byte and decoded-dimension checks; no SVG/HTML execution, remote image auto-fetch, untrusted HTML rendering, unbounded imported JSON, unrestricted file sizes, leaked private paths, or image/credential console logs. User-provided citations are text, not executable markup.
- **Durability:** Browser storage is not an archival guarantee. Every committed case edit and review event survives restart; show backup warnings; use atomic IndexedDB transactions and explicit conflict errors; make allowed exports restorable. Schema-version incompatibility must fail closed rather than mutate existing data.
- **Accessibility:** Mobile, touch, mouse, and keyboard workflow. Image-region annotation has numeric-field alternative; visible save/failure states; focus and reduced-motion support; no mandatory network after first successful installation.
- **Determinism:** Same frozen case revision + compiler version + export mode/rights + same included media yields byte-identical `casefile.md`, `casefile.json`, and `manifest.json`. Sort by stable IDs, use original event times, do not call `Date.now()` inside the compiler; a manifest MUST NOT contain its own recursive hash.
- **Performance targets, not claims:** On a recorded reference device/browser, 10,000-record indexed lookups, >=1,000 probes, p95 <250 ms; 100-claim casefile regeneration p95 <2 seconds. Integrity requirements outrank speed. Record measured machine/browser/cache/dataset and full timing distributions.
- **Approval boundary:** No product implementation, dependencies, remote mutation, worktree, Git commit, push, deploy, or release occurs as a result of authoring this plan. Once this plan is approved and execution mode selected, use the appropriate Superpowers executor and create an isolated worktree when applicable. Implementation task commits are local only unless separately authorized to push.

## Review Focus

Five easily missed input classes (each has a directly named test below):

1. **Two contradictory witnesses share a familiar title:** `same_title_distinct_witnesses_remain_distinct` in Task 5; identity conflicts surface rather than merging records.
2. **Image rotation, resizing, and touch mapping:** `annotation_survives_zoom_resize_orientation` in Task 6 plus mobile Playwright test in Task 13; original-image normalized coordinates survive display transforms.
3. **Unknown versus denied media/metadata rights:** `unknown_rights_never_embed_pixels` in Task 4 and `restricted_metadata_export_is_explicitly_incomplete` in Task 11; never silently claim full restoration.
4. **Partial failed write during review:** `transaction_abort_retains_prior_revision_and_review_history` in Task 3 and `restart_after_half_ingestion_is_idempotent` in Task 14; no lost committed events or duplicate IDs.
5. **Imported malicious or stale case record:** `reimport_conflicting_id_requires_resolution` and `reject_malformed_and_oversized_json` in Task 12; no overwrite, code execution, or silent schema migration.

---

## Repository and evidence prerequisites (not product implementation tasks)

- Source bytes currently exist in the artifact workspace; the checked reference spec uses `docs/superpowers/specs/2026-10-17-rune-binding-evidence-kernel-design.md`. Confirm the repository target and place identical copies of that spec and two v3 research files in the stated paths. Check SHA-256 before proceeding.
- If an existing Rune Binding repository is selected, inspect its actual conventions and mark proposed paths as reconciled. If a new repository is explicitly approved, initialize it without remote publication; do not create duplicate account/project names.
- Run `git status --short --branch`, `git rev-parse --show-toplevel`, `node --version`, `npm --version`, and record the environment in `docs/superpowers/implementation-environment.md` (proposed). Preserve unrelated work; never `git reset --hard`, `git clean -fd`, force-push, or overwrite preexisting files. For existing repos, use `superpowers:using-git-worktrees` before feature execution.
- **Dependency admission:** check official current documentation and license for Vite/React/TypeScript/Zod/`idb`/Vitest/Playwright, verify compatibility and maintainer status, pin tested exact releases in lockfile. No vague floating dependency versions in release. Node must be an officially supported maintained release for the selected Vite toolchain; do not guess a Node version from this plan.
- **Git discipline:** Each task's proposed commit is a **future** local commit in the verified branch/worktree after red→green checks; the reviewer can reject a task without requiring unrelated tasks to be rolled back. No publish/merge authority is inherited from `Go on`.

## Proposed file map (relative to VERIFIED repository root)

| Path | Responsibility |
|---|---|
| `docs/superpowers/specs/2026-10-17-rune-binding-evidence-kernel-design.md` | Approved architecture; immutable reference during K1 |
| `docs/research/Rune_Binding_OMNI_Research_Protocol_v3.md` | Historical/research methodology source of truth |
| `docs/research/Rune_Binding_OMNI_v3_Feature_Register.json` | F-01–F-36 registry; source IDs/priority intent |
| `src/domain/schema.ts` | Zod evidence-record shapes, enum values, hard referential rules |
| `src/domain/ids.ts` | UUID identity and case-local display namespace counters |
| `src/domain/case-actions.ts` | Pure case mutations and validation before commit |
| `src/domain/independence.ts` | Publication/witness/lineage distinct counting |
| `src/domain/regions.ts` | Screen/zoom/orientation to normalized original-image coordinates |
| `src/domain/rights.ts` | Six independent capability checks, export omission reasons |
| `src/domain/safeguards.ts` | Deterministic lint issues with field-level evidence |
| `src/domain/review.ts` | Guarded human-review transitions and append-only events |
| `src/storage/case-repository.ts` | `CaseRepository` contract, versioned mutation errors |
| `src/storage/indexeddb-repository.ts` | Atomic browser database adapter, case/media stores |
| `src/intake/raster.ts` | Strict original-image validation, digest and metadata extraction |
| `src/export/canonical.ts` | Stable JSON encoding and byte digest helpers |
| `src/export/casefile.ts` | Pure Markdown/JSON/manifest compiler and rights-filtered media plan |
| `src/export/import-casefile.ts` | Validate and reconcile casefile imports without silent merges |
| `src/ui/CaseShelf.tsx` | Local cases, storage and backup status |
| `src/ui/SourceIntake.tsx` | Local image/manual source and rights intake |
| `src/ui/AnnotationDesk.tsx` | Zoomable source image, rectangle and keyboard numeric edit |
| `src/ui/ClaimLedger.tsx` | Atomic claim/source/witness/evidence input and distinction badges |
| `src/ui/ReviewDesk.tsx` | Lint findings, human review, audit history |
| `src/ui/CasefileDesk.tsx` | Preview, omissions and verified downloads/import |
| `src/app.tsx`, `src/app.css`, `src/main.tsx` | Responsive shell and navigation; React-escaped text |
| `public/manifest.webmanifest`, `public/sw.js` | Offline shell/installed-workbench support without caching remote sources |
| `tests/fixtures/evidence-cases.ts`, `tests/fixtures/media.ts` | Synthetic reference and adversarial fixtures; not claimed historical evidence |
| `tests/unit/*`, `tests/integration/*`, `tests/e2e/*`, `tests/perf/*` | Purpose-specific test coverage, browser journeys and benchmarks |
| `docs/superpowers/implementation-environment.md` | Actual execution environment and verified dependency versions |
| `docs/superpowers/K1-acceptance.md` | Requirement-to-test trace, deferred P0 items and evidence-based release verdict |

A root `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `index.html`, and test setup file are expected **only if a new TypeScript app is approved**; adapt existing repo tools when present. Build commands below assume the proposed npm scripts have been reconciled at Task 1.

## Shared contracts locked for implementers

These signatures are the inter-task handoff. Types derive from `src/domain/schema.ts`; no task may silently rename them.

```ts
export type CaseBundle = z.infer<typeof CaseBundleSchema>;
export type RightsPolicy = z.infer<typeof RightsPolicySchema>;
export type AssetRecord = z.infer<typeof AssetRecordSchema>;
export type ClaimRecord = z.infer<typeof ClaimRecordSchema>;
export type EvidenceIssue = {
  ruleId: string; claimId: string | null;
  severity: 'PASS' | 'WARNING' | 'BLOCK';
  message: string; affectedRecordIds: string[]; fieldPaths: string[];
};
export type MediaPayload = { sha256: string; bytes: Uint8Array };
export interface CaseRepository {
  listCases(): Promise<CaseBundle['case'][]>;
  getCase(caseId: string): Promise<CaseBundle | null>;
  createCase(bundle: CaseBundle): Promise<void>;
  mutateCase(caseId: string, expectedRevision: number, mutationId: string,
    update: (current: CaseBundle) => CaseBundle,
    media?: MediaPayload[]): Promise<CaseBundle>;
  getMedia(sha256: string): Promise<Uint8Array | null>;
  storageHealth(): Promise<{
    available: boolean; persistent: boolean | null;
    estimatedUsage: number | null; estimatedQuota: number | null;
  }>;
}
```

`CaseBundle` is a versioned, JSON-safe, normalized aggregate: `schemaVersion`, `case`, and arrays of `sources`, `sourceSnapshots`, `witnesses`, `assets`, `regions`, `items`, `designs`, `claims`, `evidenceLinks`, `readingAlternatives`, `transmissionEdges`, `searchReceipts`, and `reviewEvents`. `case` has `id`, `title`, `revision`, `createdAt`, `updatedAt`. Media bytes are NEVER embedded in the case JSON. Human-facing display IDs are separate from opaque `id` values. Missing record categories use `[]`, not ambiguous undefined.

`RightsPolicySchema` has six tri-state capability keys named exactly `may_reference_link`, `may_view_locally`, `may_store_local_copy`, `may_include_metadata_export`, `may_embed_image_export`, and `may_redistribute_image`, each `ALLOW | DENY | UNKNOWN` plus `rightsBasis` / `rightsNotes`. K1 never treats `UNKNOWN` as `ALLOW`. An export never overrides a denied capability merely because the local user possesses the bytes.

For imported snapshots, `sourceInspection` is one of `ORIGINAL_BYTES_VIEWED | FACSIMILE_VIEWED | EDITION_VIEWED | METADATA_ONLY | SECONDARY_SUMMARY | NOT_ACCESSED`; these are explicit human/editor evidence states, not inferred from links. `DateRange` uses nullable integer `notBefore`/`notAfter`, typed `dateSubject` (`OBJECT | SURVIVING_COPY | STATEMENT | PRACTICE`), precision, and caveat. Locator uses `{ kind: 'FOLIO' | 'PRINTED_PAGE' | 'LINE' | 'IMAGE_REGION' | 'OTHER'; literal: string; regionId?: string }`; `FOLIO:26v` must not normalize to `PRINTED_PAGE:26`.

`ReviewEvent` appends actor, claim ID, prior/new disposition, timestamp, reason and dependent digest. Never edit or delete an event. An invalidated reviewed claim keeps its prior verdict/event but is flagged `NEEDS_RECHECK` by derived selectors. `CaseBundle` changes increment the case revision exactly once on committed transaction; compiler never increments it.

## Task 1: Establish repo foundation and runnable harness

**Files:** Create/retain root project/test config; `src/main.tsx`, `src/app.tsx`, `src/app.css`, `tests/e2e/shell.spec.ts`; preserve design and research files at listed repo paths.

**Interfaces:** Produces npm scripts `dev`, `build`, `typecheck`, `test:unit`, `test:e2e`, `test:perf` and a blank-but-functional accessible shell for Task 2 onward. `test:unit` uses `vitest run`; `test:e2e` uses `playwright test`; `test:perf` runs `playwright test tests/perf` with a separately documented reference configuration.

- [ ] **Step 1 — Write failing shell test:** `tests/e2e/shell.spec.ts::opens_case_shelf` asserts the application has heading `Rune Binding`, button `Create case`, and a visible `Local-only` or storage-unavailable status; it must not display a fabricated historical finding.
- [ ] **Step 2 — Verify red:** after explicit target approval and compatible test harness initialization, run `npm run test:e2e -- tests/e2e/shell.spec.ts` and record that the missing app route/component fails.
- [ ] **Step 3 — Minimal implementation:** configure pinned compatible Vite/React/TypeScript/test dependencies; implement the shell with semantic landmarks, in-memory navigation placeholder, and scripts exactly as above. Preserve existing project files if this is not a new repo.
- [ ] **Step 4 — Verify green:** `npm run typecheck && npm run build && npm run test:e2e -- tests/e2e/shell.spec.ts`; verify zero dev-console exceptions.
- [ ] **Step 5 — Local task commit:** stage only verified foundation, source reference copies and test files; commit `chore: establish Rune Binding K1 testable foundation` after reviewing `git diff --cached --stat`.

## Task 2: Schema, IDs, and impossible-claim protection

**Files:** `src/domain/schema.ts`, `src/domain/ids.ts`, `tests/unit/schema.test.ts`, `tests/fixtures/evidence-cases.ts`.

**Interfaces:** Produces `CaseBundleSchema`, `validateCaseBundle(value: unknown): CaseBundle`, `newEntityId(): string`, `nextDisplayId(bundle: CaseBundle, prefix: 'SRC'|'WIT'|'DES'|'CLM'|'EDGE'|'IMG'|'ITEM'): string`, and `syntheticCase(): CaseBundle`. All input arrays and strings have explicit bounded limits; `schemaVersion` begins `1` and unsupported versions reject without migration.

- [ ] **Step 1 — Write failing tests:** `one_rune_name_cannot_become_purpose` verifies a `NAME` claim stays typed `NAME`; `ids_do_not_depend_on_name_or_date` changes a title without changing opaque ID; `folio_and_page_are_distinct_locators` preserves `FOLIO:26v` and `PRINTED_PAGE:26`; `unknown_provenance_is_allowed` accepts `PU`/unresolved.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/schema.test.ts` fails for the missing parser and ID functions (not because fixture syntax is wrong).
- [ ] **Step 3 — Minimal implementation:** define discriminated Zod records and `CaseBundle` aggregate, typed date/rights states, normalized claim/evidence inputs (`SourceInput`, `WitnessInput`, `EvidenceLinkInput`, `ClaimInput`, `ReadingAlternativeInput`, `SearchReceiptInput`) and localized display-ID numbering; use `crypto.randomUUID()` only for new opaque IDs, not deterministic export runs.
- [ ] **Step 4 — Verify green:** `npm run test:unit -- tests/unit/schema.test.ts && npm run typecheck`; malformed date ranges and duplicate display IDs must be rejected.
- [ ] **Step 5 — Local task commit:** `git add src/domain/schema.ts src/domain/ids.ts tests/unit/schema.test.ts tests/fixtures/evidence-cases.ts && git commit -m "feat: define typed evidence records and stable identities"`.

## Task 3: Transactional local repository and recovery safety

**Files:** `src/storage/case-repository.ts`, `src/storage/indexeddb-repository.ts`, `tests/integration/storage.test.ts`.

**Interfaces:** Produces `openCaseRepository(dbName: string): Promise<CaseRepository>` and the `CaseRepository` contract above, including `createCase(bundle)`, `mutateCase(caseId, expectedRevision, mutationId, update, media?)`, `getMedia()` and `storageHealth()` (Task 14 adds browser quota/persistence details). Internally use one IndexedDB readwrite transaction for revision check, operation-id journal check, aggregate update, media insert and event persistence; the pure `update` function must be synchronous.

- [ ] **Step 1 — Write failing tests:** `transaction_abort_retains_prior_revision_and_review_history` injects an asset-store write failure after a review-event append and verifies no partial new revision/event; `stale_revision_rejected` tests optimistic concurrency; `same_mutation_id_replay_does_not_duplicate_records` checks idempotent retry; `reopen_preserves_committed_case` closes/reopens DB and compares records; `media_digest_dedupe` stores identical content once.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/integration/storage.test.ts` using `fake-indexeddb` fails for missing repository.
- [ ] **Step 3 — Minimal implementation:** versioned object stores (`cases`, `media`, `operations`), keep case, media, mutation-id receipt and review event in the same transaction. `mutateCase` increments revision once and rejects stale revision or invalid append-only history; an already committed `mutationId` is an idempotent no-op with a stable receipt. Enforce unique mutation IDs per case; handle quota errors visibly. `storageHealth()` initially reports available/unavailable, with quota/persistence details supplied in Task 14. No network or cloud assumptions.
- [ ] **Step 4 — Verify green:** storage integration suite passes plus browser persistence smoke test; close/reopen must not duplicate a review event.
- [ ] **Step 5 — Local task commit:** stage repository/test changes and commit `feat: add atomic offline case storage`.

## Task 4: Raster intake, digest, and six-field rights

**Files:** `src/intake/raster.ts`, `src/domain/rights.ts`, `tests/unit/raster.test.ts`, `tests/unit/rights.test.ts`, `tests/fixtures/media.ts`.

**Interfaces:** Produces `prepareRaster(file: File, rights: RightsPolicy): Promise<{ asset: AssetRecord; media: MediaPayload | null }>` and `canUseAsset(rights: RightsPolicy, action: 'REFERENCE_LINK'|'VIEW'|'STORE'|'METADATA_EXPORT'|'IMAGE_EXPORT'|'REDISTRIBUTE'): {allowed: boolean; reason: string}`. Asset records contain input MIME, SHA-256, decoded dimensions, original-pixel status, orientation notes, and rights basis.

- [ ] **Step 1 — Write failing tests:** `unknown_rights_never_embed_pixels`; `renamed_svg_rejected_despite_image_mime`; `decompression_bomb_or_oversize_rejected` with initial configurable bounds of 20 MiB compressed, 40 million decoded pixels; `link_only_never_claims_pixels_viewed`; `different_bytes_have_different_digest`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/raster.test.ts tests/unit/rights.test.ts` fails for missing intake/policy utilities.
- [ ] **Step 3 — Minimal implementation:** check binary signatures (PNG/JPEG/WebP), reject SVG/text polyglots, decode into oriented browser pixels with recorded basis, hash original bytes via Web Crypto; only persist bytes if local-copy right explicitly `ALLOW`; apply conservative `UNKNOWN` handling. Let user inspect ephemeral image privately without falsely certifying archival rights.
- [ ] **Step 4 — Verify green:** tests pass; browser image fixture verifies preview and `sha256`, no source URL fetch; rights denied/unknown block export bytes while retaining permissible link and omission metadata.
- [ ] **Step 5 — Local task commit:** stage intake/rights/tests and commit `feat: validate local image evidence and rights`.

## Task 5: Source, witness, lineage and citation locator records

**Files:** `src/domain/case-actions.ts`, `src/domain/independence.ts`, `tests/unit/identity-lineage.test.ts`.

**Interfaces:** Produces pure `addSource(bundle: CaseBundle, input: SourceInput): CaseBundle`, `addWitness(bundle: CaseBundle, input: WitnessInput): CaseBundle`, `attachEvidence(bundle: CaseBundle, input: EvidenceLinkInput): CaseBundle`, `evidenceCounts(bundle: CaseBundle, claimId: string): {publications: number; witnesses: number; independentLineages: number; unresolvedDependence: number}`. `SourceInput`, `WitnessInput`, `EvidenceLinkInput` are exported from schema in Task 2.

- [ ] **Step 1 — Write failing tests:** `same_title_distinct_witnesses_remain_distinct`; `two_catalogues_one_stone_count_as_one_witness`; `five_mirrors_one_lineage_not_five_confirmations`; `unknown_lineage_not_counted_as_independently_verified`; `folio_locator_not_auto_equal_to_page`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/identity-lineage.test.ts` fails for missing functions.
- [ ] **Step 3 — Minimal implementation:** separate source publications from `underlyingWitnessId` and provenance family; require explicit editor witness/alias selection; preserve exact citation/locator as entered; classify `SUPPORTS | REFUTES | CONTEXT` without promoting contextual material into proof. Validate source/witness/claim foreign keys before inserting links.
- [ ] **Step 4 — Verify green:** tests and `npm run typecheck` pass; changed source title never causes a witness merge.
- [ ] **Step 5 — Local task commit:** stage source/lineage/test changes and commit `feat: link sources to distinct physical witnesses`.

## Task 6: Stable, keyboard-editable original-image regions

**Files:** `src/domain/regions.ts`, `src/ui/AnnotationDesk.tsx`, `tests/unit/regions.test.ts`, `tests/e2e/annotation.spec.ts`.

**Interfaces:** Produces `screenToNormalizedPoint(clientX: number, clientY: number, viewport: ImageViewport): {x: number; y: number}`, `normalizeRegion(a: NormalizedPoint, b: NormalizedPoint, imageSha256: string, dimensions: {width: number;height: number}, orientation: string): RegionRecord`, and accessible `<AnnotationDesk asset={...} regions={...} onChange={...}/>`; `ImageViewport`, `NormalizedPoint`, `RegionRecord` are typed in schema.

- [ ] **Step 1 — Write failing tests:** `annotation_survives_zoom_resize_orientation` checks normalized coordinates after non-1 zoom and pan; `out_of_bounds_rect_rejected`; `numeric_rect_and_pointer_rect_are_equivalent`; Playwright `keyboard_user_can_edit_region_without_canvas_pointer` uses labeled X/Y/W/H fields and focusable item list.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/regions.test.ts && npm run test:e2e -- tests/e2e/annotation.spec.ts` must expose absent geometry and editor.
- [ ] **Step 3 — Minimal implementation:** derive normalized coordinates from inverse image display transform, not viewport guessed pixels; keep original oriented dimensions/digest; provide high-contrast region box, pan/zoom, pointer capture, and numeric fallback; disabled/blocked annotation when original bytes unavailable.
- [ ] **Step 4 — Verify green:** targeted unit/E2E tests; manually resize/mobile-check no item region drift. Store region in case transaction (Task 3) and link to `ITEM`/`DES` identity, not blanket screenshot verdict.
- [ ] **Step 5 — Local task commit:** stage geometry/UI/tests and commit `feat: add accessible source-region annotations`.

## Task 7: Atomic claim ledger and evidence entry UI

**Files:** `src/ui/SourceIntake.tsx`, `src/ui/ClaimLedger.tsx`, `tests/e2e/claims.spec.ts`, `tests/unit/case-actions.test.ts`.

**Interfaces:** Reuses `addSource`, `addWitness`, `attachEvidence`; adds `addClaim(bundle: CaseBundle, input: ClaimInput): CaseBundle`, `addReadingAlternative(bundle: CaseBundle, input: ReadingAlternativeInput): CaseBundle`; exposes item-linked typed claim fields and alternative literal reading/transliteration/translation fields. They remain manual, not philologically auto-validated.

- [ ] **Step 1 — Write failing tests:** `two_claims_one_item_separate_verdicts`; `source_link_without_folio_does_not_become_pinpoint_citation`; `manual_transliteration_does_not_claim_round_trip_verified`; `a_modern_intent_is_not_ancient_purpose`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/case-actions.test.ts && npm run test:e2e -- tests/e2e/claims.spec.ts` fails for absent editors/actions.
- [ ] **Step 3 — Minimal implementation:** forms for source bibliographic identity, witness/date, claim dimension and verbatim text, typed evidence relation, script/reading alternatives, lineage and exact locator. Separate persisted source-snapshot state from any self-reported viewing; no auto URL fetch.
- [ ] **Step 4 — Verify green:** focused tests pass; keyboard use can create FORM and PURPOSE claims for one item without combining them. Confirm data persisted after browser reload.
- [ ] **Step 5 — Local task commit:** stage ledger/intake/actions/tests and commit `feat: create typed claims and evidence citations`.

## Task 8: Pure structural safeguard engine

**Files:** `src/domain/safeguards.ts`, `tests/unit/safeguards.test.ts`.

**Interfaces:** Produces `evaluateCase(bundle: CaseBundle): EvidenceIssue[]`, sorted deterministically by `(claimId, ruleId, affectedRecordIds)`; `PASS/WARNING/BLOCK` indicates structural conditions, **not** a machine-decided `evidence_verdict`.

- [ ] **Step 1 — Write failing tests:** `later_manuscript_not_viking_proof`; `purpose_not_derived_from_name`; `similarity_not_documented_copying`; `uninspected_url_only_cannot_support_attested_claim`; `missing_pixels_blocks_visual_claim_only`; `no_match_in_scope_not_never_existed`; `unrelated_claims_not_blocked_by_other_sources`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/safeguards.test.ts` fails for missing engine.
- [ ] **Step 3 — Minimal implementation:** explicit rule IDs `CATEGORY_FIREWALL`, `CHRONOLOGY`, `TRANSMISSION_CHAIN`, `INDEPENDENCE`, `CITATION`, `NEGATIVE_SEARCH`, `IDENTITY`, `RIGHTS`, `DEPENDENCY_RECHECK`, `MISSING_PIXELS`. Each result cites actual affected IDs/fields and narrow remediation; no natural-language rune truth inference.
- [ ] **Step 4 — Verify green:** all targeted lint fixtures pass and repeated evaluation gives identical issue arrays; no verdict field is mutated.
- [ ] **Step 5 — Local task commit:** stage engine/tests and commit `feat: lint claim evidence without certifying history`.

## Task 9: Human review, immutable event history and dependency invalidation

**Files:** `src/domain/review.ts`, `src/ui/ReviewDesk.tsx`, `tests/unit/review.test.ts`, `tests/e2e/review.spec.ts`.

**Interfaces:** Produces `reviewClaim(bundle: CaseBundle, command: ReviewCommand): CaseBundle`, `deriveRecheckFlags(bundle: CaseBundle): string[]`; `ReviewCommand` is `{ claimId: string; actor: string; verdict: EvidenceVerdict; rationale: string; reviewedAt: string }`, where `EvidenceVerdict` derives from schema.

- [ ] **Step 1 — Write failing tests:** `attested_requires_located_inspected_witness_and_human_reason`; `unverified_case_still_reviewable_and_exportable`; `source_change_sets_needs_recheck_without_rewriting_old_event`; `blocked_not_equal_contradicted`; `review_history_append_only`; `empty_actor_or_rationale_is_rejected`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/review.test.ts && npm run test:e2e -- tests/e2e/review.spec.ts` shows review transition missing.
- [ ] **Step 3 — Minimal implementation:** validate manual reviewer and specific source/inspection support for `ATTESTED`, store event with prior/new dispositions and frozen dependency digest; derive recheck from current dependency digests. `mutateCase` atomically persists claim and event using a stable, retryable `mutationId`. UI displays prior decisions and explicit `NEEDS_RECHECK` without automatic historic verdict replacement.
- [ ] **Step 4 — Verify green:** verify targeted tests, reload and event-history readback. No machine path may call `reviewClaim` absent a user/editor action.
- [ ] **Step 5 — Local task commit:** stage review/UI/tests and commit `feat: add auditable human editorial review`.

## Task 10: Bounded negative searches and coverage honesty

**Files:** `src/domain/case-actions.ts`, `src/ui/ClaimLedger.tsx`, `tests/unit/search-receipts.test.ts`.

**Interfaces:** Adds `addSearchReceipt(bundle: CaseBundle, input: SearchReceiptInput): CaseBundle` with required corpus, exact query, filter, checked timestamp, access state, search coverage notes, outcome (`NO_MATCH_IN_SCOPE | MATCH_FOUND | NOT_SEARCHED | UNAVAILABLE`), and execution mode (`USER_REPORTED | TOOL_VERIFIED`). For manual K1 searches, always `USER_REPORTED`; no hidden remote search took place.

- [ ] **Step 1 — Write failing tests:** `zero_result_search_preserves_scope_and_limitations`; `not_searched_distinct_from_no_match`; `manual_receipt_cannot_claim_tool_verified`; `failed_access_preserves_unavailable_state`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/search-receipts.test.ts` fails for missing action.
- [ ] **Step 3 — Minimal implementation:** form and immutable receipt identity with separate `NOT_SEARCHED` option; print user-report attribution and bounded language. Reject “never existed” as an automatic conclusion, not as prohibited free-text quotation.
- [ ] **Step 4 — Verify green:** targeted tests pass; source record count is not mistaken for corpus coverage denominator.
- [ ] **Step 5 — Local task commit:** stage action/UI/tests and commit `feat: record bounded negative source searches`.

## Task 11: Deterministic Markdown/JSON casefile compiler and rights omissions

**Files:** `src/export/canonical.ts`, `src/export/casefile.ts`, `tests/unit/export.test.ts`, `tests/fixtures/evidence-cases.ts`.

**Interfaces:** Produces `canonicalJson(value: unknown): string`, `sha256(bytes: Uint8Array): Promise<string>`, and `compileCasefile(bundle: CaseBundle, availableMedia: ReadonlyMap<string, Uint8Array>, options: ExportOptions): Promise<CompiledCasefile>`. `ExportOptions` includes `mode: 'PRIVATE_BACKUP' | 'SHAREABLE'`, explicit metadata/media inclusion, and a frozen source event/revision reference; `CompiledCasefile` contains named UTF-8 payloads for `casefile.md`, `casefile.json`, `manifest.json`, permitted media filenames if enabled, and structured omission/conflict records.

- [ ] **Step 1 — Write failing tests:** `same_frozen_revision_has_identical_three_file_hashes`; `unknown_rights_never_embed_pixels`; `one_source_image_withheld_does_not_hide_unrelated_claims`; `manifest_does_not_hash_itself`; `blocked_findings_export_as_blocked_not_verified`; `restricted_metadata_export_is_explicitly_incomplete`; `no_match_in_scope_wording_retained`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/export.test.ts` fails for missing compiler.
- [ ] **Step 3 — Minimal implementation:** stable canonical key sorting and ID-order arrays, Markdown escaped as literal user data, no network/clock/random calls in compile; manifest lists exported file digests, refused media and reasons. For allowed metadata, preserve all IDs/citations/review events. **Rights conflict handling:** if a record cannot lawfully enter an export, either explicitly block a complete-backup request or produce an *opt-in labeled incomplete* export with a deterministic tombstone/omission; never claim full nonmedia round-trip. Media filenames are flat, safe, digest-derived; no ZIP extraction. `manifest.json` lists hashes of OTHER files only.
- [ ] **Step 4 — Verify green:** run focused suite twice and compare output bytes, export on 100-claim synthetic fixture, demonstrate no prohibited media bytes in outputs and no invented timestamps.
- [ ] **Step 5 — Local task commit:** stage compiler/tests and commit `feat: compile deterministic rights-filtered casefiles`.

## Task 12: Strict restore and conflict-safe re-import

**Files:** `src/export/import-casefile.ts`, `tests/unit/import.test.ts`, `tests/integration/import-storage.test.ts`.

**Interfaces:** Produces `parseCasefileImport(casefileJson: Uint8Array, manifestJson: Uint8Array, mediaFiles: ReadonlyMap<string, Uint8Array>): Promise<ImportPreview>` and `applyCasefileImport(repository: CaseRepository, preview: ImportPreview, choice: 'CREATE_NEW' | 'MERGE_IDENTICAL' | 'REVIEW_CONFLICTS'): Promise<ImportResult>`; `ImportPreview` lists checksum/rights/schema errors, missing media, exact duplicate IDs, nonidentical ID collisions, and explicitly redacted fields.

- [ ] **Step 1 — Write failing tests:** `complete_permitted_case_round_trips_without_id_changes`; `reimport_conflicting_id_requires_resolution`; `reject_malformed_and_oversized_json`; `tampered_media_digest_blocks_restoration`; `missing_media_shows_external_asset_required`; `legacy_or_future_schema_fails_closed`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/unit/import.test.ts tests/integration/import-storage.test.ts` fails for missing importer.
- [ ] **Step 3 — Minimal implementation:** cap JSON bytes and record counts, validate with Zod before writes, compare manifest digests and version, preview all changes, only apply explicit safe choice in a transaction. Same ID + same canonical bytes is idempotent; same ID + divergent content is `CONFLICT` without mutation. Missing rights-permitted media becomes explicit `EXTERNAL_ASSET_REQUIRED`; do not call the restore complete.
- [ ] **Step 4 — Verify green:** all importer/storage fixtures pass; inspect restored immutable events and exact literals; verify a failed import leaves repository unmodified.
- [ ] **Step 5 — Local task commit:** stage importer/tests and commit `feat: restore casefiles with integrity and collision checks`.

## Task 13: Integrated case shelf, responsive claim-to-source journey

**Files:** `src/ui/CaseShelf.tsx`, `src/ui/CasefileDesk.tsx`, `src/app.tsx`, `src/app.css`, `tests/e2e/case-journey.spec.ts`, `tests/e2e/mobile-accessibility.spec.ts`.

**Interfaces:** Wires existing components and `CaseRepository`; exposes Create/open case, Intake, Annotate, Claims, Review, Casefile preview/export, and Import, with no automatic data clearing. Persists each editing action at an explicit transaction boundary; source image region on claim navigation is restored from digest + region ID.

- [ ] **Step 1 — Write failing tests:** `golden_path_from_synthetic_image_to_three_files` creates one image, two separate contradictory claims, one witness and one negative search then exports; `keyboard_navigation_without_pointer` reaches coordinate fields and claim review; `mobile_viewport_has_no_horizontal_overflow`; `missing_pixels_is_visible_not_hidden_tooltip`; `external_links_require_user_action`.
- [ ] **Step 2 — Verify red:** `npm run test:e2e -- tests/e2e/case-journey.spec.ts tests/e2e/mobile-accessibility.spec.ts` fails for missing integrated routes.
- [ ] **Step 3 — Minimal implementation:** case shelf with local/backup status, stacked mobile views, focus management, labels, text statuses, reduced motion, meaningful undo/history, explicit external-link behavior and a manual export path. Use React-escaped text; do not inject user-provided HTML.
- [ ] **Step 4 — Verify green:** run E2E in at least desktop Chromium, WebKit/Safari representative, and mobile touch emulation where toolchain permits; mark skipped real-device claims honestly. Verify no horizontal scrolling and no required hover-only action.
- [ ] **Step 5 — Local task commit:** stage UI/integration tests and commit `feat: integrate accessible casefile research journey`.

## Task 14: Offline installation, crash recovery, and storage advisories

**Files:** `public/manifest.webmanifest`, `public/sw.js`, `src/ui/CaseShelf.tsx`, `src/storage/indexeddb-repository.ts`, `tests/e2e/offline-recovery.spec.ts`, `tests/integration/recovery.test.ts`.

**Interfaces:** Completes the already declared `CaseRepository.storageHealth()` implementation (browser estimate/persistence), without claiming browser storage can never be evicted. Service worker precaches only versioned static shell assets and avoids intercepting third-party evidence links; no generated casefile or user media is served through remote cache.

- [ ] **Step 1 — Write failing tests:** `restart_after_half_ingestion_is_idempotent` commits an initial portion under stable operation IDs, interrupts before the next transaction commits, reopens the DB and retries the same IDs without duplicate records; `offline_case_reopens_without_remote_api`; `quota_failure_shows_export_backup_warning`; `service_worker_does_not_cache_remote_witness`; `storage_unavailable_keeps_explicit_ephemeral_mode`.
- [ ] **Step 2 — Verify red:** `npm run test:unit -- tests/integration/recovery.test.ts && npm run test:e2e -- tests/e2e/offline-recovery.spec.ts` fails for missing offline/recovery states.
- [ ] **Step 3 — Minimal implementation:** installable manifest and app-shell cache, startup hydration from persisted committed cases, explicit ephemeral-mode banner, idempotent source-batch continuation using stable `mutationId` receipts from Task 3, export-before-migration requirement, stale-schema read-only failure. Consider `navigator.storage.persist()` only on user gesture and report refusal.
- [ ] **Step 4 — Verify green:** run offline browser test after successful initial load/registration; injected transaction abort results in zero lost COMMITTED events and zero duplicate IDs. No offline promises for unexported external media.
- [ ] **Step 5 — Local task commit:** stage PWA/recovery/tests and commit `feat: support offline reopening and crash-safe case recovery`.

## Task 15: Benchmark, adversarial K1 gate, and bounded release proof

**Files:** `tests/perf/case-performance.spec.ts`, `tests/fixtures/evidence-cases.ts`, `docs/superpowers/K1-acceptance.md`, and source-controlled benchmark receipt under `tests/perf/results/` (exclude private input/media and machine-specific secrets).

**Interfaces:** `npm run test:perf` computes p50/p95/min/max, iteration count, reference environment/browser version/cache state, fixture hash, and compiler output hash. Acceptance matrix maps all **12 K1 golden-path** criteria, the **five Review Focus** fixtures, and F-01/F-02/F-05/F-07/F-08/F-13/F-14/F-17/F-19/F-20/F-21/F-23/F-26/F-28/F-36 partial/full status.

- [ ] **Step 1 — Write failing tests and gates:** synthetic 10,000-record indexed-search fixture with >=1,000 timed lookups, 100-claim export fixture with repeatable hashes, denied-media and conflicting source fixture, injected transaction-abort fixture. Include `case_journey_reaches_reviewable_unverified_output`, `no_auto_historical_verdict`, `no_forbidden_media_in_output`.
- [ ] **Step 2 — Verify red:** run `npm run test:perf` before benchmark mechanism exists; test must fail explicitly for missing measurements, not trivially pass on zero samples.
- [ ] **Step 3 — Implement measurements and reporting:** run actual browser performance probes, collect system/browser/software versions, p95 <250ms on 10k indexed lookup (1,000+ samples), p95 <2s for 100 claims (declare repetitions). Source/synthetic fixture content is visibly not historical evidence. Record observed FAIL when limits are missed; do not loosen gates without approved design change.
- [ ] **Step 4 — Complete proof ladder:** `npm run typecheck && npm run test:unit && npm run build && npm run test:e2e && npm run test:perf`; inspect `git diff --check`, `git status --short`, generated file manifest, and regressions. If Playwright is unavailable, mark `UNVERIFIED`, not PASS. Require zero automatic false witness merges and zero denied media bytes across fixtures.
- [ ] **Step 5 — Local task commit + review request:** commit proof/tests `test: verify Rune Binding K1 evidence and recovery gates`; request independent whole-branch review before any merge/push/deploy. Preserve K1 status as `PASS`, `PARTIAL`, or `BLOCKED` with measured receipts, not “complete” by assertion.

## K1 acceptance matrix and explicit deferments

| K1 user-visible promise | Owning tasks | Release proof |
|---|---|---|
| Synthetic input creates distinct item-level claims | 2, 4, 6, 7, 13 | E2E case journey |
| Original image-region locator survives zoom | 4, 6, 13 | Geometry unit + keyboard + mobile E2E |
| Form/date/purpose/reading/meaning stay distinct | 2, 7, 8 | Typed schema + cross-category fixtures |
| Separate sources, witnesses, copying families | 2, 5, 8 | Identity/lineage suite |
| Human editorial verdicts with explanations and history | 3, 9 | Review-event + restart tests |
| Dates, folios/pages and search limits stay qualified | 2, 5, 8, 10 | Chronology/locator/search fixtures |
| Unknown/denied rights excluded from export | 4, 11, 12 | Rights suite + byte scan |
| Canonical three-file export + allowed media | 11, 13 | Hash-repeatability + manifest test |
| Conflict-safe data restore including missing-media status | 3, 12 | Import round-trip/conflict fixtures |
| Offline case re-open and persistence warning | 3, 13, 14 | Offline/recovery tests |
| Accessible mobile/keyboard inspection | 6, 13 | Playwright keyboard/touch test |
| Measured lookup/export targets and honest scope label | 15 | Timed benchmark receipt + matrix |

**P0 closure still not certified in K1:** F-01 external adapters, F-02 automated cross-corpus resolver, F-08 automatic folio catalogue alignment, F-13 period/script linter, F-14 reversible transliteration, F-21 semi-automated lineage clustering, F-28 long-running provider task queue, F-36 full VX/AT inherited coverage. Do not report these as finished merely because K1 has manual fields or tests for adjacent safeguards. The entire F-01–F-36 registry remains authoritative for subsequent design cycles.

## Validation, rollback, and user-journey preservation

- **Scope fence:** compare `git diff --name-status` to the file map; investigate any unrelated edits/deletions. Preserve any previously functioning user-facing routes, files and records in an existing repo.
- **Before changes:** record clean baseline tests and current branch; create isolated worktree (if supported) only after explicit execution approval. No force, destructive cleanup, secret/asset publishing, GitHub push or merge without separate authority.
- **Every task:** failing focused test → minimal code → passing focused test → `npm run typecheck` on relevant changes → local commit only after review. On repeated failure, isolate root cause and stop with exact blocker after one bounded corrective pass; do not spin agent loops.
- **Safe rollback:** use new local branch and targeted `git revert <task-commit>` only after checking dependent commits; do not discard user edits. Broken IndexedDB migration must retain old DB bytes and a validated exported checkpoint; avoid auto-migrating unknown schema versions.
- **Release bar:** only K1 is in scope; historical conclusions must remain explicitly human-edited and source-bound; demonstrate permitted offline storage, partial media recovery, all 12 golden-path checks, accessibility checks, and performance receipts. A failed gate means no release claim.

## Next-stage Superpowers handoff (NOT executed by plan creation)

After the user reviews this plan, require explicit selection:

- **Subagent-driven:** `superpowers:subagent-driven-development` — a fresh implementer/reviewer per task and a final independent whole-branch review; strongest fit for historical/evidence invariants and 15 tightly coupled review points, at higher execution overhead.
- **Native:** `superpowers:executing-plans` — one implementer executes sequentially with focused tests and one whole-branch review; less overhead but lower isolation of reasoning.

**Recommendation:** Subagent-driven if the runtime actually supports independent agents, because schema, rights, history, and import/export mistakes can compound across tasks. If not, Native with the same acceptance gates. **Do not claim subagents exist here until capability is verified.**

Execution cannot start until (1) the user reviews this plan; (2) execution method is selected; (3) actual repo/location is resolved; and (4) necessary implementation permissions are established. Plan file creation is not a Git commit, implementation, or permission to publish.
