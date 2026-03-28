# Admin Panel — Issues Plan
# Reference: apps/admin/README.md + fabianoneumann/admin-compass (Lovable visual reference)

---

## MILESTONE 1 — Project Scaffold & Infrastructure

---

### Issue #1 — [admin] Project scaffold via CLI commands
# GitHub: already created as eco-iguassu#12 in fabianoneumann/eco-iguassu
**Labels:** admin, frontend, chore

**Goal:** Bootstrap the admin app using Vite and shadcn CLI, avoiding manual boilerplate.

**Commands to run (in order):**
```bash
# 1. Create the app inside the monorepo
pnpm create vite apps/admin --template react-ts

# 2. Install dependencies (from monorepo root — installs all workspaces, including the new one)
pnpm install

# 3. Initialize shadcn/ui (sets up Tailwind + CSS variables automatically)
cd apps/admin && pnpm dlx shadcn@latest init
# When prompted: New York style, zinc base color, CSS variables: yes
```

**After running the commands — cleanup:**
- Delete `src/App.tsx`, `src/App.css` (will be rewritten from scratch)
- Delete `public/vite.svg` and `src/assets/` (unused)
- Keep `src/index.css` — shadcn overwrites it with CSS variables (do not delete)
- Keep `src/main.tsx` — will be updated in Issue #2

**Validate:**
- `pnpm --filter admin dev` starts without errors
- Browser shows a blank page (no errors in console)

**What these commands handle automatically:**
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `vite.config.ts` base configuration
- `package.json` with React + TypeScript deps
- Tailwind CSS installation and `tailwind.config.ts`
- `components.json` (shadcn config)
- `src/index.css` with full dark/light CSS variable tokens

---

### Issue #2 — [admin] Post-scaffold configuration
**Labels:** admin, frontend, chore

**Goal:** Complete what the CLI commands don't cover: monorepo wiring, path aliases,
environment setup, shadcn components, and ThemeProvider.

**Tasks:**

*Path aliases (needed for `@/` imports):*
- Add to `tsconfig.app.json` paths: `"@/*": ["./src/*"]`
- Add to `vite.config.ts` resolve alias: `'@': '/src'`
- Install `@types/node` (required for `path.resolve` in vite config)

*Environment:*
- Add `.env.example` with `VITE_API_URL=http://localhost:3333`
- Add `.env.local` to `.gitignore` (if not already present)

*Monorepo wiring:*
- Add `apps/admin` entry to `pnpm-workspace.yaml` (if not already covered by glob)
- Add `admin` pipeline to `turbo.json`: `dev`, `build`, `test`, `lint`

*shadcn components — install the base set:*
```bash
pnpm dlx shadcn@latest add button input label card badge dialog
pnpm dlx shadcn@latest add select separator avatar tooltip sonner skeleton
```

*Dark mode:*
- Install `next-themes`
- Create `src/app/providers.tsx` with `ThemeProvider` (defaultTheme="dark", storageKey="admin-theme")
- Update `src/main.tsx` to wrap app with `ThemeProvider`

**Validate:**
- `pnpm --filter admin dev` starts without errors
- Path alias `@/` resolves correctly (import a file using `@/` and check no TS error)
- `pnpm --filter admin build` completes without errors
- Dark mode CSS variables visible in browser devtools

---

### Issue #3 — [admin] TanStack Router setup with file-based routing
**Labels:** admin, frontend, chore

**Goal:** Wire up routing with the planned `app/routes/` structure.

**Tasks:**
- Install `@tanstack/react-router` and `@tanstack/router-vite-plugin`
- Configure Vite plugin for file-based route generation
- Create `src/app/routes/__root.tsx` (root route with Outlet + Providers)
- Create `src/app/routes/_layout.tsx` (pathless layout route — protected shell)
- Create `src/app/router.ts` (createRouter instance)
- Create `src/app/providers.tsx` (QueryClientProvider, ThemeProvider)
- Update `src/main.tsx` to use RouterProvider
- Add redirect from `/` → `/dashboard`
- Validate: router devtools visible, routing works between placeholder pages

