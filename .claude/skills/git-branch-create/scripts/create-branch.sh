#!/usr/bin/env bash
set -euo pipefail

# Usage: create-branch.sh {branch name} {base branch (default: develop)}
# Switches to the latest base branch and creates a new branch from it.

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

branch="$1"
base="${2:-develop}"

git switch "$base"
git pull
git switch -c "$branch"

echo
echo "### Created Branch"
echo "$branch"
