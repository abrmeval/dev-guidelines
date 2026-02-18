# Vue Naming Conventions (Vite + Bun)

Vue naming conventions should be followed for all code in this repository. This includes Vue 3 with the Composition API and `<script setup>` syntax.

---

## Project & Folder Structure

- Project root folder: kebab-case (e.g., `my-vue-app`)
- Source folder: `src/`
- Feature folders inside `src/`: kebab-case (e.g., `user-profile/`, `auth/`, `dashboard/`)
- Shared/reusable code lives in `src/components/` and `src/composables/`

---

## Files

- Single File Component (SFC) files: PascalCase with `.vue` extension (e.g., `UserCard.vue`, `NavBar.vue`)
- Composable files: camelCase prefixed with `use` and `.ts` extension (e.g., `useAuth.ts`, `useFetchUser.ts`)
- Utility/helper files: camelCase with `.ts` extension (e.g., `formatDate.ts`, `parseToken.ts`)
- Constant files: camelCase with `.ts` extension (e.g., `apiEndpoints.ts`, `appConfig.ts`)
- Store files (Pinia): camelCase suffixed with `Store` and `.ts` extension (e.g., `authStore.ts`, `userStore.ts`)
- Service files: camelCase suffixed with `Service` and `.ts` extension (e.g., `userService.ts`, `authService.ts`)
- Type/interface files: camelCase with `.types.ts` extension (e.g., `user.types.ts`, `auth.types.ts`)
- Router file: `router/index.ts`
- Test files: same name as the file under test with `.test.ts` or `.test.vue.ts` suffix (e.g., `UserCard.test.ts`, `useAuth.test.ts`)
- Entry point: `main.ts` (Vite default)
- Vite config: `vite.config.ts`

---

## Components

- Components: PascalCase (e.g., `UserCard`, `NavBar`, `LoginButton`)
- **Always use multi-word component names** to avoid conflict with HTML elements (e.g., `UserCard` not `Card`)
- Component files: PascalCase `.vue` (e.g., `UserCard.vue`, `BaseButton.vue`)
- Base/generic UI components: prefix with `Base` (e.g., `BaseButton.vue`, `BaseInput.vue`, `BaseModal.vue`)
- Single-instance components (used once per page): prefix with `The` (e.g., `TheHeader.vue`, `TheSidebar.vue`, `TheFooter.vue`)
- Tightly coupled child components: prefix with the parent name (e.g., `UserCard.vue` → `UserCardAvatar.vue`, `UserCardActions.vue`)
- Each component should have its own folder when it includes sub-components or scoped styles:
  ```
  components/
  └── UserCard/
      ├── UserCard.vue
      ├── UserCardAvatar.vue
      └── index.ts        ← re-exports UserCard for clean imports
  ```
- Props: camelCase in `defineProps<{}>`, kebab-case when passed in templates (Vue auto-converts)
- Props interfaces: PascalCase suffixed with `Props` (e.g., `UserCardProps`, `NavBarProps`)
- Emits: camelCase in `defineEmits`, kebab-case in templates (e.g., `update:modelValue`, `item-selected`)

---

## Views (Pages)

- View components: PascalCase suffixed with `View` (e.g., `LoginView.vue`, `DashboardView.vue`, `UserProfileView.vue`)
- Views map 1:1 to routes and should not contain direct business logic — delegate to feature components
- Live in `src/views/` (Vue Router convention) or `src/pages/` — pick one and be consistent

---

## Composables

- Composables: camelCase prefixed with `use` (e.g., `useAuth`, `useFetchUser`, `useLocalStorage`)
- Composables must always be called inside `setup()` or `<script setup>`
- Return plain refs/reactives with descriptive names (e.g., `const { user, isLoading, error } = useFetchUser()`)
- Composable files live in `src/composables/` (shared) or `features/<name>/composables/` (feature-scoped)

---

## Pinia Stores

- Store files: camelCase suffixed with `Store` (e.g., `authStore.ts`, `cartStore.ts`)
- Store id (first argument to `defineStore`): camelCase matching the file name (e.g., `'auth'`, `'cart'`)
- Use the Composition API style for stores (`defineStore` with `setup` function) over the Options API style
- Access stores in components via `const authStore = useAuthStore()`
- Store composable exports: PascalCase prefixed with `use` (e.g., `useAuthStore`, `useCartStore`)

