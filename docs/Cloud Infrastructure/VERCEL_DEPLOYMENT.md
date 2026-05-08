---
title: Vercel Deployment
description: Recommended ways to deploy Docusaurus and other frontend sites to Vercel
sidebar_position: 1
---

# Vercel Deployment

This guide explains the most common ways to deploy a Docusaurus site to Vercel, from the simplest GitHub-connected setup to fully automated CI/CD pipelines. Use it to choose the deployment model that best fits your team's release process, security requirements, and approval flow.

## Overview

Vercel supports multiple deployment patterns:

```text
GitHub repository
        |
        +--> Vercel Git Integration
        |         |
        |         +--> Preview deployments for pull requests
        |         +--> Production deployments from the main branch
        |
        +--> GitHub Actions
        |         |
        |         +--> Validate
        |         +--> Build
        |         +--> Deploy with Vercel CLI
        |
        +--> External CI/CD Pipelines
                  |
                  +--> Azure DevOps / GitLab CI / Jenkins
                  +--> Build once and deploy with Vercel CLI or deploy hooks
```

## When to Use Each Option

| Option | Best For | Benefits | Trade-Offs |
|---|---|---|---|
| Direct GitHub integration | Small teams and documentation sites | Fastest setup, built-in preview URLs, minimal maintenance | Less control over custom approval gates |
| GitHub Actions deployment | Teams already using GitHub-native CI/CD | Full control over checks, reusable workflows, branch-based rules | More setup and secret management |
| External CI/CD pipelines | Organizations standardizing on another pipeline platform | Centralized release governance and approvals | More moving parts than native Vercel integration |

> Prefer **direct GitHub integration** for simple Docusaurus sites unless you need custom validation gates, enterprise approvals, or cross-system orchestration.

## Option 1: Direct Deployment from a GitHub Repository

This is the simplest and recommended starting point for most documentation websites.

### Setup Flow

1. Import the GitHub repository into Vercel.
2. Select the production branch (usually `main`).
3. Confirm the framework and build settings.
4. Let Vercel create preview deployments for pull requests automatically.

### Recommended Vercel Project Settings

| Setting | Recommended Value | What It Does |
|---|---|---|
| Framework Preset | `Docusaurus` or `Other` | Helps Vercel apply sensible defaults for the site |
| Install Command | `npm ci` | Installs dependencies exactly from `package-lock.json` for reproducible builds |
| Build Command | `npm run build` | Generates the static Docusaurus site in the build output folder |
| Output Directory | `build` | Tells Vercel which generated files should be published |
| Node.js Version | Match the repo standard | Keeps local, CI, and Vercel builds consistent |

### What Happens Automatically

- Every pull request can receive a **preview deployment**
- Every push to the production branch can trigger a **production deployment**
- Vercel detects build failures and surfaces logs in the deployment UI

### Best Practices for Direct Git Integration

- Protect the production branch before enabling automatic production deploys
- Use preview deployments for content review before merging
- Store environment variables in Vercel project settings, not in the repository
- Keep the build command deterministic with `npm ci` and a committed lockfile

## Option 2: Deploy with GitHub Actions

Use GitHub Actions when you want validation and deployment inside GitHub with explicit workflow control.

### Example Workflow

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Validate TypeScript configuration
        run: npm run typecheck

      - name: Build the Docusaurus site
        run: npm run build

      - name: Pull Vercel project settings
        run: npx vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Build the Vercel deployment artifact
        run: npx vercel build --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy preview
        if: github.event_name == 'pull_request'
        run: npx vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy production
        if: github.event_name == 'push'
        run: npx vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Command Reference

| Command | Purpose |
|---|---|
| `npm ci` | Installs dependencies from the lockfile in a clean, reproducible way for CI |
| `npm run typecheck` | Verifies TypeScript configuration and catches typed config issues before deployment |
| `npm run build` | Builds the static Docusaurus site and confirms the documentation renders successfully |
| `npx vercel pull --yes --environment=preview` | Downloads Vercel project configuration and environment variables into the CI workspace |
| `npx vercel build` | Produces the deployment artifact locally so the same artifact can be tested and deployed |
| `npx vercel deploy --prebuilt` | Uploads the previously built artifact as a preview deployment without rebuilding |
| `npx vercel deploy --prebuilt --prod` | Uploads the prebuilt artifact to the production environment |

