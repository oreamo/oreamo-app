#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [ "$#" -eq 0 ]; then
  echo "No files are given." >&2
  exit 1
fi

for file in "$@"; do
  if [ -f "$file" ] && grep -nE '^(<<<<<<<|>>>>>>>)( |$)' "$file"; then
    echo "Conflict markers remain in '$file'." >&2
    exit 1
  fi
done

git add -A -- "$@"
