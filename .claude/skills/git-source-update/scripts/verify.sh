#!/usr/bin/env bash
set -euo pipefail

# Usage: verify.sh {repository path}
# Runs the compile, build, test, format and lint checks of the repository.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

# Check commands of each repository.
case "$(basename "$(pwd)")" in
  oreamo-web)
    commands=("pnpm lint" "pnpm format:check" "pnpm build")
    ;;
  oreamo-api)
    commands=("./gradlew spotlessCheck build")
    ;;
  oreamo-agent)
    commands=("make check")
    ;;
  *)
    commands=()
    ;;
esac

echo "### Repository"
pwd
echo

if [ "${#commands[@]}" -eq 0 ]; then
  echo "### Result"
  echo "skipped (no check commands)"
  exit 0
fi

log="$(mktemp)"
trap 'rm -f "$log"' EXIT

failed="false"
for command in "${commands[@]}"; do
  echo "### $command"
  if bash -c "$command" >"$log" 2>&1; then
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

echo "### Result"
if [ "$failed" = "true" ]; then
  echo "failed"
else
  echo "passed"
fi
