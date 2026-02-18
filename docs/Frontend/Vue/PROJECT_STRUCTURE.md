# Vue Project Structure (Vite + Bun)

This document defines the recommended folder and file structure for Vue 3 projects using Vite as the build tool and Bun as the runtime/package manager. The structure uses the Composition API with `<script setup>`, Pinia for state management, and Vue Router for routing.

---

## Root-Level Structure

```
my-vue-app/
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
├── main.ts                  # App entry point — creates and mounts Vue app
├── App.vue                  # Root component — router-view + global layout
├── app/                     # App-wide setup (plugins, global config)
│   └── plugins.ts           # Registers Pinia, Router, and other global plugins
├── assets/                  # Static assets bundled by Vite
│   ├── fonts/
│   ├── icons/
│   └── images/
├── components/              # Shared, reusable UI components (no business logic)
│   ├── base/                # Generic primitives (BaseButton, BaseInput, BaseModal)
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── index.ts
│   └── UserCard/            # Domain-agnostic shared components
│       ├── UserCard.vue
│       └── index.ts
├── composables/             # Shared composables used across features
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── constants/               # App-wide constant values
│   ├── apiEndpoints.ts      # All API URL paths
│   ├── appConfig.ts         # App-level configuration constants
│   └── queryKeys.ts         # VueQuery / cache keys (if used)
├── data/                    # Static data and seed content
│   ├── mockUsers.ts         # Mock/static data used in dev or tests
│   └── countryList.ts       # Static reference data (no API call needed)
├── features/                # Feature modules — self-contained vertical slices
│   └── user/
│       ├── components/      # Vue SFCs specific to this feature
│       ├── composables/     # Composables specific to this feature
│       ├── services/        # API calls for this feature
│       ├── stores/          # Pinia stores scoped to this feature
│       ├── types/           # Types/interfaces for this feature
│       ├── utils/           # Helpers scoped to this feature
│       └── index.ts         # Public API of the feature (re-exports)
├── layouts/                 # Layout wrapper components (used by router)
│   ├── MainLayout.vue       # Header + sidebar + footer shell
│   └── AuthLayout.vue       # Centered layout for login/register views
├── router/                  # Vue Router configuration
│   ├── index.ts             # Router instance creation and guards
│   └── routes.ts            # Route definitions (split for large apps)
├── services/                # Shared API and external service integrations
│   ├── apiClient.ts         # Axios/fetch base client (interceptors, base URL)
│   ├── authService.ts       # Auth API calls (login, logout, refresh)
│   └── userService.ts       # User API calls
├── stores/                  # Global Pinia stores
│   ├── authStore.ts         # Auth state (user, token, permissions)
│   └── uiStore.ts           # UI state (sidebar open, theme, notifications)
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
├── utils/                   # Pure, stateless utility functions
│   ├── formatDate.ts
│   ├── parseJwt.ts
│   └── debounce.ts
└── views/                   # Route-level view components (thin, delegate to features)
    ├── HomeView.vue
    ├── LoginView.vue
    ├── DashboardView.vue
    └── NotFoundView.vue
```

---

## Key Conventions

### `components/` vs `features/`
- `components/` — generic, reusable UI primitives with no domain knowledge (`BaseButton`, `BaseModal`, `UserCard`)
- `features/` — domain-specific modules that own their own components, composables, stores, services, and types

### `views/`
- Views are thin wrappers — they select a layout, compose feature components, and handle route-level concerns (page title, meta)
- No direct API calls or business logic inside view files
- Each view corresponds to exactly one route

### `layouts/`
- Layouts wrap views and provide structural chrome (header, sidebar, footer)
- Views declare which layout to use via Vue Router's `meta.layout` or by wrapping with a layout component

### `services/`
- `apiClient.ts` is the single configured HTTP client (base URL, auth headers, error interceptors)
- Feature-level services live inside `features/<name>/services/` and import `apiClient`
- Shared services (used by multiple features) live in `src/services/`

### `stores/`
- Use Pinia with the Composition API style (`defineStore` with a `setup` function)
- Global stores live in `src/stores/`; feature-scoped stores live in `features/<name>/stores/`
- Stores own client state only — server/cache state is managed by VueQuery or a similar library

### `composables/`
- Shared composables that are not tied to any specific feature live in `src/composables/`
- Feature-specific composables live inside `features/<name>/composables/`
- Always prefix with `use` (e.g., `useAuth`, `useUserList`)

### `data/`
- Static, hardcoded reference data that never comes from an API (country lists, enums, mock data)
- Mock data for development or testing lives here, not inside component or composable files

### `theme/`
- All design tokens (colors, spacing, typography, breakpoints) are defined here
- Components import from `theme/` instead of hardcoding values
- Global CSS resets and base styles go in `global.css`

### `utils/`
- Pure functions only — no Vue imports, no side effects, no API calls
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
    │   │   ├── UserCard.vue
    │   │   ├── UserCardAvatar.vue    ← tightly coupled child
    │   │   └── index.ts
    │   └── UserList/
    │       ├── UserList.vue
    │       └── index.ts
    ├── composables/
    │   └── useUser.ts               # Data fetching composable for user entity
    ├── services/
    │   └── userService.ts           # fetch/create/update/delete user API calls
    ├── stores/
    │   └── userStore.ts             # Feature-scoped Pinia store
    ├── types/
    │   └── user.types.ts            # User, UserRole, CreateUserDto, etc.
    ├── utils/
    │   └── formatUserName.ts        # Feature-scoped pure helpers
    └── index.ts                     # Re-exports: components, composables, types (public API)
```

> Only import from a feature via its `index.ts` — never reach into internal subfolders from outside the feature.

---

## `router/routes.ts` Structure

For large apps, split route definitions by feature:

```ts
// router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('@/views/LoginView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('@/views/NotFoundView.vue') },
]
```

- Always use lazy imports (`() => import(...)`) for route components — Vite will code-split automatically
- Name every route for programmatic navigation via `router.push({ name: 'dashboard' })`

---

## `public/` vs `src/assets/`

| | `public/` | `src/assets/` |
|---|---|---|
| Processed by Vite | ❌ No | ✅ Yes (hashed, optimized) |
| Imported in code | ❌ Referenced by path string | ✅ `import logo from '@/assets/logo.svg'` |
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
      '@composables': path.resolve(__dirname, './src/composables'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@services': path.resolve(__dirname, './src/services'),
      '@views': path.resolve(__dirname, './src/views'),
    }
  }
  ```
- Mirror the same aliases in `tsconfig.app.json` under `compilerOptions.paths`
- Use `bun install`, `bun run dev`, `bun run build`, `bun run test` as the standard commands
- Store sensitive config in `.env.local` (git-ignored); only commit `.env` with safe defaults
