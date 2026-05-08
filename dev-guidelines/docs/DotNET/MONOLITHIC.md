---
title: Monolithic (N-Tier) Architecture
description: Layered N-tier architecture with all components in a single deployable unit
sidebar_position: 4
---

# Monolithic Architecture (.NET)

A monolithic application is built as a **single deployable unit** where all components (UI, business logic, data access) run in one process. In .NET, this typically takes the form of a **layered (N-tier) architecture** inside a single ASP.NET Core solution.

> Reference: [Microsoft — Common Web Application Architectures](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)

---

## Core Concept

All application concerns live in one codebase and are deployed together. Layers communicate downward:

```
Presentation Layer  (Controllers / Minimal APIs / Razor Pages)
        ↓
Application Layer   (Services / Use Cases / DTOs)
        ↓
Domain Layer        (Entities / Business Rules / Interfaces)
        ↓
Infrastructure Layer (EF Core / Repositories / External APIs)
        ↓
Database
```

---

## When to Use

✅ **Use Monolithic when:**
- Building an MVP, prototype, or early-stage product
- Small to medium application with a single team
- Simple domain without complex independent scaling needs
- Rapid delivery is the priority over long-term scalability
- The team is small and DevOps maturity is limited
- CRUD-heavy applications with straightforward workflows

❌ **Avoid when:**
- Multiple independent teams need to deploy at different cadences
- Parts of the system have vastly different scaling requirements
- The domain is large and complex with many bounded contexts
- You need technology diversity across different parts of the system

---

## Project Structure

```
MyApp.sln
├── src/
│   ├── MyApp.API/                        # Entry point — ASP.NET Core Web API
│   │   ├── Program.cs
│   │   ├── Controllers/
│   │   │   ├── OrdersController.cs
│   │   │   └── CustomersController.cs
│   │   ├── Middleware/                   # Custom middleware (error handling, logging)
│   │   ├── Filters/                      # Action, authorization, exception filters
│   │   └── Extensions/                   # IServiceCollection extension methods
│   │
│   ├── MyApp.Application/                # Use cases, DTOs, service interfaces
│   │   ├── Services/
│   │   │   ├── IOrderService.cs
│   │   │   └── OrderService.cs
│   │   ├── DTOs/
│   │   │   ├── OrderDto.cs
│   │   │   └── CreateOrderRequest.cs
│   │   ├── Validators/                   # FluentValidation validators
│   │   └── Mappers/                      # AutoMapper profiles or Mapperly
│   │
│   ├── MyApp.Domain/                     # Core business rules — no external dependencies
│   │   ├── Entities/
│   │   │   ├── Order.cs
│   │   │   └── Customer.cs
│   │   ├── Enums/
│   │   ├── Interfaces/
│   │   │   ├── IOrderRepository.cs
│   │   │   └── IUnitOfWork.cs
│   │   ├── Exceptions/                   # Domain-specific exceptions
│   │   └── ValueObjects/
│   │
│   └── MyApp.Infrastructure/             # Data access, external services, file I/O
│       ├── Persistence/
│       │   ├── AppDbContext.cs
│       │   ├── Repositories/
│       │   │   └── OrderRepository.cs
│       │   ├── Configurations/           # EF Core entity type configurations
│       │   └── Migrations/
│       ├── Services/                     # External service implementations (email, SMS)
│       └── Extensions/                   # Infrastructure DI registration
│
└── tests/
    ├── MyApp.UnitTests/
    │   ├── Application/
    │   │   └── OrderServiceTests.cs
    │   └── Domain/
    │       └── OrderTests.cs
    └── MyApp.IntegrationTests/
        └── Controllers/
            └── OrdersControllerTests.cs
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Solution | `{Company}.{Product}` | `Acme.OrderManagement` |
| Projects | `{App}.{Layer}` | `MyApp.API`, `MyApp.Application` |
| Namespaces | Match project + subfolder | `MyApp.Application.Services` |
| Controllers | PascalCase + `Controller` | `OrdersController` |
| Services (interface) | `I` + PascalCase + `Service` | `IOrderService` |
| Services (implementation) | PascalCase + `Service` | `OrderService` |
| Repositories (interface) | `I` + PascalCase + `Repository` | `IOrderRepository` |
| Repositories (implementation) | PascalCase + `Repository` | `OrderRepository` |
| DTOs | PascalCase + `Dto` or `Request`/`Response` | `OrderDto`, `CreateOrderRequest` |
| Entities | PascalCase, singular noun | `Order`, `Customer` |
| DbContext | PascalCase + `DbContext` | `AppDbContext` |
| Validators | PascalCase + `Validator` | `CreateOrderValidator` |

---

## Key Principles

1. **Dependencies point inward** — Infrastructure depends on Domain; Domain has no external dependencies
2. **Controllers are thin** — delegate all logic to the Application layer; no business rules in controllers
3. **Domain is pure** — no EF Core, no HTTP, no DI framework references in the Domain project
4. **Interfaces belong in Domain/Application** — not in Infrastructure
5. **One DbContext per application** — shared across all entities
6. **Register everything via DI** — use `IServiceCollection` extension methods per layer
7. **Async all the way** — use `async/await` from controller to repository

---

## Layer Dependencies

```
MyApp.API           → MyApp.Application, MyApp.Infrastructure (DI only)
MyApp.Application   → MyApp.Domain
MyApp.Infrastructure → MyApp.Domain
MyApp.Domain        → (nothing — no external dependencies)
```

---

## References

- [Microsoft — Common Web Application Architectures](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
- [Microsoft — ASP.NET Core Architecture eBook](https://dotnet.microsoft.com/en-us/learn/architecture/aspnet-core)
- [Microsoft Learn — N-tier Applications](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier)
