---
title: Backend Design Patterns
description: Common design patterns used in backend code — Singleton, Bridge, Repository, Options Pattern, and CQRS
sidebar_position: 4
---

# Design Patterns

This document outlines the design patterns used in our backend architecture. These patterns help us create a scalable, maintainable, and efficient codebase.

---

## Singleton Pattern

**Category:** Creational

The Singleton pattern ensures a class has **only one instance** and provides a global access point to it. It is commonly used for shared resources such as configuration providers, logging services, or connection pools.

### When to Use

✅ **Use Singleton when:**
- A single shared instance must coordinate actions across the system (e.g., a logger, cache manager, or connection pool)
- Object creation is expensive and re-use is preferable
- A global access point to a service is needed without passing it explicitly everywhere

❌ **Avoid when:**
- The class holds mutable state that multiple consumers could corrupt
- It makes unit testing harder by introducing hidden global state
- The concept is better served by Dependency Injection with a `Singleton` lifetime (preferred in ASP.NET Core)

### Structure

```
┌──────────────────────────────────────┐
│            Singleton                 │
│  - static instance: Singleton        │
│  - private constructor()             │
│  + static GetInstance(): Singleton   │
│  + BusinessOperation()               │
└──────────────────────────────────────┘
```

### Implementation (C# — Thread-Safe with Lazy)

```csharp
public sealed class ConnectionPool
{
    private static readonly Lazy<ConnectionPool> _instance =
        new(() => new ConnectionPool());

    private ConnectionPool() { /* expensive init */ }

    public static ConnectionPool Instance => _instance.Value;

    public IDbConnection GetConnection() { /* ... */ }
}

// Usage
var pool = ConnectionPool.Instance;
```

### In ASP.NET Core — Prefer DI Lifetime over Manual Singleton

Instead of manually implementing the pattern, register the service with a `Singleton` lifetime in the DI container. This preserves testability and respects the framework.

```csharp
// Program.cs
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
```

```csharp
// Consumer — no static access, fully testable
public sealed class ProductService(ICacheService cache)
{
    public async Task<Product?> GetAsync(Guid id)
        => await cache.GetAsync<Product>($"product:{id}");
}
```

### Pros and Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Guarantees a single shared instance | Violates Single Responsibility Principle |
| Lazy initialization — created only when needed | Difficult to unit test (hidden global state) |
| Centralized control over the resource | Thread-safety requires careful implementation |

---

## Bridge Pattern

**Category:** Structural

The Bridge pattern **decouples an abstraction from its implementation** so that both can vary independently. Instead of creating a combinatorial explosion of subclasses for every combination of behaviour, Bridge uses object composition — the abstraction holds a reference to an implementation object.

### When to Use

✅ **Use Bridge when:**
- You want to avoid a permanent binding between an abstraction and its implementation
- Both the abstraction and implementation should be independently extensible via subclassing
- A class hierarchy would explode if all combinations were expressed as subclasses (e.g., shapes × rendering engines)
- You need to switch implementations at runtime

❌ **Avoid when:**
- The abstraction and implementation will never vary independently — the added indirection is overhead
- The codebase is small and the class hierarchy is unlikely to grow

### Structure

```
Abstraction ──────────────► IImplementation
    │                              ▲
    │                    ┌─────────┴──────────┐
    ▼                    │                    │
RefinedAbstraction   ConcreteImplA       ConcreteImplB
```

### Implementation (C# — Notification System)

```csharp
// Implementation interface
public interface INotificationSender
{
    Task SendAsync(string recipient, string message);
}

// Concrete implementations
public sealed class EmailSender : INotificationSender
{
    public Task SendAsync(string recipient, string message)
    {
        Console.WriteLine($"[Email] To: {recipient} | {message}");
        return Task.CompletedTask;
    }
}

public sealed class SmsSender : INotificationSender
{
    public Task SendAsync(string recipient, string message)
    {
        Console.WriteLine($"[SMS] To: {recipient} | {message}");
        return Task.CompletedTask;
    }
}

// Abstraction
public abstract class Notification(INotificationSender sender)
{
    protected readonly INotificationSender Sender = sender;
    public abstract Task NotifyAsync(string recipient);
}

// Refined abstraction
public sealed class OrderConfirmationNotification(INotificationSender sender)
    : Notification(sender)
{
    public override Task NotifyAsync(string recipient)
        => Sender.SendAsync(recipient, "Your order has been confirmed.");
}

// Usage — swap implementation at runtime via DI
var notification = new OrderConfirmationNotification(new SmsSender());
await notification.NotifyAsync("+1-555-0100");
```

