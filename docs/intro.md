---
sidebar_position: 1
slug: /
title: Introduction
description: Personal developer guidelines hub — conventions, patterns, and standards for .NET, Node.js, React, Vue, Git, testing, and AI agents.
---

# Dev Guidelines

A personal developer guidelines hub containing conventions, patterns, naming standards, and architectural decisions. This repository serves as the **single source of truth** for how code should be written, structured, and organized.

> Any AI agent (GitHub Copilot, Cursor, opencode, etc.) working in projects associated with these guidelines **must** read and follow the conventions defined here before generating or modifying code.

---

## Overview

Guidelines are organized by **technology domain**. Each folder holds focused Markdown files for naming conventions, project structure, architectural decisions, and tooling choices. The same files are rendered as the public documentation site — no `/docs/` URL prefix (`routeBasePath: '/'`).

This repository exists to:

- Enforce **consistency** across all projects regardless of language, framework, or platform
- Give AI agents explicit context about personal conventions so generated code always matches expectations
- Reduce code review friction by having clear, documented standards
- Serve as onboarding material for any developer (or AI) joining a project

---

## How to Use This Repository

1. Before starting a new project, read the relevant section for your stack (e.g. `docs/Frontend/React/` for a React app, `docs/DotNET/VERTICALSLICE.md` for a .NET API).
2. Follow naming conventions from the matching `NAMING_CONVENTIONS.md`.
3. Follow the project structure from the matching `PROJECT_STRUCTURE.md`.
4. Follow Git conventions from `docs/Git/Commit.md` and `docs/Git/PR.md`.
5. Follow documentation requirements from `docs/Documentation/REQUIRED_DOCS.md`.
6. AI agents working **in this repo** should read `AGENTS.md` first for repo-specific rules.

---

## Tech Stack Coverage

| Domain | Technologies Covered |
|---|---|
| Backend | C# / .NET, Node.js |
| Frontend | React (Vite + Bun), Vue 3 (Vite + Bun), Vanilla JavaScript |
| Architecture | Monolithic (N-Tier), Modular Monolith, Microservices, Vertical Slice, MVC, Clean Architecture |
| Database | Relational (naming conventions) |
| Cloud | Cloud resource naming, Vercel deployment |
| Testing | Unit, Integration, End-to-End, Front-end / Back-end tooling |
| Git | Commits, Pull Requests |
| AI | Agent standards, provider guides (Claude, Copilot, opencode), skills and commands |
| Documentation | Structure, naming, required docs, tooling |

---

## Navigation

Use the sidebar to explore different sections:

- **.NET Architecture** - Architecture patterns for .NET applications
- **Backend** - Backend development conventions and patterns
- **Frontend** - Frontend framework conventions (React, Vue, Vanilla JS)
- **Database** - Database naming standards
- **Cloud** - Cloud resource naming conventions
- **Cloud Infrastructure** - Deployment guides (Vercel)
- **Git** - Git workflow and commit standards
- **AI Providers** - Agent standards and provider guides (Claude, Copilot, opencode)
- **AI Personal Configuration** - Personal agents, skills, and commands reference
- **Documentation** - Documentation standards and requirements
- **Testing** - Testing tools and best practices

---

## References

- [How to use — README](https://github.com/abrmeval/dev-guidelines#how-to-use-this-repository)
- [Required docs per project](./Documentation/REQUIRED_DOCS.md)
- [Git commit conventions](./Git/Commit.md)

---

*Last Updated: 09 Sep 2026*
