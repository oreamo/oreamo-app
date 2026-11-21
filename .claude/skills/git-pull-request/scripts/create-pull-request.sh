#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

base="$1"
title="$2"
assignee="$3"
labels="${4:-}"
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
