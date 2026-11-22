#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

service="$1"

case "$service" in
  web) port=3000 ;;
  api) port=8080 ;;
  agent) port=8000 ;;
esac

phase() {
  if [ -n "${PHASE_FILE:-}" ]; then
    printf '%s' "${1:-}" > "$PHASE_FILE"
  fi
}

if [ -n "$(bash "$root/scripts/find-process.sh" "$service")" ]; then
  phase "Stopping (local)"
fi
bash "$root/scripts/stop.sh" "$service" || [ "$?" -eq 10 ]

if [ "$(docker inspect -f '{{.State.Running}}' "oreamo-$service" 2> /dev/null)" = "true" ]; then
  phase "Removing (docker)"
  if (cd "$root" && docker compose down "$service") > /dev/null 2>&1 && [ -n "${NOTE_FILE:-}" ]; then
    echo "docker removed" > "$NOTE_FILE"
  fi
fi
phase

pid="$(lsof -ti "tcp:$port" -sTCP:LISTEN | head -1 || true)"
if [ -n "$pid" ]; then
  echo "Port $port is already used by $(basename "$(ps -p "$pid" -o comm=)")." >&2
  exit 1
fi

temp="$(mktemp -d)"
trap 'rm -rf "$temp"' EXIT

keep() {
  while IFS= read -r line || [ -n "$line" ]; do
    printf '%s\n' "$line" >> "$temp/output" || true
  done
}

(
  trap '' HUP

  case "$service" in
    web) cd "$root/oreamo-web" && pnpm dev ;;
    api) cd "$root/oreamo-api" && ./gradlew bootRun --args='--spring.profiles.active=local' ;;
    agent) cd "$root/oreamo-agent" && make run ;;
  esac < /dev/null 2>&1 | keep 2> /dev/null
) &
pid=$!

until lsof -ti "tcp:$port" -sTCP:LISTEN > /dev/null; do
  if ! kill -0 "$pid" 2> /dev/null; then
    cat "$temp/output" >&2 2> /dev/null || true
    echo "The service stopped before listening on port $port." >&2
    exit 1
  fi
  sleep 1
done
