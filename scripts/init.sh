#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

require_command() {
  local name="$1"

  if ! command -v "$name" > /dev/null; then
    echo "$name is not installed." >&2
    exit 1
  fi
}

require_command "make"
require_command "pnpm"
require_command "uv"

echo "oreamo-app: installing"
pnpm --dir "$root" install

echo "oreamo-web: installing"
pnpm --dir "$root/oreamo-web" install

echo "oreamo-agent: installing"
make -C "$root/oreamo-agent" sync