### In ASP.NET Core — Bridge via DI

```csharp
// Register different implementations per environment
if (builder.Environment.IsProduction())
    builder.Services.AddScoped<INotificationSender, EmailSender>();
else
    builder.Services.AddScoped<INotificationSender, SmsSender>();

builder.Services.AddScoped<Notification, OrderConfirmationNotification>();
```

### Pros and Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Abstraction and implementation vary independently | Adds indirection — harder to follow for simple scenarios |
| Open/Closed Principle — extend without modifying existing code | Increases the number of classes |
| Implementations are interchangeable at runtime | Can be over-engineering for small hierarchies |

---

## Repository Pattern

**Category:** Data Access / Architectural

The Repository pattern **abstracts the data access layer** behind an interface, decoupling business logic from the persistence technology (EF Core, Dapper, external API, etc.). Consumers interact with a repository interface and are unaware of the underlying storage mechanism.

### When to Use

✅ **Use Repository when:**
- You want to isolate business logic from data access concerns
- You need to swap or mock the data layer (e.g., for unit testing)
- Multiple data sources exist and you want a consistent interface
- The domain is complex enough to justify the abstraction

❌ **Avoid when:**
- The application is a simple CRUD app — `DbContext` already acts as a repository/unit of work
- It adds unnecessary layers around EF Core without any real abstraction benefit
- The added indirection slows down development without improving testability

### Structure

```
IRepository<T>
     ▲
     │  implements
     │
Repository<T>  ◄──── DbContext / Dapper / HttpClient
     ▲
     │  extends
     │
IOrderRepository  ───  OrderRepository
```

### Implementation (C# — Generic + Specific Repository)

```csharp
// Generic interface in Domain/Core
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    void Add(T entity);
    void Remove(T entity);
}

// Entity-specific interface — domain-relevant queries
public interface IOrderRepository : IRepository<Order>
{
    Task<IReadOnlyList<Order>> GetByCustomerIdAsync(Guid customerId, CancellationToken ct = default);
}

// EF Core implementation in Infrastructure
internal sealed class OrderRepository(ApplicationDbContext context) : IOrderRepository
{
    public async Task<Order?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await context.Orders.FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<IReadOnlyList<Order>> GetAllAsync(CancellationToken ct = default)
        => await context.Orders.ToListAsync(ct);

    public async Task<IReadOnlyList<Order>> GetByCustomerIdAsync(
        Guid customerId, CancellationToken ct = default)
        => await context.Orders
            .Where(o => o.CustomerId == customerId)
            .ToListAsync(ct);

    public void Add(Order order) => context.Orders.Add(order);
    public void Remove(Order order) => context.Orders.Remove(order);
}
```

### Unit of Work alongside Repository

```csharp
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

// ApplicationDbContext implements IUnitOfWork
public sealed class ApplicationDbContext(DbContextOptions options)
    : DbContext(options), IUnitOfWork
{
    public DbSet<Order> Orders => Set<Order>();
}
```

### Registration

```csharp
// Infrastructure/DependencyInjection.cs
services.AddScoped<IOrderRepository, OrderRepository>();
services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
```

### Pros and Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Decouples business logic from data access | Extra abstraction layer for simple CRUD apps |
| Enables mocking for unit tests | Can duplicate EF Core capabilities (which is already a repository) |
| Centralizes query logic — no scattered LINQ | Generic repositories can become too broad and leak `IQueryable` |
| Makes swapping data sources easier | |

---

## Options Pattern

**Category:** Configuration / ASP.NET Core

