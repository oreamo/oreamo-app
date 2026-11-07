#!/usr/bin/env bash
set -euo pipefail

# Usage: update.sh {repository path} {base branch (default: develop)}
# Pulls the remote base branch into the current branch, following the git pull configuration.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

base="${2:-develop}"

if git pull origin "$base"; then
  result="updated"
elif git rev-parse -q --verify MERGE_HEAD >/dev/null; then
  result="conflict"
else
  exit 1
fi

echo
echo "### Result"
echo "$result"
