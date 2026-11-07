#!/usr/bin/env bash
set -euo pipefail

# Usage: create-pull-request.sh {repository path} {base branch} {title} {labels} <<< {body}
# Creates the pull request, or updates it if an open pull request of the same head and base branch exists.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

base="$2"
title="$3"
labels="${4:-}"
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

# Find the open pull request of the same head and base branch.
number="$(gh pr list --head "$head" --base "$base" --state open --json number --jq '.[0].number // empty')"

if [ -z "$number" ]; then
  # Attach the labels (comma-separated) if given.
  label_args=()
  if [ -n "$labels" ]; then
    label_args=(--label "$labels")
  fi

  # Create the pull request, reading the body from stdin.
  gh pr create --base "$base" --head "$head" --title "$title" --assignee "$assignee" ${label_args[@]+"${label_args[@]}"} --body-file -
  exit 0
fi

# Replace the labels of the existing pull request with the given labels.
label_args=()
if [ -n "$labels" ]; then
  label_args+=(--add-label "$labels")
fi

removed_labels="$(gh pr view "$number" --json labels --jq '.labels[].name' | while IFS= read -r name; do
  case ",$labels," in
    *",$name,"*) ;;
    *) echo "$name" ;;
  esac
done | paste -sd, -)"
if [ -n "$removed_labels" ]; then
  label_args+=(--remove-label "$removed_labels")
fi

# Update the existing pull request, reading the body from stdin.
echo "Pull request #$number already exists. Updating it."
gh pr edit "$number" --title "$title" --add-assignee "$assignee" ${label_args[@]+"${label_args[@]}"} --body-file -
