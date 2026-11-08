---
name: git-commit
description: Use when user requests commit.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Overview

Collects the changes, writes the commit message, and commits them.

### Rules

- Target Only: Analyze only the collected target. Do not refer to the conversation history.
- Script Only: Never change the stage area or commit directly. Use only the scripts below.
- No Authorship: Do not add any Claude authorship line to the commit message.
- Stop On Failure: If a script fails, show its output and stop. Do not fix files, retry, or use `--no-verify`.

### Pipeline

#### 1. Select

- Select the target repositories.

#### 2. Collect

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-target.sh {repository path}
```

- `Target` is `staged` if there are staged changes, otherwise `unstaged`. If it is `none`, stop.

#### 3. Analyze

- Select the matching label of `Labels` for the changes. Only if one label cannot cover all `Target Files`, group the files by label.
- Type: `(type: {type})` of the label description if exists, otherwise the label name.
- Scope: the file name for a single file, the business domain for multiple files of one domain, otherwise none.
- Fill `${CLAUDE_SKILL_DIR}/templates/commit-template.md` in English. Refer to the recent logs of the type only for the message style.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-log.sh {repository path} {type}
```

#### 4. Commit

- Commit each group with its files. For a renamed file, pass both paths.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/commit.sh {repository path} {target} {file}... <<'EOF'
{commit message}
EOF
```
