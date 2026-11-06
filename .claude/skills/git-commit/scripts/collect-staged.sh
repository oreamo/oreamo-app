#!/usr/bin/env bash
set -euo pipefail

# Move to the target repository (default: current directory).
cd "${1:-.}"
cd "$(git rev-parse --show-toplevel)"

echo "### Repository"
pwd
echo

echo "### Status"
git status
echo

echo "### Commit Target Diff"
if ! git diff --cached --quiet; then
  # Staged changes exist: only staged changes are the commit target.
  git diff --cached
else
  # No staged changes: all changes, including untracked files, are the commit target.
  git diff
  git ls-files --others --exclude-standard -z | while IFS= read -r -d '' file; do
    git diff --no-index -- /dev/null "$file" || true
  done
fi
