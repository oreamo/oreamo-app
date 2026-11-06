#!/usr/bin/env bash
set -euo pipefail

# Move to the target repository (default: current directory).
cd "${1:-.}"
cd "$(git rev-parse --show-toplevel)"

# Stage all changes only when the stage area is empty.
if git diff --cached --quiet; then
  git add .
fi

# Commit staged changes only, reading the commit message from stdin.
git commit -F -
