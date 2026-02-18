# React Project Structure (Vite + Bun)

This document defines the recommended folder and file structure for React projects using Vite as the build tool and Bun as the runtime/package manager. The structure follows a feature-first approach for scalable, maintainable codebases.

---

## Root-Level Structure

```
my-react-app/
├── public/                  # Static files served as-is (favicon, robots.txt, etc.)
├── src/                     # All application source code
├── .env                     # Default environment variables
├── .env.local               # Local overrides (git-ignored)
├── .env.development         # Dev-specific env vars
├── .env.production          # Prod-specific env vars
├── .gitignore
├── bun.lockb                # Bun lockfile (commit this)
├── bunfig.toml              # Bun configuration (optional)
├── index.html               # Vite entry HTML
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts           # Vite configuration
└── README.md
```

---

## `src/` Structure

```
src/
├── main.tsx                 # App entry point — mounts React root
├── App.tsx                  # Root component — router + global providers
├── app/                     # App-wide setup (router, store, providers)
│   ├── router.tsx           # Route definitions (react-router or tanstack-router)
│   └── providers.tsx        # Wraps app with all context providers
├── assets/                  # Static assets bundled by Vite
│   ├── fonts/
│   ├── icons/
│   └── images/
├── components/              # Shared, reusable UI components (no business logic)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   └── ...
├── constants/               # App-wide constant values
│   ├── apiEndpoints.ts      # All API URL paths
│   ├── appConfig.ts         # App-level configuration constants
│   └── queryKeys.ts         # React Query / cache keys
├── contexts/                # React context definitions and providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── data/                    # Static data and seed content
│   ├── mockUsers.ts         # Mock/static data used in dev or tests
│   └── countryList.ts       # Static reference data (no API call needed)
├── features/                # Feature modules — self-contained vertical slices
│   └── user/
│       ├── components/      # UI components specific to this feature
│       ├── hooks/           # Hooks specific to this feature
│       ├── services/        # API calls for this feature
│       ├── types/           # Types/interfaces for this feature
│       ├── utils/           # Helpers scoped to this feature
│       └── index.ts         # Public API of the feature (re-exports)
├── hooks/                   # Shared custom hooks used across features
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── layouts/                 # Page layout wrappers
│   ├── MainLayout.tsx       # Header + sidebar + footer shell
│   └── AuthLayout.tsx       # Centered layout for login/register pages
├── pages/                   # Route-level page components (thin, delegate to features)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
├── services/                # Shared API and external service integrations
│   ├── apiClient.ts         # Axios/fetch base client (interceptors, base URL)
│   ├── authService.ts       # Auth API calls (login, logout, refresh)
│   └── userService.ts       # User API calls
├── store/                   # Global client state (Zustand, Redux, Jotai, etc.)
│   ├── authStore.ts
│   └── uiStore.ts
├── theme/                   # Design tokens, global styles, and theming
│   ├── colors.ts            # Color palette constants
│   ├── typography.ts        # Font sizes, weights, line heights
│   ├── breakpoints.ts       # Responsive breakpoint values
│   ├── index.ts             # Re-exports all theme tokens
│   └── global.css           # Global CSS resets and base styles
├── types/                   # Shared global TypeScript types and interfaces
│   ├── api.types.ts         # Generic API response shapes
│   ├── auth.types.ts
│   └── user.types.ts
└── utils/                   # Pure, stateless utility functions
    ├── formatDate.ts
    ├── parseJwt.ts
    └── debounce.ts
```

---

## Key Conventions

### `components/` vs `features/`
- `components/` — generic, reusable UI primitives with no domain knowledge (Button, Modal, Input)
- `features/` — domain-specific modules that own their own components, hooks, services, and types

### `pages/`
- Pages are thin wrappers — they compose feature components and handle route-level concerns (title, layout selection)
- No direct API calls or business logic inside page files

### `services/`
- `apiClient.ts` is the single configured HTTP client (base URL, auth headers, error interceptors)
- Feature-level services live inside `features/<name>/services/` and import `apiClient`
- Shared services (used by multiple features) live in `src/services/`

### `data/`
- Static, hardcoded reference data that never comes from an API (country lists, enums, mock data)
- Mock data used for development or testing lives here, not in component files

### `theme/`
- All design tokens (colors, spacing, typography, breakpoints) are defined here
- Components import from `theme/` instead of hardcoding values
- Global CSS resets and base styles go in `global.css`

### `store/`
- Client-only state (UI state, auth state) — not server/cache state
- Server state (API data) is managed by a data-fetching library (React Query, SWR)

### `hooks/`
- Shared hooks that are not tied to any specific feature
- Feature-specific hooks live inside `features/<name>/hooks/`

### `utils/`
- Pure functions only — no React imports, no side effects, no API calls
- Feature-specific utils live inside `features/<name>/utils/`

### `constants/`
- Module-level values in UPPER_SNAKE_CASE
- API endpoint paths, query cache keys, and app configuration all live here

---

## `features/` Deep Dive

Each feature is a self-contained vertical slice:

```
features/
└── user/
    ├── components/
    │   ├── UserCard/
    │   │   ├── UserCard.tsx
    │   │   ├── UserCard.module.css
    │   │   └── index.ts
    │   └── UserList/
    │       ├── UserList.tsx
    │       └── index.ts
    ├── hooks/
    │   └── useUser.ts          # Data fetching hook for user entity
    ├── services/
    │   └── userService.ts      # fetch/create/update/delete user API calls
    ├── types/
    │   └── user.types.ts       # User, UserRole, CreateUserDto, etc.
    ├── utils/
    │   └── formatUserName.ts   # Feature-scoped pure helpers
    └── index.ts                # Re-exports: components, hooks, types (public API)
```

> Only import from a feature via its `index.ts` — never reach into internal subfolders from outside the feature.

---

## `public/` vs `src/assets/`

| | `public/` | `src/assets/` |
|---|---|---|
| Processed by Vite | ❌ No | ✅ Yes (hashed, optimized) |
| Imported in code | ❌ Referenced by path | ✅ `import logo from './assets/logo.svg'` |
| Use for | `favicon.ico`, `robots.txt`, `manifest.json` | Images, fonts, icons used in components |

---

## Vite + Bun Configuration Notes

- Use `vite.config.ts` path aliases to avoid deep relative imports:
  ```ts
  // vite.config.ts
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@services': path.resolve(__dirname, './src/services'),
      '@pages': path.resolve(__dirname, './src/pages'),
    }
  }
  ```
- Mirror the same aliases in `tsconfig.app.json` under `compilerOptions.paths`
- Use `bun install`, `bun run dev`, `bun run build`, `bun run test` as the standard commands
- Store sensitive config in `.env.local` (git-ignored); only commit `.env` with safe defaults
