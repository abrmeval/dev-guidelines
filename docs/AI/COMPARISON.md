---
title: Provider Comparison
description: Side-by-side comparison of skills, agents, commands, and tool models across OpenCode, Claude Code, and GitHub Copilot
sidebar_position: 5
---

# Provider Comparison

This document compares how OpenCode, Claude Code, and GitHub Copilot implement the four core AI extension primitives: skills, agents, commands, and tools.

Use this as a quick reference when authoring configurations that need to work across providers, or when migrating from one tool to another.

---

## Overview

| Feature | OpenCode | Claude Code | GitHub Copilot |
|---|---|---|---|
| Instruction file | `AGENTS.md` | `AGENTS.md` + `CLAUDE.md` | `AGENTS.md` + `.github/copilot-instructions.md` |
| Skills | `.opencode/skills/` or `.agents/skills/` | `.claude/skills/` | Not natively supported |
| Agents | `.opencode/agents/` | `.claude/agents/` | `.github/agents/` or `.agents/agents/` |
| Commands | `.opencode/commands/` | `.claude/commands/` | `.github/prompts/` (preview) |
| Hooks | Not supported | `.claude/settings.json` hooks | Not supported |
| Config file | `opencode.json` | `.claude/settings.json` | `.vscode/settings.json` |
| Tool model | Permission-based (`allow`/`ask`/`deny`) | Allowlist + disallowedTools | Allowlist only |
| Model format | `provider/model-id` | Short name or full ID | Display name |

---

## Skills

### Supported Paths

| Path | OpenCode | Claude Code | GitHub Copilot |
|---|---|---|---|
| `.opencode/skills/<n>/SKILL.md` | Yes | No | No |
| `.agents/skills/<n>/SKILL.md` | Yes | Yes (partial) | No |
| `.claude/skills/<n>/SKILL.md` | Yes (fallback) | Yes (canonical) | No |
| `~/.config/opencode/skills/` | Yes | No | No |
| `~/.claude/skills/` | Yes (fallback) | Yes | No |

### Frontmatter Fields

| Field | OpenCode | Claude Code | Copilot |
|---|---|---|---|
| `name` | Required | Optional | N/A |
| `description` | Required | Recommended | N/A |
| `license` | Supported | Supported | N/A |
| `compatibility` | Supported | Supported | N/A |
| `metadata` | Supported | Not recognized | N/A |
| `when_to_use` | Ignored | Supported | N/A |
| `argument-hint` | Ignored | Supported | N/A |
| `arguments` | Ignored | Supported | N/A |
| `allowed-tools` | Ignored | Supported | N/A |
| `model` | Ignored | Supported | N/A |
| `effort` | Ignored | Supported | N/A |
| `context` | Ignored | Supported | N/A |
| `agent` | Ignored | Supported | N/A |
| `hooks` | Ignored | Supported | N/A |
| `paths` | Ignored | Supported | N/A |
| `shell` | Ignored | Supported | N/A |
| `disable-model-invocation` | Ignored | Supported | N/A |
| `user-invocable` | Ignored | Supported | N/A |

**Key difference**: OpenCode has a minimal frontmatter surface (`name`, `description`, `license`, `compatibility`, `metadata`). Claude Code has the most extensive skill configuration. Copilot has no native skill loading.

---

## Agents

### Discovery Paths

| Path | OpenCode | Claude Code | Copilot |
|---|---|---|---|
| `.opencode/agents/<n>.md` | Yes (canonical) | No | No |
| `.claude/agents/<n>.md` | No | Yes (canonical) | No |
| `.agents/agents/<n>.md` | No | No | Partial |
| `.github/agents/<n>.md` | No | No | Yes |
| `~/.config/opencode/agents/` | Yes | No | No |
| `~/.claude/agents/` | No | Yes | No |

### Frontmatter Fields

| Field | OpenCode | Claude Code | Copilot |
|---|---|---|---|
| `description` | Required | Required | Required |
| `mode` | `primary`/`subagent`/`all` | N/A (always subagent) | N/A |
| `model` | `provider/model-id` | short name or full ID | display name |
| `temperature` | Supported | Not in frontmatter | Not supported |
| `top_p` | Supported | Not in frontmatter | Not supported |
| `steps` | Supported (`steps`) | `maxTurns` | Not supported |
| `permission` | Permission map | N/A | N/A |
| `tools` | Deprecated (use `permission`) | Allowlist array | Allowlist array |
| `disallowedTools` | N/A | Supported | Not supported |
| `hidden` | Supported | N/A | N/A |
| `disable` | Supported | N/A | N/A |
| `color` | Hex or theme key | Named colors | Not supported |
| `skills` | N/A | Inject skills at startup | N/A |
| `mcpServers` | N/A | Supported | Via VS Code settings |
| `hooks` | N/A | Supported | N/A |
| `memory` | N/A | `user`/`project`/`local` | N/A |
| `background` | N/A | Supported | N/A |
| `effort` | N/A | Supported | N/A |
| `isolation` | N/A | `worktree` | N/A |
| `initialPrompt` | N/A | Supported | N/A |
| `permissionMode` | N/A | Supported | N/A |
| `name` | Not used (filename = name) | Required | Required |

**Key difference**: OpenCode uses a `permission` map with `allow`/`ask`/`deny`. Claude Code and Copilot use tool allowlists. Claude Code has the richest agent configuration.

### Model ID Format

