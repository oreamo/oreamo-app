#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

target="$1"
shift
files=("$@")

if [ "${#files[@]}" -eq 0 ]; then
  echo "No files are given." >&2
  exit 1
fi

if [ "$target" = "unstaged" ]; then
  git add -A -- "${files[@]}"
  git commit -F -
  exit 0
fi

if [ "$target" != "staged" ]; then
  echo "Target must be 'staged' or 'unstaged'." >&2
  exit 1
fi

covered="true"
while IFS= read -r staged_file; do
  found="false"
  for file in "${files[@]}"; do
    if [ "$file" = "$staged_file" ]; then
      found="true"
      break
    fi
  done
  if [ "$found" = "false" ]; then
    covered="false"
    break
  fi
done < <(git diff --cached --name-only --no-renames)

if [ "$covered" = "true" ]; then
  git commit -F -
  exit 0
fi

tmp_index="$(mktemp)"
rm -f "$tmp_index"
trap 'rm -f "$tmp_index"' EXIT

GIT_INDEX_FILE="$tmp_index" git read-tree HEAD
for file in "${files[@]}"; do
  entry="$(git ls-files -s -- "$file")"
  if [ -n "$entry" ]; then
    printf '%s\n' "$entry" | GIT_INDEX_FILE="$tmp_index" git update-index --index-info
  else
    GIT_INDEX_FILE="$tmp_index" git update-index --force-remove -- "$file"
  fi
done

GIT_INDEX_FILE="$tmp_index" git commit -F -
