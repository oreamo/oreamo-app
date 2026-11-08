---
name: git-select-repository
description: Use before any git related skill or task to select the target repositories of the git workflow.
user-invocable: false
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Overview

Selects the target repositories (Git Target) of a git workflow, which lasts from the user's git request until it is completed.

### Rules

- Once Per Workflow: Ask only once per git workflow. Reuse the selected Git Target in every git skill afterwards.
- Target Only: Run git operations only on the Git Target repositories, in the order of `Application`, `Frontend`, `Backend`, `Agent`.
- Additional Question: Ask the other questions of the git workflow (e.g. the level of the git work) in the same `AskUserQuestion` call.

### Pipeline

#### 1. Collect

```
!`bash ${CLAUDE_SKILL_DIR}/scripts/list-repositories.sh`
```

#### 2. Ask

- Ask with the `AskUserQuestion` tool: header `Repository`, `multiSelect: true`, options `Application`, `Frontend`, `Backend`, `Agent` with the description `{branch}, {changes} changes`.

#### 3. Result

```
### Git Target
- {Repository}: {Path}
```
