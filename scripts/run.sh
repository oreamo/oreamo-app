#!/usr/bin/env bash
set -euo pipefail

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"

# Restart the services if they are already running.
bash "$root/scripts/stop.sh" "$@"

# Fail if the ports are still used by others, such as the docker containers.
for service in "$@"; do
  case "$service" in
    web) port=3000 ;;
    api) port=8080 ;;
    agent) port=8000 ;;
  esac

  pid="$(lsof -ti "tcp:$port" -sTCP:LISTEN | head -1 || true)"
  if [ -n "$pid" ]; then
    echo "### $service: port $port is already used by $(basename "$(ps -p "$pid" -o comm=)")" >&2
    exit 1
  fi
done

# Print the processes run by the given process and their descendants.
descendants() {
  for child in $(pgrep -P "$1" || true); do
    echo "$child"
    descendants "$child"
  done
}

# Stop all the services together when the script is stopped.
cleanup() {
  trap - INT TERM EXIT
  kill $(descendants $$) 2> /dev/null || true
  wait
}
trap cleanup INT TERM EXIT

for service in "$@"; do
  echo "### $service: running"

  case "$service" in
    web) (cd "$root/oreamo-web" && pnpm dev) & ;;
    api) (cd "$root/oreamo-api" && ./gradlew bootRun --args='--spring.profiles.active=local') & ;;
    agent) (cd "$root/oreamo-agent" && make run) & ;;
  esac
done

wait
