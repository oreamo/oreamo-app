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
echo "- Base: $base"
echo

echo "### Remote Branch"
if git ls-remote --exit-code --heads origin "$head" >/dev/null; then
  echo "origin/$head"
else
  echo "None"
fi
echo

echo "### Existing Pull Request"
gh pr list --head "$head" --state open --limit 1 --json number,url \
  --jq 'if length == 0 then "None" else .[0] | "- Number: \(.number)\n- URL: \(.url)" end'
echo

echo "### Labels"
gh label list --limit 100 --json name,description --jq '.[] | "- \(.name): \(.description)"'
echo

echo "### Commits"
if [ -z "$(git rev-list "origin/$base..HEAD")" ]; then
  echo "None"
  exit 0
fi
git log --reverse --format='---%n%s%n%n%b' --name-status "origin/$base..HEAD"
