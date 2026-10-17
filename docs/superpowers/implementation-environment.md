# Verified implementation environment and architectural rulings

**Date:** 2026-10-17

- Local isolated repository: `/mnt/data/Rune_Binding` (sandbox execution only, not assumed to be the user's MacBook checkout).
- Initial branch: `feature/k1-evidence-kernel`; local commits are allowed by the user's explicit authorization.
- Node `v22.16.0`, npm `10.9.2`, global `tsc` `5.8.3`, Git `2.47.3` observed in container.
- Network package-registry access failed DNS with `EAI_AGAIN`. **Ruling:** implement the approved K1 interfaces with dependency-free, strict TypeScript + native DOM/IndexedDB instead of installing the plan's Vite/React/Zod/Vitest/Playwright stack. Rationale: stay functional and testable without fabricated dependencies; risk: browser component-testing ergonomics and dependency parity differ from the approved plan.
- Local static HTTP server works for Node `fetch`. Managed Chromium shows `Your organization doesn't allow you to view this site` for localhost, and blocks `file://` paths. **Ruling:** report real-browser tests SKIPPED/UNVERIFIED and preserve runnable tests for unrestricted environments. No offline/mobile/IndexedDB runtime proof claimed.
- Public GitHub target requested: `westkitty/Rune_Binding`; the connected GitHub connector authenticates as `westkitty` but does not expose a repository creation operation. The authorized BigMac's `gh` CLI is present but authentication could not be verified; MacBook command route timed out. **Ruling:** never claim a created public repository or pushed commits without provider confirmation; retain portable git history for push when a valid authenticated repo creation path exists.
- Static compiled output `dist/` is committed for distribution, including a content-versioned service worker cache. The repository source remains the build authority.

## Source integrity (exact bytes)

- Research protocol: `docs/research/Rune_Binding_OMNI_Research_Protocol_v3.md` SHA-256 `96973ed5867cf1fa77edfbd0dcc4c29e2f80edd32eb37f52d94f3f27fda9b665`.
- Feature register: `docs/research/Rune_Binding_OMNI_v3_Feature_Register.json` SHA-256 `ee5e440a8415d0a717a8507fa30a1b22b3b8925561e416ed2f83b589569e9f43`.
- Design specification: `docs/superpowers/specs/2026-10-17-rune-binding-evidence-kernel-design.md` SHA-256 `3f7a7eab5d9fad01e3e963d7be70da592181674d619252cde9ec67ac4bed891d`.

## Authority and scope

User explicitly approved new local repository, Native Superpowers implementation, and subsequent PUBLIC GitHub repo, stage, commit and push. No more user questions. No force-push, deletion or publication of investigation data was authorized or performed. Historical research evidence is not inferred from source filename or visual resemblance.
