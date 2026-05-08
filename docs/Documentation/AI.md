# AI Agents, Skills, and Hooks

## AGENTS.md 
AGENTS.md is a project-specific file that provides guidelines for AI agents interacting with the codebase. It should be placed in the root directory of the project.
It is being loaded in every conversation with the agent, so it should be concise and focused on providing the necessary context and instructions for the agent to effectively interact with the project.

Placed in the root directory, AGENTS.md should include:
- A title (e.g., "Coding Agent Guidelines")
- A brief description of the document's purpose and contents
- Detailed instructions for AI agents on how to interact with the codebase, including:
   - Build and run steps
   - Testing instructions
   - Coding conventions and patterns to follow
   - Any specific rules or guidelines for code generation or modification

## CLAUDE.md 
CLAUDE.md is a Claude-specific file.

## AI Skills
Best for specific tasks. An agent loads a skill when it detects the user is asking for something that matches the skill's description or when the user explicitly invokes it with `/skill-name`. Skills are ideal for tasks that require specific instructions, templates, or examples to execute correctly. They can also include scripts for Claude to run or reference documentation to consult.

Where skills live
Where you store a skill determines who can use it:

```
Location    Path                                     Applies to
Enterprise	See managed settings                     All users in your organization
Personal    ~/.claude/skills/<skill-name>/SKILL.md   All your projects
Project     .claude/skills/<skill-name>/SKILL.md     This project only
Plugin      <plugin>/skills/<skill-name>/SKILL.md    Where plugin is enabled
```

Each skill is a directory with SKILL.md as the entrypoint.
The SKILL.md contains the main instructions and is required. Other files are optional and let you build more powerful skills: templates for Claude to fill in, example outputs showing the expected format, scripts Claude can execute, or detailed reference documentation.
```
my-skill/
├── SKILL.md           # Main instructions (required)
├── template.md        # Template for Claude to fill in
├── examples/
│   └── sample.md      # Example output showing expected format
└── scripts/
    └── validate.sh    # Script Claude can execute
```

Beyond the markdown content, you can configure skill behavior using YAML frontmatter fields between --- markers at the top of your SKILL.md file:

```
---
name: my-skill
description: What this skill does
disable-model-invocation: true
allowed-tools: Read Grep
---

Your skill instructions here...
```

All fields are optional. Only description is recommended so Claude knows when to use the skill.

| Field | Required | Description |
| :--- | :--- | :--- |
| **name** | No | Display name for the skill. If omitted, uses the directory name. Lowercase letters, numbers, and hyphens only (max 64 characters). |
| **description** | Recommended | What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses the first paragraph of markdown content. Put the key use case first: the combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing to reduce context usage. |
| **when_to_use** | No | Additional context for when Claude should invoke the skill, such as trigger phrases or example requests. Appended to `description` in the skill listing and counts toward the 1,536-character cap. |
| **argument-hint** | No | Hint shown during autocomplete to indicate expected arguments. Example: `[issue-number]` or `[filename] [format]`. |
| **arguments** | No | Named positional arguments for `$name` substitution in the skill content. Accepts a space-separated string or a YAML list. Names map to argument positions in order. |
| **disable-model-invocation** | No | Set to `true` to prevent Claude from automatically loading this skill. Use for workflows you want to trigger manually with `/name`. Also prevents the skill from being preloaded into subagents. Default: `false`. |
| **user-invocable** | No | Set to `false` to hide from the `/` menu. Use for background knowledge users shouldn’t invoke directly. Default: `true`. |
| **allowed-tools** | No | Tools Claude can use without asking permission when this skill is active. Accepts a space-separated string or a YAML list. |
| **model** | No | Model to use when this skill is active. The override applies for the rest of the current turn and is not saved to settings; the session model resumes on your next prompt. Accepts the same values as `/model`, or `inherit` to keep the active model. |
| **effort** | No | Effort level when this skill is active. Overrides the session effort level. Default: inherits from session. Options: `low`, `medium`, `high`, `xhigh`, `max`; available levels depend on the model. |
| **context** | No | Set to `fork` to run in a forked subagent context. |
| **agent** | No | Which subagent type to use when `context: fork` is set. |
| **hooks** | No | Hooks scoped to this skill’s lifecycle. See Hooks in skills and agents for configuration format. |
| **paths** | No | Glob patterns that limit when this skill is activated. Accepts a comma-separated string or a YAML list. When set, Claude loads the skill automatically only when working with files matching the patterns. Uses the same format as path-specific rules. |
| **shell** | No | Shell to use for `!command` and ` ```! ` blocks in this skill. Accepts `bash` (default) or `powershell`. Setting `powershell` runs inline shell commands via PowerShell on Windows. Requires `CLAUDE_CODE_USE_POWERSHELL_TOOL=1`. |

## AI Custom Commands
Commands are best for executing on-demand tasks.
You execute a command by typing `/command-name` in the chat. Commands are ideal for tasks that don’t require specific instructions or templates, and can be executed with a simple trigger phrase.

Custom commands have been merged into skills. A file at .claude/commands/deploy.md and a skill at .claude/skills/deploy/SKILL.md both create /deploy and work the same way. Your existing .claude/commands/ files keep working. Skills add optional features: a directory for supporting files, frontmatter to control whether you or Claude invokes them, and the ability for Claude to load them automatically when relevant.

## AI Hooks
Hooks are user-defined shell commands that execute at specific points in Claude Code’s lifecycle. They provide deterministic control over Claude Code’s behavior, ensuring certain actions always happen rather than relying on the LLM to choose to run them.
For decisions that require judgment rather than deterministic rules, you can also use prompt-based hooks or agent-based hooks that use a Claude model to evaluate conditions.
To create a hook, add a hooks block to a settings file. 
The example below uses osascript for macOS; see Get notified when Claude needs input for Linux and Windows commands.

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```
## AI Subagents
Subagents are specialized AI assistants that handle specific types of tasks. Use one when a side task would flood your main conversation with search results, logs, or file contents you won’t reference again: the subagent does that work in its own context and returns only the summary.

