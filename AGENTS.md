# Coding Agent Guidelines

This document provides essential rules, conventions, and command recipes for all agentic coding tools and AI agents working in this codebase. Follow these standards to ensure contribution consistency across frontend, backend, and documentation domains.

---

## Purpose

This repository is a **developer guidelines hub**, containing cross-project
coding conventions, patterns, and architectural practices for C#, .NET, Node.js, React, Vue, and more.
All AI agents and automated tools must follow the mandates here unless explicitly instructed otherwise.

---

## Build / Lint / Test Commands

### Application Build (Docusaurus)

- Local dev server:   `bun run start`
- Production build:   `bun run build`
- Deploy:            `bun run deploy`

### Linting & Typecheck
- TypeScript types:   `bun run typecheck`

### Testing
- No direct app test scripts for this documentation-only repo.
- If you are in a downstream .NET code repo, use:
    - List tests:    `dotnet test --list-tests`
    - Run all tests: `dotnet test`
    - Run single test: `dotnet test --filter FullyQualifiedName~TestMethodName`
    - Example: `dotnet test --filter Name~LoginReturns200`
- If in a JS/Vite/Bun repo, standard commands
    - All tests:      `bun run test`
    - Single test:    `bun run test -- <path-to-file>`, e.g., `bun run test -- src/features/auth/useAuth.test.ts`
    - Check project scripts in `package.json`.

### Git Workflow
- Always use feature branches—never commit directly to `main`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for messages (refer to Git section).

---

## Code Style Guidelines

**All contributions must adhere to these conventions:**

### Imports & Structure
- Use ES module imports (`import ... from '...'`).
- Sort imports: libraries first, then relative, then styles/types.
- Group by domain/feature—never import across unrelated modules.

### File & Folder Naming
- Project root: `kebab-case` (e.g. `my-app`)
- Features/folders: `kebab-case` (e.g., `user-profile`, `auth`)
- React/Vue component files: `PascalCase` (e.g., `UserCard.tsx`, `LoginView.vue`)
- Hooks/Composables: camelCase prefixed with `use` (e.g., `useAuth.ts`)
- Service, store, helper, utils: `camelCase` with domain suffix (e.g., `userService.ts`, `authStore.ts`)
- Types/interfaces: `camelCase.types.ts` (e.g., `user.types.ts`)
- Test files: Match file under test + `.test.ts` (`MyComp.test.tsx`)

### Variables, Functions & Types
- Variables, functions: `camelCase` (e.g., `handleClick`, `isLoading`)
- Constants: `UPPER_SNAKE_CASE`
- Boolean vars: Prefix with `is`, `has`, `can` (e.g. `isLoading`, `hasPermission`)
- Types/interfaces: Use `PascalCase`, avoid `I` prefix (e.g., `User`, NOT `IUser`)
- Generic types: Use `T`, `TData`, `TResult` as appropriate

### Components/Pages
- Component: `PascalCase`, one per file
- Multi-component modules: Use folders (see below)
- Props interface: `PascalCaseProps` (e.g., `UserCardProps`)
- Page files: Suffix with `Page`/`View` (e.g., `LoginPage.tsx`, `DashboardView.vue`)
- Event handlers: Prefix with `handle` (e.g., `handleSubmit`)
- Callback props: Prefix with `on` (e.g., `onSubmit`)

### Services/API (React & Vue)
- Service files: `camelCaseService.ts`
- Functions: verb + noun (`fetchUser`, `updateProfile`)
- API base clients are centralized (e.g., `apiClient.ts`)

### Utils & Helpers
- Only write pure (stateless/side-effect free) utilities.
- Utilities: verb + noun (`formatDate`, `debounce`)

### Configuration
- Env vars prefixed with `VITE_` for Vite/Bun projects; access via `import.meta.env.VITE_*`
- `.env.local`/`.env.production`/etc. for overrides
- Vite config: `vite.config.ts`

### Secrets & Sensitive Data
- **Never include real secrets, credentials, API keys, tokens, passwords, connection strings, or any sensitive data in documentation or source files.**
- All examples and code snippets must use clearly labelled `<placeholder>` values instead. Examples:
  ```env
  DATABASE_URL=<your-database-url>
  API_KEY=<your-api-key>
  JWT_SECRET=<your-jwt-secret>
  ```
- Real values belong only in `.env.local`, `.env.production`, or a secrets manager — all of which must be gitignored.
- If a secret is accidentally committed, treat it as compromised immediately and rotate it.

### Error Handling
- Always handle possible error branches (try/catch for async, fallback UI for React, error boundaries)
- Never suppress errors silently; log or re-throw as appropriate

---

## Git Commit / PR Guidelines

- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) strictly: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Commit message:
  - First line ≤ 50 chars (summary)
  - Blank line
  - Up to 3 bullet points explaining what & why—never who
  - N O  AI/Claude/Copilot attribution or co-authorship in messages
- PR title: Prefix with `PR:` and, if relevant, area in `[Area]` (e.g. `PR: [Testing] Improve coverage`)
- Use `gh pr create --title "PR: ..." --body "..."`
- See `docs/Git/Commit.md` and `docs/Git/PR.md` for full examples

---

## Documentation & Contribution Format

- All `.md` docs must follow:
  - Title on first line (`# ...`)
  - Intro paragraph
  - Use `##` and `###` headings, no level skipping
  - Triple-backtick for code blocks, proper language tag
  - Markdown tables for comparisons & naming standards
  - ASCII diagrams only, no external images
  - End with `## References` and `*Last Updated: DD Mon YYYY*`
  - File names: `UPPER_SNAKE_CASE.md`, no spaces/punctuation

---

## AI Agent & Copilot-Specific Rules

- AGENTS.md is always loaded in agentic environments—keep instructions precise, non-redundant.
- For large/ambiguous changes: ask devs for clarification—never assume project scope.
- AI/Claude/Copilot must not write attribution to commit/PR messages.
- Follow the [AI skills and hooks](docs/Documentation/AI.md) registry for complex workflows.
- Skills and subagents: use focused system prompts for specialized domains—see `docs/Documentation/AI.md` for structure.
- Only add new files if not duplicating an existing doc (check folder first).
- Every new or changed file must include a References section and last updated stamp.

---

## Key References

| Topic      | File/Link                                            |
|------------|-----------------------------------------------------|
| C#/.NET    | docs/Backend/NAMING_CONVENTIONS.md                  |
| React      | docs/Frontend/React/NAMING_CONVENTIONS.md           |
| Vue 3      | docs/Frontend/Vue/NAMING_CONVENTIONS.md             |
| Commit     | docs/Git/Commit.md                                  |
| PR         | docs/Git/PR.md                                      |
| Agent/AI   | docs/Documentation/AI.md                            |
| Doc rules  | .github/copilot-instructions.md, docs/Documentation/STRUCTURE.md |

---

## References
- See all referenced guideline files in `/docs/`
- .github/copilot-instructions.md
- docs/Documentation/AI.md
- docs/Git/Commit.md, docs/Git/PR.md
- docs/Frontend/React/NAMING_CONVENTIONS.md
- docs/Frontend/Vue/NAMING_CONVENTIONS.md
- docs/Documentation/STRUCTURE.md

*Last Updated: 08 May 2026*
