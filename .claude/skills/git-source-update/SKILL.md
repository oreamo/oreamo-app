---
name: git-source-update
description: Use when user requests to update the current branch with the latest develop branch, or when the source needs to be updated with the latest develop branch.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Overview

Pulls the latest `develop`, checks the errors, and fixes them.

### Rules

- Base Branch: `develop`, unless the user requests another. Pass it as the second argument of the scripts.
- Fix Commands: Fix format and lint errors with the formatter first, then fix the remaining errors by editing the code.
  - Client: `pnpm lint:fix`, `pnpm format`
  - Server: `./gradlew spotlessApply`
  - Agent: `make lint-fix`, `make format`
- Environment Error: If a check fails by the environment (e.g. Docker is not running), do not change the code. Tell the user how to fix it and stop.
- Stop On Failure: If a script fails, show its output and stop.

### Pipeline

#### 1. Check

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/check-update.sh {repository path}
```

- If `Behind` is `0`, stop.

#### 2. Update

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/update.sh {repository path}
```

- If `Result` is `conflict`, resolve the merge conflicts.

#### 3. Verify

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/verify.sh {repository path}
```

- If `Result` is `failed`, fix the errors and verify again until it passes. Then commit the fixes.
