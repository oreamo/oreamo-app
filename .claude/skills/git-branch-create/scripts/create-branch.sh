#!/usr/bin/env bash
set -euo pipefail

# Usage: create-branch.sh {repository path} {branch name} {base branch (default: develop)}
# Switches to the latest base branch and creates a new branch from it.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

branch="$2"
base="${3:-develop}"

git switch "$base"
git pull
git switch -c "$branch"

echo
echo "### Created Branch"
echo "$branch"
