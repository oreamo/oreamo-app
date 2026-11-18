#!/usr/bin/env bash
set -euo pipefail

# Usage: rename-branch.sh {branch name} {base branch (default: develop)}
# Renames the current branch, and replaces the remote branch too if it exists.

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

branch="$1"
base="${2:-develop}"
head="$(git branch --show-current)"

if [ -z "$head" ] || [ "$head" = "$base" ]; then
  echo "The current branch '$head' cannot be renamed." >&2
  exit 1
fi

if [ "$head" = "$branch" ]; then
  echo "The current branch is already $branch." >&2
  exit 1
fi

git branch -m "$branch"

# Push the new branch and delete the old one only if the old one exists on the remote.
if git ls-remote --exit-code --heads origin "$head" >/dev/null; then
  git push -u origin "$branch"
  git push --delete origin "$head"
fi

echo
echo "### Renamed Branch"
echo "$head -> $branch"
