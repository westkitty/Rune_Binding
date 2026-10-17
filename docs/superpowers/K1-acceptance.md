# K1 acceptance matrix — evidence kernel

**Date:** 2026-10-17. Status: **PARTIAL** (browser runtime unavailable in the test environment; not a completed release certificate).

| Approved golden path | Verified evidence | Verdict |
|---|---|---|
| 1. Create and organize atomic item-level claims | Schema/unit tests; static DOM wiring | PARTIAL: browser journey SKIPPED |
| 2. Original-image regions under resize/zoom | Numeric normalization and geometry tests | PARTIAL: browser rotation/touch SKIPPED |
| 3. Distinct form, reading, meaning, date, purpose and transmission | Strict claim types and rejection tests | CODE VERIFIED |
| 4. Separate publications, original witnesses, lineage families | Identity and citation tests; same-title distinct witness fixtures | CODE VERIFIED |
| 5. Human-identified editorial review and immutable history | Review-event and restart/revision tests | PARTIAL: browser event flow unverified |
| 6. Qualified dates, locators and search-coverage limits | Static validation and bounded receipt tests | CODE VERIFIED |
| 7. Unknown/denied rights excluded from export | Rights unit and denied-byte fixture; 0 forbidden bytes | CODE VERIFIED |
| 8. Deterministic three-file casefile and permitted media | Repeatable hash and manifest tests | CODE VERIFIED |
| 9. Restore with strict integrity and collision handling | Round-trip, conflicting ID, malformed/oversize tests | CODE VERIFIED |
| 10. Offline case reopening and persistence warning | Versioned local SW shell test; storage adaptor tests | PARTIAL: actual browser offline/IndexedDB SKIPPED |
| 11. Accessible mobile and keyboard inspection | Numeric-field fallback and CSS structure | UNVERIFIED: browser test blocked |
| 12. 10k search / 100-claim export performance | Node proxy p95 receipt, 2,000 lookup probes, 20 compiles | PARTIAL: actual browser IndexedDB performance UNVERIFIED |

## Foundation feature-trace matrix

P0 registry IDs from v3 are preserved. These are status classifications, not a redefinition of their acceptance criteria.

| Feature | K1 status | Limitation |
|---|---|---|
| F-01 | DEFERRED | No live archive adapters |
| F-02 | PARTIAL | Stable internal IDs, manual witness differentiation; no corpus-wide resolver |
| F-05 | PARTIAL | Six-field rights control and export filtering; provider-license automation deferred |
| F-07 | PARTIAL | Normalized image-region records; no external IIIF region citations yet |
| F-08 | DEFERRED | No folio/catalogue alignment |
| F-13 | DEFERRED | Manual script label only |
| F-14 | DEFERRED | Manual alternatives, no reversible transliterator |
| F-17 | PARTIAL | Separate semantic types; scholarly interpretive accuracy not automated |
| F-19 | PARTIAL | Claim relationships and review dependency digest; full impact graph deferred |
| F-20 | PARTIAL | Explicit date fields and simple chronology warnings, not historical proof |
| F-21 | PARTIAL | Manually recorded source families; no automatic clustering |
| F-23 | PARTIAL | Review proof gates and uncertainty flags; transmission genealogy deferred |
| F-26 | PARTIAL | Bounded negative-search receipts; no verified corpus execution adapter |
| F-28 | PARTIAL | Crash-safe mutation IDs and local restart tests; no distributed research queue |
| F-36 | PARTIAL | Adversarial unit fixtures; real mobile/browser test gates not yet executable |

## Execution proof and limits

- **RED → GREEN** cycles were executed for the implementation units. Synthetic fixtures are never presented as verified ancient evidence.
- **This environment:** Node 22.16.0 / TypeScript 5.8.3 globally installed, Linux x64. Browser Chromium managed policy blocks navigation to localhost and local `file://` pages; the real browser tests report SKIP with explanation. They must be run on an unrestricted local machine before claiming user-journey release readiness.
- **Offline claim limit:** SW static-resource precache and origin guard were tested by inspecting generated output, not by actually disconnecting a browser and reopening a case.
- **Performance claim limit:** `tests/perf/results/node-proxy-latest.json` measures `Map` searches and a Node-compiled casefile. It does not benchmark IndexedDB or UI responsiveness. No automatic promotion to fully P0-certified is allowed.
- **Security claim limit:** Structural import checks, rights filtering, and no executing user markup were inspected and unit tested. There is no external security audit.
- **Completion status:** PARTIAL until unrestricted browser journey (desktop/mobile, offline restart, image-region annotation, and re-import) and relevant performance targets pass.

## Remaining decisive validation

Run `npm test` and inspect explicit SKIP count; then, on an unrestricted browser and real device, run the automated Chrome journey to verify case creation, image intake, annotation, source and claim entry, human review, three-file export, import conflict detection, persistence over reload, mobile layout and offline reopen. Measure the planned 10k IndexedDB p95 lookup rather than substituting Node Map timing.
