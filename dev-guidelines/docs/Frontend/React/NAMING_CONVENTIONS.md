# React Naming Conventions

React naming conventions should be followed for all code in this repository. This includes:

## Project & Folder Structure

- Project root folder: kebab-case (e.g., `my-react-app`)
- Source folder: `src/`
- Feature folders inside `src/`: kebab-case (e.g., `user-profile/`, `auth/`, `dashboard/`)
- Shared/reusable code lives in `src/shared/` or `src/common/`

Recommended folder structure for a Vite + Bun project:
```
src/
├── assets/          # Static assets (images, fonts, icons)
├── components/      # Shared reusable components
├── constants/       # App-wide constants
├── contexts/        # React context providers
├── features/        # Feature-based modules (each contains its own components, hooks, etc.)
│   └── user/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── index.ts
├── hooks/           # Shared custom hooks
├── layouts/         # Layout wrapper components
├── pages/           # Route-level page components
├── services/        # API and external service calls
├── types/           # Global TypeScript types and interfaces
└── utils/           # Pure utility/helper functions
```

## Files

- Component files: PascalCase with `.tsx` extension (e.g., `UserCard.tsx`, `NavBar.tsx`)
- Hook files: camelCase prefixed with `use` and `.ts` extension (e.g., `useAuth.ts`, `useFetchUser.ts`)
- Utility/helper files: camelCase with `.ts` extension (e.g., `formatDate.ts`, `parseToken.ts`)
- Constant files: camelCase with `.ts` extension (e.g., `apiEndpoints.ts`, `appConfig.ts`)
- Context files: PascalCase suffixed with `Context` and `.tsx` extension (e.g., `AuthContext.tsx`, `ThemeContext.tsx`)
- Service files: camelCase suffixed with `Service` and `.ts` extension (e.g., `userService.ts`, `authService.ts`)
- Type/interface files: camelCase with `.types.ts` extension (e.g., `user.types.ts`, `auth.types.ts`)
- Test files: same name as the file under test with `.test.ts` or `.test.tsx` suffix (e.g., `UserCard.test.tsx`, `useAuth.test.ts`)
- Entry point: `main.tsx` (Vite default)
- Vite config: `vite.config.ts`

## Components

- Components: PascalCase (e.g., `UserCard`, `NavBar`, `LoginButton`)
- Each component should have its own folder when it includes styles or sub-components:
  ```
  components/
  └── UserCard/
      ├── UserCard.tsx
      ├── UserCard.module.css
      └── index.ts        ← re-exports UserCard for clean imports
  ```
- CSS Modules files: PascalCase matching the component (e.g., `UserCard.module.css`)
- Props interfaces: PascalCase suffixed with `Props` (e.g., `UserCardProps`, `NavBarProps`)

## Pages

- Page components: PascalCase suffixed with `Page` (e.g., `LoginPage.tsx`, `DashboardPage.tsx`, `UserProfilePage.tsx`)
- Pages map 1:1 to routes and should not contain direct business logic — delegate to feature components

## Hooks

- Custom hooks: camelCase prefixed with `use` (e.g., `useAuth`, `useFetchUser`, `useLocalStorage`)
- Hook return values: use descriptive names, not generic arrays (e.g., `const { user, isLoading, error } = useFetchUser()`)

## Context

- Context objects: PascalCase suffixed with `Context` (e.g., `AuthContext`, `ThemeContext`)
- Context providers: PascalCase suffixed with `Provider` (e.g., `AuthProvider`, `ThemeProvider`)
- Context hooks: camelCase prefixed with `use` and named after the context (e.g., `useAuth`, `useTheme`)

## Services & API

- Service files and functions: camelCase, grouped by domain (e.g., `userService.ts` containing `getUser()`, `updateUser()`)
- API fetch functions: camelCase verb + noun (e.g., `fetchUser()`, `createPost()`, `deleteComment()`)
- Base API client (e.g., `apiClient.ts`) configured once and reused across services

## Utils & Helpers

- Utility functions: camelCase, verb + noun describing the operation (e.g., `formatDate()`, `parseJwt()`, `debounce()`)
- Helper functions: camelCase (e.g., `buildQueryString()`, `truncateText()`)
- Pure functions only — no side effects in `utils/`

## Constants

- Module-level constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- Enum-like constant objects: keys in UPPER_SNAKE_CASE (e.g., `export const ROUTES = { HOME: '/', LOGIN: '/login' }`)
- Avoid magic numbers/strings — always extract to a named constant

## Types & Interfaces (TypeScript)

- Interfaces: PascalCase (e.g., `User`, `AuthState`, `ApiResponse<T>`)
- Type aliases: PascalCase (e.g., `UserId`, `Theme`, `ButtonVariant`)
- Generic type parameters: single uppercase letter or descriptive PascalCase (e.g., `T`, `TData`, `TError`)
- Avoid `I` prefix for interfaces (e.g., use `User` not `IUser`)
- Prefer `interface` for object shapes and `type` for unions, intersections, and primitives

## Assets

- Image/icon files: kebab-case (e.g., `user-avatar.png`, `logo-dark.svg`)
- Font files: kebab-case (e.g., `inter-regular.woff2`)
- Group by type inside `src/assets/` (e.g., `assets/images/`, `assets/icons/`, `assets/fonts/`)

## Variables & Functions (General)

- Variables: camelCase (e.g., `userName`, `isLoggedIn`)
- Boolean variables: prefix with `is`, `has`, or `can` (e.g., `isLoading`, `hasError`, `canEdit`)
- Event handler functions: prefix with `handle` (e.g., `handleSubmit`, `handleClick`, `handleChange`)
- Callback props: prefix with `on` (e.g., `onSubmit`, `onClick`, `onChange`)

## Vite-Specific

- Environment variables: prefix with `VITE_` (e.g., `VITE_API_URL`, `VITE_APP_TITLE`)
- Access env vars via `import.meta.env.VITE_*` (never `process.env`)
- `.env` files: `.env`, `.env.local`, `.env.production`, `.env.development`

## Bun-Specific

- Scripts in `package.json`: kebab-case (e.g., `dev`, `build`, `test`, `lint`)
- Use `bun run dev`, `bun run build`, `bun run test` as standard commands
- Bun workspace packages (monorepo): kebab-case scoped names (e.g., `@my-app/ui`, `@my-app/utils`)
