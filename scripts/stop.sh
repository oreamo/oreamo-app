#!/usr/bin/env bash
set -euo pipefail

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"

for service in "$@"; do
  pids="$(bash "$root/scripts/find-process.sh" "$service")"
  if [ -z "$pids" ]; then
    continue
  fi

  echo "### $service: stopping"
  kill $pids

  # Wait until the processes are stopped.
  for pid in $pids; do
    while kill -0 "$pid" 2> /dev/null; do
      sleep 1
    done
  done
done
