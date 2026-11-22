#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

base="${1:-develop}"

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
