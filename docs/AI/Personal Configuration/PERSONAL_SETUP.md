---
title: Personal Setup
description: Instructions for configuring your personal environment for AI agents
sidebar_position: 1
---

# Personal Setup

## Global Configuration

There is a global configuration so that the AI agents work consistently across all projects.

### .agents directory

In Windows, the global configuration is stored in `%USERPROFILE%\agents` and includes:
- AGENTS.md: Global instructions for the AI agents, including skill and agent definitions.
- skills: Global skills that can be used across all projects.
- commands: Global commands that can be used across all projects.
- agents: Global agents that can be used across all projects.
This configuration will be read by all AI agents, including Claude Code, OpenCode, GitHub Copilot and others.
Every AI provider adds its own configuration files and directory for their agents. So in every directory will be included the corresponding files but pointing to the same global configuration in agents.

### AGENTS.md

For example, for Claude Code, the global configuration is stored in `~/.claude/`.
There will be a global CLAUDE.md file that will point to the global AGENTS.md file.
There will be a symbolic link or shortcut renamed as CLAUDE.md that references AGENTS.md.

An alternative option is adding the following in CLAUDE.md:
```markdown
@AGENTS.md
```
The same happens with other AI agents from different providers.

### Skills
Skills are in the `~/.agents` global directory. The skills are referenced in every AI provider global directory by using symbolic links.
For example, in `~/.claude/skills` there is a symbolic link (shortcuts) pointing to the skills in `~/.agents/skills`. Skills have a standard structure with compatible options only.

Domain specific skills:
- microsoft-code-reference
- microsoft-docs
- microsoft-skill-creator

General dev skills:
- mcp-analizer
- chrome-devtools-axi
- lavish
- no-mistakes

### Commands
Commands are in `~/.agents` global directory. Commands are referenced by other AI providers in their global directory too.
For example, with Claude, commands are in `~/.claude/commands`, but those files are shortcuts that point to `~/.agents/commands` files.

- commit.d
- pr.md 

### Agents/Subagents


## Project Configuration

## OPENCODE Global Configuration

For OpenCode, the global configuration is stored in `~/.opencode/.
configurations, and user-specific options.
In Windows, the global configuration is stored in `%USERPROFILE%\.config\opencode`.
- skills: Global skills that can be used across all projects.
- commands: Global commands that can be used across all projects.
- agents: Global agents that can be used across all projects.
- `~/.opencode.json`: Global settings for the AI agents, including model preferences, tool 
- .env: file containing secrets for the Azure MCP Server (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)
```json
{
    "$schema": "https://opencode.ai/config.json",
    "mcp": {
        "microsoft-learn": {
            "type": "remote",
            "url": "https://learn.microsoft.com/api/mcp",
            "enabled": true
        },
        "github": {
            "type": "remote",
            "url": "https://api.githubcopilot.com/mcp/",
            "enabled": true,
            "oauth": false,
            "headers": {
                "Authorization": "Bearer <github_pat>"
            }
        },
        "playwright": {
            "type": "local",
            "command": [
                "npx",
                "@playwright/mcp@latest"
            ],
            "enabled": true
        },
        "chrome-devtools": {
            "type": "local",
            "command": [
                "npx",
                "-y",
                "chrome-devtools-mcp@latest"
            ]
        },
        "nuget": {
            "type": "local",
            "command": [
                "dnx",
                "NuGet.Mcp.Server@1.4.3",
                "--source",
                "https://api.nuget.org/v3/index.json",
                "--yes"
            ],
            "enabled": true
        },
        "aws-mcp": {
            "type": "local",
            "command": [
                "uvx",
                "mcp-proxy-for-aws==1.6.2",
                "https://aws-mcp.us-east-1.api.aws/mcp",
                "--metadata",
                "AWS_REGION=us-west-2"
            ],
            "timeout": 100000,
            "enabled": true
        },
        "Azure MCP Server": {
            "type": "local",
            "command": [
                "docker",
                "run",
                "-i",
                "--rm",
                "--env-file",
                "C:\\Users\\abrah\\.config\\opencode\\.env",
                "mcr.microsoft.com/azure-sdk/azure-mcp:latest"
            ],
            "enabled": true
        }
    }
}
```