#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "### Repository"
pwd
echo

echo "### Labels"
gh label list --limit 100 --json name,description --jq '.[] | "- \(.name): \(.description)"'
echo

echo "### Changes"
if [ -z "$(git status --porcelain)" ]; then
  echo "None"
  exit 0
fi
git status --short
echo

echo "### Diff"
git diff HEAD
