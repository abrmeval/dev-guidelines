---
title: Clean Architecture
description: Four-layer Clean Architecture for ASP.NET Core using CQRS and MediatR
sidebar_position: 6
---

# Clean Architecture (.NET / ASP.NET Core)

Clean Architecture is a **layered, dependency-rule-driven** approach to structuring software, introduced by Robert C. Martin ("Uncle Bob") in 2012. It promotes separation of concerns, testability, and independence from frameworks, databases, and delivery mechanisms. Inner layers define the rules; outer layers implement the details.

> Influenced by Hexagonal (Ports & Adapters) and Onion Architecture.

---

## Core Concept

All dependencies point **inward**. The Domain layer knows nothing about Application, Infrastructure, or the Web. The Application layer knows only the Domain. Infrastructure and Presentation depend on inner layers — never the reverse.

```
┌──────────────────────────────────────────────────────────┐
│  Presentation / API  (Controllers, Minimal APIs)         │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Infrastructure  (EF Core, HTTP Clients, Services) │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Application  (Use Cases, CQRS, Validation)  │  │  │
│  │  │  ┌────────────────────────────────────────┐  │  │  │
│  │  │  │  Domain  (Entities, Rules, Interfaces) │  │  │  │
│  │  │  └────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘

         Dependencies flow inward  →  ←
```

---

## When to Use

✅ **Use Clean Architecture when:**
- Building medium-to-large, long-lived applications
- The domain model is central and complex (DDD is a natural fit)
- You need strong testability at every layer (unit-test Domain/Application without infrastructure)
- The team follows separation of concerns and clean code practices
- The codebase may evolve significantly over time (database swaps, new delivery channels)
- Multiple developers or teams work on the same codebase

❌ **Avoid when:**
- The project is a small CRUD-only app or a short-lived prototype
- Deadlines are extremely tight and the team is unfamiliar with the pattern
- The domain model is trivial — the overhead of four layers won't pay off
- Requirements change so rapidly that stable layer boundaries can't be established

---

## Solution Structure

```
MyApp.sln
├── src/
│   ├── MyApp.Domain/                        # Innermost layer — no external references
│   │   ├── Entities/
│   │   │   └── Order.cs
│   │   ├── ValueObjects/
│   │   │   └── Money.cs
│   │   ├── Enums/
│   │   ├── DomainEvents/
│   │   │   └── OrderCreatedDomainEvent.cs
│   │   ├── Exceptions/
│   │   │   └── OrderNotFoundException.cs
│   │   ├── Repositories/                    # Interfaces only — implemented in Infrastructure
│   │   │   └── IOrderRepository.cs
│   │   └── Shared/
│   │       └── Entity.cs                    # Base entity with Id + domain events list
│   │
│   ├── MyApp.Application/                   # Use-case orchestration
│   │   ├── Abstractions/
│   │   │   ├── Data/
│   │   │   │   └── IApplicationDbContext.cs
│   │   │   ├── Messaging/
│   │   │   │   ├── ICommand.cs
│   │   │   │   └── IQuery.cs
│   │   │   └── Email/
│   │   │       └── IEmailService.cs
│   │   ├── Behaviors/                       # MediatR pipeline behaviors
│   │   │   ├── ValidationBehavior.cs
│   │   │   └── LoggingBehavior.cs
│   │   ├── Contracts/                       # Request/Response DTOs
│   │   │   └── Orders/
│   │   │       └── OrderResponse.cs
│   │   ├── Orders/
│   │   │   ├── Commands/
│   │   │   │   └── CreateOrder/
│   │   │   │       ├── CreateOrderCommand.cs
│   │   │   │       ├── CreateOrderCommandHandler.cs
│   │   │   │       └── CreateOrderCommandValidator.cs
│   │   │   ├── Queries/
│   │   │   │   └── GetOrder/
│   │   │   │       ├── GetOrderQuery.cs
│   │   │   │       └── GetOrderQueryHandler.cs
│   │   │   └── Events/
│   │   │       └── OrderCreatedEventHandler.cs
│   │   └── DependencyInjection.cs           # AddApplication(this IServiceCollection)
│   │
│   ├── MyApp.Infrastructure/                # External-facing implementations
│   │   ├── Persistence/
│   │   │   ├── ApplicationDbContext.cs      # EF Core DbContext
│   │   │   ├── EntityConfigurations/
│   │   │   │   └── OrderConfiguration.cs
│   │   │   ├── Migrations/
│   │   │   └── Repositories/
│   │   │       └── OrderRepository.cs
│   │   ├── ExternalServices/
│   │   │   └── EmailService.cs
│   │   ├── BackgroundJobs/
│   │   │   └── OutboxMessageProcessorJob.cs
│   │   ├── Extensions/
│   │   └── DependencyInjection.cs           # AddInfrastructure(this IServiceCollection)
│   │
│   └── MyApp.Api/                           # ASP.NET Core entry point
│       ├── Controllers/
│       │   └── OrdersController.cs
│       ├── Middlewares/
│       │   └── ExceptionHandlingMiddleware.cs
│       ├── Filters/
│       ├── Extensions/
│       ├── Properties/
│       │   └── launchSettings.json
│       ├── appsettings.json
│       ├── appsettings.Production.json
│       └── Program.cs
│
└── tests/
    ├── MyApp.Domain.UnitTests/
    ├── MyApp.Application.UnitTests/
    ├── MyApp.Application.IntegrationTests/
    └── MyApp.ArchitectureTests/             # Enforce layer rules (NetArchTest)
```

