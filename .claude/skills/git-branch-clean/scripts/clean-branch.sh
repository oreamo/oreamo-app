#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

base="${1:-develop}"
head="$(git branch --show-current)"

if [ "$head" = "$base" ]; then
  echo "The current branch is already $base." >&2
  exit 1
fi

if git worktree list --porcelain | grep -qx "branch refs/heads/$base"; then
  git fetch origin "$base"
  git switch --detach "origin/$base"
else
  git switch "$base"
  git pull
fi
git branch -d "$head"
git push --delete origin "$head"

echo
echo "### Deleted Branch"
echo "$head"
