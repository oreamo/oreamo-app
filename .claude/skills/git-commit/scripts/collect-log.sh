#!/usr/bin/env bash
set -euo pipefail

# Usage: collect-log.sh {repository path} {type}
# Shows the recent 10 commit messages of the given type (e.g. `feat: ...`, `feat(user): ...`).

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

type="$2"

echo "### Recent Logs ($type)"
git log -n 10 -E --grep="^${type}(\([^)]*\))?:" --format='---%n%B'
