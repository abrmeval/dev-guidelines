---
title: AGENTS Guidelines
sidebar_position: 2
---

# AGENTS.md Abrahim guidelines
Common guidelines for AI agents across all repositories. These guidelines are intended to ensure that agents operate effectively, maintain code quality, and adhere to best practices.
---
## General Guidelines
- Always provide the user with options before taking an action unless specified by the user to allow to continue without asking the whole session.
- Always use arrow icons, dashes, asterisks and numbers instead of emojis for lists and steps.
- When doing bug fixes, always start with reproducing the bug in an END-TO-END setting as closely aligned with how an end user would experience it. 
  This ensures that you find the real problem so your fix will actually solve it.
- Always refer to official documentation for any libraries, frameworks, or tools being used.
- When end-to-end testing a product, be picky about the UI you see and be obsessed with pixel perfection.
- When making technical decisions, do not give much weight to development cost. Instead, prefer quality, simplicity, robustness, and maintainability.
- Apply that same high standard to engineering excellence: lint, test failures and test flakiness. 
  If you see one, even if it is not caused by what you are working on right now, still get it fixed.
- When writing commit messages, follow Conventional Commits Specification.

# Documentation Guidelines
- Documentation files should never have real sensitive information like passwords, API keys, or secrets. Use placeholders instead.
- Documentation files should be in a docs folder in the root folder of the project, in Markdown format with UPPERCASE file names.