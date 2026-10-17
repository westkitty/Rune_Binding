# Rune Binding — Project Bible

This is an additive project record. It does not override the approved design, detailed historical-research protocol, or current `OPERATIONAL_STATE.md`.

## Project identity and protected rules

- **Identity:** Rune Binding is a local-first evidence workbench for rune and bind-rune research, not an oracle of magical efficacy or historical certainty.
- **Grounding:** An image shape, transcription, transliteration, translation, date, practical use and historical transmission are different propositions. Modern interpretations must not silently become ancient evidence.
- **Review authority:** Software may flag missing evidence but only an explicitly identified human reviewer records editorial verdicts. Later evidence changes must invalidate affected review dependencies.
- **Rights:** Unknown image rights deny viewing, storage and publication by default. Local viewing consent never grants export or redistribution. Shareable pixels require explicit rights and a recorded basis.
- **Privacy:** Investigation cases and imported images stay browser-local; there are no mandatory accounts or automatic uploads. Saved browser data can be evicted; users must have portable exports.
- **Release honesty:** Code tests, browser execution, offline restart, mobile behavior, historical accuracy, public GitHub push and remote CI are separate proof states.

## 2026-10-17 — K1 safety, annotation and portability uplift

- **Prior baseline:** `3348df79d080439546f42ba324f3016913206161` on local `main`, no configured remote.
- **Implementation commit:** `ffc47c9a5ae77620dd36dd6e963815111f3f41ff`.
- **Work:** a rights-first image URL resolver prevents old cached blob URLs bypassing unknown or denied viewing permissions; original media hashes are checked before first storage-backed display; public image distribution requires a nonblank rights basis.
- **Usability:** annotation image selector reaches all imported assets and resolves corresponding item IDs. An investigator can explicitly change previously imported images' local viewing permission with a required reason, without granting redistribution.
- **Research continuity:** reviewed claims now depend on linked asset identity, rights, item and image regions; changes mark those reviews for recheck.
- **Recovery:** an uncompressed deterministic ZIP/STORE archive contains the compiler's rights-filtered casefile files. ZIP imports enforce entry allowlist, length bounds, duplicate-name rejection, CRC and existing SHA-256 manifest checks; incomplete archives remain labeled as such. Existing individual-file export/import is retained.
- **Publication handoff:** `scripts/publish-public.sh` targets public `westkitty/Rune_Binding`, requires GitHub CLI authentication, refuses conflicting remote/dirty tree/private destination and checks remote SHA; `.github/workflows/verify.yml` sets up Node 22, TypeScript 5.8.3 and runs `npm test` on GitHub when published.
- **Verification:** the local full suite completed with 75 unit/integration passes, 5 static/browser-test passes, 3 performance/proxy passes, zero failures, **two actual browser checks skipped** due to managed Chromium URL policy. `unzip -t` recognized a synthetic generated ZIP. No real browser persistence, offline-restart, touch/mobile behavior, hosted CI or historical provenance has been certified.
- **Open requirement:** publish PUBLIC repo and verify remote Git SHA; obtain unrestricted browser/device evidence before promoting K1 release acceptance beyond PARTIAL.
- **Known risks:** ZIP archive is uncompressed and capped at 128 MiB; browser user storage remains subject to eviction. Rights and source records are editorial assertions requiring independent verification. Generated CI workflow remains untested on hosted runners until publication.

## 2026-10-17 — First public GitHub Pages publication

- Authenticated GitHub identity: `westkitty`. The original K1 bundle transferred through authorized Google Drive and remote tooling was checksum-verified before cloning. The active developer copy is `/Users/andrew/Rune_Binding` (outside iCloud), preserving the original local Git history.
- Pages preparation commit: `d826abc577cf9e477d8abdf0348bfdf5f0dcc1c0`. A stale browser test was corrected to expect the ZIP button in addition to the three per-file exports; the real end-to-end browser journey and mobile viewport test both passed afterward.
- The public repository `https://github.com/westkitty/Rune_Binding` was created, then the exact `main` commit was pushed and verified against `git ls-remote`. No forced update or history rewrite was used.
- GitHub Actions verification run `39016279168` succeeded. Pages was configured for `workflow` publishing with HTTPS enforced. The first publish workflow raced initial Pages setup and failed; the explicit rerun `39016342453` passed both build and deploy jobs.
- Live site `https://westkitty.github.io/Rune_Binding/` and its JavaScript, CSS, manifest and service-worker assets each returned HTTP 200 in a direct network smoke test.
- Local MacBook Chrome full suite: 75 unit/integration + 7 E2E including two true browser tests + 3 perf proxy = 85 passed, 0 failed, 0 skipped. These checks do not prove offline network-disconnect behavior, tablet touch drawing, complete keyboard accessibility, or historical source accuracy.
- Release state must be anchored to GitHub Pages deployment status and live HTTP readback; updating `main` alone is insufficient proof of a deployed site.
