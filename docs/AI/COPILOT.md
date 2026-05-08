---
title: GitHub Copilot
description: Skills, agents, commands, and tool configuration for GitHub Copilot and the Agent standard
sidebar_position: 4
---

# GitHub Copilot

GitHub Copilot is Microsoft's AI coding assistant, integrated directly into VS Code, JetBrains IDEs, and the GitHub web UI. It supports a growing agent and extensibility model through `copilot-instructions.md`, agent files, and MCP server integrations. This document covers Copilot-specific configuration.

---

## Configuration Files

| File | Purpose |
|---|---|
| `AGENTS.md` | Universal instruction file, loaded by Copilot agent mode |
| `.github/copilot-instructions.md` | Copilot-specific workspace instructions |
| `.vscode/settings.json` | VS Code workspace settings including Copilot config |

Copilot loads `.github/copilot-instructions.md` for workspace-level context in Copilot Chat and agent mode. `AGENTS.md` is also respected when Copilot agent mode is active.

### copilot-instructions.md

This file provides persistent context to Copilot across all conversations in the workspace:

```markdown
# Project Conventions

This project is a React + TypeScript application using Vite and Bun.

## Naming Conventions
- Components: PascalCase (.tsx)
- Hooks: camelCase prefixed with `use`
- Services: camelCase with domain suffix (e.g. `userService.ts`)

## Stack
- Frontend: React 18, TypeScript, Vite
- Testing: Vitest, Testing Library
- Linting: ESLint + Prettier
```

---

## Agents

GitHub Copilot supports custom agent definitions via Markdown files. Agents are invoked using `@agent-name` in Copilot Chat.

### Discovery Paths

```
.github/agents/<name>.md       # project-local agents
.agents/agents/<name>.md       # cross-tool compatible
```

### Agent Frontmatter

Copilot agents use a subset of the common agent frontmatter:

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Agent identifier used for `@mention` |
| `description` | Yes | When Copilot should invoke this agent |
| `tools` | No | Tools the agent can use (array or space-separated string) |
| `model` | No | Model identifier (e.g. `GPT-4.1 (copilot)`, `Claude Sonnet 4.6 (copilot)`) |

### Model Identifiers for Copilot

Copilot uses display-name model identifiers rather than `provider/model-id` format:

| Display Name | Description |
|---|---|
| `GPT-4.1 (copilot)` | OpenAI GPT-4.1 via Copilot |
| `Claude Sonnet 4.6 (copilot)` | Anthropic Claude Sonnet via Copilot |
| `Claude Opus (copilot)` | Anthropic Claude Opus via Copilot |
| `o3 (copilot)` | OpenAI o3 reasoning model via Copilot |

### Example

```markdown
---
name: sprint-planner
description: |
  Use this agent when the user asks to create, plan, or organize a sprint.
  Trigger phrases: "create a sprint plan", "plan the next sprint"
tools: ['Read', 'Search', 'Edit', 'Write']
model: Claude Sonnet 4.6 (copilot)
---

You are an expert Agile sprint planner...
```

---

## Skills

Copilot does not have a native skills system. Skills authored for other providers (using `SKILL.md`) are not loaded by Copilot natively.

However, you can make skills available to Copilot agents by:

1. **Referencing skill content in agent files** — copy or `@include` the skill body into the agent's system prompt
2. **Using `.github/copilot-instructions.md`** — paste concise skill guidelines directly into workspace instructions
3. **Using cross-tool paths** — skills in `.agents/skills/` are discovered by OpenCode and Claude; Copilot agents can reference them by file path in their prompts

---

## Commands

Copilot does not have a native `/command-name` dispatch system equivalent to OpenCode or Claude Code.

On-demand workflows in Copilot are handled via:

| Approach | Description |
|---|---|
| **Slash commands in chat** | Built-ins like `/explain`, `/fix`, `/tests`, `/doc` |
| **Agent `@mention`** | `@agent-name` in Copilot Chat invokes a custom agent |
| **VS Code tasks** | `.vscode/tasks.json` for repeatable terminal workflows |
| **Prompt files** | `.github/prompts/*.prompt.md` for reusable prompt templates (preview feature) |

### Prompt Files (Preview)

Copilot supports `.github/prompts/*.prompt.md` as reusable prompt templates:

```markdown
---
description: Create a conventional commit and push
---

Review the current diff and staged changes. Create a single conventional commit
following the project's commit message guidelines, then push.
```

Invoke via Copilot Chat: `#<filename>` or by attaching the file.

---

## Tools

Copilot in agent mode supports a set of built-in tools plus MCP server integrations.

### Built-in Tools (Agent Mode)

| Tool | Description |
|---|---|
| `Read` | Read file contents |
| `Write` | Write or create files |
| `Edit` | Edit existing files |
| `Search` | Search the workspace |
| `Grep` | Regex search through files |
| `Bash(command)` | Run specific shell commands (must be explicitly allowed) |
| `WebSearch` | Web search (when enabled) |
| `WebFetch` | Fetch a URL |

Tool access in agent frontmatter uses a string array:

```yaml
tools: ["Read", "Search", "Edit", "Write", "Grep", "Bash(find *)", "Bash(ls *)"]
```

Note: unlike OpenCode's permission model, Copilot tools are listed as an allowlist. There is no `allow`/`ask`/`deny` distinction — tools either appear in the list or they don't.

### MCP Servers

Copilot supports MCP (Model Context Protocol) servers for extending tool access:

```json
// .vscode/settings.json
{
  "github.copilot.chat.mcp.enabled": true,
  "mcp": {
    "servers": {
      "my-server": {
        "command": "node",
        "args": ["./mcp-server.js"]
      }
    }
  }
}
```

---

## Project Layout

```
<project-root>/
├── AGENTS.md
└── .github/
    ├── copilot-instructions.md        # Workspace-level Copilot context
    └── agents/
        └── sprint-planner.md          # Custom Copilot agents
```

Cross-tool compatible layout (also readable by OpenCode and Claude):

```
<project-root>/
├── AGENTS.md
└── .agents/
    ├── agents/
    │   └── sprint-planner.md
    └── skills/
        └── web-search/SKILL.md        # Not natively loaded by Copilot
```

---

## Limitations Compared to OpenCode and Claude

- No native skill discovery or `SKILL.md` loading
- No `/command-name` dispatch system (prompt files are a partial workaround)
- Tool access is an allowlist, not a permission model with `ask`/`deny`
- Model IDs use display names, not `provider/model-id` format
- No lifecycle hooks

---

## References

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [Copilot Agent Mode](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent)
- `docs/AI/AGENT_STANDARD.md`
- `docs/AI/COMPARISON.md`

*Last Updated: 08 May 2026*
