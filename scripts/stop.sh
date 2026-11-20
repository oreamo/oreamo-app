#!/usr/bin/env bash
set -euo pipefail

# Usage: stop.sh {service}
# Stops the service run directly, and waits until it is stopped. Exits with 10 if the service is not run directly.

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"

pids="$(bash "$root/scripts/find-process.sh" "$1")"
if [ -z "$pids" ]; then
  exit 10
fi

kill $pids

# Wait until the processes are stopped, and kill them forcibly if they are not stopped in 10 seconds.
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