The Options pattern provides **strongly typed access to groups of related configuration settings** using plain C# classes. It promotes encapsulation and separation of concerns — each class depends only on the settings it uses.

### When to Use

✅ **Use Options when:**
- You have a group of related configuration values (e.g., SMTP settings, API keys, feature flags)
- You want IntelliSense, compile-time safety, and validation on configuration
- Settings need to be injected into services without coupling to `IConfiguration` directly
- Settings may change at runtime without restarting the app (`IOptionsSnapshot` / `IOptionsMonitor`)

❌ **Avoid when:**
- A single isolated config value is needed — a direct `configuration["Key"]` read is simpler
- The configuration class would be trivial (one property)

### Options Interfaces

| Interface | Lifetime | Reload on Change | Use Case |
|---|---|---|---|
| `IOptions<T>` | Singleton | ❌ No | Static settings read once at startup |
| `IOptionsSnapshot<T>` | Scoped | ✅ Per request | Per-request settings that may change |
| `IOptionsMonitor<T>` | Singleton | ✅ Real-time | Background services needing live updates |

### Implementation (C# — External Service Settings)

```csharp
// 1. Define the options class (POCO — non-abstract, public read-write properties)
public sealed class DynamicsSettings
{
    public const string SectionName = "Dynamics";

    public string BaseUrl { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
}
```

```json
// appsettings.json
{
  "Dynamics": {
    "BaseUrl": "https://org.crm.dynamics.com/api/data/v9.2/",
    "TenantId": "your-tenant-id",
    "ClientId": "your-client-id",
    "ClientSecret": "your-client-secret"
  }
}
```

```csharp
// 2. Register in DI
services.Configure<DynamicsSettings>(
    configuration.GetSection(DynamicsSettings.SectionName));
```

```csharp
// 3. Inject and consume
public sealed class DynamicsService(IOptions<DynamicsSettings> options)
{
    private readonly DynamicsSettings _settings = options.Value;

    public Task CallApiAsync(string endpoint)
    {
        // _settings.BaseUrl, _settings.ClientId, etc.
    }
}
```

### Options Validation

```csharp
public sealed class SmtpSettings
{
    [Required] public string Host { get; set; } = string.Empty;
    [Range(1, 65535)] public int Port { get; set; }
    [Required, EmailAddress] public string FromAddress { get; set; } = string.Empty;
}

// Register with fail-fast validation
services.AddOptions<SmtpSettings>()
    .BindConfiguration("Smtp")
    .ValidateDataAnnotations()
    .ValidateOnStart();
```

### Pros and Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Strongly typed — IntelliSense and compile-time safety | Slightly more setup than direct `IConfiguration` reads |
| Encapsulates related settings in one class | Options class must follow POCO constraints |
| Supports reload-on-change without restart | `IOptions<T>` does not reload — must choose the right interface |
| Supports validation at startup (`ValidateOnStart`) | |

---

## CQRS

**Category:** Architectural

**Command Query Responsibility Segregation (CQRS)** separates **write operations (Commands)** from **read operations (Queries)** into distinct models. Each side can be optimised, scaled, and evolved independently. In ASP.NET Core, CQRS is typically implemented using **MediatR** as the in-process dispatcher.

### CQS vs CQRS

| | CQS | CQRS |
|---|---|---|
| Level | Method / class | Architectural |
| Coined by | Bertrand Meyer | Greg Young |
| Concept | Methods are either commands (mutate, no return) or queries (return value, no side effects) | Separate models, handlers, and optionally databases for reads and writes |

### When to Use

✅ **Use CQRS when:**
- The application has complex business logic on the write side and complex query needs on the read side
- Read and write load need to scale independently
- You want clear, focused use-case handlers with no fat service classes
- Pipeline cross-cutting concerns (validation, logging, transactions) should apply uniformly
- You are building with Clean Architecture or Domain-Driven Design

❌ **Avoid when:**
- The application is a simple CRUD API with no domain logic
- The team is unfamiliar with the pattern — the learning curve can slow initial development
- Eventual consistency (dual databases) is not acceptable for your use case

### Flow

