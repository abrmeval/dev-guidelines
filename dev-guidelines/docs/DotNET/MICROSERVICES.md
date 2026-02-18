# Microservices Architecture (.NET)

Microservices decompose an application into **small, independently deployable services**, each owning a single business capability, its own data store, and its own deployment lifecycle. In .NET, this is the recommended architecture for large-scale, cloud-native systems.

> Reference: [Microsoft — .NET Microservices: Architecture for Containerized .NET Applications](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/)

---

## Core Concept

Each service is an autonomous unit:

```
Client
  │
  ▼
API Gateway (YARP / Ocelot / Azure API Management)
  │
  ├──► Order Service          (own DB, own deploy, own repo)
  ├──► Customer Service       (own DB, own deploy, own repo)
  ├──► Catalog Service        (own DB, own deploy, own repo)
  └──► Notification Service   (own DB, own deploy, own repo)
        │
        └──► Message Broker (RabbitMQ / Azure Service Bus / Kafka)
```

---

## When to Use

✅ **Use Microservices when:**
- Different parts of the system have dramatically different scaling requirements
- Multiple autonomous teams need to deploy independently without coordination
- The domain is large and complex with many distinct bounded contexts
- The system is cloud-native and requires high availability, resilience, and elasticity
- Technology diversity across services is a business requirement (polyglot persistence)
- Different features have different uptime / SLA requirements

❌ **Avoid when:**
- Building an MVP, prototype, or early-stage product
- The team is small and lacks DevOps/cloud maturity
- The domain is not yet well understood (premature decomposition is dangerous)
- Operational complexity (service discovery, distributed tracing, circuit breakers) is not justified
- Data consistency requirements are strict across what would be separate services

> **Recommendation:** Start with a well-structured Modular Monolith and extract services when justified by clear scaling or deployment needs.

---

## Solution Structure (Per Service)

Each microservice is an independent solution or repository:

```
OrderService/
├── src/
│   ├── OrderService.API/                 # ASP.NET Core Web API entry point
│   │   ├── Program.cs
│   │   ├── Controllers/
│   │   │   └── OrdersController.cs
│   │   ├── Middleware/
│   │   └── Extensions/
│   │
│   ├── OrderService.Application/         # Use cases, CQRS commands/queries
│   │   ├── Commands/
│   │   │   └── CreateOrder/
│   │   │       ├── CreateOrderCommand.cs
│   │   │       └── CreateOrderHandler.cs
│   │   ├── Queries/
│   │   │   └── GetOrder/
│   │   │       ├── GetOrderQuery.cs
│   │   │       └── GetOrderHandler.cs
│   │   ├── DTOs/
│   │   ├── Validators/
│   │   └── IntegrationEvents/            # Events published to the message broker
│   │       ├── OrderCreatedIntegrationEvent.cs
│   │       └── Handlers/
│   │
│   ├── OrderService.Domain/              # Pure domain — no external dependencies
│   │   ├── Entities/
│   │   │   └── Order.cs
│   │   ├── ValueObjects/
│   │   ├── Interfaces/
│   │   │   └── IOrderRepository.cs
│   │   ├── Events/                       # Domain events
│   │   │   └── OrderCreatedDomainEvent.cs
│   │   └── Exceptions/
│   │
│   └── OrderService.Infrastructure/      # EF Core, messaging, external APIs
│       ├── Persistence/
│       │   ├── OrdersDbContext.cs
│       │   ├── Repositories/
│       │   │   └── OrderRepository.cs
│       │   └── Configurations/
│       ├── Messaging/                    # Message broker integration (MassTransit, etc.)
│       │   └── OrderCreatedIntegrationEventPublisher.cs
│       └── Extensions/
│
├── tests/
│   ├── OrderService.UnitTests/
│   └── OrderService.IntegrationTests/
│
├── Dockerfile
├── docker-compose.yml                    # Local dev compose
└── OrderService.sln
```

---

## Multi-Service Repository Layout (Monorepo option)

