#!/usr/bin/env bash
set -euo pipefail

# Usage: push-branch.sh {repository path}
# Pushes the current branch to the remote and sets upstream.

# Move to the target repository.
cd "$1"
cd "$(git rev-parse --show-toplevel)"

git push -u origin "$(git branch --show-current)"
