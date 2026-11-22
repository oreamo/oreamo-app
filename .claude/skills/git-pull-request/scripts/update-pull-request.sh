#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

number="$1"
title="$2"
assignee="$3"
labels="${4:-}"
repository="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"

gh api -X PATCH "repos/$repository/pulls/$number" -f title="$title" -f body="$(cat)" --jq '.html_url'

gh api -X POST "repos/$repository/issues/$number/assignees" -f "assignees[]=$assignee" --silent

if [ -z "$labels" ]; then
  gh api -X DELETE "repos/$repository/issues/$number/labels" --silent
else
  label_args=()
  IFS=',' read -ra label_names <<< "$labels"
  for name in "${label_names[@]}"; do
    label_args+=(-f "labels[]=$name")
  done
  gh api -X PUT "repos/$repository/issues/$number/labels" "${label_args[@]}" --silent
fi
