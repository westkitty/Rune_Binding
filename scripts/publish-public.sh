#!/bin/sh
# Safe, idempotent publication to the single authorized public repository.
set -eu
TARGET='westkitty/Rune_Binding'
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"
if [ "$(git branch --show-current)" != 'main' ]; then
  echo 'Publish blocked: expected the verified main branch.' >&2
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo 'Publish blocked: the working tree has uncommitted changes.' >&2
  exit 1
fi
if ! command -v gh >/dev/null 2>&1 || ! gh auth status -h github.com >/dev/null 2>&1; then
  echo 'Publish blocked: authenticate the GitHub CLI with rights to create public repositories.' >&2
  exit 1
fi
ORIGIN=$(git remote get-url origin 2>/dev/null || true)
case "$ORIGIN" in
  ''|"https://github.com/$TARGET"|"https://github.com/$TARGET.git"|"git@github.com:$TARGET.git") ;;
  *) echo "Publish blocked: unexpected origin remote; no changes made." >&2; exit 1;;
esac
if gh repo view "$TARGET" --json visibility --jq .visibility >/dev/null 2>&1; then
  VISIBILITY=$(gh repo view "$TARGET" --json visibility --jq .visibility)
  if [ "$VISIBILITY" != 'PUBLIC' ]; then
    echo 'Publish blocked: target exists but is not public; repository privacy was not changed.' >&2
    exit 1
  fi
else
  # A failed public read is not proof of nonexistence, so creation must succeed explicitly.
  gh repo create "$TARGET" --public --source=.
fi
VISIBILITY=$(gh repo view "$TARGET" --json visibility --jq .visibility)
if [ "$VISIBILITY" != 'PUBLIC' ]; then
  echo 'Publish blocked: GitHub did not confirm PUBLIC visibility.' >&2
  exit 1
fi
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/$TARGET.git"
fi
git push -u origin main
LOCAL_SHA=$(git rev-parse refs/heads/main)
REMOTE_SHA=$(git ls-remote origin refs/heads/main | awk '{print $1}')
if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
  echo 'Push readback mismatch; inspect the remote before claiming publication.' >&2
  exit 1
fi
printf 'PUBLICATION VERIFIED: https://github.com/%s commit %s\n' "$TARGET" "$LOCAL_SHA"
