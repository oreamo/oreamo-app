---
name: git-branch-clean
description: Use when user requests to clean up the current branch after its pull request is merged.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Overview

Switches to the latest `develop`, and deletes the current branch from the local and the remote.

### Rules

- Base Branch: `develop`, unless the user requests another. Pass it as the second argument of the script.
- Script Only: Never switch, pull or delete branches directly. Use only the script below.
- Stop On Failure: If the script fails, show its output and stop. Do not force delete with `-D`.

### Pipeline

#### 1. Select

- Select the target repositories.

#### 2. Clean

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/clean-branch.sh {repository path}
```
