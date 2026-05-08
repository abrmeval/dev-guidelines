---
name: project-analyzer
description: Find and analyze the project's content to get a comprehensive understanding of the codebase, architecture, and functionality. Use this skill when the user asks to analyze a project, understand its structure, explore its content or gain insights about its components and dependencies. This skill is essential for onboarding, debugging, refactoring, or planning new features.
compatibility: opencode
---

This skill guides the process of finding and analyzing a project's content to gain a comprehensive understanding of its codebase, architecture, and functionality.

# Search methodology
1. **Identify md files for context**: Start by searching for markdown files (README.md, docs/, etc.) that provide high-level context about the project. These often contain architecture overviews, component descriptions, and usage instructions.
2. **Explore source code**: Search for main source code directories (src/, lib/, etc.) to understand the project's structure, key modules, and implementation details.

3. **Analyze dependencies**: Look for package.json, requirements.txt, or similar files to identify external libraries and dependencies that the project relies on.

4. **Review configuration files**: Check for config files (webpack.config.js, .env, etc.) that reveal how the project is set up and how different components interact.

5. **Identify tests**: Search for test directories (tests/, __tests__, etc.) to understand how the project is tested and what key functionalities are covered.

# Analysis approach
- **Summarize project purpose**: Based on the files found, summarize the overall purpose and goals of the project. What problem does it solve? Who is the target audience?
- **Summarize architecture**: Based on the files found, summarize the overall architecture of the project, including key components, their relationships, and the flow of data.
- **Identify key functionalities**: Highlight the main features and functionalities of the project, as well as any unique or complex implementations.
- **Stack and dependencies**: List the main technologies, frameworks, and libraries used in the project, along with their roles.
- **Design patterns and best practices**: Note any design patterns, coding styles, or best practices that are evident in the codebase.
- **CI/CD**: Describe the continuous integration and continuous deployment setup, including any pipelines, automated tests, and deployment strategies.
- **Highlight potential areas of interest**: Point out any areas that may require further exploration, such as complex modules, critical paths, or areas with limited documentation.
