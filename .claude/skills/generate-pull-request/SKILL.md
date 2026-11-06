---
name: generate-pull-request
description: Use when user requests to generate a pull request.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/scripts/*)
---

### Git Target

- Invoke the `git-target-ask` skill first, and use its Git Target as the target repositories.
- Run the steps below for each Git Target repository, one repository at a time.

### Pull Request Target

- Collect the pull request target via the script below with the repository path. Use only this output.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-diff.sh {repository path}
```

- The target is the difference between the remote `develop` branch and the current branch of the repository.
- If the user requests a different base branch, pass that branch as the second argument.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect-diff.sh {repository path} {base branch}
```

- If the head branch is the same as the base branch, tell the user and skip the repository.
- If there is no difference, tell the user and skip the repository.
- Do not refer to the conversation history or commit history to decide the pull request content.

### Pull Request Generation Rules

- Generate pull request contents for each repository.
- Read `${CLAUDE_SKILL_DIR}/templates/pull-request-template.md`, and fill braces with contents following:
  - Title should summarize the major changes of the pull request. (Do not include commit type)
  - Description should show details about the pull request.
  - Changes should show each change's.
- Do not interpret the Markdown. Wrap each output in a code block with the repository name to prevent Markdown rendering.
- Write a pull request content in Korean.
- Do not add a `Generated with Claude Code` line or any other Claude authorship line to the pull request content.

### Pull Request Creation Rules

- After showing all outputs, ask which repositories to create the pull request for with the `AskUserQuestion` tool, using `multiSelect: true` and the generated repositories as options. Each option description shows `{head} → {base}`.
- If no repository is selected, do not create any pull request.
- For each selected repository, create the pull request only via the script below. Pass the title as an argument, and the content without the title line (starting from `# Pull Request`) via heredoc.
- The script pushes the current branch to `origin` and creates the pull request with `gh`.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/create-pull-request.sh {repository path} {base branch} "{title}" <<'EOF'
{generated pull request content without the title line}
EOF
```

- If the script fails (e.g. `gh` is not installed or not authenticated, push rejected, pull request already exists), show its output to the user and stop all remaining repositories. Do not retry, force push, or change the branch.
- Never run `git push` or `gh pr create` directly.

### Result

- After all repositories are done, show the result of each repository: created (with the pull request URL), skipped, or failed.
