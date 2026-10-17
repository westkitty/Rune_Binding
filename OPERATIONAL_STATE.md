# Rune Binding operational state

**Project ID:** `rune-binding-k1`
**Current focus:** Rune Binding K1 Evidence Kernel, no-account local-first workbench
**Updated:** 2026-10-17
**Status:** Public GitHub main and Pages deployment verified; 89/89 MacBook Chrome tests pass with zero skips; beginner-first redesign implemented locally, publication confirmation pending. Offline network-disconnect and real-device touch acceptance remain pending.

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

- On the authorized MacBook, Chrome headless ran all 85 checks: 75 unit/integration, seven E2E (including browser case persistence and mobile layout) and three performance proxy checks; zero failures and zero skips.
- GitHub public repository `https://github.com/westkitty/Rune_Binding` main commit `d826abc577cf9e477d8abdf0348bfdf5f0dcc1c0` was pushed and independently matched against the remote ref.
- GitHub verification run `39016279168` passed; GitHub Pages build+deploy run `39016342453` passed.
- Pages `https://westkitty.github.io/Rune_Binding/` uses GitHub Actions workflow source with HTTPS enforced; root, JS, CSS, PWA manifest and service worker each returned HTTP 200.

- First-run redesign: interactive illustrative rune inspector needs no account or case; single-click blank studies pre-create an item; selecting an image imports and opens annotation without demanding a title or source metadata. A one-click private local rights basis never grants public image redistribution.
- Researcher-only source, witness, dating, rights, and citation fields remain available behind explicit expandable sections. Browser tests verify illustrative sample switch, single-image import despite duplicate change events, persistent case recovery, legacy full evidence journey and mobile no-overflow.
- MacBook Chrome ran 77 unit/integration checks + 9 E2E checks (including 4 real browser cases) + 3 Node proxy performance tests: 89 passed, 0 failed, 0 skipped. Screenshot review inspected a 1440 px desktop layout and 390 px mobile layout. Visual inspection does not prove every interaction or device size.

## Unverified or blocked

- Offline-after-network-disconnect service-worker behavior, actual touch region drawing, full keyboard-only navigation and device-specific performance have not been independently verified.
- Historical source provenance and exact runic readings remain subject to human source criticism; the UI never makes historical verdicts automatically.
- Cross-database identification, script-period linting and transliteration are outside K1 scope.
- Earlier Linux sandbox Chrome could not access localhost; this has now been superseded **only** for the MacBook Chrome desktop restart and mobile viewport browser tests.

## Next executable actions

1. Perform a real offline reconnection/reload trial, image-region drawing and keyboard-only usability on desktop/tablet.
2. Measure IndexedDB 10k lookup and 100-claim export p95 on the actual browser instead of relying on Node proxies.
3. Verify future GitHub Pages deployments against their exact commit and live assets; do not infer publication from local commits alone.
4. Continue the original 36-feature research roadmap without promoting uninspected historical claims.

## Reproduction

`npm run build && npm test`; inspect `tests/perf/results/node-proxy-latest.json` and `docs/superpowers/K1-acceptance.md`. Source-only changes require TDD and updated tests. Static output is under `dist/`.
