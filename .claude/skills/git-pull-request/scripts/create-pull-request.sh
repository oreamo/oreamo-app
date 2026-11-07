#!/usr/bin/env bash
set -euo pipefail

# Usage: create-pull-request.sh {repository path} {base branch} {title} {assignee} {labels} <<< {body}
# Creates the pull request, reading the body from stdin. Labels are comma-separated.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

base="$2"
title="$3"
assignee="$4"
labels="${5:-}"
head="$(git branch --show-current)"

if [ -z "$head" ] || [ "$head" = "$base" ]; then
  echo "Head branch '$head' must differ from base branch '$base'." >&2
  exit 1
fi

label_args=()
if [ -n "$labels" ]; then
  label_args=(--label "$labels")
fi

gh pr create --base "$base" --head "$head" --title "$title" --assignee "$assignee" ${label_args[@]+"${label_args[@]}"} --body-file -
