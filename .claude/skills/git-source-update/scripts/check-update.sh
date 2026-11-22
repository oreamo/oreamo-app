#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

base="${1:-develop}"
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
