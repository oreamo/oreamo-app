#!/usr/bin/env bash
set -euo pipefail

# Usage: update-pull-request.sh {repository path} {number} {title} {assignee} {labels} <<< {body}
# Updates the title, body, assignee and labels of the existing pull request, reading the body from stdin.
# Uses REST API since `gh pr edit` fails on the deprecated Projects classic. Labels are comma-separated and replace the existing ones.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

number="$2"
title="$3"
assignee="$4"
labels="${5:-}"
repository="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"

# Update the title and the body.
gh api -X PATCH "repos/$repository/pulls/$number" -f title="$title" -f body="$(cat)" --jq '.html_url'

# Add the assignee.
gh api -X POST "repos/$repository/issues/$number/assignees" -f "assignees[]=$assignee" --silent

# Replace the labels.
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
