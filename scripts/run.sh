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

# Restart the service if it is already running.
bash "$root/scripts/stop.sh" "$service" || [ "$?" -eq 10 ]

# Fail if the port is still used by others, such as the docker containers.
if lsof -ti "tcp:$port" -sTCP:LISTEN > /dev/null; then
  exit 1
fi

case "$service" in
  web) cd "$root/oreamo-web" && nohup pnpm dev < /dev/null > /dev/null 2>&1 & ;;
  api) cd "$root/oreamo-api" && nohup ./gradlew bootRun --args='--spring.profiles.active=local' < /dev/null > /dev/null 2>&1 & ;;
  agent) cd "$root/oreamo-agent" && nohup make run < /dev/null > /dev/null 2>&1 & ;;
esac
pid=$!

# Wait until the service listens on the port, or fail if it stops.
until lsof -ti "tcp:$port" -sTCP:LISTEN > /dev/null; do
  if ! kill -0 "$pid" 2> /dev/null; then
    exit 1
  fi
  sleep 1
done
