#!/usr/bin/env bash
set -euo pipefail

# Usage: collect-diff.sh {repository path} {base branch (default: develop)}
# Collects the pull request target: the diff with the remote base branch, the labels and the existing pull request.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

base="${2:-develop}"
head="$(git branch --show-current)"

git fetch origin "$base" --quiet
git fetch origin "$head" --quiet 2>/dev/null || true

echo "### Repository"
pwd
echo

echo "### Branch"
echo "- Head: $head"
echo "- Base: $base"
echo

echo "### Unpushed Commits"
if git rev-parse -q --verify "origin/$head" >/dev/null; then
  git rev-list --count "origin/$head..HEAD"
else
  echo "not pushed"
fi
echo

# Find the GitHub user of the current git email as the assignee.
echo "### Assignee"
email="$(git config user.email || true)"
assignee=""
if [ -n "$email" ]; then
  assignee="$(gh api -X GET search/users -f q="$email in:email" --jq '.items[0].login // empty')"
fi
echo "${assignee:-None}"
echo

echo "### Existing Pull Request"
gh pr list --head "$head" --base "$base" --state open --limit 1 \
  --json number,url,title,labels,assignees,body \
  --jq 'if length == 0 then "None" else .[0] | "- Number: \(.number)\n- URL: \(.url)\n- Title: \(.title)\n- Labels: \([.labels[].name] | join(","))\n- Assignees: \([.assignees[].login] | join(","))\n- Body:\n\(.body)" end'
echo

echo "### Labels"
gh label list --limit 100 --json name,description --jq '.[] | "- \(.name): \(.description)"'
echo

echo "### Changed Files"
git diff --name-status "origin/$base...HEAD"
echo

echo "### Diff"
git diff "origin/$base...HEAD"
