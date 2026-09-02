---
title: PR Command
sidebar_position: 2
description: Create a GitHub pull request using gh CLI with proper title and description format
---

## Context
- Current git status: !`git status`
- Current branch: !`git branch --show-current`
- Recent commits on current branch: !`git log --oneline main..HEAD`
- Recent commits for context: !`git log --oneline -5`

## Your task
Create a GitHub pull request using the `gh pr create` command with the following requirements:

### Title format
- Keep title short and concise
- If working on a specific area (e.g. AI, Payments, etc.), prefix title with the area in square brackets: `[Area] Title`
- Prefix the title with the letters "PR: " to indicate it's a pull request
- Use imperative mood for the title (e.g., "Add feature X" instead of "Added feature X")
- At most 150 characters for the title
- Pass all options to avoid interactive mode
- Use `--title` and `--body` flags

### Body format
- Start with a concise Summary paragraph - 2-3 sentences max
- Focus on what was changed and why it's useful
- Continue with a Key Changes section that lists the main changes made in the pull request
    - Use bullet points for key changes
    - Don't go into excessive depth or detail

### Example Command Structure
```bash
gh pr create --title "PR: Title here" --body "Description here"
```

### Structure of the body:
``` 
# Summary:
- Brief summary of the changes made and their purpose

# Key Changes:
- Bullet point 1: Description of the first key change
- Bullet point 2: Description of the second key change
- Bullet point 3: Description of the third key change
```