---

### Issue #4 — [admin] Vitest + React Testing Library + Playwright setup
**Labels:** admin, frontend, chore

**Goal:** Testing infrastructure ready before first feature is written.

**Tasks:**
- Install and configure Vitest with jsdom environment
- Install `@testing-library/react` and `@testing-library/user-event`
- Install MSW (Mock Service Worker) for API mocking in integration tests
- Create `tests/setup.ts` (global test setup, MSW server start/stop)
- Configure `vitest.config.ts` with path aliases and setup file
- Install and configure Playwright
- Create `playwright.config.ts` pointing to `http://localhost:5173`
- Write one smoke test per layer (unit + e2e) to validate setup
- Add `test`, `test:watch`, `test:e2e` scripts to `package.json`

---

### Issue #5 — [admin] Axios HTTP client with auth interceptors
**Labels:** admin, frontend, chore

**Goal:** Centralized API client ready for all feature integrations.

**Tasks:**
- Install Axios
- Create `src/lib/api/client.ts`:
  - Base URL from `VITE_API_URL` env var
  - `withCredentials: true` (sends httpOnly refresh token cookie)
  - Request interceptor: attach `Authorization: Bearer <token>` from Zustand store
  - Response interceptor: on 401, call `PATCH /auth/token/refresh`, update token in store,
    retry original request; on second 401, logout and redirect to `/login`
- Create `src/lib/react-query/query-client.ts` (QueryClient instance)
- Unit test: interceptor retries failed request after successful token refresh

---

## MILESTONE 2 — Authentication

---

### Issue #6 — [admin] Zustand auth store
**Labels:** admin, frontend, auth, chore

**Goal:** Client-side session state that works inside and outside React components.

**Tasks:**
- Install Zustand
- Create `src/features/auth/store/auth-store.ts`:
  - State: `user`, `token`, `isAuthenticated`
  - Actions: `setSession(user, token)`, `clearSession()`, `updateName(name)`
