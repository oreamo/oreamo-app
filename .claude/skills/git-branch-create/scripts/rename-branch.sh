#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

branch="$1"
base="${2:-develop}"
head="$(git branch --show-current)"

if [ -z "$head" ] || [ "$head" = "$base" ]; then
  echo "The current branch '$head' cannot be renamed." >&2
  exit 1
fi

if [ "$head" = "$branch" ]; then
  echo "The current branch is already $branch." >&2
  exit 1
fi

git branch -m "$branch"

if git ls-remote --exit-code --heads origin "$head" >/dev/null; then
  git push -u origin "$branch"
  git push --delete origin "$head"
fi

echo
echo "### Renamed Branch"
echo "$head -> $branch"
