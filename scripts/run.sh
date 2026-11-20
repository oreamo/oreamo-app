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

for service in "$@"; do
  echo "### $service: running"

  case "$service" in
    web) (cd "$root/oreamo-web" && nohup pnpm dev < /dev/null > /dev/null 2>&1 &) ;;
    api) (cd "$root/oreamo-api" && nohup ./gradlew bootRun --args='--spring.profiles.active=local' < /dev/null > /dev/null 2>&1 &) ;;
    agent) (cd "$root/oreamo-agent" && nohup make run < /dev/null > /dev/null 2>&1 &) ;;
  esac
done