---

## Layer Details

### 1. Domain Layer

The core of the application. Contains **pure business logic** — no framework dependencies, no NuGet packages beyond language primitives.

```
MyApp.Domain/
├── Entities/            # Aggregates and domain entities with behaviour
├── ValueObjects/        # Immutable types defined by their attributes (e.g., Money, Address)
├── Enums/               # Domain-level enumerations
├── DomainEvents/        # Events raised when something meaningful happens in the domain
├── Exceptions/          # Typed domain exceptions (e.g., OrderNotFoundException)
├── Repositories/        # Repository interfaces — implemented in Infrastructure
└── Shared/              # Base classes: Entity<TId>, AggregateRoot, ValueObject
```

**Rules:**
- ❌ No references to `Microsoft.*`, `EntityFrameworkCore`, or any infrastructure package
- ❌ No `IServiceCollection` registrations
- ✅ Rich domain model — push logic into entities, not services
- ✅ Raise `DomainEvent` objects from aggregate roots

```csharp
public sealed class Order : AggregateRoot<OrderId>
{
    public CustomerId CustomerId { get; private set; }
    public OrderStatus Status { get; private set; }

    public static Order Create(CustomerId customerId)
    {
        var order = new Order(OrderId.New(), customerId, OrderStatus.Pending);
        order.RaiseDomainEvent(new OrderCreatedDomainEvent(order.Id));
        return order;
    }
}
```

---

### 2. Application Layer

Orchestrates use cases. References the Domain layer. Defines abstractions (interfaces) that Infrastructure must implement. Uses **CQRS** with MediatR.

```
MyApp.Application/
├── Abstractions/        # Interfaces for external services (IEmailService, IApplicationDbContext)
├── Behaviors/           # MediatR pipeline: validation, logging, transactions
├── Contracts/           # Request/Response DTOs exposed to the Presentation layer
├── {Entity}/
│   ├── Commands/        # State-changing operations
│   ├── Queries/         # Read-only operations
│   └── Events/          # Domain event handlers
└── DependencyInjection.cs
```

**Rules:**
- ✅ References only the Domain layer
- ✅ All use cases are `ICommand` / `IQuery` + their handlers (MediatR)
- ✅ Validation via `FluentValidation` registered in `ValidationBehavior`
- ❌ No direct calls to `DbContext` — use `IApplicationDbContext` abstraction
- ❌ No HTTP or infrastructure concerns

