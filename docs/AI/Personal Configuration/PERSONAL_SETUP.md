---
title: Personal Setup
description: Instructions for configuring your personal environment for AI agents
sidebar_position: 1
---

> [!NOTE]
> A symbolic link is not the same as a shortcut. Windows allows creating shortcuts, which are simple pointers to other files or directories.
Symbolic links are basically advanced shortcuts. Create a symbolic link to an individual file or folder, and that link will appear to Windows as if it were the file or folder itself.
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

Tools:

- chrome-devtools-axi: Wraps chrome-devtools-mcp with an AXI-compliant CLI.
- lavish: A skill that helps agents turn rich HTML artifacts into collaborative human review surfaces.
- no-mistakes: A local gate that validates your code changes through a pipeline before they reach the configured push target.
- gnhf: An agent orchestrator, it repeatedly calls another coding agent until a natural-language stop condition is met. This skill teaches the host agent to prepare one durable run and, in Companion mode, steer or review it.
- treehouse: Helps you manage a pool of reusable, isolated worktrees so each of your agents gets its own environment instantly — no cloning, no conflicts, no coordination overhead.
- skill-creator: Anthropic's tool to create skills

### Commands

Commands are in `~/.agents` global directory. Commands are referenced by other AI providers in their global directory too.
For example, with Claude, commands are in `~/.claude/commands`, but those files are symbolic links that point to `~/.agents/commands` files.
To ensure compatibility, only options available across different providers are set.

- commit.md
- pr.md

### Agents/Subagents

Agents are in `~/.agents` global directory. Agents are referenced by other AI providers in their global directory too.
For example, in Claude, agents are defined in `~/.claude/agents`, but those files are symbolic links that point to `~/.agents/agents` files.
To ensure compatibility, only options available across different providers are set.

- designer-enforcer
- sprint-executor
- sprint-planner

## Project Configuration

In every project, there will be specific context, definitions, documentation, skills, commands, and agents/subagents that support development through release.
The logic will be the same as for global configuration. All AI context lives in a `./agents` folder, and those files are referenced in every AI provider folder as symbolic links to avoid repetition and enhance maintainability.

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

For OpenCode, the global configuration is stored in `~/.opencode/`, including global configurations and user-specific options.
In Windows, the global configuration is stored in `%USERPROFILE%\.config\opencode`.

- skills: Global skills that can be used across all projects (Symbolic links instead).
- commands: Global commands that can be used across all projects (Symbolic links instead).
- agents: Global agents that can be used across all projects (Symbolic links instead).
- `~/.opencode.json`: Global settings for the AI agents, including model preferences and tools.
- .env: file containing secrets for the Azure MCP Server (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)

```json
// OpenCode v1 – Still supported
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
// -----------------------------------------------------------
// -----------------------------------------------------------
// Opencode v2
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "microsoft-learn": {
        "type": "remote",
        "url": "https://learn.microsoft.com/api/mcp"
      },
      "github": {
        "type": "remote",
        "url": "https://api.githubcopilot.com/mcp/",
        "oauth": false,
        "headers": {
          "Authorization": "Bearer {env:GITHUB_MCP_TOKEN}"
        }
      },
      "playwright": {
        "type": "local",
        "command": [
          "npx",
          "@playwright/mcp@latest"
        ]
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
        ]
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
        "timeout": {
          "catalog": 100000,
          "execution": 100000
        }
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
        ]
      },
      "headroom": {
        "type": "local",
        "command": [
          "C:\\Users\\abrah\\.local\\bin\\headroom.EXE",
          "mcp",
          "serve"
        ]
      },
      "serena": {
        "type": "local",
        "command": [
          "uvx",
          "--from",
          "serena-agent",
          "serena",
          "start-mcp-server",
          "--project-from-cwd",
          "--context",
          "agent",
          "--open-web-dashboard",
          "False"
        ]
      }
    }
  },
  "providers": {
    "headroom": {
      "package": "aisdk:@ai-sdk/openai-compatible",
      "name": "Headroom Proxy",
      "settings": {
        "baseURL": "http://127.0.0.1:8787/v1"
      },
      "models": {
        "gpt-4o": {
          "name": "GPT-4o",
          "limit": {
            "context": 128000,
            "output": 16384
          }
        },
        "gpt-4.1": {
          "name": "GPT-4.1",
          "limit": {
            "context": 1048576,
            "output": 32768
          }
        }
      }
    },
     "opencode-go": {
      "models": {
        "glm-5.2": {
          "variants": [
            {
              "id": "deterministic",
              "settings": {
                "reasoningEffort": "high"
              },
              "body": {
                "temperature": 0.0
              }
            },
            {
              "id": "deterministic-deep",
              "settings": {
                "reasoningEffort": "max"
              },
              "body": {
                "temperature": 0.0
              }
            },
            {
              "id": "exact",
              "settings": {
                "reasoningEffort": "high"
              },
              "body": {
                "temperature": 0.1
              }
            },
            {
              "id": "exact-deep",
              "settings": {
                "reasoningEffort": "max"
              },
              "body": {
                "temperature": 0.1
              }
            },
            {
              "id": "precise",
              "settings": {
                "reasoningEffort": "high"
              },
              "body": {
                "temperature": 0.2
              }
            },
            {
              "id": "precise-deep",
              "settings": {
                "reasoningEffort": "max"
              },
              "body": {
                "temperature": 0.2
              }
            }
          ]
        },
        "gpt-5.6-luna": {
          "variants": [
            {
              "id": "deeper",
              "settings": {
                "reasoningEffort": "xhigh",
                "textVerbosity": "low"
              }
            },
            {
              "id": "deepest",
              "settings": {
                "reasoningEffort": "max",
                "textVerbosity": "low"
              }
            }
          ]
        },
         "glm-5.3": {
          "variants": [
            {
              "id": "deterministic",
              "settings": {
                "reasoningEffort": "high"
              },
              "body": {
                "temperature": 0.0
              }
            },
            {
              "id": "deterministic-deep",
              "settings": {
                "reasoningEffort": "max"
              },
              "body": {
                "temperature": 0.0
              }
            },
            {
              "id": "exact",
              "settings": {
                "reasoningEffort": "high"
              },
              "body": {
                "temperature": 0.1
              }
            },
            {
              "id": "exact-deep",
              "settings": {
                "reasoningEffort": "max"
              },
              "body": {
                "temperature": 0.1
              }
            }
          ]
        }
      }
    }
  }
}

```
---

*Last Updated: 22 Sep 2026*
