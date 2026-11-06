#!/usr/bin/env bash
set -euo pipefail

# Move to the target repository (default: current directory).
cd "${1:-.}"
cd "$(git rev-parse --show-toplevel)"

# Compare the current branch with the remote base branch (default: develop).
base="${2:-develop}"

git fetch origin "$base" --quiet

echo "### Repository"
pwd
echo

echo "### Base"
echo "origin/$base...HEAD"
echo

echo "### Changed Files"
git diff --name-status "origin/$base...HEAD"
echo

echo "### Diff"
git diff "origin/$base...HEAD"
