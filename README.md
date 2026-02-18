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

## Overview

Guidelines are organized by **technology domain**, each with its own folder containing markdown files for naming conventions, project structure, architectural decisions, and tooling choices.

---

## Repository Structure

```
dev-guidelines/
├── Architectures/                   # Architecture patterns
│   └── .NET/                        # .NET-specific architecture guides
│       ├── MICROSERVICES.md         # Microservices — structure, patterns, when to use
│       ├── MODULARMONOLITHIC.md     # Modular Monolith — modules, communication, DI
│       ├── MONOLITHIC.md            # N-Tier Layered — structure, layer rules
│       ├── MVC.md                   # MVC / ASP.NET Core — folders, conventions
│       └── VERTICALSLICE.md         # Vertical Slice — feature folders, MediatR
│
├── Backend/                         # Backend development conventions
│   ├── API_VERSIONING.md            # API versioning strategies
│   ├── DESIGN_PATTERNS.md           # Design patterns used in backend code
│   ├── NAMING_CONVENTIONS.md        # C# and Node.js naming conventions
│   └── PROJECTS_NAMING_CONVENTIONS.md # Solution and project naming rules
│
├── Cloud/                           # Cloud infrastructure conventions
│   └── NAMING_CONVENTIONS.md        # Cloud resource naming standards
│
├── Database/                        # Database conventions
│   └── NAMING_CONVENTIONS.md        # Table, column, index naming standards
│
├── Documentation/                   # Documentation standards
│   ├── NAMING_CONVENTIONS.md        # File naming rules for docs
│   ├── REQUIRED_DOCS.md             # Required documents for every project
│   ├── STRUCTURE.md                 # README and doc file structure rules
│   └── TOOLS.md                     # Documentation tooling
│
├── Frontend/
│   ├── React/                       # React conventions (Vite + Bun)
│   │   ├── BUILD_TOOLS.md           # Vite and Bun configuration
│   │   ├── NAMING_CONVENTIONS.md    # Components, hooks, utils, services naming
│   │   └── PROJECT_STRUCTURE.md    # Recommended folder structure
│   ├── Vue/                         # Vue 3 conventions (Vite + Bun)
│   │   ├── NAMING_CONVENTIONS.md    # SFCs, composables, stores, views naming
│   │   └── PROJECT_STRUCTURE.md    # Recommended folder structure
│   └── VanillaJS/                   # Vanilla JavaScript conventions
│       └── NAMING_CONVENTIONS.md    # JS naming rules
│
├── Git/                             # Git workflow conventions
│   ├── Commit.md                    # Commit message format and rules
│   └── PR.md                        # Pull request process and standards
│
└── Testing/                         # Testing conventions and tooling
    ├── End-End/
    │   └── TOOLS.md                 # E2E testing tools
    ├── Integration/
    │   └── TOOLS.md                 # Integration testing tools
    └── UnitTesting/
        └── TOOLS.md                 # Unit testing tools
```

---

## How to Use This Repository

### As a Developer

1. Before starting a new project, read the relevant section for your stack (e.g., `Frontend/React/` for a React app, `Architectures/VerticalSlice.md` for a .NET API)
2. Follow naming conventions from the matching `NAMING_CONVENTIONS.md`
3. Follow the project structure from the matching `PROJECT_STRUCTURE.md`
4. Follow Git conventions from `Git/Commit.md` and `Git/PR.md`
5. Follow documentation requirements from `Documentation/REQUIRED_DOCS.md`

### As an AI Agent

When working on any project associated with this guidelines repository:

1. **Read the applicable guideline files** for the technology being used before generating any code
2. **Naming:** Follow the `NAMING_CONVENTIONS.md` for the relevant language/framework
3. **Structure:** Follow the `PROJECT_STRUCTURE.md` for the relevant framework
4. **Architecture:** Apply the pattern defined in `Architectures/` for the project type
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

## Contributing

These are personal conventions. To propose a change:

1. Update the relevant `.md` file directly
2. Ensure the change is consistent with other files in the same domain
3. Follow the documentation structure defined in `Documentation/STRUCTURE.md`

---

## Links & References

- [Microsoft .NET Architecture Guides](https://dotnet.microsoft.com/en-us/learn/architecture)
- [Microsoft Naming Guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/naming-guidelines)
- [Microsoft — .NET Microservices Architecture](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/)
- [Jimmy Bogard — Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [Milan Jovanović — Modular Monolith Architecture](https://www.milanjovanovic.tech/modular-monolith-architecture)
- [Vue 3 Style Guide](https://vuejs.org/style-guide/)
- [React Documentation](https://react.dev/)

---

*Last Updated: 18 Feb 2026*
