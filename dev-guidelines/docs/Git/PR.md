---
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(gh pr create:*)
description: Create a GitHub pull request using gh CLI
---

## Context

- Current git status: !`git status`
- Current branch: !`git branch --show-current`
- Recent commits on current branch: !`git log --oneline main..HEAD`
- Recent commits for context: !`git log --oneline -5`

### Additional user context (may be empty)
$ARGUMENTS

## Your task

Create a GitHub pull request using the `gh pr create` command with the following requirements:

### PR Requirements
- Keep title short and concise
- If working on a specific area (e.g. AI, Payments, etc.), prefix title with area in square brackets: `[Area] Feature description`
- Pass all options to avoid interactive mode
- Use `--title` and `--body` flags
- Prefix the title with the letters "PR: " to indicate it's a pull request

### Description Format
- Start with a concise summary paragraph, OR
- Use bullet points for key changes
- Don't go into excessive depth or detail
- Focus on what was changed and why it's useful

### Example Command Structure
```bash
gh pr create --title "PR: Title here" --body "Description here"
```