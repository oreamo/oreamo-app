#!/usr/bin/env bash
set -euo pipefail

# Usage: run.sh {service}
# Runs the service directly in the background, and waits until it listens on its port.

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"

service="$1"

case "$service" in
  web) port=3000 ;;
  api) port=8080 ;;
  agent) port=8000 ;;
esac

# Write the phase of the service to PHASE_FILE if it is given, or clear it without a phase.
phase() {
  if [ -n "${PHASE_FILE:-}" ]; then
    printf '%s' "${1:-}" > "$PHASE_FILE"
  fi
}

# Restart the service if it is already running.
if [ -n "$(bash "$root/scripts/find-process.sh" "$service")" ]; then
  phase "Stopping (local)"
fi
bash "$root/scripts/stop.sh" "$service" || [ "$?" -eq 10 ]

# Remove the container of the service if it is running, so that the service can use its port.
if [ "$(docker inspect -f '{{.State.Running}}' "oreamo-$service" 2> /dev/null)" = "true" ]; then
  phase "Removing (docker)"
  if (cd "$root" && docker compose down "$service") > /dev/null 2>&1 && [ -n "${NOTE_FILE:-}" ]; then
    echo "docker removed" > "$NOTE_FILE"
  fi
fi
phase

# Fail if the port is still used by others.
pid="$(lsof -ti "tcp:$port" -sTCP:LISTEN | head -1 || true)"
if [ -n "$pid" ]; then
  echo "Port $port is already used by $(basename "$(ps -p "$pid" -o comm=)")." >&2
  exit 1
fi

# Keep the output of the service in a temporary directory only until it starts, to show it when it fails to start.
temp="$(mktemp -d)"
trap 'rm -rf "$temp"' EXIT

# Pass the output to the temporary directory, and drop it once the directory is removed.
keep() {
  while IFS= read -r line || [ -n "$line" ]; do
    # Never stop reading even if the directory is removed, so that the service is not broken by the closed pipe.
    printf '%s\n' "$line" >> "$temp/output" || true
  done
}

(
  # Keep the service running when the terminal is closed.
  trap '' HUP

  case "$service" in
    web) cd "$root/oreamo-web" && pnpm dev ;;
    api) cd "$root/oreamo-api" && ./gradlew bootRun --args='--spring.profiles.active=local' ;;
    agent) cd "$root/oreamo-agent" && make run ;;
  esac < /dev/null 2>&1 | keep 2> /dev/null
) &
pid=$!

# Wait until the service listens on the port, or fail with its output if it stops.
until lsof -ti "tcp:$port" -sTCP:LISTEN > /dev/null; do
  if ! kill -0 "$pid" 2> /dev/null; then
    cat "$temp/output" >&2 2> /dev/null || true
    echo "The service stopped before listening on port $port." >&2
    exit 1
  fi
  sleep 1
done
