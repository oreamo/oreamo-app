---
name: git-conflict-resolve
description: Use when user requests to resolve merge conflicts, or when merge conflicts occur.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Overview

Analyzes the merge conflicts, resolves them, and completes the merge commit.

### Rules

- Certain Only: Resolve automatically only when the result is certain. Otherwise, ask the user.
- Script Only: Never run `git add`, `git commit` or `git merge` directly. Use only the scripts below.
- Stop On Failure: If a script fails, show its output and stop.

### Pipeline

#### 1. Collect

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-conflicts.sh {repository path}
```

- If `Merge` is `None`, stop.

#### 2. Resolve

- Resolve the certain conflicts by editing the files.
- Ask the others with the `AskUserQuestion` tool, showing the code and intent of both sides. Options: `Ours`, `Theirs`, `Combine`, `Abort merge`.
- If `Abort merge` is selected, abort and stop.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/abort-merge.sh {repository path}
```

#### 3. Commit

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/mark-resolved.sh {repository path} {file}...
bash ${CLAUDE_SKILL_DIR}/scripts/finish-merge.sh {repository path}
```
