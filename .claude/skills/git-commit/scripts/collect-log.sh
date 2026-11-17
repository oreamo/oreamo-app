#!/usr/bin/env bash
set -euo pipefail

# Usage: collect-log.sh {type}
# Shows the recent 10 commit messages of the given type (e.g. `feat: ...`, `feat(user): ...`).

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

type="$1"

echo "### Recent Logs ($type)"
git log -n 10 -E --grep="^${type}(\([^)]*\))?:" --format='---%n%B'
