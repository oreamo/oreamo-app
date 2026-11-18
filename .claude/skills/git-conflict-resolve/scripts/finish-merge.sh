#!/usr/bin/env bash
set -euo pipefail

# Usage: finish-merge.sh
# Completes the ongoing merge with the default merge commit message.

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

if ! git rev-parse -q --verify MERGE_HEAD >/dev/null; then
  echo "No merge is in progress." >&2
  exit 1
fi

conflicted="$(git diff --name-only --diff-filter=U)"
if [ -n "$conflicted" ]; then
  echo "Conflicted files remain:" >&2
  echo "$conflicted" >&2
  exit 1
fi

git commit --no-edit
