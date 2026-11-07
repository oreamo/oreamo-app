#!/usr/bin/env bash
set -euo pipefail

# Usage: mark-resolved.sh {repository path} {file}...
# Marks the given conflicted files as resolved.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"
shift

if [ "$#" -eq 0 ]; then
  echo "No files are given." >&2
  exit 1
fi

# Refuse files which still have conflict markers.
for file in "$@"; do
  if [ -f "$file" ] && grep -nE '^(<<<<<<<|>>>>>>>)( |$)' "$file"; then
    echo "Conflict markers remain in '$file'." >&2
    exit 1
  fi
done

git add -A -- "$@"