Subagents help you:
+ Preserve context by keeping exploration and implementation out of your main conversation
+ Enforce constraints by limiting which tools a subagent can use
+ Reuse configurations across projects with user-level subagents
+ Specialize behavior with focused system prompts for specific domains
+ Control costs by routing tasks to faster, cheaper models like Haiku

Subagent files use YAML frontmatter for configuration, followed by the system prompt in Markdown:

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

Where subagents live<br>
Where you store a subagent determines its scope:

~/.claude/agents/<agent-name>.md    # Personal subagent available to all your projects
.claude/agents/<agent-name>.md     # Project-specific subagent

Supported frontmatter fields
The following fields can be used in the YAML frontmatter. Only name and description are required.

| Field | Required | Description |
| :--- | :--- | :--- |
| **name** | Yes | Unique identifier using lowercase letters and hyphens |
| **description** | Yes | When Claude should delegate to this subagent |
| **tools** | No | Tools the subagent can use. Inherits all tools if omitted |
| **disallowedTools** | No | Tools to deny, removed from inherited or specified list |
| **model** | No | Model to use: `sonnet`, `opus`, `haiku`, a full model ID (for example, `claude-opus-4-7`), or `inherit`. Defaults to `inherit` |
| **permissionMode** | No | Permission mode: `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, or `plan`. Ignored for plugin subagents |
| **maxTurns** | No | Maximum number of agentic turns before the subagent stops |
| **skills** | No | Skills to load into the subagent’s context at startup. The full skill content is injected, not just made available for invocation. Subagents don’t inherit skills from the parent conversation |
| **mcpServers** | No | MCP servers available to this subagent. Each entry is either a server name referencing an already-configured server (e.g., `"slack"`) or an inline definition with the server name as key and a full MCP server config as value. Ignored for plugin subagents |
| **hooks** | No | Lifecycle hooks scoped to this subagent. Ignored for plugin subagents |
| **memory** | No | Persistent memory scope: `user`, `project`, or `local`. Enables cross-session learning |
| **background** | No | Set to `true` to always run this subagent as a background task. Default: `false` |
| **effort** | No | Effort level when this subagent is active. Overrides the session effort level. Default: inherits from session. Options: `low`, `medium`, `high`, `xhigh`, `max`; available levels depend on the model |
| **isolation** | No | Set to `worktree` to run the subagent in a temporary git worktree, giving it an isolated copy of the repository. The worktree is automatically cleaned up if the subagent makes no changes |
| **color** | No | Display color for the subagent in the task list and transcript. Accepts `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, or `cyan` |
| **initialPrompt** | No | Auto-submitted as the first user turn when this agent runs as the main session agent (via `--agent` or the `agent` setting). Commands and skills are processed. Prepended to any user-provided prompt |

## Optional Context Files for AI Agents
In addition to the required documentation files, you can include optional context files to provide additional information and guidance for AI agents interacting with the project. 
These files can be placed in the .claude or .agents directory.
Content of these files must be structured by using XML tags to define sections and subsections, allowing for easy parsing and retrieval of information by AI agents.
Example of an optional context file structure:
```
Write a message to the agent with the following context:

<project-overview>
This project is a web application built with React and Node.js. It allows users to create and manage their tasks efficiently. The frontend is built with React, while the backend API is developed using Node.js and Express. The project follows a microservices architecture, with separate services for user authentication, task management, and notifications.
</project-overview>

<coding-conventions>
- Use camelCase for variable and function names
- Use PascalCase for component names
- Include JSDoc comments for all functions and classes
- Follow the Airbnb JavaScript style guide
</coding-conventions>
```