- The store must be readable outside React via `useAuthStore.getState()`
  (required by Axios interceptor in Issue #5)
- Unit test: store actions update state correctly

---

### Issue #7 — [admin] Login page
**Labels:** admin, frontend, auth, feature

**User stories:**
- Como **administrador**, quero **fazer login no painel com meu e-mail e senha**, para que **eu possa acessar as funcionalidades de gestão do sistema**.

**Goal:** Split-screen login page connected to `POST /auth/admin/login`.

**UI reference:** fabianoneumann/admin-compass `src/pages/Login.tsx`

**Tasks:**
- Create `src/app/routes/login.tsx`
- Create `src/features/auth/components/LoginForm.tsx`:
  - React Hook Form + Zod validation (email required, password min 6)
  - Show/hide password toggle
  - Loading state on submit button
  - Error toast on invalid credentials (401)
- Create `src/features/auth/api/auth.api.ts`:
  - `loginAdmin(email, password)` → `POST /auth/admin/login` → returns `{ token }`
- On success: save session to Zustand store, redirect to `/dashboard`
- Left panel: dark background (zinc-950) with gradient mesh blobs + large Lucide
  icons as wallpaper (LayoutDashboard, Users, BarChart3, Shield, Settings at ~10% opacity)
  + tagline "Gerencie com eficiência." at bottom-left
- Right panel: form centered, "Logo" placeholder text at top
- Responsive: left panel hidden on mobile
- Unit test: LoginForm shows validation errors, calls api on valid submit
- E2E test: successful login redirects to /dashboard

---

### Issue #8 — [admin] Route guards and protected layout
**Labels:** admin, frontend, auth, chore

**Goal:** Unauthenticated users are redirected to /login. Authenticated users see the app shell.

**Tasks:**
- Add `beforeLoad` guard to `_layout.tsx`: check `useAuthStore.getState().isAuthenticated`;
  redirect to `/login` if false
- Add redirect in `login.tsx` `beforeLoad`: if already authenticated, redirect to `/dashboard`
- Create `src/components/layout/Sidebar.tsx`:
  - Sections: Geral (Dashboard), Usuários, Operações (Em breve), Financeiro (Em breve),
    Configurações (Perfil + Sair)
  - "Em breve" items: visually disabled + badge
  - Active link highlight
  - Collapses to icon-only on mobile (Sheet/Drawer)
- Create `src/components/layout/TopBar.tsx`:
  - Page title (from route context), dark/light toggle, user avatar initials + name
- Create `src/components/layout/AppShell.tsx`:
  - Sidebar + TopBar + `<Outlet />`
- Create `src/components/layout/PageLayout.tsx`:
  - Consistent title, optional breadcrumb slot, optional action button slot
- E2E test: unauthenticated access to /dashboard redirects to /login

---

### Issue #9 — [admin] Logout + token refresh
**Labels:** admin, frontend, auth, feature

**User stories:**
- Como **administrador autenticado**, quero **encerrar minha sessão**, para que **eu possa sair do painel com segurança**.
- Como **administrador autenticado**, quero **que meu token de acesso seja renovado automaticamente**, para que **minha sessão permaneça ativa sem que eu precise fazer login novamente durante o uso normal do painel**.

**Goal:** Logout clears session. Token refresh happens transparently on 401.

**Tasks:**
- Create `logoutAdmin()` in `auth.api.ts` → `DELETE /auth/logout`
- Logout button in Sidebar: confirmation dialog → call API → `clearSession()` → redirect `/login`
- Verify Axios interceptor from Issue #5 handles the silent refresh end-to-end:
  - Mock 401 → mock `PATCH /auth/token/refresh` success → original request retried
  - Mock 401 → mock refresh failure → logout triggered
- Unit tests for both refresh scenarios using MSW

---

### Issue #10 — [admin] Forgot password page
**Labels:** admin, frontend, auth, feature

**User stories:**
- Como **administrador**, quero **solicitar a recuperação de senha informando meu e-mail**, para que **eu possa redefinir o acesso ao painel caso esqueça minha senha**.

**Goal:** User can request a password reset email.

**UI reference:** fabianoneumann/admin-compass `src/pages/ForgotPassword.tsx`

**Tasks:**
- Create `src/app/routes/forgot-password.tsx`
- Create `src/features/auth/components/ForgotPasswordForm.tsx`:
  - React Hook Form + Zod (email required)
  - On submit: `POST /auth/password/forgot`
  - Success state: inline confirmation message (API always returns 204)
  - Link back to `/login`
- Unit test: form shows validation error, renders success state after submit

---

### Issue #11 — [admin] Reset password page
**Labels:** admin, frontend, auth, feature

**User stories:**
- Como **administrador**, quero **redefinir minha senha através do link recebido por e-mail**, para que **eu possa recuperar o acesso ao painel**.

**Goal:** Page that receives the reset token from the URL and allows the admin to set a new password. Completes the forgot-password flow started in Issue #10.

**Depends on:** Issue #10 (forgot password sends the email with the link pointing to this route)

**Tasks:**
- Create `src/app/routes/reset-password.tsx`
- Extract `token` from URL search params using TanStack Router `useSearch`
- Create `src/features/auth/components/ResetPasswordForm.tsx`:
  - Fields: nova senha (min 6) + confirmar nova senha (Zod refine for match)
  - On submit: `PATCH /auth/password/reset` with `{ token, newPassword }`
  - Success state: inline confirmation + link to `/login`
  - Error state (400): "Link inválido ou expirado" + link to `/forgot-password`
- Add `resetPassword(token, newPassword)` to `auth.api.ts`
- Unit test: validation errors shown, success state rendered, error state rendered on 400
- E2E test: valid token → password changed → redirect to /login

---

## MILESTONE 3 — Users Module

---

### Issue #12 — [admin] Shared DataTable component
**Labels:** admin, frontend, chore

**Goal:** Generic, reusable paginated table using TanStack Table.

**UI reference:** fabianoneumann/admin-compass `src/components/DataTable.tsx`

**Tasks:**
- Install `@tanstack/react-table`
- Create `src/components/shared/DataTable/DataTable.tsx`:
  - Accepts `columns`, `data`, `isLoading`, `pagination` props
  - Loading: skeleton rows (use `src/components/shared/LoadingSkeleton.tsx`)
  - Empty state: `src/components/shared/EmptyState.tsx`
  - Pagination controls: previous/next, page count, items per page
- Create `src/components/shared/RoleBadge.tsx` (ADMIN=red, MEMBER=blue, USER=gray)
- Create `src/components/shared/StatusBadge.tsx` (Ativo=green, Deletado=red)
- Create `src/components/shared/ConfirmDialog.tsx` (reusable confirmation modal)
- Unit tests for DataTable: renders data, shows skeleton on loading, shows empty state

---

### Issue #13 — [admin] Users list page
**Labels:** admin, frontend, users, feature

**User stories:**
- Como **administrador**, quero **visualizar a lista de usuários com paginação e filtros**, para que **eu possa monitorar e gerenciar as contas cadastradas no sistema**.

**Goal:** Paginated, filterable users table connected to `GET /users`.

**UI reference:** fabianoneumann/admin-compass `src/pages/Users.tsx`

**Tasks:**
- Create `src/app/routes/_layout/users/index.tsx`
- Create `src/features/users/api/users.api.ts`:
  - `listUsers({ page, perPage, role?, status? })` → `GET /users`
- Create `src/features/users/hooks/useUsers.ts`:
  - TanStack Query `useQuery` wrapping `listUsers`
  - Manage `page`, `perPage`, `role`, `status` as URL search params
    (TanStack Router `useSearch` — preserves filters on back navigation)
- Columns: Nome, Email, Perfil (RoleBadge), Validado (icon), Status (StatusBadge),
  Criado em, Ações (Ver, Editar, Excluir)
- Filters: search input (name/email), role select, status toggle (Ativos/Deletados/Todos)
- Deleted rows: opacity-50
- Action button "+ Novo Usuário" → opens Create User modal (Issue #14)
- Row actions: Ver → `/users/:id`, Editar → inline edit modal, Excluir → ConfirmDialog
- Unit test: filters update URL search params, table renders with mocked API response (MSW)

---

### Issue #14 — [admin] Create user modal
**Labels:** admin, frontend, users, feature

**User stories:**
- Como **administrador**, quero **criar um novo usuário diretamente pelo painel**, para que **eu possa adicionar membros da equipe sem depender do fluxo de registro público**.

**Goal:** Admin can create a new user directly from the users list.

**Tasks:**
- Create `src/features/users/components/CreateUserModal.tsx`:
  - Fields: Nome (required), Email (required, valid email), Perfil (select: User/Member/Admin)
  - React Hook Form + Zod validation
  - On submit: `POST /auth/register` (existing endpoint — no dedicated admin create endpoint yet)
  - Success: close modal, invalidate `users` query, success toast
  - Error: show error toast, keep modal open
- Unit test: validation errors shown, modal closes on success

---

### Issue #15 — [admin] User detail page
**Labels:** admin, frontend, users, feature

**User stories:**
- Como **administrador**, quero **visualizar os detalhes completos de um usuário**, para que **eu possa auditar e gerenciar individualmente cada conta**.
- Como **administrador**, quero **editar o nome, e-mail e perfil de um usuário**, para que **eu possa corrigir informações incorretas ou ajustar permissões**.
- Como **administrador**, quero **remover um usuário do sistema**, para que **eu possa excluir contas inativas ou indevidas**.

**Goal:** Full user detail view with edit, role change and delete actions.

**UI reference:** fabianoneumann/admin-compass `src/pages/UserDetail.tsx`

**Tasks:**
- Create `src/app/routes/_layout/users/$id.tsx`
- Create `src/features/users/api/`:
  - `getUser(id)` → `GET /users/:id`
  - `updateUser(id, data)` → `PATCH /users/:id`
  - `changeUserRole(id, role)` → `PATCH /users/:id/role`
  - `deleteUser(id)` → `DELETE /users/:id`
- Create `src/features/users/hooks/`:
  - `useUser(id)` — TanStack Query useQuery
  - `useUpdateUser()`, `useChangeUserRole()`, `useDeleteUser()` — useMutation with
    query invalidation and toast feedback
- Page sections:
  - User detail card: all fields
  - Breadcrumb: Usuários > [Nome]
  - Edit button → inline form (name, email) with save/cancel
  - Change Role button → modal with role selector + ConfirmDialog
  - Delete button → ConfirmDialog → soft delete → redirect to /users
- Unit test: page renders user data, delete triggers confirmation

---

## MILESTONE 4 — Profile & Settings

---

### Issue #16 — [admin] Profile page
**Labels:** admin, frontend, auth, feature

**User stories:**
- Como **administrador autenticado**, quero **visualizar e atualizar meu próprio perfil**, para que **eu possa manter meus dados cadastrais corretos**.
- Como **administrador autenticado**, quero **trocar minha senha informando a senha atual**, para que **eu possa alterar minhas credenciais com segurança**.

**Goal:** Logged-in admin can view and update their own profile.

**UI reference:** fabianoneumann/admin-compass `src/pages/Profile.tsx`

**Tasks:**
- Create `src/app/routes/_layout/profile.tsx`
- Create `src/features/auth/api/`:
  - `getProfile()` → `GET /auth/me`
  - `updateProfile(name)` → `PATCH /auth/me`
  - `changePassword(currentPassword, newPassword)` → `PATCH /auth/me/password`
- Create `src/features/auth/hooks/`:
  - `useProfile()` — TanStack Query useQuery
  - `useUpdateProfile()`, `useChangePassword()` — useMutation with toast feedback
- Page sections:
  - Profile card with avatar initials, name, email, role, account status
  - Edit name form (React Hook Form + Zod)
  - Change password form (currentPassword + newPassword + confirm, Zod refine for match)
- On password change success: clear session and redirect to `/login`
  (API invalidates token_version — all sessions revoked)
- Unit test: name update calls API, password mismatch shows inline error

---

## MILESTONE 5 — Error Pages & Polish

---

### Issue #17 — [admin] Error pages (404 and 403)
**Labels:** admin, frontend, chore

**Goal:** Consistent error pages for not found and forbidden routes.

**UI reference:** fabianoneumann/admin-compass `src/pages/NotFound.tsx` and `Forbidden.tsx`

**Tasks:**
- Create `src/app/routes/$.tsx` (TanStack Router catch-all → 404 page)
- Create `src/app/routes/403.tsx`
- Both pages: large error code in accent color, message in Portuguese, button back to /dashboard
- Wire 403 redirect in route guards for future role-restricted routes

---

### Issue #18 — [admin] Dashboard page
**Labels:** admin, frontend, feature

**User stories:**
- Como **administrador**, quero **visualizar um resumo do estado do sistema ao entrar no painel**, para que **eu possa ter uma visão rápida das métricas mais relevantes sem precisar navegar por outras telas**.

**Goal:** Summary cards and recent users chart connected to real data.

**UI reference:** fabianoneumann/admin-compass `src/pages/Dashboard.tsx`

**Tasks:**
- Create `src/app/routes/_layout/dashboard/index.tsx`
- Create `src/features/dashboard/hooks/useDashboardStats.ts`:
  - Calls `GET /users?perPage=100` (aggregate client-side — no dedicated stats endpoint)
  - Derives: total, active (deletedAt null), unvalidated (validatedAt null), by role count
- Install Recharts
- Summary cards: Total de Usuários, Usuários Ativos, Não Validados, Administradores
- Bar chart: mock "Novos usuários por mês" (last 6 months — static until API has date filtering)
- Recent users table: last 5 users from the list (reuse DataTable)
- Unit test: stats derived correctly from mock user list

---

## Implementation order

Milestone 1 (Issues #1–5) → Milestone 2 (Issues #6–11) → Milestone 3 (Issues #12–15)
→ Milestone 4 (Issue #16) → Milestone 5 (Issues #17–18)

Start each issue only after the previous is merged and green on CI.
The Lovable project (fabianoneumann/admin-compass) serves as visual reference throughout.
