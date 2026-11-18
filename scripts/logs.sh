#!/usr/bin/env bash
set -euo pipefail

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

# Split the services into the ones run directly and the ones run with docker.
files=()
containers=()
for service in "$@"; do
  if [ -n "$(bash scripts/find-process.sh "$service")" ]; then
    files+=("logs/$service.log")
  else
    containers+=("$service")
  fi
done

if [ ${#files[@]} -gt 0 ] && [ ${#containers[@]} -gt 0 ]; then
  # Show both logs together, and stop the file logs when the docker logs are stopped.
  tail -f "${files[@]}" &
  trap "kill $!" EXIT
  docker compose logs -f "${containers[@]}"
elif [ ${#files[@]} -gt 0 ]; then
  tail -f "${files[@]}"
else
  docker compose logs -f "${containers[@]}"
fi
