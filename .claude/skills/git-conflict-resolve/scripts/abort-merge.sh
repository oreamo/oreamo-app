#!/usr/bin/env bash
set -euo pipefail

# Usage: abort-merge.sh
# Aborts the ongoing merge and restores the state before the merge.

# Move to the repository root.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

git merge --abort
