#!/usr/bin/env bash
set -euo pipefail

# Usage: collect-status.sh {repository path}
# Collects the uncommitted changes of the repository.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

echo "### Repository"
pwd
echo

echo "### Uncommitted Changes"
status="$(git status --short)"
echo "${status:-None}"
