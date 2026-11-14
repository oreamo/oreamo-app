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

print_repository "Application" "$root"
print_repository "Web" "$root/oreamo-web"
print_repository "API" "$root/oreamo-api"
print_repository "Agent" "$root/oreamo-agent"
