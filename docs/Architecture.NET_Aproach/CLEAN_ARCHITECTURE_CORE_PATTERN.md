# Clean Architecture — Core Pattern (.NET / ASP.NET Core)

A **pragmatic variant of Clean Architecture** that merges the Domain and Application layers into a single `Core` project. This reduces solution complexity while preserving the essential dependency rule: inner layers never reference outer layers. It pairs naturally with a **Service + Repository pattern** (no CQRS) and **Dapper** for data access.

> Based on real-world usage in [abrmeval/nikola_admissions-service](https://github.com/abrmeval/nikola_admissions-service).

---

## How It Differs from Full Clean Architecture

| Concern | Full Clean Architecture | Core Pattern |
|---|---|---|
| Domain layer | Separate project (`{App}.Domain`) | Merged into `{App}.Core` |
| Application layer | Separate project (`{App}.Application`) | Merged into `{App}.Core` |
| Use-case approach | CQRS — Commands / Queries / Handlers | Service interfaces + implementations |
| ORM | EF Core (typical) | **Dapper** + raw SQL scripts |
| DB migrations | EF Core migrations | Embedded `.sql` scripts via shared infra package |
| Inter-service events | Optional | **MassTransit + Azure Service Bus** (publish-only) |
| External consumers | N/A | Separate `{App}.Client` project (event contracts) |

---

## When to Use

✅ **Use the Core Pattern when:**
- The service is focused and bounded (microservice or single-domain API)
- The team prefers a **Service + Repository** pattern over CQRS
- You use **Dapper** or another micro-ORM where EF Core migrations are not in play
- The domain model doesn't require strict Domain / Application separation overhead
- You need a **publish-only** integration event contract for other services to consume
- You want a lighter solution structure with fewer projects

❌ **Avoid when:**
- The domain is complex enough to need rich aggregates with strict invariants
- Multiple teams work on the same service and need the hard Application boundary
- You need CQRS pipeline behaviors (validation, logging, transactions via MediatR)
- The service both publishes and consumes many event types (use full CA + MassTransit consumers)

---

## Solution Structure

```
MyApp.sln
├── src/
│   ├── MyApp.Core/                          # Domain + Application merged
│   │   ├── Constants/                       # App-wide string/numeric constants
│   │   ├── DTOs/                            # Request and response objects
│   │   │   ├── Requests/
│   │   │   └── Responses/
│   │   ├── Entities/                        # Domain entities (data + behaviour)
│   │   ├── Enums/                           # Domain-level enumerations
│   │   ├── Interfaces/
│   │   │   ├── Repositories/                # IRepository interfaces
│   │   │   │   └── IApplicantRepository.cs
│   │   │   └── Services/                    # IService interfaces
│   │   │       └── IApplicantService.cs
│   │   └── Validators/                      # FluentValidation validators for DTOs
│   │       └── CreateApplicantRequestValidator.cs
│   │
│   ├── MyApp.Infrastructure/                # External-world implementations
│   │   ├── Configuration/                   # Options classes bound from appsettings
│   │   │   └── DynamicsSettings.cs
│   │   ├── Data/
│   │   │   ├── DapperColumnAttributeMapper.cs   # Maps [Column] attributes to Dapper
│   │   │   └── Repositories/                    # IRepository implementations (Dapper)
│   │   │       └── ApplicantRepository.cs
│   │   ├── DependencyInjection/
│   │   │   └── DependencyInjection.cs       # AddInfrastructure(IServiceCollection)
│   │   ├── Extensions/
│   │   ├── ExternalServices/                # Third-party API clients (Dynamics, Graph, etc.)
│   │   │   └── ApplicantDynamicsService.cs
│   │   ├── Http/                            # DelegatingHandlers for HTTP clients
│   │   │   └── DynamicsBearerTokenHandler.cs
│   │   ├── Scripts/
│   │   │   └── Migrations/                  # Embedded .sql migration scripts
│   │   │       └── 001_CreateApplicants.sql
│   │   ├── Services/                        # IService implementations
│   │   │   └── ApplicantService.cs
│   │   ├── Utils/
│   │   └── InfrastructureAssembly.cs        # Assembly marker for migration discovery
│   │
│   ├── MyApp.Api/                           # ASP.NET Core entry point
│   │   ├── Controllers/
│   │   │   └── ApplicantsController.cs
│   │   ├── Filters/                         # Action / operation filters
│   │   ├── Helpers/
│   │   ├── Properties/
│   │   │   └── launchSettings.json
│   │   ├── appsettings.json
│   │   ├── appsettings.Production.json
│   │   └── Program.cs
│   │
│   └── MyApp.Client/                        # Integration event contracts for consumers
│       └── Events/
│           └── ApplicantCreatedEvent.cs
│
└── tests/
    ├── MyApp.Core.UnitTests/
    ├── MyApp.Infrastructure.IntegrationTests/
    └── MyApp.ArchitectureTests/
```

---

## Dependency Graph

```
MyApp.Api
  ├── MyApp.Core
  ├── MyApp.Infrastructure
  └── MyApp.Client

MyApp.Infrastructure
  ├── MyApp.Core
  └── MyApp.Client

MyApp.Core
  └── (no project references — only NuGet)

MyApp.Client
  └── (no project references — only NuGet)
```

> `MyApp.Api` references `Infrastructure` only for DI registration in `Program.cs`. All other code in `Api` uses only `Core` interfaces.

---

## Layer Details

### 1. Core

The innermost layer. Defines **what** the application does — entities, contracts, and validation rules. No knowledge of databases, HTTP, or external services.

```
MyApp.Core/
├── Constants/     # Shared string/integer constants (e.g., role names, claim types)
├── DTOs/          # Input (requests) and output (responses) shapes used by controllers and services
├── Entities/      # Domain objects — carry state and simple business logic
├── Enums/         # Typed enumerations for status fields, categories, etc.
├── Interfaces/
│   ├── Repositories/   # Data-access contracts — implemented in Infrastructure
│   └── Services/       # Application service contracts — implemented in Infrastructure
└── Validators/    # FluentValidation AbstractValidator<TRequest> classes
```

**Rules:**
- ❌ No `ProjectReference` to Infrastructure, Api, or Client
- ✅ May reference `Microsoft.AspNetCore.App` framework only when DTOs use `IFormFile`
- ✅ Validators live alongside their request DTOs
- ✅ Service interfaces define the use-case boundary — keep them focused and async

```csharp
// Interfaces/Repositories/IApplicantRepository.cs
public interface IApplicantRepository
{
    Task<Applicant?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Applicant>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Applicant applicant, CancellationToken ct = default);
}

// Interfaces/Services/IApplicantService.cs
public interface IApplicantService
{
    Task<ApplicantResponse?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Guid> CreateAsync(CreateApplicantRequest request, CancellationToken ct = default);
}

// Validators/CreateApplicantRequestValidator.cs
public sealed class CreateApplicantRequestValidator : AbstractValidator<CreateApplicantRequest>
{
    public CreateApplicantRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(200);
    }
}
```

---

### 2. Infrastructure

Implements every interface declared in `Core`. Contains all external-world concerns: database, HTTP clients, Azure services, messaging, and background jobs.

```
MyApp.Infrastructure/
├── Configuration/       # IOptions<T> classes — one per external service
├── Data/
│   ├── DapperColumnAttributeMapper.cs   # Registers [Column] attribute type mappings
│   └── Repositories/                    # Dapper-based IRepository implementations
├── DependencyInjection/
│   └── DependencyInjection.cs           # Single AddInfrastructure() extension method
├── ExternalServices/    # Named HTTP client wrappers (Dynamics, Graph, Azure APIs)
├── Http/                # DelegatingHandlers for bearer token injection per HTTP client
├── Scripts/Migrations/  # Embedded .sql files — discovered via Assembly marker
├── Services/            # IService implementations that orchestrate repos + external calls
├── Utils/               # Shared helpers (e.g., pagination, mapping extensions)
└── InfrastructureAssembly.cs
```

**Rules:**
- ✅ References `Core` and `Client` only
- ✅ Each repository implements a `Core` interface using Dapper SQL
- ✅ Services inject repository interfaces — never other service implementations directly
- ✅ All `IOptions<T>` binding happens in `DependencyInjection.cs`, not in `Program.cs`
- ✅ HTTP clients are named and registered with `AddHttpClient("name")` + `DelegatingHandler`
- ❌ No business logic in repositories — only data mapping and SQL execution

```csharp
// Data/Repositories/ApplicantRepository.cs
internal sealed class ApplicantRepository(IDbConnectionFactory connectionFactory)
    : IApplicantRepository
{
    public async Task<Applicant?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        using var connection = await connectionFactory.OpenAsync(ct);
        return await connection.QuerySingleOrDefaultAsync<Applicant>(
            "SELECT * FROM Applicants WHERE Id = @Id", new { Id = id });
    }
}

// Services/ApplicantService.cs
internal sealed class ApplicantService(
    IApplicantRepository repository,
    IApplicantDynamicsService dynamicsService) : IApplicantService
{
    public async Task<Guid> CreateAsync(CreateApplicantRequest request, CancellationToken ct = default)
    {
        var applicant = new Applicant { Id = Guid.NewGuid(), Email = request.Email };
        await repository.AddAsync(applicant, ct);
        await dynamicsService.SyncAsync(applicant, ct);
        return applicant.Id;
    }
}
```

```csharp
// DependencyInjection/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Data (Dapper + UnitOfWork)
        services.AddMuralTactilData(configuration);
        DapperColumnAttributeMapper.RegisterMappings();

        // Options
        services.Configure<DynamicsSettings>(configuration.GetSection("Dynamics"));

        // Repositories
        services.AddScoped<IApplicantRepository, ApplicantRepository>();

        // Named HTTP clients
        services.AddTransient<DynamicsBearerTokenHandler>();
        services.AddHttpClient("dynamics")
            .AddHttpMessageHandler<DynamicsBearerTokenHandler>();

        // External services
        services.AddScoped<IApplicantDynamicsService, ApplicantDynamicsService>();

        // Application services
        services.AddScoped<IApplicantService, ApplicantService>();

        // MassTransit + Azure Service Bus (publish-only)
        var sbConnection = configuration["ServiceBus:ConnectionString"];
        if (!string.IsNullOrWhiteSpace(sbConnection))
        {
            services.AddMassTransit(x =>
                x.UsingAzureServiceBus((_, cfg) => cfg.Host(sbConnection)));
        }

        return services;
    }
}
```

---

### 3. Api

Thin ASP.NET Core entry point. Delegates all work to `Core` service interfaces via DI.

```
MyApp.Api/
├── Controllers/       # [ApiController] classes — parse HTTP input, call IService, return IActionResult
├── Filters/           # Global action filters and OpenAPI operation filters
├── Helpers/           # Shared controller utilities (pagination helpers, claim readers)
├── Properties/        # launchSettings.json
├── appsettings.json
├── appsettings.Production.json
└── Program.cs         # Composition root
```

**Rules:**
- ✅ References `Core` (for interfaces + DTOs) and `Infrastructure` (for `AddInfrastructure()`)
- ✅ Controllers inject `IService` interfaces — never concrete implementations
- ✅ No business logic in controllers — validate input shape, call service, return result
- ✅ Use `ProblemDetails` (RFC 7807) for error responses via a global exception filter
- ✅ Serilog structured logging configured in `Program.cs`
- ✅ `UsePathBase()` for reverse-proxy / API Gateway path prefix

```csharp
[ApiController]
[Route("applicants")]
[Authorize]
public sealed class ApplicantsController(IApplicantService applicantService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await applicantService.GetByIdAsync(id, ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateApplicantRequest request,
        CancellationToken ct)
    {
        var id = await applicantService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }
}
```

```csharp
// Program.cs — Composition root (abridged)
var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console(new RenderedCompactJsonFormatter())
    .CreateLogger();
builder.Host.UseSerilog();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddValidatorsFromAssemblyContaining<CreateApplicantRequestValidator>();
builder.Services.AddControllers();
builder.Services.AddHealthChecks();

var app = builder.Build();

// Run embedded SQL migrations on startup
if (app.Services.UseMuralTactilMigrations(args, typeof(InfrastructureAssembly).Assembly))
    return;

app.UsePathBase("/api/myapp");
app.UseAuthentication();
app.UseAuthorization();
app.UseSerilogRequestLogging();
app.MapControllers();
app.MapHealthChecks("/health/liveness");
app.Run();
```

---

### 4. Client

Published NuGet package (or shared project reference) that exposes the **integration event contracts** this service publishes. Other services reference only `Client` — never `Core` or `Infrastructure`.

```
MyApp.Client/
└── Events/
    └── ApplicantCreatedEvent.cs   # Record / class with the event payload
```

```csharp
// Events/ApplicantCreatedEvent.cs
public sealed record ApplicantCreatedEvent(
    Guid ApplicantId,
    string Email,
    DateTimeOffset OccurredAt);
```

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Solution projects | `{App}.{Layer}` | `MyApp.Core`, `MyApp.Api` |
| Entity | PascalCase | `Applicant`, `UserProfile` |
| DTO (request) | PascalCase + `Request` | `CreateApplicantRequest` |
| DTO (response) | PascalCase + `Response` | `ApplicantResponse` |
| Service interface | `I` + PascalCase + `Service` | `IApplicantService` |
| Service implementation | PascalCase + `Service` | `ApplicantService` |
| Repository interface | `I` + PascalCase + `Repository` | `IApplicantRepository` |
| Repository implementation | PascalCase + `Repository` | `ApplicantRepository` |
| External service interface | `I` + PascalCase + `Service` or `I` + Name + `DynamicsService` | `IApplicantDynamicsService` |
| Validator | PascalCase + `Validator` | `CreateApplicantRequestValidator` |
| Options / settings class | PascalCase + `Settings` | `DynamicsSettings` |
| Integration event | PascalCase + `Event` | `ApplicantCreatedEvent` |
| DelegatingHandler | PascalCase + `BearerTokenHandler` | `DynamicsBearerTokenHandler` |
| Assembly marker | `{Layer}Assembly` | `InfrastructureAssembly` |
| Namespaces | `{App}.{Layer}.{Subfolder}` | `MyApp.Infrastructure.Data.Repositories` |

---

## Key Principles

1. **Dependency rule** — `Core` has zero project references; `Infrastructure` references only `Core` and `Client`; `Api` references everything for DI wiring only
2. **Interfaces in Core, implementations in Infrastructure** — controllers and tests program against interfaces, never concrete classes
3. **Single DI entry point** — all registrations live in `Infrastructure/DependencyInjection/DependencyInjection.cs`; `Program.cs` calls only `AddInfrastructure()`
4. **Dapper + embedded SQL** — repository methods contain explicit SQL; migrations are `.sql` files embedded as resources and run at startup via assembly marker
5. **Named HTTP clients** — each external API gets its own named `HttpClient` with a dedicated `DelegatingHandler` for auth token injection
6. **Options pattern** — every external service configuration uses `IOptions<TSettings>` bound in `DependencyInjection.cs`; no `configuration["key"]` scattered in service classes
7. **Publish-only messaging** — MassTransit is configured if a Service Bus connection string is present; this service only publishes events, never consumes them
8. **Client project is the contract** — consumers reference only `{App}.Client`; breaking its API is a versioning decision

---

## Recommended NuGet Packages

| Package | Layer | Purpose |
|---|---|---|
| `FluentValidation` | Core | DTO validation |
| `Dapper` | Infrastructure | Lightweight SQL ORM |
| `MassTransit.Azure.ServiceBus.Core` | Infrastructure | Integration event publishing |
| `Azure.AI.DocumentIntelligence` | Infrastructure | OCR / document parsing |
| `Microsoft.Graph` | Infrastructure | Microsoft 365 / Entra ID Graph API |
| `Microsoft.Identity.Client` (MSAL) | Infrastructure | On-behalf-of + client credential flows |
| `Serilog.AspNetCore` | Api | Structured request logging |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | Api | Entra ID JWT validation |
| `Microsoft.Extensions.Diagnostics.HealthChecks` | Api | Liveness / readiness probes |
| `OpenTelemetry.Extensions.Hosting` | Api | Distributed tracing |
| `NetArchTest.Rules` | Tests | Architecture dependency rule enforcement |

---

## Testing Strategy

| Test Type | Scope | Notes |
|---|---|---|
| Unit tests | `Core` validators, entity logic | No mocking needed — pure logic |
| Unit tests | `Infrastructure` services with mocked repositories | Mock `IRepository` interfaces |
| Integration tests | Repositories against a real DB | Use Testcontainers (PostgreSQL / SQL Server) |
| Integration tests | API endpoints via `WebApplicationFactory` | Test HTTP layer end-to-end |
| Architecture tests | Layer dependency rules | No `Core` → `Infrastructure` reference allowed |

---

## References

- [abrmeval/nikola_admissions-service — Reference project](https://github.com/abrmeval/nikola_admissions-service/tree/main/src)
- [Milan Jovanović — Clean Architecture Folder Structure](https://www.milanjovanovic.tech/blog/clean-architecture-folder-structure)
- [TechWorld with Milan — What is Clean Architecture?](https://newsletter.techworld-with-milan.com/p/what-is-clean-architecture)
- [Microsoft — ASP.NET Core Best Practices](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices)
- [Microsoft — Options pattern in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options)
- [MassTransit — Azure Service Bus](https://masstransit.io/documentation/transports/azure-service-bus)
- [Dapper — GitHub](https://github.com/DapperLib/Dapper)
- [NetArchTest — Architecture Test Library](https://github.com/BenMorris/NetArchTest)
