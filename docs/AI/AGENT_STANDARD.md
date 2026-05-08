---
title: Agent Standard
description: Provider-agnostic standards for skills, agents, commands, and tools across all AI coding assistants
sidebar_position: 1
---

# Agent Standard

This document defines the provider-agnostic standard for configuring AI coding assistants in projects. It covers the four core extension primitives — **skills**, **agents**, **commands**, and **tools** — describing their purpose, structure, and when to use each.

All provider-specific implementations (OpenCode, Claude, Copilot) derive from this standard. Where providers diverge, their dedicated docs explain the differences.

---

## AGENTS.md

`AGENTS.md` is a project-level instruction file loaded automatically by all major AI coding agents. It is the single most important configuration file in a project for AI interaction.

### Placement

```
<project-root>/
└── AGENTS.md   ← loaded by all agents on every conversation
```

### Required Content

```markdown
# Coding Agent Guidelines

## Purpose
Brief description of the project and its goals.

## Build / Lint / Test Commands
- Dev server:  <command>
- Build:       <command>
- Test:        <command>

## Code Style Guidelines
- Language, framework, naming conventions

## Git Workflow
- Branch strategy, commit format

## AI-Specific Rules
- What the agent must and must not do
```

### Rules

- Keep it concise — it is injected into every conversation
- Include only project-specific information that cannot be inferred from the code
- Never include secrets, credentials, or environment-specific values
- Reference other docs rather than duplicating them

---

## Skills

Skills are reusable instruction sets that agents load on demand. They are the recommended way to package domain knowledge, workflow guidance, or style rules that apply to specific tasks.

### When to Use Skills

- A task requires specialized instructions not covered by `AGENTS.md`
- The same workflow recurs across sessions (e.g. SEO audit, accessibility review)
- You want the agent to follow a specific methodology for a class of request

### Directory Structure

```
.agents/skills/<skill-name>/
├── SKILL.md           # Main instructions (required)
├── template.md        # Optional: template for agent to fill in
├── examples/
│   └── sample.md      # Optional: example output showing expected format
└── references/
    └── REFERENCE.md   # Optional: reference material
```

### SKILL.md Frontmatter

```yaml
---
name: skill-name          # Required: lowercase, hyphens only, matches directory name
description: |            # Required: when and why to use this skill (max 1024 chars)
  Use this skill when...
license: MIT              # Optional
compatibility: opencode   # Optional: target platform(s)
metadata:                 # Optional: arbitrary key-value pairs
  author: your-name
  version: "1.0"
---
```

### Naming Rules

- Lowercase alphanumeric with single hyphens: `web-search`, `seo`, `accessibility`
- Must match the directory name exactly
- 1–64 characters
- No leading/trailing hyphens, no consecutive `--`

### Discovery Paths (most to least specific)

```
.opencode/skills/<name>/SKILL.md     # OpenCode project
.agents/skills/<name>/SKILL.md       # All agents, project scope
.claude/skills/<name>/SKILL.md       # Claude, project scope
~/.config/opencode/skills/           # OpenCode global
~/.claude/skills/                    # Claude global
```

---

## Agents (Subagents)

Agents are specialized AI assistants with a defined scope of tools, a focused system prompt, and optional model overrides. They are invoked programmatically or by `@mention`.

### When to Use Agents

- A task has a well-defined, repeatable scope (e.g. sprint planning, code review)
- You want to isolate a side task from the main conversation context
- You need to restrict tool access for safety or cost reasons
- You want to route specific task types to a different model

### Agent File Structure

Agents are defined as a single Markdown file:

```
.opencode/agents/<agent-name>.md     # OpenCode
.claude/agents/<agent-name>.md       # Claude
```

The filename (without `.md`) becomes the agent name.

### Agent Frontmatter

```yaml
---
description: |             # Required: when to invoke this agent
  Use this agent when...
mode: subagent             # primary | subagent | all
model: provider/model-id   # Optional: defaults to parent model
permission:                # Optional: tool permission overrides
  read: allow
  edit: allow
  bash:
    "git *": ask
    "find *": allow
---
```

### Permission Keys

