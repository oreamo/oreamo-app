#!/usr/bin/env bash
set -euo pipefail

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"

mkdir -p "$root/logs"

# Restart the services if they are already running.
bash "$root/scripts/stop.sh" "$@"

for service in "$@"; do
  echo "### $service: running (logs/$service.log)"
  log="$root/logs/$service.log"

  case "$service" in
    web) (cd "$root/oreamo-web" && nohup pnpm dev < /dev/null > "$log" 2>&1 &) ;;
    api) (cd "$root/oreamo-api" && nohup ./gradlew bootRun --args='--spring.profiles.active=local' < /dev/null > "$log" 2>&1 &) ;;
    agent) (cd "$root/oreamo-agent" && nohup make run < /dev/null > "$log" 2>&1 &) ;;
  esac
done
