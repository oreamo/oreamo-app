---
name: git-commit
description: Use when user requests commit.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Git Target

- Invoke the `git-target-ask` skill first, and use its Git Target as the target repositories.
- Run the steps below for each Git Target repository, one repository at a time.

### Commit Target

- Collect the commit target via the script below with the repository path. Use only this output.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-staged.sh {repository path}
```

- If there is nothing to commit, tell the user and skip the repository.
- If there are staged changes, the commit target is the staged changes only. Otherwise, the commit target is all changes (they are staged by the commit script).
- Do not run `git add`, `git reset`, `git restore`, or any other command that changes the stage area.
- Do not refer to the conversation history to decide the commit target.

### Commit Message Rules

- Determine the commit type from the Commit Target Diff above: `fix`, `feat`, `refactor`, `docs`, `chore`, `style`, `test`, etc.
- After determining the type, read only the template matching the type, and fill it:
  - `fix` → read `${CLAUDE_SKILL_DIR}/templates/bugfix-template.md`
  - `feat` → read `${CLAUDE_SKILL_DIR}/templates/feature-template.md`
  - Other types → read the feature template and use the same shape, with `feat` replaced by the actual type (e.g. `refactor: {message}`).
- `{message}` should be a concise, single-line summary of the change, written in English.
- For the bugfix template, fill `Issue` / `Cause` / `Solve` based only on what the diff actually shows. Do not fabricate details that aren't evidenced by the change.
- Do not interpret the Markdown. Wrap the generated commit message in a code block with the repository name when showing it to the user.

### Commit Execution Rules

- Commit only via the script below with the repository path, passing the generated message via heredoc. Never run `git commit` directly.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/commit.sh {repository path} <<'EOF'
{generated commit message}
EOF
```

- If the commit script fails (e.g. a hook fails), show its output to the user and stop all remaining repositories. Do not fix files, retry, use `--no-verify`, or change the stage area.
- Do not add a `Co-Authored-By: Claude` trailer or any other Claude authorship line to the commit message.
- Always create a new commit. Never amend an existing commit unless explicitly requested.
- One user request creates exactly one commit per Git Target repository.

### Result

- After all repositories are done, show the result of each Git Target repository: committed (with the commit hash), skipped, or failed.
