---
name: write-pull-request
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

- If there is no difference, tell the user and skip the repository.
- Do not refer to the conversation history or commit history to decide the pull request content.

### Pull Request Generation Rules

- Generate pull request contents for each repository.
- Read `${CLAUDE_SKILL_DIR}/templates/pull-request-template.md`, and fill braces with contents following:
  - Title should summarize the major changes of the pull request. (Do not include commit type)
  - Description should show details about the pull request.
  - Changes should show each change's.
- Do not create a file or request to create a PR. Just show the plain text.
- Do not interpret the Markdown. Wrap each output in a code block with the repository name to prevent Markdown rendering.
- Write a pull request content in Korean.
- Do not add a `Generated with Claude Code` line or any other Claude authorship line to the pull request content.

### After Generation

- After showing all outputs, copy the content (title on the first line, followed by a blank line, then the PR template content) to the clipboard only via the script below, passing the content via heredoc.
- If there are multiple repositories, ask which repository's content to copy with the `AskUserQuestion` tool, with the generated repositories as options.

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/copy-clipboard.sh <<'EOF'
{generated pull request content}
EOF
```
