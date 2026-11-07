---
name: git-select-repository
description: Use before any git related skill or task to ask which repositories are the target.
user-invocable: false
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Repositories

The repositories below are collected by shell, not by the conversation context. Use only this output.

```
!`bash ${CLAUDE_SKILL_DIR}/scripts/list-repositories.sh`
```

### Ask Rules

- Ask the target repositories with the `AskUserQuestion` tool. Always ask, even if the target seems obvious from the current directory or the conversation history.
- Use a single question with `multiSelect: true`, header `Repository`, and the options below in this order:
  - `Workspace`, `Client`, `Server`, `Agent`
  - Each option description shows the branch and the number of changes from the output above (e.g. `develop, 3 changes`).
- Selecting all four options means all repositories.
- Do not add an `All` option. The tool allows at most four options.
- If the user answers with text instead of options, map it to the repositories above (e.g. `all` means all four). If it cannot be mapped, ask again.

### Result

- Show the selected repositories with their paths as the Git Target.

```
### Git Target
- {Repository}: {Path}
```

- The skill or task which invoked this skill must run only on the Git Target repositories, in the order above.
- Never run git operations on a repository which is not in the Git Target.
