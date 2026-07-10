---
title: Personal Setup
description: Instructions for configuring your personal environment for AI agents
sidebar_position: 1
---
[!NOTE]
> A symbolic link is not the same as a shortcut. Windows allows to create shortcuts, which are simple pointers to other files or directories.
Symbolic links are basically advanced shortcuts. Create a symbolic link to an individual file or folder, and that link will appear to be the same as the file or folder to Windows — even though it's just a link pointing at the file or folder.
Applications treat it as if the data exists exactly at that location.

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
There will be a symbolic link renamed as CLAUDE.md that references AGENTS.md.

An alternative option is adding the following in CLAUDE.md:
```markdown
@AGENTS.md
```
The same happens with other AI agents from different providers.

### Skills

Skills are in the `~/.agents` global directory. The skills are referenced in every AI provider global directory by using symbolic links.
For example, in `~/.claude/skills` there is a symbolic link pointing to the skills in `~/.agents/skills`. Skills have a standard structure with compatible options only.

Domain specific skills:
- microsoft-code-reference
- microsoft-docs
- microsoft-skill-creator

General dev skills:
- mcp-analizer
- chrome-devtools-axi
- lavish
- no-mistakes
- skill-creator

### Commands

Commands are in `~/.agents` global directory. Commands are referenced by other AI providers in their global directory too.
For example, with Claude, commands are in `~/.claude/commands`, but those files are symbolic links that point to `~/.agents/commands` files.
To ensure compatibility, options avaiable across different providers are set.

- commit.d
- pr.md 

### Agents/Subagents

Agents are in `~/.agents` global directory. Agents are referenced by other AI providers in their global directory too.
For example, in Claude, agents are defined in `~/.claude/agents`, but those files are symbolic links that point to `~/.agents/agents` files.
To ensure compatibility, options avaiable across different providers are set.

- designer-enforcer
- sprint-executor
- sprint-planner


## Project Configuration

In every project, there will be specific context, defintions, documentation, skills, commands and agents/subgagents that will help with the development to release of projects.
The logic will be the same as for global configuration. All AI context will be in a  `./agents ` folder and those files will be referneced in every AI provider folder as symbolic links to avoid repetition and ehance maintainability.

### Skills
Skills are in the `./agents` directory. Skills are referenced in every AI provider directory by using symbolic links.
For example, in `./claude/skills` there are symbolic links pointing to skills in `./agents/skills`. Skills have a standard structure with compatible options only.

.NET

- Pending

Python

- Pending

JavaScript/TypeScript

- Pending

Node.js

- Pending

Vite

- Pending

React

- Pending

## OPENCODE Global Configuration

For OpenCode, the global configuration is stored in `~/.opencode/ `.
configurations, and user-specific options.
In Windows, the global configuration is stored in `%USERPROFILE%\.config\opencode`.
- skills: Global skills that can be used across all projects (Symbolic links instead).
- commands: Global commands that can be used across all projects (Symbolic links instead).
- agents: Global agents that can be used across all projects (Symbolic links instead).
- `~/.opencode.json`: Global settings for the AI agents, including model preferences, tool 
- .env: file containing secrets for the Azure MCP Server (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)
```json
//"Never commit tokens/secrets; keep them in local-only secret stores/env files." 
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
                "<drive>:\\Users\\<username>\\.config\\opencode\\.env",
                "mcr.microsoft.com/azure-sdk/azure-mcp:latest"
            ],
            "enabled": true
        }
    }
}
```