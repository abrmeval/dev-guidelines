---
title: Init Context Command
sidebar_position: 3
description: Create or update `AGENTS.md` for this repository
---

## Context

The goal is a compact instruction file that helps future AI sessions avoid mistakes and ramp up quickly. Every line should answer: "Would an agent likely miss this without help?" If not, leave it out.

User-provided focus or constraints (honor these): $ARGUMENTS

## How to investigate

Read the highest-value sources first:
- `README*`, root manifests, workspace config, lockfiles
- build, test, lint, formatter, typecheck, and codegen config
- CI workflows and pre-commit / task runner config
- existing instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`)
- repo-local config such as `opencode.json` or `settings.json`

If architecture is still unclear after reading config and docs, inspect a small number of representative code files to find the real entrypoints, package boundaries, and execution flow. Prefer reading the files that explain how the system is wired together over random leaf files.

Prefer executable sources of truth over prose. If docs conflict with config or scripts, trust the executable source and only keep what you can verify.

## What to extract

Look for the highest-signal facts for an agent working in this repo:
- exact developer commands, especially non-obvious ones
- how to run a single test, a single package, or a focused verification step
- required command order when it matters, such as `lint -> typecheck -> test`
- monorepo or multi-package boundaries, ownership of major directories, and the real app/library entrypoints
- framework or toolchain quirks: generated code, migrations, codegen, build artifacts, special env loading, dev servers, infra deploy flow
- repo-specific style or workflow conventions that differ from defaults
- testing quirks: fixtures, integration test prerequisites, snapshot workflows, required services, flaky or expensive suites
- important constraints from existing instruction files worth preserving

Good `AGENTS.md` content is usually hard-earned context that took reading multiple files to infer.

## Questions

Only ask the user questions if the repo cannot answer something important.

Good questions:
- undocumented team conventions
- branch / PR / release expectations
- missing setup or test prerequisites that are known but not written down

Do not ask about anything the repo already makes clear.

## Writing rules

Include only high-signal, repo-specific guidance such as:
- exact commands and shortcuts the agent would otherwise guess wrong
- architecture notes that are not obvious from filenames
- conventions that differ from language or framework defaults
- setup requirements, environment quirks, and operational gotchas
- references to existing instruction sources that matter

Exclude:
- generic software advice
- long tutorials or exhaustive file trees
- obvious language conventions
- speculative claims or anything you could not verify
- content better stored in another file referenced via `opencode.json` `instructions`

When in doubt, omit.

Prefer short sections and bullets. If the repo is simple, keep the file simple. If the repo is large, summarize the few structural facts that actually change how an agent should work.

If `AGENTS.md` already exists at the current project root, improve it in place rather than rewriting blindly. Preserve verified useful guidance, delete fluff or stale claims, and reconcile it with the current codebase.

Keep the `AGENTS.md` up to 300 lines, if more context added, split it into Markdown files, adding a short description and a reference to read when necessary.

## Core sections

- Project overview: The purpose of the project with key components
- Tech stack: A flat bullet list with the core stack used (Frontend, Backend, Tests, Db, Cloud providers)
- Commands: Exact executable commands with flags, not just tool names. Add a short comment about its purpose per command
- Boundaries - three-tier model (Optional): Always do / Ask first / Never do - based on the current project documentation.
- Project Structure: Map core folder and file structure with purpose annotations
- Code Style: Naming conventions, settings, core architecture rules and patterns. Avoid prose descriptions and add code snippets with short descriptions
- Security rules: Describe rules to follow to avoid vulnerabilities and exploitation
- Testing conventions: Framework, mocking strategy, coverage thresholds, naming conventions
- Key dependencies: a list with core dependencies used in the current project
- Documentation: Add a flat map of documentation files in the current project with short descriptions to read them only when necessary.

## Important note

Keep every section short with core knowledge and split the context into different task-specific files, list the files to read them when relevant.
