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

# Wait until the processes are stopped.
for pid in $pids; do
  while kill -0 "$pid" 2> /dev/null; do
    sleep 1
  done
done
