# Rune Binding

A local-first evidence workbench for investigating rune and bind-rune images, historical claims, textual readings, and their documentary witnesses. This application does **not** assign ancient origins, meanings, dates, or magical purposes automatically.

## Try it

**Without installing a JavaScript toolchain:** serve the committed `dist/` directory over a local HTTP origin. For example, with Python 3:

```bash
cd dist
python3 -m http.server 4173 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4173/` on the same computer. Opening `index.html` with a `file://` URL is not supported for reliable ES-module loading or service workers. The browser may offer **Install app** after the first successful load. Saved cases use browser IndexedDB, not a cloud account. Backup exports are strongly recommended; browser storage can be evicted.

**For contributors with Node.js 22+ and TypeScript 5.8.3 globally installed:**

```bash
npm run build
npm test
npm run dev
```

The source project intentionally uses no runtime npm packages. `npm run build` invokes globally available `tsc` and then copies static assets to `dist/`. If `tsc` is missing, install the TypeScript compiler compatible with your environment before building. A local runtime HTTP server is still required to test the built frontend reliably.

## One complete research journey

1. Create a local **case** from the case shelf.
2. Record a **source publication**, an underlying **witness** if known, and optionally upload an original PNG/JPEG/WebP with explicitly selected rights.
3. Inspect or mark an **image region** (mouse, touch, or normalized numeric coordinates). A region is an observation, not a translation.
4. Enter an **atomic claim**, separately typed as `FORM`, `READING`, `NAME`, `MEANING`, `DATE`, `PURPOSE`, or `TRANSMISSION`.
5. Connect sources to claims with exact locators and supporting, refuting, or contextual relationships. Unknown witness independence must remain unresolved.
6. Open **Evidence review**. Structural warnings identify limitations. Only an identified human editor can append a verdict with a rationale, which is recorded in an append-only review history.
7. Export the **casefile** as individually downloadable `casefile.md`, `casefile.json`, `manifest.json` and permitted media. An import preview checks digests and identity and refuses silently overwriting different cases.

**Image/export rights are not inferred from public visibility.** Rights for viewing, local copying, metadata, embedding and redistribution are tracked separately. Unknown rights deny restricted operations by default.

## Scope and caution

- **K1 is a foundation, not a finished historical research service.** Automated archive search, exact manuscript catalogue matching, script-period classification, reversible transliteration, and proven historical identifications are future milestones.
- The app does not fetch outside URLs automatically. A citation to a publication means you recorded its metadata, not that the application verified it.
- The browser sandbox used during this release refused localhost and `file://` navigation, so real-browser IndexedDB, touch/mobile, and offline-reload behavior are **unverified** here. Unit and static tests are not substitutes for those checks. See [K1 acceptance](docs/superpowers/K1-acceptance.md).
- No user-supplied reference images or private investigation records are packaged in the repository. Fixture material is clearly synthetic.

## Integrity and provenance

The three governing specifications are preserved in `docs/` with the exact SHA-256 hashes in `docs/superpowers/implementation-environment.md`. The v3 feature registry contains 36 proposals; partial P0 progress must not be represented as closure.

See `OPERATIONAL_STATE.md` for verified project status and remaining browser validation requirements, and `tests/perf/results/node-proxy-latest.json` for the actual **Node proxy**, not browser, benchmark receipt.

## Development and quality

- `npm run typecheck` checks strict TypeScript interfaces.
- `npm run test:unit` runs domain, storage, rights, review, and export tests.
- `npm run test:e2e` runs static integration checks and attempts two real Chromium journeys. Managed policy restrictions produce **explicit SKIP**, not PASS.
- `npm run test:perf` exercises 10,000 synthetic Map entries and 100-claim deterministic casefile generation. These are Node proxy measurements, not IndexedDB browser results.

## Privacy

No accounts, analytics, hosted databases, mandatory remote providers, or automatic image uploads. The production service worker caches local application files only; it does not prefetch linked historical-source websites.

---

**Status:** K1 implementation with verified code-level checks; browser/device release acceptance remains conditional. Historical assertions require independent scholarship and human judgment.
