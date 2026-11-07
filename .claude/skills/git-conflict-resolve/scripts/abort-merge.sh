#!/usr/bin/env bash
set -euo pipefail

# Usage: abort-merge.sh {repository path}
# Aborts the ongoing merge and restores the state before the merge.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

git merge --abort
