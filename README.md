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
3. Select any imported image and inspect or mark an **image region** (mouse, touch, or normalized numeric coordinates). A region is an observation, not a translation. If local viewing rights were left unknown, explicitly update them on the Sources tab; this does not grant redistribution rights.
4. Enter an **atomic claim**, separately typed as `FORM`, `READING`, `NAME`, `MEANING`, `DATE`, `PURPOSE`, or `TRANSMISSION`.
5. Connect sources to claims with exact locators and supporting, refuting, or contextual relationships. Unknown witness independence must remain unresolved.
6. Open **Evidence review**. Structural warnings identify limitations. Only an identified human editor can append a verdict with a rationale, which is recorded in an append-only review history.
7. Export a **single ZIP backup** containing `casefile.md`, `casefile.json`, `manifest.json` and permitted media, or download each file separately. The ZIP can be re-imported in one operation. An import preview checks digests and identity and refuses to silently overwrite different cases. Restricted and missing media are listed as omissions; an incomplete archive is not a full backup.

**Image/export rights are not inferred from public visibility.** Rights for viewing, local copying, metadata, embedding and redistribution are tracked separately. Unknown rights deny restricted operations by default. Public image redistribution requires a written rights basis. An image-view permission change preserves earlier basis text and triggers re-review of affected editorial claims.

## Scope and caution

- **K1 is a foundation, not a finished historical research service.** Automated archive search, exact manuscript catalogue matching, script-period classification, reversible transliteration, and proven historical identifications are future milestones.
- The app does not fetch outside URLs automatically. A citation to a publication means you recorded its metadata, not that the application verified it.
- The original Linux sandbox could not run Chromium locally. An independent MacBook Chrome run now passes the browser case/reload and mobile viewport tests; offline network-disconnect recovery, touch drawing, and full keyboard navigation are still not certified. See [K1 acceptance](docs/superpowers/K1-acceptance.md) for the earlier acceptance snapshot.
- No user-supplied reference images or private investigation records are packaged in the repository. Fixture material is clearly synthetic.

## Integrity and provenance

The three governing specifications are preserved in `docs/` with the exact SHA-256 hashes in `docs/superpowers/implementation-environment.md`. The v3 feature registry contains 36 proposals; partial P0 progress must not be represented as closure.

See `OPERATIONAL_STATE.md` for verified project status and remaining browser validation requirements, and `tests/perf/results/node-proxy-latest.json` for the actual **Node proxy**, not browser, benchmark receipt.

## Public GitHub repository and Pages

- Source: https://github.com/westkitty/Rune_Binding (public `main`)
- Live workbench: https://westkitty.github.io/Rune_Binding/
- GitHub Pages runs `.github/workflows/pages.yml` (Node 22, pinned TypeScript 5.8.3, full tests including Chrome and static build). Pushes to `main` deploy through GitHub Actions; the first successful deployment run is [39016342453](https://github.com/westkitty/Rune_Binding/actions/runs/39016342453).
- `scripts/publish-public.sh` remains as a guarded CLI route for correctly authenticated copies. It refuses an unexpected remote or private target and compares the remote and local main SHAs.
- Confirm a new deployment on GitHub Actions and by requesting the actual site before claiming an update is live.

## Development and quality

- `npm run typecheck` checks strict TypeScript interfaces.
- `npm run test:unit` runs domain, storage, rights, review, and export tests.
- `npm run test:e2e` runs static integration checks and attempts two real Chromium journeys. Managed policy restrictions produce **explicit SKIP**, not PASS. The mobile and browser-persistence release gate remains open.
- `npm run test:perf` exercises 10,000 synthetic Map entries and 100-claim deterministic casefile generation. These are Node proxy measurements, not IndexedDB browser results.

## Privacy

No accounts, analytics, hosted databases, mandatory remote providers, or automatic image uploads. The production service worker caches local application files only; it does not prefetch linked historical-source websites.

---

**Status:** Public Pages deployed with verified browser case persistence and mobile viewport checks; full offline and real-device acceptance remain conditional. Historical assertions require independent scholarship and human judgment.
