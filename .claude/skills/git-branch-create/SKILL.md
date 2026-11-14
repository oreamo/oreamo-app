---
name: git-branch-create
description: Use when user requests to create a new branch.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Overview

Creates a new branch from the latest `develop`.

### Rules

- Base Branch: `develop`, unless the user requests another. Pass it as the third argument of the script.
- Branch Name: `{label}/{short-description}`. If the user gives the full branch name, use it as it is.
  - `{label}`: the one label of `Labels` that matches the work.
  - `{short-description}`: the work in short English kebab-case.
- Work: If there are `Changes`, analyze them for the work. If `Changes` is `None`, ask the work with the `AskUserQuestion` tool.
- Script Only: Never switch, pull or create branches directly. Use only the script below.
- Stop On Failure: If the script fails, show its output and stop.

### Pipeline

#### 1. Select

- Select the target repositories.

#### 2. Collect

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-context.sh {repository path}
```

#### 3. Name

- Write the branch name with the collected `Labels` and the work.

#### 4. Create

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/create-branch.sh {repository path} {branch name}
```
