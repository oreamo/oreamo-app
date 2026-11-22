#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

pids="$(bash "$root/scripts/find-process.sh" "$1")"
if [ -z "$pids" ]; then
  exit 10
fi

kill $pids

for pid in $pids; do
  seconds=0
  while kill -0 "$pid" 2> /dev/null; do
    if [ "$seconds" -ge 10 ]; then
      kill -9 "$pid" 2> /dev/null || true
    fi
    sleep 1
    seconds=$((seconds + 1))
  done
done
