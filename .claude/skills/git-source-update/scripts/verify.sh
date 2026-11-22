#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

base="${1:-develop}"

echo "### Repository"
pwd
echo

log="$(mktemp)"
trap 'rm -f "$log"' EXIT

checked="false"
failed="false"
for service in oreamo-web oreamo-api oreamo-agent; do
  if git diff --quiet "origin/$base" -- "$service"; then
    continue
  fi

  case "$service" in
    oreamo-web)
      commands=("make lint web" "make format web" "make build web")
      ;;
    oreamo-api)
      commands=("make format api" "make build api")
      ;;
    oreamo-agent)
      commands=("make lint agent" "make format agent" "make build agent")
      ;;
  esac

  checked="true"
  for command in "${commands[@]}"; do
    echo "### $service: $command"
    if bash -c "$command" >"$log" 2>&1; then
      echo "passed"
    else
      failed="true"
      echo "failed"
      echo
      tail -n 100 "$log"
    fi
    echo
  done
done

echo "### Result"
if [ "$checked" = "false" ]; then
  echo "skipped (no changed services)"
elif [ "$failed" = "true" ]; then
  echo "failed"
else
  echo "passed"
fi
