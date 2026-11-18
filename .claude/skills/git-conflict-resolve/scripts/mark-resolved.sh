#!/usr/bin/env bash
set -euo pipefail

# Usage: mark-resolved.sh {file}...
# Marks the given conflicted files as resolved.

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

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
