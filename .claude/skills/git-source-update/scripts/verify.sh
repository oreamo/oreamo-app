#!/usr/bin/env bash
set -euo pipefail

# Usage: verify.sh {base branch (default: develop)}
# Runs the compile, build, test, format and lint checks of the services changed from the remote base branch.

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

base="${1:-develop}"

echo "### Repository"
pwd
echo

log="$(mktemp)"
trap 'rm -f "$log"' EXIT

checked="false"
failed="false"
for service in oreamo-web oreamo-api oreamo-agent; do
  # Skip the service which has no difference from the remote base branch.
  if git diff --quiet "origin/$base" -- "$service"; then
    continue
  fi

  # Check commands of each service.
  case "$service" in
    oreamo-web)
      commands=("pnpm lint" "pnpm format:check" "pnpm build")
      ;;
    oreamo-api)
      commands=("./gradlew spotlessCheck build")
      ;;
    oreamo-agent)
      commands=("make check")
      ;;
  esac

  checked="true"
  for command in "${commands[@]}"; do
    echo "### $service: $command"
    if (cd "$service" && bash -c "$command") >"$log" 2>&1; then
      echo "passed"
    else
      failed="true"
      echo "failed"
      echo
      # Show only the last lines of the output to keep the error readable.
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
