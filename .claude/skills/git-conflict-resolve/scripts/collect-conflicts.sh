#!/usr/bin/env bash
set -euo pipefail

# Usage: collect-conflicts.sh {repository path}
# Collects the conflicted files of the ongoing merge, with the commits of each side.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

echo "### Repository"
pwd
echo

if ! git rev-parse -q --verify MERGE_HEAD >/dev/null; then
  echo "### Merge"
  echo "None"
  exit 0
fi

echo "### Merge"
echo "- Ours: HEAD ($(git branch --show-current))"
echo "- Theirs: MERGE_HEAD ($(git name-rev --name-only MERGE_HEAD))"
echo

echo "### Conflicted Files"
git diff --name-only --diff-filter=U
echo

git diff --name-only --diff-filter=U | while IFS= read -r file; do
  echo "### Commits: $file"
  git log --oneline --left-right HEAD...MERGE_HEAD -- "$file"
  echo

  echo "### Diff: $file"
  git diff -- "$file" || true
  echo
done
