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

# Find the GitHub user of the current git email to assign the pull request.
email="$(git config user.email || true)"
if [ -z "$email" ]; then
  echo "git user.email is not set." >&2
  exit 1
fi

assignee="$(gh api -X GET search/users -f q="$email in:email" --jq '.items[0].login // empty')"
if [ -z "$assignee" ]; then
  echo "GitHub user for git email '$email' is not found." >&2
  exit 1
fi

# Push the current branch to the remote and set upstream.
git push -u origin "$head"

# Create the pull request, reading the body from stdin.
gh pr create --base "$base" --head "$head" --title "$title" --assignee "$assignee" --body-file -
