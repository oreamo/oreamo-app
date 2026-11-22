#!/usr/bin/env bash
set -euo pipefail

case "$1" in
  web) port=3000 ;;
  api) port=8080 ;;
  agent) port=8000 ;;
esac

for pid in $(lsof -ti "tcp:$port" -sTCP:LISTEN || true); do
  case "$(ps -p "$pid" -o comm= | tr '[:upper:]' '[:lower:]' || true)" in
    *node* | *java* | *python*) echo "$pid" ;;
  esac
done
