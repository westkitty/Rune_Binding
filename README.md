# Rune Binding

**What does that rune really mean?** Rune Binding lets you start with a picture or an example, record what somebody claims about a symbol, and investigate what historical evidence actually supports. No login, no required case title, and no need to learn research terminology to begin. Images and case records stay on your device. The tool does **not** automatically verify a rune, invent meanings, or identify an ancient source.

## Open the app

**[Explore Rune Binding online](https://westkitty.github.io/Rune_Binding/)**

You can try three rune examples instantly, choose an image to open a private investigation, or begin a blank study without naming it. Detailed source, date and permissions fields are tucked away until needed.

## Run it locally

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

## A simple research journey

1. **Start immediately.** Click **Try a sample** to see the difference between an observed shape, a popular interpretation, and examined evidence. The demo does not create or alter a case.
2. **Add a symbol.** Choose **Explore my symbol** and select a PNG/JPEG/WebP. It creates a local study with a useful title automatically, records permission for *private on-device viewing and storage only*, and opens image annotation. Neither reuse nor public redistribution is granted.
3. **Record what is claimed.** Mark a region if useful, then write a claim in plain language. Unknown dates, script classifications and citation details may be left out. All claims begin **UNVERIFIED**.
4. **Investigate and preserve findings.** Add source publications, physical witnesses, exact locators and alternative readings when available. Human editorial review is explicit and append-only. Save a ZIP backup or restore a prior case. An incomplete backup never masquerades as complete.

The full evidence system remains available in the Research workspace; beginner shortcuts cannot infer a historical verdict or relax source and image rights checks.

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
- `npm run test:e2e` runs static checks and four Chromium journeys: research/reload persistence, mobile viewport, zero-input sample/blank study, and image-first upload/reload. Managed browsers that block localhost produce explicit SKIP, not PASS. The authorized MacBook Chrome run passed all four; real-device touch and disconnected-network operation remain separate acceptance gates.
- `npm run test:perf` exercises 10,000 synthetic Map entries and 100-claim deterministic casefile generation. These are Node proxy measurements, not IndexedDB browser results.

## Privacy

No accounts, analytics, hosted databases, mandatory remote providers, or automatic image uploads. The production service worker caches local application files only; it does not prefetch linked historical-source websites.

---

**Status:** Public Pages deployed with verified browser case persistence and mobile viewport checks; full offline and real-device acceptance remain conditional. Historical assertions require independent scholarship and human judgment.
