# Rune Binding operational state

**Project ID:** `rune-binding-k1`
**Current focus:** Rune Binding K1 Evidence Kernel, no-account local-first workbench
**Updated:** 2026-10-17
**Status:** Uplift implemented with code-level tests; browser acceptance **PARTIALLY VERIFIED**; public remote repository **PENDING**. Latest public publication authorization: create PUBLIC westkitty/Rune_Binding, stage, commit, push; no additional questions requested.

## Source of truth

1. Explicit newest user authorization and constraints.
2. Approved design in `docs/superpowers/specs/2026-10-17-rune-binding-evidence-kernel-design.md`.
3. Approved implementation plan in `docs/superpowers/plans/2026-10-17-rune-binding-evidence-kernel.md`.
4. Preserved v3 evidence/provenance research contract and 36-feature register in `docs/research/`.

## Protected invariant

Typed graphic observation, text reading, language/name, semantic meaning, date, practical/magical function and historical transmission remain distinct. Only recorded human editorial action changes verdicts; structural checks and negative search coverage never prove historic certainty. Unknown image rights never authorize public redistribution. Browser data remains locally owned with explicit backups and no mandatory cloud services.

## Verified

- Build and strict TypeScript typecheck execute on the sandbox reference environment.
- Unit/integration tests cover IDs, storage, rights, source/witness separation, normalized regions, claim categories, review history, search receipts, deterministic casefile digests, conflict-safe import and synthetic crash recovery.
- Node static HTTP tests and generated service-worker origin guards execute; external source sites are excluded from app-shell precache.
- Node proxy benchmark has independent 10k lookup / 100-claim compilation receipt, explicitly separate from browser performance.
- Local Git commits include the original K1 implementation units.
- Uplift code-level verification: cached image viewing checks rights before returning pixels; public image redistribution requires a recorded rights basis; multi-image selection isolates image-linked items; rights changes are explicitly recorded and invalidate affected review dependency digests; deterministic ZIP/STORE archives round-trip through the existing manifest verifier.
- `unzip -t` accepted a synthetic exported ZIP. Tests also reject corrupted ZIP data and unsafe archive paths.

## Unverified or blocked

- Real Chromium localhost navigation is blocked by environment organization policy; browser E2E tests are SKIPPED, not passed.
- Actual browser IndexedDB restart, offline SW reload, touch/mouse region drawing, full keyboard flow and mobile viewport not independently verified.
- In-situ image and source provenance accuracy remains dependent on human scholarly verification.
- Public `westkitty/Rune_Binding` GitHub repository creation/push awaits an authenticated supported creation mechanism; connected GitHub plugin lacks `create_repository`. The checked-in `scripts/publish-public.sh` explicitly performs safe publish/readback when authenticated CLI access exists. Remote success is not inferred from local commits.
- No automated cross-database identification, period/script linter or transliteration engine.

## Next executable actions

1. Run browser journeys on an unrestricted Mac/Android instance and certify offline, storage, rights, imports and mobile accessibility.
2. Measure browser IndexedDB 10k lookup p95 and 100-claim compilation p95 on identified target device.
3. Create PUBLIC `westkitty/Rune_Binding`, attach the verified local git branch, push and read back the remote commit SHA; do not claim push from local commits alone.
4. Once browser evidence passes, mark specific K1 rows verified; keep broader F-01..F-36 register in backlog.
5. Independently run GitHub Actions on the actual published repository; workflow presence does not prove remote CI passed.

## Reproduction

`npm run build && npm test`; inspect `tests/perf/results/node-proxy-latest.json` and `docs/superpowers/K1-acceptance.md`. Source-only changes require TDD and updated tests. Static output is under `dist/`.
