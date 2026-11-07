#!/usr/bin/env bash
set -euo pipefail

# Usage: check-update.sh {repository path} {base branch (default: develop)}
# Checks whether the current branch includes the latest remote base branch.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

base="${2:-develop}"
head="$(git branch --show-current)"

git fetch origin "$base" --quiet

echo "### Repository"
pwd
echo

echo "### Branch"
echo "- Head: $head"
echo "- Base: origin/$base"
echo

echo "### Behind"
git rev-list --count "HEAD..origin/$base"
