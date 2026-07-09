---
name: mcp-analizer
description: Analize the current project stack and suggest mcp servers and skills based on the analysis. Use this skill when the user asks to analyze the project stack and get recommendations for mcp servers and skills. This skill is essential for onboarding, understanding the project architecture, and identifying relevant tools and skills for development.
---
This skill guides the process of analyzing the current project stack and suggesting MCP servers and skills based on the analysis.

# Search methodology
1. **Identify project stack**: Start by searching for files that provide information about the project's technology stack, such as package.json, requirements.txt, Dockerfile, or any documentation files that describe the architecture and technologies used.
2. **Analyze source code**: Examine the source code to identify the programming languages, frameworks, libraries, and tools being used. Look for import statements, dependencies, and configuration files that indicate the technologies in use.
3. **Evaluate project structure**: Assess the project's structure to understand how different components interact and what kind of MCP servers and skills would be most relevant for development.
4. **Search for existing MCP servers and skills**: Look for any existing MCP servers and skills that are already being used in the project or that are commonly used in similar projects. Make use of `npx skills` CLI.
5. **Recommend MCP servers and skills**: Based on the analysis, recommend MCP servers and skills that would be beneficial for the project, taking into account the technologies in use, the project's architecture, and the development needs. Look for servers and skills that align with the project's goals and can enhance productivity and efficiency.

# Reliable sources
- **Vercel**: For MCP servers and deployment solutions https://skills.sh
- **Microsoft MCP repository**: https://github.com/microsoft/mcp
- **GitHub repositories**: Search for popular MCP servers and skills in relevant GitHub repositories.
- **MCP Marketplace**: https://mcpmarket.com For a marketplace of official MCP servers and skills.
- **Community forums**: Look for discussions and recommendations on platforms like Stack Overflow, Reddit, or Dev Community.