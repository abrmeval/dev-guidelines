---
title: Vertical Slice Architecture
description: Feature-first architecture organizing code by use case rather than technical layer
sidebar_position: 1
---

# Vertical Slice Architecture (.NET)

Vertical Slice Architecture (VSA) organizes code by **feature/use case** rather than by technical layer. Each "slice" is a self-contained vertical cut through all application concerns — from the HTTP endpoint down to the database — for a single feature or operation.

> Coined and popularized by [Jimmy Bogard](https://www.jimmybogard.com/vertical-slice-architecture/) (creator of MediatR and AutoMapper).

---

## Core Concept

Traditional layered architecture organizes by **technical role** (Controllers, Services, Repositories). VSA organizes by **business capability** (CreateOrder, GetOrder, CancelOrder). Each slice owns everything it needs and changes independently.

```
Traditional (Layered):            Vertical Slice:
/Controllers                      /Features
/Services                           /Orders
/Repositories                         CreateOrder.cs
/Models                               GetOrder.cs
                                      CancelOrder.cs
                                    /Customers
                                      RegisterCustomer.cs
```

---

## When to Use

✅ **Use Vertical Slice when:**
- The application has many distinct features or use cases
- You want to reduce coupling between unrelated features
- Teams work on different features in parallel with minimal merge conflicts
- You are building CQRS-heavy applications (pairs naturally with MediatR)
- You want self-contained, independently testable feature units
- Features evolve at different rates and need different data shapes

❌ **Avoid Vertical Slice when:**
- The application is very small (CRUD-only, few features)
- The team is unfamiliar with CQRS patterns
- Strong shared business rules exist across many features simultaneously

---

## Project Structure

```
MyApp.sln
├── src/
│   ├── MyApp.API/                    # Entry point — minimal APIs or controllers
│   │   ├── Program.cs
│   │   ├── Features/
│   │   │   ├── Orders/
│   │   │   │   ├── CreateOrder/
│   │   │   │   │   ├── CreateOrderCommand.cs       # MediatR request + response
│   │   │   │   │   ├── CreateOrderHandler.cs       # Business logic
│   │   │   │   │   ├── CreateOrderValidator.cs     # FluentValidation
│   │   │   │   │   └── CreateOrderEndpoint.cs      # Minimal API or Controller
│   │   │   │   ├── GetOrder/
│   │   │   │   │   ├── GetOrderQuery.cs
│   │   │   │   │   ├── GetOrderHandler.cs
│   │   │   │   │   └── GetOrderEndpoint.cs
│   │   │   │   └── CancelOrder/
│   │   │   │       ├── CancelOrderCommand.cs
│   │   │   │       ├── CancelOrderHandler.cs
│   │   │   │       └── CancelOrderEndpoint.cs
│   │   │   └── Customers/
│   │   │       └── RegisterCustomer/
│   │   │           ├── RegisterCustomerCommand.cs
│   │   │           ├── RegisterCustomerHandler.cs
│   │   │           └── RegisterCustomerEndpoint.cs
│   │   └── Common/                   # Cross-cutting concerns (middleware, filters, etc.)
│   │       ├── Behaviors/            # MediatR pipeline behaviors (logging, validation)
│   │       ├── Exceptions/
│   │       └── Extensions/
│   └── MyApp.Infrastructure/         # Shared infrastructure (EF Core, external services)
│       ├── Persistence/
│       │   ├── AppDbContext.cs
│       │   └── Migrations/
│       └── Extensions/
└── tests/
    ├── MyApp.UnitTests/
    │   └── Features/
    │       └── Orders/
    │           └── CreateOrderHandlerTests.cs
    └── MyApp.IntegrationTests/
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Feature folder | PascalCase, verb+noun | `CreateOrder/`, `GetUserById/` |
| Command/Query class | PascalCase + `Command`/`Query` | `CreateOrderCommand`, `GetOrderQuery` |
| Handler class | PascalCase + `Handler` | `CreateOrderHandler`, `GetOrderHandler` |
| Validator class | PascalCase + `Validator` | `CreateOrderValidator` |
| Endpoint class | PascalCase + `Endpoint` | `CreateOrderEndpoint` |
| Response/Result class | PascalCase + `Response`/`Result` | `CreateOrderResponse`, `GetOrderResult` |
| Namespace | `{App}.Features.{Domain}.{UseCase}` | `MyApp.Features.Orders.CreateOrder` |

---

## Key Principles

1. **A slice owns its request, handler, response, validator, and endpoint** — all in one folder
2. **No shared service layers** — handlers call the database directly (EF Core/Dapper) unless truly shared
3. **Duplication is preferred over wrong abstraction** — resist extracting shared services prematurely
4. **MediatR is a convention, not a requirement** — can use direct handler injection or minimal APIs
5. **Each slice is independently testable** — unit test the handler in isolation; integration test via the endpoint

---

## Typical Slice File (`CreateOrderCommand.cs`)

```csharp
namespace MyApp.Features.Orders.CreateOrder;

// Request
public record CreateOrderCommand(Guid CustomerId, List<OrderItem> Items) : IRequest<CreateOrderResponse>;

// Response
public record CreateOrderResponse(Guid OrderId, decimal Total);

// Handler
public class CreateOrderHandler(AppDbContext db) : IRequestHandler<CreateOrderCommand, CreateOrderResponse>
{
    public async Task<CreateOrderResponse> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        var order = Order.Create(request.CustomerId, request.Items);
        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        return new CreateOrderResponse(order.Id, order.Total);
    }
}

// Validator
public class CreateOrderValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.Items).NotEmpty();
    }
}
```

---

## Common Libraries

| Purpose | Library |
|---|---|
| Mediator pattern | [MediatR](https://github.com/jbogard/MediatR) |
| Validation | [FluentValidation](https://fluentvalidation.net/) |
| ORM | Entity Framework Core or Dapper |
| Mapping | Mapperly or manual mapping (avoid AutoMapper per-slice) |
| Minimal APIs | ASP.NET Core built-in |
| Pipeline behaviors | MediatR `IPipelineBehavior<,>` |

---

## References

- [Jimmy Bogard — Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [Code Maze — Vertical Slice Architecture in ASP.NET Core](https://code-maze.com/vertical-slice-architecture-aspnet-core/)
- [Vertical Slice Architecture .NET Template (GitHub)](https://github.com/nadirbad/VerticalSliceArchitecture)
