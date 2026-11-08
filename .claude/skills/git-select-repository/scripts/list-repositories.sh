#!/usr/bin/env bash
set -euo pipefail

# Workspace root is four levels above this script (.claude/skills/git-select-repository/scripts).
root="$(cd "$(dirname "$0")/../../../.." && pwd)"

print_repository() {
  local name="$1"
  local path="$2"

  echo "### $name"
  echo "- Path: $path"
  if [ ! -d "$path/.git" ]; then
    echo "- Status: not a git repository"
    echo
    return
  fi
  echo "- Branch: $(git -C "$path" status -sb | head -1 | sed 's/^## //')"
  echo "- Changes: $(git -C "$path" status --porcelain | wc -l | tr -d ' ')"
  echo
}

print_repository "Oreamo" "$root"
print_repository "Frontend" "$root/oreamo-frontend"
print_repository "Backend" "$root/oreamo-backend"
print_repository "Agent" "$root/oreamo-agent"
