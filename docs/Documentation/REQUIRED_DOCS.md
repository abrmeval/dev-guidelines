---
title: Required and Optional Documents
description: Documents required for every project to ensure consistency and clarity
sidebar_position: 1
---
# Required and Optional Documents

The following documents are required and nice to have for every project to ensure consistency and clarity. 
All documents EXCEPT for the main README and AI related documents (agents, skills, so on) should be placed in a `docs` folder in the root directory of the project, and should follow the naming conventions outlined in the NAMING_CONVENTIONS.md file.

README files should be placed in the root directory of each project or subdirectory, and should follow the structure outlined in the STRUCTURE.md file.
For AI context besides skills, commands, and so on, must be place in the `docs/AI` folder in the root directory of the project. Context like sprints, palnning and everything else the AI can use to understand the project.

## Documents List

- README -> README file containing a general overview of the project. *[Required]*
- CHANGELOG -> Log of changes of the project(s). *[Optional]*
- CONTRIBUTING -> Contribution steps. *[Optional]*
- /docs/ARCHITECTURE -> Architecture of the project(s) The overall architecture and specific architecture styles like Clean Architecture, Monolithic, Microservices, etc. *[Required]*
- /docs/DEPENDENCIES -> Dependencies of the project(s). *[Required]*
- /docs/STACK-> Stack used for the project(s). [*Required]*
- /docs/PROJECT_STRUCTURE -> Folder structure of the project(s). *[Required]*
- /docs/EXTERNAL_SERVICES -> External services integrated with the project(s). *[Required]*
- /docs/TESTING_TOOLS -> Tools used for testing the project(s). *[Required]*
- /docs/INFRASTRUCTURE/WORKFLOWS -> Documentation related to CI/CD workflows, deployment steps, structure of a workflow file, what is being deployed, etc. *[Required]*
- /docs/INFRASTRUCTURE/CLOUD_RESOURCES -> Cloud resources in the project(s). *[Required]*
- /docs/INFRASTRUCTURE/DEPLOYMENT -> Documentation related to Deployment environments, purpose of every environment, rules, configuration needed in the different platforms, etc. *[Required]*
- /docs/DEV/* -> Documentation related to functional/non-functional requirements and all documentation provided by the development team. A more technical documentation of the project(s). *[Optional]*
- /docs/BUSINESS/* -> Documentation related to business rules and business related data. Documentation provided by the business team. *[Optional]*
- /docs/NAMING_CONVENTIONS.md -> Naming conventions to follow in this project for files and code. *[Optional]*
- /docs/DESIGN_PRINCIPLES -> SOLID, DRY, KISS, YAGNI, etc. *[Optional]*
- /docs/DESIGN_PATTERNS -> Result Pattern, Options Pattern, Singleton, Value Object pattern, Repository pattern, etc. *[Optional]*

## References

- [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)
- [STRUCTURE.md](./STRUCTURE.md)

*Last Updated: 08 June 2026*