| Key | Tools Gated |
|---|---|
| `read` | File reads |
| `edit` | File writes, edits, patches |
| `glob` | Directory listing |
| `grep` | Content search |
| `bash` | Shell commands (supports glob patterns) |
| `task` | Spawning subagents |
| `webfetch` | HTTP requests |
| `skill` | Loading skills |

### Design Principles

- One agent per domain — avoid creating general-purpose agents
- Always define `description` with trigger phrases and examples
- Prefer `permission` restrictions over open access
- Keep system prompts focused; reference skills for domain knowledge

---

## Commands

Commands are prompt templates invoked by typing `/command-name` in the chat. They are best for on-demand, interactive workflows where the user initiates the action.

### When to Use Commands

- A repeatable task has a well-known starting point (e.g. create a commit, open a PR)
- The prompt benefits from injecting live context (git status, branch, diff)
- You want a shorthand that team members can invoke consistently

### Directory Structure

```
.opencode/commands/<command-name>.md     # OpenCode
.claude/commands/<command-name>.md       # Claude
.agents/commands/<command-name>.md       # Generic
```

### Command Frontmatter

```yaml
---
description: Short description shown in the command palette   # Required
model: provider/model-id                                       # Optional
agent: build                                                   # Optional: which agent to use
subtask: false                                                 # Optional: run as subagent
---
```

### Prompt Features

**Arguments** — use `$ARGUMENTS` or positional `$1`, `$2`, `$3`:
```
Create a component named $ARGUMENTS with TypeScript support.
```

**Shell output injection** — prefix with `!`:
```
Current branch: !`git branch --show-current`
Recent commits: !`git log --oneline -10`
```

**File references** — use `@`:
```
Review @src/components/Button.tsx for accessibility issues.
```

### Naming

- Filename becomes command name: `commit.md` → `/commit`
- Lowercase, hyphens allowed: `/create-component`, `/pr`, `/commit`

---

## Tools

Tools are the actions an agent can perform. They are not defined by the project author — they are provided by the platform and gated through permissions.

### Built-in Tool Categories

| Category | Tools | Description |
|---|---|---|
| **File read** | `read`, `glob`, `grep` | Reading and searching files |
| **File write** | `write`, `edit`, `apply_patch` | Creating and modifying files |
| **Shell** | `bash` | Running terminal commands |
| **Web** | `webfetch`, `websearch` | HTTP and search |
| **Agent** | `task` | Spawning subagents |
| **Skills** | `skill` | Loading skill instructions |
| **Interaction** | `question` | Asking the user for input |

### Custom Tools

Custom tools extend the built-in set. They are defined in `opencode.json` (OpenCode) or MCP server configurations and exposed as callable functions to the agent.

```json
{
  "tools": {
    "my-tool": {
      "description": "What this tool does",
      "command": "script-or-binary"
    }
  }
}
```

### Tool Permission Model

Permissions control whether a tool runs immediately, prompts the user, or is blocked entirely:

| Value | Behavior |
|---|---|
| `allow` | Runs without user confirmation |
| `ask` | Prompts user before running |
| `deny` | Tool is hidden and blocked |

Bash permissions support glob patterns for fine-grained control:

```yaml
permission:
  bash:
    "*": ask           # ask for all commands by default
    "git status": allow  # but allow git status silently
    "git push*": ask   # and always ask before pushing
```

---

## Choosing the Right Primitive

```
┌─────────────────────────────────────────────────────┐
│  What are you trying to do?                         │
│                                                     │
│  Provide project context to all agents              │
│  └─ AGENTS.md                                       │
│                                                     │
│  Package reusable instructions for a task type      │
│  └─ Skill (.agents/skills/<name>/SKILL.md)          │
│                                                     │
│  Delegate a whole domain to a specialist agent      │
│  └─ Agent (.opencode/agents/<name>.md)              │
│                                                     │
│  Give users a repeatable shorthand command          │
│  └─ Command (.opencode/commands/<name>.md)          │
│                                                     │
│  Control what the agent is allowed to do            │
│  └─ Tool permissions (permission: in frontmatter)   │
└─────────────────────────────────────────────────────┘
```

---

## References

- [OpenCode Documentation](https://opencode.ai/docs)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- `docs/AI/OPENCODE.md`
- `docs/AI/CLAUDE.md`
- `docs/AI/COPILOT.md`
- `docs/AI/COMPARISON.md`

*Last Updated: 08 May 2026*
