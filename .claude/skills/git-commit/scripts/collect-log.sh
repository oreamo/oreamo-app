#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

type="$1"

echo "### Recent Logs ($type)"
git log -n 10 -E --grep="^${type}(\([^)]*\))?:" --format='---%n%B'
