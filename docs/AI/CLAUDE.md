---
title: Claude Code
description: Skills, agents, commands, hooks, and tool configuration for Claude Code
sidebar_position: 3
---

# Claude Code

Claude Code is Anthropic's terminal-native AI coding assistant. It uses `.claude/` as the primary configuration directory and has the richest set of skill and agent frontmatter options across providers. This document covers Claude-specific configuration.

---

## Configuration Files

| File | Purpose |
|---|---|
| `CLAUDE.md` | Claude-specific instruction file (alternative to `AGENTS.md`) |
| `AGENTS.md` | Universal instruction file, also loaded by Claude |
| `.claude/settings.json` | Project-level settings (tools, hooks, model) |
| `~/.claude/settings.json` | Global user settings |

Claude loads both `AGENTS.md` and `CLAUDE.md` if both are present, giving `CLAUDE.md` precedence for Claude-specific overrides.

---

## Skills

Claude Code invented the skills pattern. Skills live in `.claude/skills/` and are the canonical path for Claude-targeted skills.

### Discovery Paths

```
.claude/skills/<name>/SKILL.md       # project-local (canonical for Claude)
.agents/skills/<name>/SKILL.md       # cross-tool compatible
~/.claude/skills/<name>/SKILL.md     # global
```

### Supported Frontmatter Fields

Claude supports the most frontmatter fields of any provider:

| Field | Required | Description |
|---|---|---|
| `name` | No | Display name; defaults to directory name. Lowercase, hyphens, max 64 chars. |
| `description` | Recommended | When to use the skill. Truncated at 1536 chars in listing. |
| `when_to_use` | No | Extra trigger context. Appended to `description`. |
| `argument-hint` | No | Autocomplete hint, e.g. `[issue-number]` or `[filename] [format]` |
| `arguments` | No | Named positional argument list for `$name` substitution |
| `disable-model-invocation` | No | `true` prevents automatic loading; manual `/name` only |
| `user-invocable` | No | `false` hides from `/` menu |
| `allowed-tools` | No | Tools allowed without prompting when skill is active |
| `model` | No | Model override for the skill's duration |
| `effort` | No | `low`, `medium`, `high`, `xhigh`, `max` |
| `context` | No | `fork` to run in a forked subagent context |
| `agent` | No | Which subagent type to use when `context: fork` |
| `hooks` | No | Lifecycle hooks scoped to this skill |
| `paths` | No | Glob patterns; skill auto-activates only for matching files |
| `shell` | No | `bash` (default) or `powershell` |
| `license` | No | License identifier |
| `compatibility` | No | Platform target |

### Example

```markdown
---
name: accessibility
description: |
  Audit and improve web accessibility following WCAG 2.2 guidelines.
  Use when asked to improve accessibility, a11y audit, or WCAG compliance.
allowed-tools: Read Grep WebFetch
paths: "**/*.tsx,**/*.vue,**/*.html"
compatibility: opencode
---

## Audit Checklist
...
```

---

## Agents (Subagents)

Claude subagents live in `.claude/agents/` and are invoked via `@agent-name` or automatically by Claude when the task matches the description.

### Discovery Paths

```
.claude/agents/<name>.md       # project-local
~/.claude/agents/<name>.md     # global
```

### Supported Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Unique identifier, lowercase with hyphens |
| `description` | Yes | When Claude should delegate to this subagent |
| `tools` | No | Allowed tools list. Inherits all if omitted. |
| `disallowedTools` | No | Tools to remove from the inherited or specified list |
| `model` | No | `sonnet`, `opus`, `haiku`, a full model ID, or `inherit` |
| `permissionMode` | No | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | Max agentic iterations |
| `skills` | No | Skills to inject into this subagent at startup |
| `mcpServers` | No | MCP servers available to this subagent |
| `hooks` | No | Lifecycle hooks scoped to this subagent |
| `memory` | No | `user`, `project`, or `local` for cross-session persistence |
| `background` | No | `true` to always run as a background task |
| `effort` | No | `low`, `medium`, `high`, `xhigh`, `max` |
| `isolation` | No | `worktree` runs in a temporary isolated git worktree |
| `color` | No | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |
| `initialPrompt` | No | Auto-submitted as first user turn when agent starts |

### Example

```markdown
---
name: sprint-planner
description: |
  Use this agent when the user asks to create, plan, or organize a sprint.
  Trigger phrases: "create a sprint plan", "plan the next sprint", "set up a sprint"
tools: Read, Edit, Write, Glob
model: claude-sonnet-4-5
---

You are an expert Agile sprint planner...
```

---

## Commands

Claude commands live in `.claude/commands/`. They are equivalent to skills — a file at `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` create identical `/deploy` commands.

### Discovery Paths

```
.claude/commands/<name>.md       # project-local
~/.claude/commands/<name>.md     # global
```

### Frontmatter Fields

Commands inherit all skill frontmatter fields. The most relevant:

| Field | Description |
|---|---|
| `description` | Shown in the `/` command palette |
| `argument-hint` | Autocomplete hint for arguments |
| `allowed-tools` | Tools allowed without prompting |
| `model` | Model override |
| `disable-model-invocation` | `true` = user-only invocation, not auto-loaded |

### Prompt Syntax

| Syntax | Effect |
|---|---|
| `$ARGUMENTS` | All arguments after the command name |
| `$1`, `$2`… | Positional arguments |
| `!`backtick`command`backtick | Shell output injected at runtime |
| `@path/to/file` | File content injected |

---

## Hooks

Hooks execute shell commands at specific lifecycle points in Claude Code. They provide deterministic control independent of the LLM.

### Configuration

Add hooks to `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'About to run bash'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bun run typecheck"
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude needs input\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### Hook Events

| Event | Fires When |
|---|---|
| `PreToolUse` | Before any tool call |
| `PostToolUse` | After any tool call |
| `Notification` | Claude needs user input |
| `Stop` | Claude finishes responding |

---

## Tools

Claude Code tool access is configured via `settings.json` or subagent frontmatter.

### Global Tool Settings

```json
{
  "tools": {
    "allowedTools": ["Read", "Glob", "Grep", "Edit", "Write", "Bash"],
    "disallowedTools": ["WebFetch"]
  }
}
```

### Subagent Tool Restriction

```yaml
---
name: readonly-reviewer
tools: Read, Glob, Grep
disallowedTools: Write, Edit, Bash
---
```

---

## Project Layout

```
<project-root>/
├── AGENTS.md
├── CLAUDE.md                        # Claude-specific overrides
└── .claude/
    ├── settings.json
    ├── agents/
    │   ├── sprint-planner.md
    │   └── sprint-executor.md
    ├── commands/
    │   ├── commit.md
    │   ├── pr.md
    │   └── role.md
    └── skills/
        ├── accessibility/SKILL.md
        └── web-search/SKILL.md
```

---

## References

- [Claude Code Documentation](https://docs.anthropic.com/claude/docs)
- [Claude Code Skills](https://docs.anthropic.com/claude/docs/skills)
- [Claude Code Hooks](https://docs.anthropic.com/claude/docs/hooks)
- `docs/AI/AGENT_STANDARD.md`
- `docs/AI/COMPARISON.md`

*Last Updated: 08 May 2026*
