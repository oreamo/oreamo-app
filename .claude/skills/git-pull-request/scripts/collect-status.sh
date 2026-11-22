#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "### Repository"
pwd
echo

echo "### Uncommitted Changes"
status="$(git status --short)"
echo "${status:-None}"
