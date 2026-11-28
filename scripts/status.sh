#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

running="$(docker compose ps --services --status running 2> /dev/null || true)"

width=6
for target in "$@"; do
  name="oreamo-$target"
  if [ "${#name}" -gt "$width" ]; then
    width="${#name}"
  fi
done

if [ -t 1 ]; then
  columns="$(stty size < /dev/tty 2> /dev/null | cut -d ' ' -f 2)"
  columns="${columns:-0}"
  if [ $((columns - 19)) -gt "$width" ]; then
    width=$((columns - 19))
  fi
fi

printf "%-${width}s  %-16s\n" "NAME" "STATUS"
for target in "$@"; do
  status="stopped" color="90"
  if echo "$running" | grep -qx "$target"; then
    status="running (docker)" color="32"
  fi
  case "$target" in
    web | api | agent)
      if [ -n "$(bash scripts/find-process.sh "$target")" ]; then
        status="running (local)" color="32"
      fi
      ;;
  esac

  if [ -t 1 ]; then
    printf "%-${width}s  \033[${color}m%-16s\033[0m\n" "oreamo-$target" "$status"
  else
    printf "%-${width}s  %-16s\n" "oreamo-$target" "$status"
  fi
done