```
HTTP Request
     │
     ▼
Controller  ──  ISender.Send(command | query)
     │
     ▼
MediatR Pipeline  ──  IPipelineBehavior<TRequest, TResponse>
     │                ├── ValidationBehavior
     │                ├── LoggingBehavior
     │                └── TransactionBehavior
     ▼
Handler
     ├── Command → Repository → Domain Logic → SaveChanges()
     └── Query   → Dapper / EF Projection → DTO → Response
```

### Implementation (C# — with MediatR)

```csharp
// Marker interfaces in Application/Abstractions/Messaging
public interface ICommand<TResponse> : IRequest<TResponse>;
public interface IQuery<TResponse> : IRequest<TResponse>;
public interface ICommandHandler<TCommand, TResponse>
    : IRequestHandler<TCommand, TResponse>
    where TCommand : ICommand<TResponse>;
public interface IQueryHandler<TQuery, TResponse>
    : IRequestHandler<TQuery, TResponse>
    where TQuery : IQuery<TResponse>;
```

```csharp
// Command + Validator
public sealed record CreateOrderCommand(Guid CustomerId, decimal Amount)
    : ICommand<Guid>;

public sealed class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
    }
}

// Command Handler
internal sealed class CreateOrderCommandHandler(
    IOrderRepository repository,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateOrderCommand, Guid>
{
    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        var order = Order.Create(new CustomerId(request.CustomerId), request.Amount);
        repository.Add(order);
        await unitOfWork.SaveChangesAsync(ct);
        return order.Id.Value;
    }
}
```

```csharp
// Query + Handler (thin read — no domain model)
public sealed record GetOrderQuery(Guid OrderId) : IQuery<OrderResponse?>;

internal sealed class GetOrderQueryHandler(IDbConnectionFactory factory)
    : IQueryHandler<GetOrderQuery, OrderResponse?>
{
    public async Task<OrderResponse?> Handle(GetOrderQuery request, CancellationToken ct)
    {
        using var connection = await factory.OpenAsync(ct);
        return await connection.QuerySingleOrDefaultAsync<OrderResponse>(
            "SELECT Id, CustomerId, Amount, Status FROM Orders WHERE Id = @Id",
            new { Id = request.OrderId });
    }
}
```

```csharp
// Controller — thin, delegates to MediatR
[ApiController]
[Route("api/orders")]
public sealed class OrdersController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderCommand command, CancellationToken ct)
    {
        var id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await sender.Send(new GetOrderQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }
}
```

### Pipeline Behavior (Validation Example)

```csharp
public sealed class ValidationBehavior<TRequest, TResponse>(
    IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        var failures = validators
            .Select(v => v.Validate(new ValidationContext<TRequest>(request)))
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        if (failures.Count > 0)
            throw new ValidationException(failures);

        return await next();
    }
}
```

### Registration

```csharp
// Application/DependencyInjection.cs
services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(ApplicationAssembly).Assembly));

services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));

services.AddValidatorsFromAssembly(typeof(ApplicationAssembly).Assembly);
```

### Pros and Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Clear separation of read and write concerns | More boilerplate — one class per use case |
| Handlers are small, focused, and independently testable | Learning curve for teams new to MediatR |
| Pipeline behaviors enable DRY cross-cutting concerns | Thin CRUD apps gain little benefit |
| Read side can use a lighter stack (Dapper, raw SQL) | Dual-database CQRS introduces eventual consistency complexity |
| Reads and writes scale independently | |

---

## References

- [Refactoring.Guru — Singleton Pattern](https://refactoring.guru/design-patterns/singleton)
- [Refactoring.Guru — Bridge Pattern](https://refactoring.guru/design-patterns/bridge)
- [Microsoft — Repository Pattern (ASP.NET Core)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/repository-pattern)
- [Microsoft — Options Pattern in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options)
- [Microsoft — Options Pattern in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/options)
- [Microsoft — CQRS Pattern (Azure Architecture Center)](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [Milan Jovanović — CQRS Pattern with MediatR](https://www.milanjovanovic.tech/blog/cqrs-pattern-with-mediatr)
- [MediatR — GitHub](https://github.com/jbogard/MediatR)