#!/usr/bin/env bash
set -euo pipefail

# Usage: push-branch.sh
# Pushes the current branch to the remote and sets upstream.

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

git push -u origin "$(git branch --show-current)"
