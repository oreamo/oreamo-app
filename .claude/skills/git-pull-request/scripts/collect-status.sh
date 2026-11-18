#!/usr/bin/env bash
set -euo pipefail

# Usage: collect-status.sh
# Collects the uncommitted changes of the repository.

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

echo "### Repository"
pwd
echo

echo "### Uncommitted Changes"
status="$(git status --short)"
echo "${status:-None}"
