# Modular Monolith Architecture (.NET)

A Modular Monolith is a **single deployable unit** that is internally divided into **well-defined, loosely coupled modules**, each owning its own domain logic, data access, and public API. It combines the operational simplicity of a monolith with the organizational clarity of microservices.

> Reference: [Milan Jovanović — Modular Monolith Architecture](https://www.milanjovanovic.tech/modular-monolith-architecture)

---

## Core Concept

Unlike a traditional monolith (one big shared codebase), or microservices (separate processes), a Modular Monolith enforces strict boundaries **at the code level**:

```
Single Deployment Unit
┌─────────────────────────────────────────────────────┐
│  API Layer (Composition Root)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Orders       │  │ Customers    │  │ Catalog   │ │
│  │ Module       │  │ Module       │  │ Module    │ │
│  │              │  │              │  │           │ │
│  │ Domain       │  │ Domain       │  │ Domain    │ │
│  │ Application  │  │ Application  │  │ Application│ │
│  │ Infra        │  │ Infra        │  │ Infra     │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                  ↕ Events / Interfaces              │
│  ┌──────────────────────────────────────────────┐   │
│  │ Shared Kernel (minimal shared utilities)     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## When to Use

✅ **Use Modular Monolith when:**
- The domain is complex enough to benefit from clear module boundaries (multiple bounded contexts)
- You want microservices-style organization without the operational overhead of distributed systems
- The team is growing and you need to reduce cross-team coupling
- You are building a system that *may* be split into microservices in the future
- You need independent evolvability of features without independent deployments
- Organizational boundaries map to domain boundaries (one team per module)

❌ **Avoid when:**
- The app is small and a simple layered monolith suffices
- Independent scaling of individual features is strictly required right now
- Different modules need different technology stacks or runtimes

---

## Project Structure

```
MyApp.sln
├── src/
│   ├── API/
│   │   └── MyApp.API/                        # Composition root — thin entry point
│   │       ├── Program.cs                    # Registers all modules
│   │       └── Extensions/
│   │
│   ├── Modules/
│   │   ├── Orders/
│   │   │   ├── MyApp.Modules.Orders.Domain/
│   │   │   │   ├── Entities/
│   │   │   │   │   └── Order.cs
│   │   │   │   ├── Interfaces/
│   │   │   │   │   └── IOrderRepository.cs
│   │   │   │   └── Events/
│   │   │   │       └── OrderCreatedDomainEvent.cs
│   │   │   │
│   │   │   ├── MyApp.Modules.Orders.Application/
│   │   │   │   ├── Commands/
│   │   │   │   │   └── CreateOrder/
│   │   │   │   │       ├── CreateOrderCommand.cs
│   │   │   │   │       └── CreateOrderHandler.cs
│   │   │   │   ├── Queries/
│   │   │   │   └── IntegrationEvents/        # Outbound events (published to other modules)
│   │   │   │
│   │   │   ├── MyApp.Modules.Orders.Infrastructure/
│   │   │   │   ├── Persistence/
│   │   │   │   │   ├── OrdersDbContext.cs     # Module-scoped DbContext
│   │   │   │   │   └── Repositories/
│   │   │   │   └── OrdersModule.cs            # IServiceCollection extension — module registration
│   │   │   │
│   │   │   └── MyApp.Modules.Orders.Contracts/   # Public API for other modules to consume
│   │   │       └── IOrdersApi.cs
│   │   │
│   │   └── Customers/
│   │       ├── MyApp.Modules.Customers.Domain/
│   │       ├── MyApp.Modules.Customers.Application/
│   │       ├── MyApp.Modules.Customers.Infrastructure/
│   │       └── MyApp.Modules.Customers.Contracts/
│   │
│   └── Shared/
│       └── MyApp.Shared/                     # Minimal shared utilities only
│           ├── Abstractions/                 # Shared interfaces (IEvent, ICommand, etc.)
│           ├── Exceptions/
│           └── Extensions/
│
└── tests/
    ├── Modules/
    │   ├── Orders/
    │   │   ├── MyApp.Modules.Orders.UnitTests/
    │   │   └── MyApp.Modules.Orders.IntegrationTests/
    │   └── Customers/
    │       └── MyApp.Modules.Customers.UnitTests/
    └── MyApp.ArchitectureTests/              # Enforce module boundary rules (NetArchTest)
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Module projects | `{App}.Modules.{Module}.{Layer}` | `MyApp.Modules.Orders.Domain` |
| Module contracts project | `{App}.Modules.{Module}.Contracts` | `MyApp.Modules.Orders.Contracts` |
| Module registration class | PascalCase + `Module` | `OrdersModule` |
| Module DbContext | PascalCase + `DbContext` | `OrdersDbContext` |
| Domain events | PascalCase + `DomainEvent` | `OrderCreatedDomainEvent` |
| Integration events | PascalCase + `IntegrationEvent` | `OrderShippedIntegrationEvent` |
| Module public interface | `I` + PascalCase + `Api` | `IOrdersApi` |
| Namespaces | `{App}.Modules.{Module}.{Layer}` | `MyApp.Modules.Orders.Application.Commands` |

---

## Key Principles

1. **No direct cross-module references** — modules communicate only via `Contracts` interfaces or integration events, never by reaching into another module's internals
2. **Each module owns its database schema** — use separate schemas (`orders.`, `customers.`) in one database, or separate databases per module for stronger isolation
3. **Module registration via extension methods** — each module exposes a `AddOrdersModule(this IServiceCollection services)` extension, called from `Program.cs`
4. **Shared Kernel stays minimal** — only genuinely cross-cutting primitives (event interfaces, base exceptions) belong in `Shared`
5. **Module boundaries enforced by architecture tests** — use [NetArchTest](https://github.com/BenMorris/NetArchTest) or [ArchUnitNET](https://github.com/TNG/ArchUnitNET) to prevent forbidden references
6. **Prefer async messaging between modules** — use domain/integration events to decouple modules rather than direct service calls
7. **Module is the unit of team ownership** — one team owns one or more modules end-to-end

---

## Module-to-Module Communication

| Pattern | When to Use |
|---|---|
| Direct interface call via `Contracts` | Synchronous, query-only (read data from another module) |
| Domain event → Integration event | Decoupled, async reactions to state changes |
| In-process messaging (MediatR notifications) | Lightweight async within the same deployment |
| Message broker (RabbitMQ, Azure Service Bus) | Future-proofing for microservices extraction |

---

## Module Registration Pattern (`Program.cs`)

```csharp
builder.Services
    .AddOrdersModule(builder.Configuration)
    .AddCustomersModule(builder.Configuration)
    .AddCatalogModule(builder.Configuration);
```

Each module's extension method registers its own services, DbContext, and handlers.

---

## References

- [Milan Jovanović — Modular Monolith Architecture](https://www.milanjovanovic.tech/modular-monolith-architecture)
- [Milan Jovanović — How to Structure a Modular Monolith in .NET (YouTube)](https://www.youtube.com/watch?v=z3piPJ7x4WU)
- [NetArchTest — Architecture Test Library](https://github.com/BenMorris/NetArchTest)
