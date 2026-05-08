# GitHub Copilot Instructions

This is a **developer guidelines repository** — a documentation-only repo containing conventions, patterns, and architectural standards used across all projects. There is no application code here.

> Before generating or modifying any documentation in this repo, read the relevant guideline files first to match the established format and conventions.

---

## Repository Purpose

This repo is the **single source of truth** for how code should be written, structured, and organized across all associated projects. It covers:

- Architecture patterns (.NET)
- Backend conventions (C# / Node.js)
- Frontend conventions (React, Vue, Vanilla JS)
- Database naming standards
- Git workflow (commits, PRs)
- Testing tools
- Cloud naming standards
- Documentation standards

---

## Repository Structure

```
dev-guidelines/
├── docs/
│   ├── Architecture.NET_Aproach/   # .NET architecture patterns
│   ├── Backend/                    # C# and Node.js conventions
│   ├── Cloud/                      # Cloud resource naming
│   ├── Database/                   # DB naming conventions
│   ├── Documentation/              # Doc structure and standards
│   ├── Frontend/                   # React, Vue, VanillaJS conventions
│   │   ├── React/
│   │   ├── Vue/
│   │   └── VanillaJS/
│   ├── Git/                        # Commit and PR standards
│   └── Testing/                    # Testing tools by type
└── README.md
```

---

## Documentation Format Rules

All guideline files follow a **consistent format**. When creating or editing any `.md` file here:

- **Title**: Single `#` heading matching the document subject
- **Intro paragraph**: Short description of what the document covers
- **Sections**: Use `##` and `###` headings — no skipping levels
- **Code examples**: Always fenced with triple-backticks and a language tag (` ```csharp `, ` ```ts `, etc.)
- **Tables**: Use markdown tables for naming conventions, pros/cons, comparisons
- **Callouts**: Use `>` blockquotes for important rules or references
- **Diagrams**: ASCII art for architecture/folder-tree diagrams — no external images
- **Last updated date**: Every file ends with `*Last Updated: DD Mon YYYY*`
- **References section**: Every file ends with a `## References` section listing all sources

### File Naming

- `UPPER_SNAKE_CASE.md` (e.g., `NAMING_CONVENTIONS.md`, `CLEAN_ARCHITECTURE.md`)
- No spaces or special characters

### Architecture Doc Section Order

1. Title + intro paragraph
2. Core Concept / Overview (with ASCII diagram)
3. When to Use ✅ / When NOT to Use ❌
4. Project Structure (ASCII folder tree)
5. Layer/Section details with C# code examples
6. Naming Conventions table
7. Key Principles
8. Recommended NuGet Packages (for .NET) / npm packages (for JS)
9. Testing Strategy
10. References
11. `*Last Updated: ...*`

---

## Key Convention Files to Consult

When generating code in **any project** associated with this guidelines repo:

| Topic | File |
|---|---|
| C# / .NET naming | `docs/Backend/NAMING_CONVENTIONS.md` |
| .NET project/solution naming | `docs/Backend/PROJECTS_NAMING_CONVENTIONS.md` |
| API versioning | `docs/Backend/API_VERSIONING.md` |
| Design patterns (Singleton, CQRS, Repository…) | `docs/Backend/DESIGN_PATTERNS.md` |
| PostgreSQL naming | `docs/Database/NAMING_CONVENTIONS.md` |
| SQL Server naming | `docs/Database/NAMING_CONVENTIONS.md` |
| React conventions | `docs/Frontend/React/NAMING_CONVENTIONS.md` |
| React project structure | `docs/Frontend/React/PROJECT_STRUCTURE.md` |
| Vue 3 conventions | `docs/Frontend/Vue/NAMING_CONVENTIONS.md` |
| Vue 3 project structure | `docs/Frontend/Vue/PROJECT_STRUCTURE.md` |
| Vanilla JS | `docs/Frontend/VanillaJS/NAMING_CONVENTIONS.md` |
| Git commit format | `docs/Git/Commit.md` |
| Git PR format | `docs/Git/PR.md` |
| Required docs per project | `docs/Documentation/REQUIRED_DOCS.md` |
| Doc file structure rules | `docs/Documentation/STRUCTURE.md` |
| AI agents / skills / hooks | `docs/Documentation/AI.md` |

---

## Convention Quick Reference

### C# / .NET

- Classes, Methods, Properties, Constants: `PascalCase`
- Private / internal fields: `_camelCase`
- Private static fields: `s_camelCase`
- Interfaces: `IPascalCase`
- Async methods: `MethodNameAsync()`
- Generic type params: `T`, `TKey`, `TValue`
- Projects: `Company.ProjectName.LayerName` (e.g., `MyApp.Api`, `MyApp.Core`, `MyApp.Infrastructure`)
- Namespaces mirror folder structure exactly
- API versioning: URL path segments `/api/v1/resource`

### PostgreSQL

- Tables and columns: `snake_case`, singular nouns
- Primary keys: `{table_name}_id`
- Foreign keys: `{referenced_table_name}_id`
- Indexes: `idx_{table_name}_{column_name}`
- Check constraints: `chk_{table_name}_{constraint_name}`
- FK constraints: `fk_{table_name}_{referenced_table_name}`

### SQL Server

- Tables and columns: `PascalCase`, singular nouns
- Primary keys: `{TableName}Id`
- Indexes: `IX_{TableName}_{ColumnName}`
- FK constraints: `FK_{TableName}_{ReferencedTableName}`

### React (Vite + Bun)

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Pages: `PascalCasePage.tsx`
- Contexts: `PascalCaseContext.tsx`
- Services: `camelCaseService.ts`
- Types: `camelCase.types.ts`
- Feature-based folder structure under `src/features/`
- Boolean vars: prefix with `is`, `has`, or `can`
- Event handlers: prefix with `handle`; callback props: prefix with `on`
- Env vars: `VITE_` prefix, accessed via `import.meta.env.VITE_*`
- Commands: `bun run dev`, `bun run build`, `bun run test`

### Vue 3 (Vite + Bun)

- SFCs: `PascalCase.vue`
- Base/generic components: `BaseButton.vue`, `BaseInput.vue`
- Single-instance layout components: `TheHeader.vue`, `TheSidebar.vue`
- Composables: `useCamelCase.ts`
- Pinia stores: `camelCaseStore.ts`
- Views (pages): `PascalCaseView.vue`
- Always use `<script setup lang="ts">`
- Script order: imports → props/emits → composables → state → computed → watchers → functions → lifecycle hooks

### Git Commits

- Follow **Conventional Commits** specification (`feat`, `fix`, `docs`, `refactor`, `chore`, etc.)
- First line ≤ 50 chars, blank line, then up to 3 bullet points
- No AI attribution or co-authorship in commit messages

### Git PRs

- Title format: `PR: [Area] Short description`
- Use `gh pr create --title "..." --body "..."`

---

## Architecture Patterns Available

| Pattern | File |
|---|---|
| Clean Architecture (4-layer CQRS/MediatR) | `docs/Architecture.NET_Aproach/CLEAN_ARCHITECTURE.md` |
| Clean Architecture (3-layer Core variant) | `docs/Architecture.NET_Aproach/CLEAN_ARCHITECTURE_CORE_PATTERN.md` |
| Modular Monolith | `docs/Architecture.NET_Aproach/MODULARMONOLITHIC.md` |
| Monolithic (N-Tier) | `docs/Architecture.NET_Aproach/MONOLITHIC.md` |
| Vertical Slice | `docs/Architecture.NET_Aproach/VERTICALSLICE.md` |
| Microservices | `docs/Architecture.NET_Aproach/MICROSERVICES.md` |
| MVC | `docs/Architecture.NET_Aproach/MVC.md` |

---

## Testing Tools

| Type | Tools |
|---|---|
| Unit Testing (.NET) | xUnit, MSTest |
| Integration Testing (.NET) | xUnit, MSTest |
| End-to-End | Playwright, Stagehand |

---

## Rules for Editing This Repo

1. Match the existing document format exactly — title, sections, code blocks, tables, last updated date, references
2. Doc file names must be `UPPER_SNAKE_CASE.md`
3. Architecture docs must include ASCII folder trees and C# code examples with fenced code blocks
4. Every new file must end with `## References` and `*Last Updated: ...*`
5. Do not add new files that duplicate existing ones — check the folder structure first
6. When unsure about scope or placement, ask the developer rather than assuming
7. **Never include real secrets, credentials, API keys, tokens, passwords, or connection strings in any documentation file.** Always use clearly labelled `<placeholder>` values in examples:
   ```env
   API_KEY=<your-api-key>
   DATABASE_URL=<your-database-url>
   JWT_SECRET=<your-jwt-secret>
   ```
   Real values belong only in gitignored env files or a secrets manager.

---

*Last Updated: 08 May 2026*
