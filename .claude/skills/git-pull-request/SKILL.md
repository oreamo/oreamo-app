---
name: git-pull-request
description: Use when user requests to generate a pull request.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Overview

Prepares the branch, writes the pull request, and creates or updates it.

### Rules

- Base Branch: `develop`, unless the user requests another. Pass it to `collect-diff.sh` and `create-pull-request.sh`.
- Diff Only: Write the pull request only from the collected diff. Do not refer to the conversation history.
- No Authorship: Do not add any Claude authorship line to the pull request.
- Script Only: Never run `git push`, `gh pr create` or `gh pr edit` directly. Use only the scripts below.
- Stop On Failure: If a script fails, show its output and stop. Do not retry or force push.

### Pipeline

#### 1. Prepare

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-status.sh
```

- If there are `Uncommitted Changes`, ask `Commit` or `Ignore` with the `AskUserQuestion` tool. Commit them for `Commit`.
- Update the source with the latest `origin/develop`.

#### 2. Analyze

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-diff.sh
```

- If there is no difference or `Assignee` is `None`, stop.
- Fill `${CLAUDE_SKILL_DIR}/templates/pull-request-template.md` in Korean. Do not include the commit type in the title.
- Select every matching label of `Labels`.

#### 3. Pull Request

- If `Unpushed Commits` is not `0`, push.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/push-branch.sh
```

- If `Existing Pull Request` is `None`, create. Otherwise, update only if the title, body, assignee or labels differ. Labels are comma-separated, and the body starts from `# Pull Request`.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/create-pull-request.sh {base branch} "{title}" {assignee} "{labels}" <<'EOF'
{body}
EOF
bash ${CLAUDE_SKILL_DIR}/scripts/update-pull-request.sh {number} "{title}" {assignee} "{labels}" <<'EOF'
{body}
EOF
```