```csharp
// Command
public sealed record CreateOrderCommand(Guid CustomerId) : ICommand<Guid>;

// Handler
internal sealed class CreateOrderCommandHandler(
    IOrderRepository repository,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateOrderCommand, Guid>
{
    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        var order = Order.Create(new CustomerId(request.CustomerId));
        repository.Add(order);
        await unitOfWork.SaveChangesAsync(ct);
        return order.Id.Value;
    }
}

// Validator
public sealed class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
    }
}
```

---

### 3. Infrastructure Layer

Implements the interfaces defined in Application and Domain. Contains all external-world concerns.

```
MyApp.Infrastructure/
├── Persistence/
│   ├── ApplicationDbContext.cs      # Implements IApplicationDbContext
│   ├── EntityConfigurations/        # EF Core IEntityTypeConfiguration<T>
│   ├── Migrations/
│   └── Repositories/                # Implements IRepository<T> from Domain
├── ExternalServices/                # HTTP clients, third-party SDKs
├── BackgroundJobs/                  # Hangfire / Quartz jobs, Outbox processors
├── Extensions/                      # Shared helpers, mapping extensions
├── Configuration/                   # Options classes bound from appsettings
├── Scripts/                         # SQL scripts, seed data
└── DependencyInjection.cs
```

**Rules:**
- ✅ References Application and Domain layers
- ✅ Each repository class implements the corresponding interface from Domain
- ✅ EF Core entity configurations use `IEntityTypeConfiguration<T>`, not `OnModelCreating` inline
- ✅ Expose a single `AddInfrastructure(this IServiceCollection, IConfiguration)` extension method
- ❌ No business logic — only I/O, mapping, and external calls

```csharp
// DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IUnitOfWork>(sp =>
            sp.GetRequiredService<ApplicationDbContext>());

        return services;
    }
}
```

---

### 4. Presentation / API Layer

The ASP.NET Core entry point. Thin — receives HTTP requests, dispatches to Application via MediatR, returns responses.

```
MyApp.Api/
├── Controllers/                     # API controllers — delegate to MediatR
├── Middlewares/                     # Global exception handling, request logging
├── Filters/                         # Action filters (e.g., model state validation)
├── Extensions/                      # IServiceCollection / WebApplication extensions
├── Properties/launchSettings.json
├── appsettings.json
├── appsettings.{Environment}.json
└── Program.cs                       # Composition root
```

**Rules:**
- ✅ References Application layer (and Infrastructure only for DI registration)
- ✅ Controllers are thin — no business logic, only HTTP input parsing and response shaping
- ✅ Use `IMediator` to dispatch commands and queries
- ✅ Return `IActionResult` or `Results<T>` (Minimal APIs)
- ✅ Use `ProblemDetails` (RFC 7807) for error responses

```csharp
[ApiController]
[Route("api/orders")]
public sealed class OrdersController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateOrder(
        CreateOrderRequest request,
        CancellationToken ct)
    {
        var command = new CreateOrderCommand(request.CustomerId);
        var orderId = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetOrder), new { id = orderId }, orderId);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id, CancellationToken ct)
    {
        var query = new GetOrderQuery(id);
        var result = await sender.Send(query, ct);
        return result is null ? NotFound() : Ok(result);
    }
}
```