---

## Router

- Route names: camelCase (e.g., `home`, `userProfile`, `adminDashboard`)
- Route paths: kebab-case (e.g., `/user-profile`, `/admin-dashboard`)
- Route files: `router/index.ts` for definitions; split into `router/routes.ts` for large apps
- Named route params: camelCase (e.g., `:userId`, `:postSlug`)

---

## Services & API

- Service files and functions: camelCase, grouped by domain (e.g., `userService.ts` containing `getUser()`, `updateUser()`)
- API fetch functions: camelCase verb + noun (e.g., `fetchUser()`, `createPost()`, `deleteComment()`)
- Base API client (e.g., `apiClient.ts`) configured once (interceptors, base URL) and reused across services

---

## Utils & Helpers

- Utility functions: camelCase, verb + noun describing the operation (e.g., `formatDate()`, `parseJwt()`, `debounce()`)
- Helper functions: camelCase (e.g., `buildQueryString()`, `truncateText()`)
- Pure functions only — no side effects, no Vue imports in `utils/`

---

## Constants

- Module-level constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- Enum-like constant objects: keys in UPPER_SNAKE_CASE (e.g., `export const ROUTES = { HOME: '/', LOGIN: '/login' }`)
- Avoid magic numbers/strings — always extract to a named constant

---

## Types & Interfaces (TypeScript)

- Interfaces: PascalCase (e.g., `User`, `AuthState`, `ApiResponse<T>`)
- Type aliases: PascalCase (e.g., `UserId`, `Theme`, `ButtonVariant`)
- Generic type parameters: single uppercase letter or descriptive PascalCase (e.g., `T`, `TData`, `TError`)
- Avoid `I` prefix for interfaces (e.g., use `User` not `IUser`)
- Prefer `interface` for object shapes and `type` for unions, intersections, and primitives

---

## Assets

- Image/icon files: kebab-case (e.g., `user-avatar.png`, `logo-dark.svg`)
- Font files: kebab-case (e.g., `inter-regular.woff2`)
- Group by type inside `src/assets/` (e.g., `assets/images/`, `assets/icons/`, `assets/fonts/`)

---

## Variables & Functions (General)

- Variables: camelCase (e.g., `userName`, `isLoggedIn`)
- Boolean variables: prefix with `is`, `has`, or `can` (e.g., `isLoading`, `hasError`, `canEdit`)
- Reactive refs: camelCase, named after what they hold (e.g., `const count = ref(0)`, `const user = ref<User | null>(null)`)
- Computed properties: camelCase, named as a noun or adjective (e.g., `const fullName = computed(...)`, `const isAdmin = computed(...)`)
- Watchers: camelCase, named after what they watch (e.g., `watch(userId, ...)`)
- Event handler functions: prefix with `handle` (e.g., `handleSubmit`, `handleClick`, `handleChange`)
- Event names in `defineEmits`: camelCase (e.g., `itemSelected`, `formSubmitted`)

---

## `<script setup>` Conventions

- Always use `<script setup lang="ts">` — the standard for Vue 3
- Define props with `defineProps<PropsInterface>()` using TypeScript generics
- Define emits with `defineEmits<{ eventName: [payload: Type] }>()`
- Expose public API with `defineExpose({ ... })` only when needed
- Order inside `<script setup>`: imports → props/emits → composables/stores → reactive state → computed → watchers → functions → lifecycle hooks

---

## Vite-Specific

- Environment variables: prefix with `VITE_` (e.g., `VITE_API_URL`, `VITE_APP_TITLE`)
- Access env vars via `import.meta.env.VITE_*` (never `process.env`)
- `.env` files: `.env`, `.env.local`, `.env.production`, `.env.development`

---

## Bun-Specific

- Scripts in `package.json`: kebab-case (e.g., `dev`, `build`, `test`, `lint`)
- Use `bun run dev`, `bun run build`, `bun run test` as standard commands
- Bun workspace packages (monorepo): kebab-case scoped names (e.g., `@my-app/ui`, `@my-app/utils`)
