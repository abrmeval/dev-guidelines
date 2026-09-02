---
title: Documentation Structure
description: Required structure and content for README and documentation files
sidebar_position: 2
---
# Documentation Structure

## README files

The README file should be named `README.md` and placed in the root directory of each project to provide an overview of the contents and purpose of that directory. 
The file MUST include:
- A title that relates to the project purpose or topic based on the business or technical context
- A brief description of the project
- Shields or badges (if applicable) to indicate build status, coverage and tech stack used
- An Overview of the project structure and contents
- Tech stack and tools used
- Getting Started instructions (if applicable)
   - Prerequisites
   - Installation steps
   - Configuration instructions (if applicable)
   - Alternative installation methods (if applicable)
- A brief overview of the architecture (if applicable)
- Project structure (Files and directories with brief descriptions)
- Cloud resources used (if applicable) -> Reference to the CLOUD_RESOURCES.md file for more detailed documentation
- Troubleshooting tips (if applicable)
- Reference to the docs folder for more detailed information (if applicable)
- Links to relevant documentation or resources not covered fully in the project documentation
- Last updated date at the bottom of the file (e.g., `*Last Updated: 17 Feb 2026*`)

## Documentation files

Documentation files should be placed in a `docs` folder in the root directory of the project, and should follow the naming conventions outlined in the [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) file. Each documentation file should include:
- A title that matches the name of the document
- A brief description of the document's purpose and contents
- Clear and concise content that is well-organized and easy to navigate
- Use of headings, subheadings, bullet points, and numbered lists to improve readability
- Diagrams, screenshots, or other visual aids where appropriate to enhance understanding
- Links to relevant resources or documentation (external or internal - same project) for further reading
- Last updated date at the bottom of the file (e.g., `*Last Updated: 17 Feb 2026*`)

## Exceptions

1. Every new or changed file must include a References section if the content specified in the document does not cover all the topics intended. Meaning, it just covers the necessary for the project but it would be helpful for the user to explore more in case of interest.

2. For AI context such as skills, commands, subagents and so on, it is not mandatory to follow the rules above. Those follow a different structure specified in official websites.

## README Sample Structure

```markdown
# Order Management API

A RESTful API built with ASP.NET Core for managing customer orders, inventory synchronization, and payment processing workflows. Serves as the backend for the OrderManagement web and mobile clients.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-84%25-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
 
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)
![C%23](https://img.shields.io/badge/C%23-12.0-239120?logo=csharp&logoColor=white)
![EF Core](https://img.shields.io/badge/EF%20Core-8.0-512BD4)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Azure%20SQL-CC2927?logo=microsoftsqlserver&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Azure%20Cache-DC382D?logo=redis&logoColor=white)
![Azure Service Bus](https://img.shields.io/badge/Azure-Service%20Bus-0078D4?logo=microsoftazure&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-container-2496ED?logo=docker&logoColor=white)

## Overview

The `Order Management Api` exposes endpoints for creating and tracking orders, managing product inventory, and integrating with a third-party payment gateway. It follows a layered architecture (API → Application → Domain → Infrastructure) and is designed to be deployed as a containerized service in Azure.

This repository contains the API source code, unit and integration tests, database migrations, and infrastructure-as-code templates used to provision supporting Azure resources.

## Tech Stack and Tools

- **Framework:** ASP.NET Core 8.0 (Minimal APIs + Controllers)
- **Language:** C# 12
- **ORM:** Entity Framework Core 8
- **Database:** Azure SQL Database
- **Authentication:** Azure AD B2C / JWT Bearer tokens
- **Caching:** Redis (Azure Cache for Redis)
- **Messaging:** Azure Service Bus
- **Testing:** xUnit, Moq, FluentAssertions
- **Documentation:** Swagger / OpenAPI (Swashbuckle)
- **CI/CD:** GitHub Actions
- **Containerization:** Docker

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- SQL Server (local instance or Docker container)
- An Azure subscription (for cloud-dependent features)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/OrderManagement.Api.git
   cd OrderManagement.Api
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Apply database migrations:
   ```bash
   dotnet ef database update --project src/OrderManagement.Infrastructure
   ```
4. Run the API:
   ```bash
   dotnet run --project src/OrderManagement.Api
   ```
5. Navigate to `https://localhost:5001/swagger` to explore the API.

### Configuration Instructions

Copy `appsettings.Example.json` to `appsettings.Development.json` and set the following values:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "<your-connection-string>"
  },
  "AzureAdB2C": {
    "Instance": "<b2c-instance-url>",
    "ClientId": "<client-id>"
  },
  "ServiceBus": {
    "ConnectionString": "<service-bus-connection-string>"
  }
}
```

Secrets should be stored using .NET User Secrets locally, and Azure Key Vault in staging/production environments.

### Alternative Installation Methods

**Run via Docker Compose** (spins up the API, SQL Server, and Redis together):

```bash
docker compose up --build
```

## Architecture Overview

The API follows Clean Architecture principles, separating concerns into distinct layers:

- **API Layer** — controllers, middleware, request/response DTOs
- **Application Layer** — CQRS handlers (MediatR), validation (FluentValidation), business use cases
- **Domain Layer** — entities, value objects, domain events
- **Infrastructure Layer** — EF Core persistence, external service integrations (payment gateway, messaging)

Requests flow through middleware (authentication, logging, exception handling) before reaching controllers, which dispatch commands/queries to the Application layer via MediatR.

## Project Structure

```
OrderManagement.Api/
├── src/
│   ├── OrderManagement.Api/            # Entry point, controllers, middleware
│   ├── OrderManagement.Application/    # Commands, queries, handlers, validators
│   ├── OrderManagement.Domain/         # Entities, enums, domain logic
│   └── OrderManagement.Infrastructure/ # EF Core, external integrations
├── tests/
│   ├── OrderManagement.UnitTests/
│   └── OrderManagement.IntegrationTests/
├── docs/                                # Detailed technical documentation
├── infra/                               # Bicep/Terraform templates
├── CLOUD_RESOURCES.md                   # Cloud resource documentation
├── docker-compose.yml
└── README.md
```

## Cloud Resources

This project provisions and depends on several Azure resources (App Service, Azure SQL, Service Bus, Key Vault, Redis Cache). See [`CLOUD_RESOURCES.md`](./CLOUD_RESOURCES.md) for detailed provisioning steps, resource naming conventions, and environment configuration.

## Troubleshooting

- **`500` on startup / DB connection errors:** Verify your connection string in `appsettings.Development.json` and confirm SQL Server is running.
- **`401 Unauthorized` on protected endpoints:** Ensure your Azure AD B2C configuration matches the tenant used to issue your test token.
- **Migrations fail to apply:** Confirm the `dotnet-ef` tool is installed (`dotnet tool install --global dotnet-ef`) and that you're targeting the correct project with `--project`.
- **Docker Compose fails to start SQL Server:** Ensure no other process is bound to port `1433`.

## Additional Documentation

Further documentation — including API contracts, sequence diagrams, and deployment runbooks — is available in the [`docs/`](./docs) folder.

## Resources for Further Reading

- [ASP.NET Core Documentation](https://learn.microsoft.com/aspnet/core)
- [Entity Framework Core Documentation](https://learn.microsoft.com/ef/core)
- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service)

---

*Last Updated: 02 Sep 2026*

```