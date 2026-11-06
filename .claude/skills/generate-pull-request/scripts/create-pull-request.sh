#!/usr/bin/env bash
set -euo pipefail

# Usage: create-pull-request.sh {repository path} {base branch} {title} <<< {body}

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

base="$2"
title="$3"
head="$(git branch --show-current)"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is not installed." >&2
  exit 1
fi

if [ -z "$head" ] || [ "$head" = "$base" ]; then
  echo "Head branch '$head' must differ from base branch '$base'." >&2
  exit 1
fi

# Push the current branch to the remote and set upstream.
git push -u origin "$head"

# Create the pull request, reading the body from stdin.
gh pr create --base "$base" --head "$head" --title "$title" --body-file -
