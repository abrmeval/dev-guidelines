---
sidebar_position: 1
slug: /
---

# Dev Guidelines

A personal developer guidelines repository containing conventions, patterns, naming standards, and architectural decisions. This repository serves as the **single source of truth** for how code should be written, structured, and organized — for both **human developers** and **AI coding agents**.

> Any AI agent (GitHub Copilot, Cursor, etc.) working in projects associated with these guidelines **must** read and follow the conventions defined here before generating or modifying code.

---

## Purpose

This repository exists to:

- Enforce **consistency** across all projects regardless of language, framework, or platform
- Give AI agents explicit context about personal conventions so generated code always matches expectations
- Reduce code review friction by having clear, documented standards
- Serve as onboarding material for any developer (or AI) joining a project

---

## How to Use This Repository

### As a Developer

1. Before starting a new project, read the relevant section for your stack (e.g., `Frontend/React/` for a React app)
2. Follow naming conventions from the matching `NAMING_CONVENTIONS.md`
3. Follow the project structure from the matching `PROJECT_STRUCTURE.md`
4. Follow Git conventions from `Git/Commit.md` and `Git/PR.md`
5. Follow documentation requirements from `Documentation/REQUIRED_DOCS.md`

### As an AI Agent

When working on any project associated with this guidelines repository:

1. **Read the applicable guideline files** for the technology being used before generating any code
2. **Naming:** Follow the `NAMING_CONVENTIONS.md` for the relevant language/framework
3. **Structure:** Follow the `PROJECT_STRUCTURE.md` for the relevant framework
4. **Architecture:** Apply the pattern defined in `.NET/` for the project type
5. **Git:** Use commit message format from `Git/Commit.md`
6. **Documentation:** Ensure all required docs from `Documentation/REQUIRED_DOCS.md` exist
7. **Ask before deviating** — if a situation is not covered, ask the developer rather than assuming

---

## Tech Stack Coverage

| Domain | Technologies Covered |
|---|---|
| Backend | C# / .NET, Node.js |
| Frontend | React (Vite + Bun), Vue 3 (Vite + Bun), Vanilla JavaScript |
| Architecture | Monolithic (N-Tier), Modular Monolith, Microservices, Vertical Slice, MVC |
| Database | Relational (naming conventions) |
| Cloud | Cloud resource naming |
| Testing | Unit, Integration, End-to-End |
| Git | Commits, Pull Requests |

---

## Navigation

Use the sidebar to explore different sections:

- **.NET** - Architecture patterns for .NET applications
- **Backend** - Backend development conventions and patterns
- **Cloud** - Cloud infrastructure naming conventions
- **Database** - Database naming standards
- **Documentation** - Documentation standards and requirements
- **Frontend** - Frontend framework conventions (React, Vue, Vanilla JS)
- **Git** - Git workflow and commit standards
- **Testing** - Testing tools and best practices