```csharp
// Program.cs — Composition root
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseExceptionHandlingMiddleware();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Solution projects | `{App}.{Layer}` | `MyApp.Domain`, `MyApp.Api` |
| Entity class | PascalCase | `Order`, `Customer` |
| Value object | PascalCase + context | `Money`, `OrderId`, `EmailAddress` |
| Domain event | PascalCase + `DomainEvent` | `OrderCreatedDomainEvent` |
| Command | PascalCase + `Command` | `CreateOrderCommand` |
| Query | PascalCase + `Query` | `GetOrderQuery` |
| Handler | Same as command/query + `Handler` | `CreateOrderCommandHandler` |
| Validator | Same as command/query + `Validator` | `CreateOrderCommandValidator` |
| Repository interface | `I` + Entity + `Repository` | `IOrderRepository` |
| Repository implementation | Entity + `Repository` | `OrderRepository` |
| DbContext | `ApplicationDbContext` | `ApplicationDbContext` |
| Entity configuration | Entity + `Configuration` | `OrderConfiguration` |
| DI extension class | `DependencyInjection` per layer | `DependencyInjection.cs` |
| Namespaces | `{App}.{Layer}.{Feature}` | `MyApp.Application.Orders.Commands` |

---

## Key Principles

1. **Dependency Rule** — source code dependencies point only inward; outer layers depend on inner layers, never the reverse
2. **Domain is king** — all business rules live in the Domain layer, not in services, controllers, or handlers
3. **Application defines, Infrastructure implements** — repository and service interfaces are declared in Application; concrete classes are in Infrastructure
4. **Single entry point for DI** — each layer exposes one `Add{Layer}(IServiceCollection, IConfiguration?)` extension method, called in `Program.cs`
5. **CQRS via MediatR** — commands mutate state, queries return data; handlers are the only place that orchestrates domain logic
6. **Pipeline behaviours** — cross-cutting concerns (validation, logging, transactions) are `IPipelineBehavior<TRequest, TResponse>` implementations, not scattered attributes
7. **Rich domain model (avoid anaemic)** — business logic belongs inside entity methods, not application service methods
8. **Architecture tests** — use NetArchTest or ArchUnitNET to enforce that no layer references a layer it should not

---

## Recommended NuGet Packages

| Package | Layer | Purpose |
|---|---|---|
| `MediatR` | Application | CQRS dispatching and pipeline behaviors |
| `FluentValidation` | Application | Request validation in `ValidationBehavior` |
| `Microsoft.EntityFrameworkCore` | Infrastructure | ORM — SQL Server, PostgreSQL, SQLite |
| `Microsoft.EntityFrameworkCore.SqlServer` | Infrastructure | SQL Server provider |
| `Serilog.AspNetCore` | Api | Structured logging |
| `Mapster` / `AutoMapper` | Application / Infrastructure | DTO ↔ Entity mapping |
| `NetArchTest.Rules` | Tests | Architecture dependency rule enforcement |
| `Bogus` / `AutoFixture` | Tests | Test data generation |
| `Testcontainers` | Integration Tests | Real DB containers for integration tests |

---

## Testing Strategy

| Test Type | What to Test | Layer Under Test |
|---|---|---|
| Unit tests | Domain entities, value objects, domain logic | Domain |
| Unit tests | Command/query handlers with mocked interfaces | Application |
| Integration tests | Repositories + real DB (Testcontainers) | Infrastructure |
| Integration tests | API endpoints end-to-end via `WebApplicationFactory` | Api |
| Architecture tests | Layer dependency rules, naming conventions | All |

```csharp
// Architecture test example using NetArchTest
[Fact]
public void Domain_Should_Not_HaveDependencyOn_Application()
{
    var result = Types.InAssembly(DomainAssembly)
        .ShouldNot()
        .HaveDependencyOn("MyApp.Application")
        .GetResult();

    result.IsSuccessful.Should().BeTrue();
}
```

---

## References

- [Milan Jovanović — Clean Architecture Folder Structure](https://www.milanjovanovic.tech/blog/clean-architecture-folder-structure)
- [Milan Jovanović — Clean Architecture & DDD Series (YouTube)](https://www.youtube.com/playlist?list=PLYpjLpq5ZDGstQ5afRz-34o_0dexr1RGa)
- [TechWorld with Milan — What is Clean Architecture?](https://newsletter.techworld-with-milan.com/p/what-is-clean-architecture)
- [Robert C. Martin — The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Microsoft — ASP.NET Core Best Practices](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices)
- [Microsoft — Design a DDD-oriented microservice](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice)
- [Jason Taylor — Clean Architecture Solution Template (GitHub)](https://github.com/jasontaylordev/CleanArchitecture)
- [Steve Smith (Ardalis) — Clean Architecture Template (GitHub)](https://github.com/ardalis/cleanarchitecture)
- [NetArchTest — Architecture Test Library](https://github.com/BenMorris/NetArchTest)
- [abrmeval/nikola_admissions-service — Reference project](https://github.com/abrmeval/nikola_admissions-service/tree/main/src)