```
MySystem.sln
├── src/
│   ├── Services/
│   │   ├── OrderService/            (mirrors structure above)
│   │   ├── CustomerService/
│   │   └── CatalogService/
│   ├── ApiGateway/
│   │   └── MySystem.ApiGateway/     # YARP or Ocelot
│   └── Shared/
│       └── BuildingBlocks/          # Shared NuGet-worthy infrastructure
│           ├── MySystem.BuildingBlocks.Messaging/
│           ├── MySystem.BuildingBlocks.Persistence/
│           └── MySystem.BuildingBlocks.Web/
├── tests/
│   └── (per-service test folders)
├── docker-compose.yml
└── docker-compose.override.yml
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Service solution/repo | PascalCase + `Service` | `OrderService`, `CustomerService` |
| Service projects | `{Service}.{Layer}` | `OrderService.Domain`, `OrderService.API` |
| Namespaces | `{Company}.{Service}.{Layer}` | `Acme.OrderService.Application.Commands` |
| API controllers | PascalCase + `Controller` (plural noun) | `OrdersController` |
| Commands | PascalCase + `Command` | `CreateOrderCommand` |
| Queries | PascalCase + `Query` | `GetOrderByIdQuery` |
| Handlers | PascalCase + `Handler` | `CreateOrderHandler` |
| Domain events | PascalCase + `DomainEvent` | `OrderPlacedDomainEvent` |
| Integration events | PascalCase + `IntegrationEvent` | `OrderShippedIntegrationEvent` |
| DTOs | PascalCase + `Dto` or `Request`/`Response` | `OrderDto`, `CreateOrderRequest` |
| Service endpoints (REST) | Plural, kebab-case | `/api/orders`, `/api/order-items` |
| Service-to-service topics | kebab-case, past-tense verb | `order-created`, `payment-processed` |

---

## Key Principles

1. **Each service owns its data** — no service queries another service's database directly (no shared DB)
2. **Services communicate via API or messaging** — REST/gRPC for synchronous calls; message broker for async/event-driven
3. **Design for failure** — implement retries, circuit breakers (Polly), and timeouts for all outbound calls
4. **API Gateway as the single entry point** — clients never call services directly; routing, auth, and rate limiting happen at the gateway
5. **Idempotent message consumers** — consuming the same integration event twice must produce the same result
6. **Use the Outbox Pattern** — guarantee at-least-once delivery when publishing events alongside database writes
7. **Independent CI/CD per service** — each service has its own pipeline, container image, and deployment
8. **Centralized observability** — structured logging (Serilog), distributed tracing (OpenTelemetry), and metrics aggregated centrally (Grafana, Azure Monitor)
9. **Service discovery** — use Kubernetes DNS, Consul, or Azure Service Fabric for service-to-service resolution
10. **Versioned APIs** — version all service contracts (`/api/v1/orders`) to allow independent evolution

---

## Inter-Service Communication

| Pattern | Technology | When to Use |
|---|---|---|
| Synchronous REST | HttpClient + Polly | Real-time queries, simple request/response |
| Synchronous gRPC | gRPC + Protobuf | High-throughput, low-latency internal calls |
| Async messaging | MassTransit + RabbitMQ / Azure Service Bus | Decoupled event-driven workflows |
| Event streaming | Apache Kafka | High-throughput event logs, replay scenarios |

---

## Common Infrastructure (BuildingBlocks)

| Concern | Library / Pattern |
|---|---|
| Messaging abstraction | [MassTransit](https://masstransit.io/) |
| Resilience | [Polly](https://github.com/App-vNext/Polly) |
| API Gateway | [YARP](https://microsoft.github.io/reverse-proxy/) or Ocelot |
| Distributed tracing | [OpenTelemetry .NET](https://opentelemetry.io/docs/languages/dotnet/) |
| Structured logging | [Serilog](https://serilog.net/) |
| Health checks | `Microsoft.Extensions.Diagnostics.HealthChecks` |
| Service-to-service auth | JWT Bearer tokens, mTLS |
| Outbox pattern | [Wolverine](https://wolverine.netlify.app/) or custom |

---

## References

- [Microsoft — .NET Microservices Architecture Guide](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/)
- [Microsoft — eShopOnContainers Reference Application](https://github.com/dotnet-architecture/eShopOnContainers)
- [Microsoft — Naming Guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/naming-guidelines)
- [MassTransit Documentation](https://masstransit.io/documentation)
- [OpenTelemetry .NET](https://opentelemetry.io/docs/languages/dotnet/)
