#!/usr/bin/env bash
set -euo pipefail

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"

require_command() {
  local name="$1"

  if ! command -v "$name" > /dev/null; then
    echo "$name is not installed." >&2
    exit 1
  fi
}

clone_repository() {
  local name="$1"
  local path="$root/$name"

  if [ -d "$path/.git" ]; then
    echo "### $name: already exists"
    return
  fi

  echo "### $name: cloning"
  git clone --branch develop "https://github.com/oreamo/$name.git" "$path"
}

require_command "git"
require_command "make"
require_command "pnpm"
require_command "uv"

clone_repository "oreamo-web"
clone_repository "oreamo-api"
clone_repository "oreamo-agent"

echo "### oreamo-web: installing"
pnpm --dir "$root/oreamo-web" install

echo "### oreamo-agent: installing"
make -C "$root/oreamo-agent" sync
