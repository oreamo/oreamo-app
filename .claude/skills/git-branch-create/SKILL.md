---
name: git-branch-create
description: Use when user requests to create a new branch, or to rename the current branch.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Overview

Creates a new branch from the latest `develop`, or renames the current branch by its commit logs.

### Rules

- Mode: `Create` if the user requests a new branch, `Rename` if the user requests to change the name of the current branch.
- Base Branch: `develop`, unless the user requests another. Pass it as the last argument of the scripts.
- Branch Name: `{label}/{short-description}`. If the user gives the full branch name, use it as it is.
  - `{label}`: the one label of `Labels` that matches the work.
  - `{short-description}`: the work in short English kebab-case.
- Work
  - `Create`: If there are `Changes`, analyze them for the work. If `Changes` is `None`, ask the work with the `AskUserQuestion` tool.
  - `Rename`: Analyze the `Commits` for the work. If `Commits` is `None` or there is an `Existing Pull Request`, stop.
- Script Only: Never switch, pull, create or rename branches directly. Use only the scripts below.
- Stop On Failure: If a script fails, show its output and stop.

### Pipeline

#### 1. Select

- Select the target repositories.

#### 2. Collect

- `Create`

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-context.sh {repository path}
```

- `Rename`

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-history.sh {repository path}
```

#### 3. Name

- Write the branch name with the collected `Labels` and the work.

#### 4. Apply

- `Create`

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/create-branch.sh {repository path} {branch name}
```

- `Rename`: Renames the remote branch too if it exists.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/rename-branch.sh {repository path} {branch name}
```
