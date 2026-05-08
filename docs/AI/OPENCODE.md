---
title: OpenCode
description: Skills, agents, commands, and tool configuration for the OpenCode AI coding assistant
sidebar_position: 2
---

# OpenCode

OpenCode is an open-source, terminal-native AI coding assistant. It uses a session-based TUI (terminal UI) and supports multiple LLM providers. This document covers OpenCode-specific configuration for skills, agents, commands, and tools.

---

## Configuration File

OpenCode reads `opencode.json` in the project root. Always include the schema for editor validation:

```json
{
  "$schema": "https://opencode.ai/config.json"
}
```

Global config lives at `~/.config/opencode/config.json`.

---

## Skills

OpenCode discovers skills by walking up from the working directory to the git root and loading any `SKILL.md` files found in:

```
.opencode/skills/<name>/SKILL.md     # project-local (preferred)
.agents/skills/<name>/SKILL.md       # cross-tool compatible
.claude/skills/<name>/SKILL.md       # Claude-compatible fallback
~/.config/opencode/skills/<name>/    # global
~/.agents/skills/<name>/             # global cross-tool
```

### Supported Frontmatter Fields

OpenCode only recognizes these fields — all others are silently ignored:

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Lowercase alphanumeric with hyphens. Must match directory name. Max 64 chars. |
| `description` | Yes | When and why to use the skill. Max 1024 chars. |
| `license` | No | License identifier (e.g. `MIT`, `Apache-2.0`) |
| `compatibility` | No | Set to `opencode` to signal OpenCode support |
| `metadata` | No | Arbitrary string key-value pairs |

### Example

```markdown
---
name: seo
description: Optimize for search engine visibility. Use when asked to improve SEO, fix meta tags, or add structured data.
license: MIT
compatibility: opencode
---

## What I do
Audit and improve SEO following Google Search guidelines...
```

### Permissions

Control skill access in `opencode.json`:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "experimental-*": "ask",
      "internal-*": "deny"
    }
  }
}
```

### Troubleshooting

If a skill is not loading:
1. Verify `SKILL.md` is spelled in all caps
2. Confirm `name` and `description` are present in frontmatter
3. Check the skill name matches the directory name exactly
4. Check that no `deny` permission is blocking it

---

## Agents

OpenCode loads custom agents from:

```
.opencode/agents/<name>.md     # project-local (preferred)
~/.config/opencode/agents/     # global
```

The filename (without `.md`) becomes the agent name and `@mention` handle.

### Supported Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `description` | Yes | When to invoke this agent. Include trigger phrases and examples. |
| `mode` | No | `primary`, `subagent`, or `all`. Default: `all` |
| `model` | No | `provider/model-id` format, e.g. `anthropic/claude-sonnet-4-5` |
| `temperature` | No | 0.0–1.0 |
| `top_p` | No | 0.0–1.0 |
| `steps` | No | Max agentic iterations |
| `permission` | No | Tool permission map (see below) |
| `hidden` | No | `true` to hide from `@` autocomplete. Subagents only. |
| `disable` | No | `true` to disable the agent entirely |
| `color` | No | Hex color or theme key: `primary`, `accent`, `error`, etc. |

### Permission Map

```yaml
permission:
  read: allow
  edit: allow
  glob: allow
  grep: allow
  bash:
    "*": ask
    "find *": allow
    "ls *": allow
    "git status": allow
  task:
    "*": deny
    "sprint-*": allow
  skill: allow
  webfetch: deny
```

### Agent Modes

| Mode | Behavior |
|---|---|
| `primary` | Selectable in TUI with Tab; handles main conversation |
| `subagent` | Invoked by other agents via Task tool or `@mention` |
| `all` | Can be used as either (default) |

### Example

```markdown
---
description: |
  Use this agent when the user asks to review code for quality and security.
  Trigger phrases: "review this", "check my code", "code review"
mode: subagent
model: anthropic/claude-sonnet-4-5
permission:
  edit: deny
  bash: deny
  read: allow
  glob: allow
  grep: allow
---

You are a code reviewer. Focus on security, performance, and maintainability.
Provide specific, actionable feedback without making direct changes.
```

---

## Commands

OpenCode loads commands from:

```
.opencode/commands/<name>.md     # project-local (preferred)
~/.config/opencode/commands/     # global
```

Invoke with `/command-name` in the TUI. The filename becomes the command name.

### Supported Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `description` | Yes | Shown in the command palette |
| `model` | No | `provider/model-id` override for this command |
| `agent` | No | Which agent to run the command with |
| `subtask` | No | `true` to force subagent execution |

### Prompt Syntax

| Syntax | Effect |
|---|---|
| `$ARGUMENTS` | Full argument string passed after the command name |
| `$1`, `$2`, `$3` | Positional arguments |
| `!`backtick`command`backtick | Injects shell output at runtime |
| `@path/to/file` | Injects file content |

### Example

```markdown
---
description: Create a conventional commit and push to the current branch
---

Current status: !`git status`
Current diff:   !`git diff HEAD`
Branch:         !`git branch --show-current`

Create a single commit following Conventional Commits. Push when done.
```

---

## Tools and Permissions

### Built-in Permission Keys

| Key | Controls |
|---|---|
| `read` | `read` |
| `edit` | `write`, `edit`, `apply_patch` |
| `glob` | `glob` |
| `grep` | `grep` |
| `list` | `list` |
| `bash` | `bash` (supports per-command glob patterns) |
| `task` | `task` (spawning subagents) |
| `skill` | `skill` |
| `webfetch` | `webfetch` |
| `websearch` | `websearch` |
| `lsp` | Language server protocol tools |
| `todowrite` | `todowrite`, `todoread` |
| `question` | `question` |
| `external_directory` | Any tool reading/writing outside the project root |

### Global Defaults

Set defaults in `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask",
    "bash": "ask",
    "webfetch": "allow"
  }
}
```

### Per-Agent Overrides

```json
{
  "agent": {
    "build": {
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "git status": "allow"
        }
      }
    }
  }
}
```

---

## Project Layout

Canonical layout for OpenCode configuration in this project:

```
<project-root>/
├── AGENTS.md                          # Universal agent instructions
├── opencode.json                      # OpenCode config
├── .opencode/
│   ├── agents/
│   │   ├── sprint-planner.md
│   │   └── sprint-executor.md
│   └── commands/
│       ├── commit.md
│       ├── pr.md
│       └── role.md
└── .agents/
    └── skills/
        ├── accessibility/SKILL.md
        ├── frontend-design/SKILL.md
        ├── project-analizer/SKILL.md
        ├── seo/SKILL.md
        └── web-search/SKILL.md
```

---

## References

- [OpenCode Docs — Skills](https://opencode.ai/docs/skills)
- [OpenCode Docs — Agents](https://opencode.ai/docs/agents)
- [OpenCode Docs — Commands](https://opencode.ai/docs/commands)
- [OpenCode Docs — Permissions](https://opencode.ai/docs/permissions)
- `docs/AI/AGENT_STANDARD.md`
- `docs/AI/COMPARISON.md`

*Last Updated: 08 May 2026*