| Format | OpenCode | Claude Code | Copilot |
|---|---|---|---|
| `provider/model-id` | Yes (`anthropic/claude-sonnet-4-5`) | Partial (also accepts short names) | No |
| Short name | No | Yes (`sonnet`, `opus`, `haiku`) | No |
| Display name | No | No | Yes (`GPT-4.1 (copilot)`) |

---

## Commands

### Discovery Paths

| Path | OpenCode | Claude Code | Copilot |
|---|---|---|---|
| `.opencode/commands/<n>.md` | Yes (canonical) | No | No |
| `.agents/commands/<n>.md` | No | No | No |
| `.claude/commands/<n>.md` | No | Yes | No |
| `.github/prompts/<n>.prompt.md` | No | No | Yes (preview) |
| `~/.config/opencode/commands/` | Yes | No | No |
| `~/.claude/commands/` | No | Yes | No |

### Frontmatter Fields

| Field | OpenCode | Claude Code | Copilot Prompts |
|---|---|---|---|
| `description` | Required | Supported | Supported |
| `model` | `provider/model-id` | Short name or ID | N/A |
| `agent` | Agent name | N/A | N/A |
| `subtask` | Supported | N/A | N/A |
| `argument-hint` | Not supported | Supported | N/A |
| `allowed-tools` | Not supported | Supported | N/A |

### Prompt Features

| Feature | OpenCode | Claude Code | Copilot |
|---|---|---|---|
| `$ARGUMENTS` | Supported | Supported | Not supported |
| `$1`, `$2`… | Supported | Supported | Not supported |
| `!`backtick`cmd`backtick (shell injection) | Supported | Supported | Not supported |
| `@file` reference | Supported | Supported | Via `#file` |
| Invoked via | `/command-name` | `/command-name` | `#filename` or chat |

---

## Tools and Permissions

### Permission Model

| Capability | OpenCode | Claude Code | Copilot |
|---|---|---|---|
| Tool access model | Permission map | Allowlist + denylist | Allowlist |
| `allow` (no prompt) | Yes | Implicit (in list) | Implicit (in list) |
| `ask` (prompt user) | Yes | Not available | Not available |
| `deny` (block) | Yes | `disallowedTools` | Omit from list |
| Per-command bash patterns | Yes | No | No |
| Global permission defaults | `opencode.json` | `settings.json` | Not available |
| Per-agent overrides | Yes | Partial | No |

### Hooks

| Hook Event | OpenCode | Claude Code | Copilot |
|---|---|---|---|
| Pre-tool execution | Not supported | `PreToolUse` | Not supported |
| Post-tool execution | Not supported | `PostToolUse` | Not supported |
| User input needed | Not supported | `Notification` | Not supported |
| Session end | Not supported | `Stop` | Not supported |

---

## Cross-Tool Compatibility

### What Works Everywhere

These patterns are recognized by all three providers:

- `AGENTS.md` in the project root
- `.agents/skills/<name>/SKILL.md` (OpenCode and Claude read this path)
- Basic `name` and `description` in skill frontmatter
- `$ARGUMENTS` in command/prompt bodies

### What Requires Per-Tool Configuration

| Concern | Recommendation |
|---|---|
| Agents | Maintain separate files per provider (`.opencode/agents/`, `.claude/agents/`, `.github/agents/`) |
| Commands | Maintain separate files per provider (`.opencode/commands/`, `.claude/commands/`) |
| Skills | Author in `.agents/skills/` with minimal frontmatter; add provider-specific files for advanced features |
| Model references | Use provider format — never mix formats across configs |

### Recommended Dual-Config Layout

For projects using both OpenCode and Claude Code:

```
<project-root>/
├── AGENTS.md                           # Universal — all providers
├── opencode.json                       # OpenCode config
├── .opencode/
│   ├── agents/                         # OpenCode agents
│   └── commands/                       # OpenCode commands
├── .claude/
│   ├── agents/                         # Claude agents
│   ├── commands/                       # Claude commands
│   └── skills/                         # Claude-specific skills
├── .agents/
│   └── skills/                         # Shared skills (both OpenCode + Claude)
└── .github/
    └── copilot-instructions.md         # Copilot workspace context
```

---

## Migration Guide

### From Claude Code to OpenCode

| Claude Code | OpenCode Equivalent |
|---|---|
| `.claude/agents/<n>.md` | `.opencode/agents/<n>.md` |
| `.claude/commands/<n>.md` | `.opencode/commands/<n>.md` |
| `tools: [Read, Edit]` | `permission: { read: allow, edit: allow }` |
| `model: sonnet` | `model: anthropic/claude-sonnet-4-5` |
| `name:` in agent | Remove — filename is the name |

### From Copilot to OpenCode

| Copilot | OpenCode Equivalent |
|---|---|
| `.agents/agents/<n>.md` | `.opencode/agents/<n>.md` |
| `tools: ['Read', 'Edit']` | `permission: { read: allow, edit: allow }` |
| `model: GPT-4.1 (copilot)` | `model: openai/gpt-4.1` |
| No skills system | `.agents/skills/<n>/SKILL.md` |
| No `/commands` | `.opencode/commands/<n>.md` |

---

## References

- `docs/AI/AGENT_STANDARD.md`
- `docs/AI/OPENCODE.md`
- `docs/AI/CLAUDE.md`
- `docs/AI/COPILOT.md`
- [OpenCode Docs](https://opencode.ai/docs)
- [Claude Code Docs](https://docs.anthropic.com/claude/docs)
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)

*Last Updated: 08 May 2026*
