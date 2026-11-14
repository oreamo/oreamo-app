#!/usr/bin/env bash
set -euo pipefail

# Usage: clean-branch.sh {repository path} {base branch (default: develop)}
# Switches to the latest base branch and deletes the current branch from the local and the remote.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

base="${2:-develop}"
head="$(git branch --show-current)"

if [ "$head" = "$base" ]; then
  echo "The current branch is already $base." >&2
  exit 1
fi

git switch "$base"
git pull
git branch -d "$head"
git push --delete origin "$head"

echo
echo "### Deleted Branch"
echo "$head"
