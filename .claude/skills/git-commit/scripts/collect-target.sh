#!/usr/bin/env bash
set -euo pipefail

# Usage: collect-target.sh
# Collects the commit target: staged changes if any, otherwise unstaged changes (including untracked files).

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

echo "### Repository"
pwd
echo

# Decide the target type.
if ! git diff --cached --quiet; then
  target="staged"
elif [ -n "$(git status --porcelain)" ]; then
  target="unstaged"
else
  target="none"
fi

echo "### Target"
echo "$target"
echo

if [ "$target" = "none" ]; then
  exit 0
fi

echo "### Target Files"
if [ "$target" = "staged" ]; then
  git diff --cached --name-status
else
  git diff --name-status
  git ls-files --others --exclude-standard | while IFS= read -r file; do
    printf 'A\t%s\n' "$file"
  done
fi
echo

echo "### Labels"
gh label list --limit 100 --json name,description --jq '.[] | "- \(.name): \(.description)"'
echo

echo "### Diff"
if [ "$target" = "staged" ]; then
  git diff --cached
else
  git diff
  git ls-files --others --exclude-standard -z | while IFS= read -r -d '' file; do
    git diff --no-index -- /dev/null "$file" || true
  done
fi
