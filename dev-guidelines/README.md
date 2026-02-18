# Dev Guidelines Documentation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Overview

This Docusaurus site serves the Dev Guidelines documentation, containing conventions, patterns, naming standards, and architectural decisions for consistent code development.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Documentation Structure

Documentation files are organized in the `docs/` folder with the following structure:

- **DotNET/** - .NET architecture patterns (Vertical Slice, Microservices, Modular Monolith, etc.)
- **Backend/** - Backend development conventions and design patterns
- **Frontend/** - Frontend framework conventions (React, Vue, Vanilla JS)
- **Database/** - Database naming conventions
- **Cloud/** - Cloud resource naming standards
- **Git/** - Git workflow and commit conventions
- **Documentation/** - Documentation standards and requirements
- **Testing/** - Testing tools and best practices

## Adding New Documentation

1. Create a new `.md` file in the appropriate category folder under `docs/`
2. Add frontmatter if needed for ordering: `---\nsidebar_position: N\n---`
3. Update `sidebars.ts` if you want to manually control the sidebar structure
4. Run `npm start` to preview your changes locally

## Customization

- **Configuration**: Edit `docusaurus.config.ts` for site-wide settings
- **Sidebar**: Edit `sidebars.ts` to customize navigation structure
- **Styling**: Edit `src/css/custom.css` for custom styles and theming
