#!/usr/bin/env bash
set -euo pipefail

# Usage: status.sh {target:container}...
# Prints whether the targets are running directly, with docker, or stopped.

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

running="$(docker compose ps --services --status running 2> /dev/null || true)"

printf "%-8s %s\n" "TARGET" "STATUS"
for item in "$@"; do
  target="${item%%:*}"
  container="${item#*:}"

  status="stopped"
  if echo "$running" | grep -qx "$container"; then
    status="running (docker)"
  fi
  case "$target" in
    web | api | agent)
      if [ -n "$(bash scripts/find-process.sh "$target")" ]; then
        status="running (direct)"
      fi
      ;;
  esac

  printf "%-8s %s\n" "$target" "$status"
done
