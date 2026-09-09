---
title: MCP Analyzer
sidebar_position: 1
name: mcp-finder
description: Analyze the current project stack and suggest MCP servers based on the analysis. Use this skill when the user asks to analyze the project stack and get recommendations for MCP servers. This skill is essential for onboarding, understanding the project architecture, and identifying relevant tools for development.
---
This skill guides the process of analyzing the current project stack and suggesting MCP servers based on the analysis.

# Search methodology
1. **Identify project stack**: Start by searching for files that provide information about the project's technology stack, such as package.json, requirements.txt, Dockerfile, or any documentation files that describe the architecture and technologies used.
2. **Analyze source code**: Examine the source code to identify the programming languages, frameworks, libraries, and tools being used. Look for import statements, dependencies, and configuration files that indicate the technologies in use.
3. **Evaluate project structure**: Assess the project's structure to understand how different components interact and what kind of MCP servers would be most relevant for development.
4. **Search for existing MCP servers**: Look for any existing MCP servers that are already being used in the project or globally available.
5. **Recommend MCP servers**: Based on the analysis, recommend MCP servers that would be beneficial for the project, taking into account the technologies in use, the project's architecture, and the development needs. Look for servers that align with the project's goals and can enhance productivity and efficiency.

# Where to find MCP servers
Go to `https://mcpmarket.com/search`, then append a query parameter to the URL with the technology or framework you want to search for. For example, if you want to find MCP servers for React, you would go to `https://mcpmarket.com/search?q=react`.

# Other resources
- [MCP Servers](https://mcpservers.org/search)
- [Microsoft MCP](https://github.com/microsoft/mcp)