### Required Secrets

Store the following values in GitHub Actions secrets:

| Secret | Purpose |
|---|---|
| `VERCEL_TOKEN` | Authenticates the workflow against Vercel |
| `VERCEL_ORG_ID` | Identifies the Vercel team or account |
| `VERCEL_PROJECT_ID` | Identifies the target Vercel project |

> Use a dedicated token with the minimum access required for deployment.

## Option 3: Deploy from External Pipelines

Use this option when your organization manages releases through Azure DevOps, GitLab CI, Jenkins, or another centralized delivery platform.

### Generic Pipeline Flow

1. Check out the repository
2. Install dependencies with `npm ci`
3. Run validation such as `npm run typecheck`
4. Build the site with `npm run build`
5. Authenticate to Vercel
6. Run `vercel pull`, `vercel build`, and `vercel deploy --prebuilt`

### Example Azure Pipelines Job

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self

  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'

  - script: npm ci
    displayName: Install dependencies

  - script: npm run typecheck
    displayName: Validate TypeScript configuration

  - script: npm run build
    displayName: Build Docusaurus site

  - script: npx vercel pull --yes --environment=production --token=$(VERCEL_TOKEN)
    displayName: Pull Vercel configuration
    env:
      VERCEL_ORG_ID: $(VERCEL_ORG_ID)
      VERCEL_PROJECT_ID: $(VERCEL_PROJECT_ID)

  - script: npx vercel build --token=$(VERCEL_TOKEN)
    displayName: Build Vercel artifact
    env:
      VERCEL_ORG_ID: $(VERCEL_ORG_ID)
      VERCEL_PROJECT_ID: $(VERCEL_PROJECT_ID)

  - script: npx vercel deploy --prebuilt --prod --token=$(VERCEL_TOKEN)
    displayName: Deploy production release
    env:
      VERCEL_ORG_ID: $(VERCEL_ORG_ID)
      VERCEL_PROJECT_ID: $(VERCEL_PROJECT_ID)
```

### Why Pipelines Are Useful

- They fit into existing enterprise approval processes
- They make it easier to reuse shared validation and security stages
- They let teams deploy Vercel alongside other infrastructure changes

## Deployment Best Practices

### Build and Validate Before Deploying

- Run `npm ci` to guarantee clean dependency installation
- Run `npm run typecheck` before deployment to catch configuration issues early
- Run `npm run build` to verify that the documentation site compiles successfully

### Keep Environments Separate

- Use preview deployments for pull requests and branch testing
- Reserve `--prod` deployments for approved releases from the production branch
- Keep development, preview, and production environment variables separate

### Secure the Deployment Process

- Store tokens and project identifiers in the CI platform's secret store
- Rotate deployment tokens regularly
- Never commit `.vercel` credentials, secrets, or environment values to the repository

### Prefer Reproducible Builds

- Commit `package-lock.json`
- Pin the Node.js version used by CI and Vercel
- Prefer `vercel build` + `vercel deploy --prebuilt` so the deployed artifact matches the validated artifact

## Recommended Approach for Docusaurus

For most Docusaurus documentation repositories:

1. Start with **direct GitHub integration** for the fastest feedback loop
2. Move to **GitHub Actions** when you need additional checks before deployment
3. Use **external pipelines** only when your organization already standardizes on them

This progression keeps the setup simple while leaving room for stricter governance as the project grows.

## References

- [Vercel Documentation - Deploying with Git](https://vercel.com/docs/deployments/git)
- [Vercel Documentation - CLI](https://vercel.com/docs/cli)
- [Vercel Documentation - Building Outputs in CI/CD](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [Docusaurus Documentation - Deployment](https://docusaurus.io/docs/deployment)

*Last Updated: 08 May 2026*
