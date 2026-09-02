---
title: Documentation Expert
sidebar_position: 1
name: docu-expert
description: Best practices for creating and reviewing project documentation following the dev-guidelines standards — README files, docs/ folders, required documents, naming conventions, and Markdown formatting. Use whenever the user asks to write, structure, update, or review documentation of any kind (README, CHANGELOG, CONTRIBUTING, architecture, dependencies, deployment, testing, infrastructure docs), scaffold documentation for a new project, or decide where a document should live — even when the word "documentation" is never mentioned.
---

# Documentation Expert

Apply the standards below whenever creating, updating, or reviewing project documentation. They keep documents discoverable, consistent, and safe to share across all projects.

## Where Documents Live

| Document | Location |
|----------|----------|
| Main README | Root of each project |
| Subdirectory README | Root of the subdirectory (optional, for large modules) |
| All project docs | `docs/` folder in the project root |
| AI context (sprints, planning, project context) | `docs/AI/` folder |
| Skills, commands, agents | `.claude/` or `.agents/` directories (follow each tool's official structure) |

Keep the `docs/` folder separate from source code (`src/`) — separating code from documentation keeps the project structure easy to navigate.

## File Naming

UPPER_SNAKE_CASE, no spaces or special characters. Applies to files and folders inside `docs/`.

Good:
```
docs/ARCHITECTURE.md
docs/API_VERSIONING.md
docs/INFRASTRUCTURE/WORKFLOWS.md
```

Bad:
```
docs/Architecture.md
docs/api-versioning.md
docs/API Versioning.md
```

## Document Set

When scaffolding documentation for a project, create the required documents first. Add optional documents when the project actually needs them.

| Document | Location | Status |
|----------|----------|--------|
| README | Root | Required |
| ARCHITECTURE | docs/ | Required |
| DEPENDENCIES | docs/ | Required |
| STACK | docs/ | Required |
| PROJECT_STRUCTURE | docs/ | Required |
| EXTERNAL_SERVICES | docs/ | Required |
| TESTING_TOOLS | docs/ | Required |
| WORKFLOWS | docs/INFRASTRUCTURE/ | Required |
| CLOUD_RESOURCES | docs/INFRASTRUCTURE/ | Required |
| DEPLOYMENT | docs/INFRASTRUCTURE/ | Required |
| CHANGELOG | Root | Optional |
| CONTRIBUTING | Root | Optional |
| DEV/* | docs/DEV/ | Optional |
| BUSINESS/* | docs/BUSINESS/ | Optional |
| NAMING_CONVENTIONS | docs/ | Optional |
| DESIGN_PRINCIPLES | docs/ | Optional |
| DESIGN_PATTERNS | docs/ | Optional |

## README Blueprint

A README must include, in order:
1. Title related to the project purpose (business or technical context)
2. Brief description of the project
3. Badges for build status, coverage, and tech stack
4. Overview of the project structure and contents
5. Tech stack and tools
6. Getting Started — prerequisites, installation steps, configuration, alternative installation methods (when applicable)
7. Architecture overview (when applicable)
8. Project structure — files and directories with brief descriptions
9. Cloud resources (when applicable) — link to CLOUD_RESOURCES.md
10. Troubleshooting tips (when applicable)
11. Reference to the docs folder for detailed information
12. Links to relevant resources not covered fully in the project
13. Last updated date at the bottom

Condensed example:

```markdown
# Order Management API

A RESTful API built with ASP.NET Core for managing customer orders and payment processing.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Azure%20SQL-CC2927?logo=microsoftsqlserver&logoColor=white)

## Overview

The API exposes endpoints for creating and tracking orders. It follows Clean Architecture and deploys to Azure as a containerized service.

## Tech Stack and Tools

- **Framework:** ASP.NET Core 8
- **Database:** Azure SQL

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server (local instance or Docker container)

### Installation Steps

1. Clone the repository.
2. Restore dependencies: `dotnet restore`
3. Run the API: `dotnet run --project src/OrderManagement.Api`

### Configuration Instructions

Copy `appsettings.Example.json` and set the values (use placeholders, never real secrets).

## Architecture Overview

The API follows Clean Architecture principles, separating concerns into distinct layers:

- **API Layer** — controllers, middleware, request/response DTOs
- **Application Layer** — CQRS handlers (MediatR), validation (FluentValidation), business use cases
- **Domain Layer** — entities, value objects, domain events
- **Infrastructure Layer** — EF Core persistence, external service integrations (payment gateway, messaging)

## Project Structure

- `src/` — Application source code
- `tests/` — Unit and integration tests
- `docs/` — Detailed documentation

## Cloud Resources

This project provisions and depends on several Azure resources (App Service, Azure SQL). See [`CLOUD_RESOURCES.md`](./CLOUD_RESOURCES.md).

## Troubleshooting

- **Startup errors:** verify the connection string and that SQL Server is running.

## Additional Documentation

See the [docs/](./docs) folder.

## Resources for Further Reading

- [ASP.NET Core Documentation](https://learn.microsoft.com/aspnet/core)
- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service)
---

*Last Updated: 02 Sep 2026*
```

## Documentation File Blueprint

Every documentation file must include:
- A title matching the document name
- A brief description of the document's purpose
- Well-organized content — headings, bullet points, and numbered lists
- Visual aids where they help understanding (ASCII diagrams, tables)
- Links to related documentation (internal or external)
- A References section when the content does not cover all related topics
- Last updated date at the bottom

Condensed example:

```markdown
# Deployment

This document describes every deployment environment, its purpose, and the configuration required on each platform.

## Environments

| Environment | Purpose | Deploy Trigger |
|-------------|---------|----------------|
| Staging | Validation | Merge to main |
| Production | Live traffic | Tagged release |

## References

- [CLOUD_RESOURCES.md](./CLOUD_RESOURCES.md)

*Last Updated: 02 Sep 2026*
```

## Formatting Rules

- Start with `#` for the title, then `##` and `###` — never skip heading levels.
- Wrap code in triple-backtick fences with a language tag (`bash`, `csharp`, `json`, `env`).
- Use Markdown tables for comparisons and enumerated standards.
- Use ASCII diagrams instead of external images — they render everywhere and survive copy-paste:

```
Client -> API Gateway -> Order Service -> SQL Server
                          |
                          +-> Payment Gateway
```

- Add frontmatter (`title`, `description`, `sidebar_position`) when the project builds its docs with Docusaurus.

## Security: Placeholders, Never Real Secrets

Never write real credentials, keys, tokens, or connection strings in documentation. Use clearly labelled placeholders:

```env
DATABASE_URL=<your-database-url>
API_KEY=<your-api-key>
JWT_SECRET=<your-jwt-secret>
```

If a secret is ever committed, treat it as compromised and rotate it immediately.

## Documentation Tooling

- Docusaurus — the standard for documentation sites in these guidelines.
- MkDocs and docmd.io — accepted alternatives.

When contributing to a Docusaurus site, remember that `_category_.json` files control folder labels and sidebar positions.

## Review Checklist

Before delivering any documentation, verify:
1. Correct location (root, `docs/`, `docs/AI/`) and UPPER_SNAKE_CASE file name.
2. Title, description, and intro paragraph present.
3. No skipped heading levels; code fenced with language tags.
4. Comparisons shown as tables; diagrams are ASCII.
5. No real secrets — placeholders only.
6. References section when related topics are not fully covered.
7. Last updated date at the bottom.

---

These standards are maintained in the dev-guidelines repository (`docs/Documentation/`). When a project defines its own conventions, the project's conventions take precedence.
