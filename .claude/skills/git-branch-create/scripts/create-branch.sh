#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

branch="$1"
base="${2:-develop}"

if git worktree list --porcelain | grep -qx "branch refs/heads/$base"; then
  git fetch origin "$base"
  git switch --no-track -c "$branch" "origin/$base"
else
  git switch "$base"
  git pull
  git switch -c "$branch"
fi

echo
echo "### Created Branch"
echo "$branch"
