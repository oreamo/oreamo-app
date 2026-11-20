#!/usr/bin/env bash
set -euo pipefail

# Usage: status.sh {target:container}...
# Prints whether the targets are running locally, with docker, or stopped.

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

running="$(docker compose ps --services --status running 2> /dev/null || true)"

# Align the statuses after the longest name.
width=6
for item in "$@"; do
  name="oreamo-${item#*:}"
  if [ "${#name}" -gt "$width" ]; then
    width="${#name}"
  fi
done

# Push the statuses to the right end of the terminal like the other commands.
if [ -t 1 ]; then
  columns="$(stty size < /dev/tty 2> /dev/null | cut -d ' ' -f 2)"
  columns="${columns:-0}"
  if [ $((columns - 19)) -gt "$width" ]; then
    width=$((columns - 19))
  fi
fi

printf "%-${width}s  %-16s\n" "TARGET" "STATUS"
for item in "$@"; do
  target="${item%%:*}"
  container="${item#*:}"

  status="stopped" color="90"
  if echo "$running" | grep -qx "$container"; then
    status="running (docker)" color="32"
  fi
  case "$target" in
    web | api | agent)
      if [ -n "$(bash scripts/find-process.sh "$target")" ]; then
        status="running (local)" color="32"
      fi
      ;;
  esac

  # Color the status only on the terminal.
  if [ -t 1 ]; then
    printf "%-${width}s  \033[${color}m%-16s\033[0m\n" "oreamo-$container" "$status"
  else
    printf "%-${width}s  %-16s\n" "oreamo-$container" "$status"
  fi
done
