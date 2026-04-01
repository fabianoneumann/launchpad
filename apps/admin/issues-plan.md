# Admin Panel — Issues Plan
# Reference: apps/admin/README.md + fabianoneumann/admin-compass (Lovable visual reference)

---

## MILESTONE 1 — Project Scaffold & Infrastructure

---

### Issue #1 — [admin] Project scaffold via CLI commands
# GitHub: eco-iguassu#12 ✅ CONCLUÍDA
**Labels:** admin, frontend, chore

**O que foi feito (resumo):**
- Scaffold via `pnpm create vite apps/admin --template react-ts`
- Tailwind v4 instalado (`tailwindcss` + `@tailwindcss/vite`) antes do shadcn init — exigido pelo shadcn atual
- `shadcn@latest init` executado com preset Nova; `components.json` editado para `style: "new-york"` e `baseColor: "zinc"`
- Path alias `@/` → `src/` configurado em `tsconfig.json`, `tsconfig.app.json` e `vite.config.ts` — foi necessário antes do shadcn init, que valida o alias
- `src/App.tsx`, `src/App.css`, `src/assets/` deletados; `src/main.tsx` substituído por placeholder
- ESLint migrado de `tseslint.config()` para `defineConfig()` em `packages/eslint-config` e `apps/api`; `react.js` corrigido para usar `reactHooks.configs.flat['recommended-latest']`
- Todos os checks passam: `dev`, `build`, `lint`, `format:check`

**Nota sobre Tailwind v4:** O shadcn atual usa Tailwind v4 (sem `tailwind.config.ts`, configurado via plugin Vite). Os tokens CSS gerados usam formato `oklch()` em vez do `hsl` bare do Tailwind v3. Isso impacta a substituição dos tokens na Issue #2 — ver nota específica lá.

---

### Issue #2 — [admin] Post-scaffold configuration
# GitHub: eco-iguassu#17
**Labels:** admin, frontend, chore

**Goal:** Complete post-scaffold setup: environment, shadcn component base set,
dark mode (ThemeProvider), and CSS token replacement with project colors.

> **Já feito na Issue #12 — não refazer:**
> - Path aliases `@/` → `src/` (tsconfig.json, tsconfig.app.json, vite.config.ts) ✅
> - `@types/node` instalado ✅
> - `pnpm-workspace.yaml` — glob `apps/*` já cobre admin ✅
> - `turbo.json` — tasks globais (`dev`, `build`, `test`, `lint`, `format:check`) já cobrem admin ✅
> - `.env.local` no `.gitignore` raiz ✅
> - ESLint + Prettier configurados ✅

**Tasks:**

*Environment:*
- Criar `.env.example` com `VITE_API_URL=http://localhost:3333`

*shadcn components — install the base set:*

`button` já foi instalado pelo shadcn init. Instalar os restantes a partir de `apps/admin`:
```bash
pnpm dlx shadcn@latest add input label card badge dialog alert-dialog
pnpm dlx shadcn@latest add select separator avatar tooltip sonner skeleton table
pnpm dlx shadcn@latest add sidebar dropdown-menu popover
```
> `sidebar` — os tokens `--sidebar-*` já estão no `@theme inline` do `index.css` (gerados pelo preset Nova) especificamente para este componente. Instalar agora junto com o restante da base.
>
> `dropdown-menu` e `popover` — dependências diretas de vários outros componentes (menus de usuário, select interno, etc.). Melhor ser explícito.

Após instalar: `pnpm --filter admin format` para formatar os arquivos gerados.

*Dark mode:*
- Instalar `next-themes`
- Envolver `src/main.tsx` com `ThemeProvider` usando `attribute="class"` explícito:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="admin-theme">
      <div />
    </ThemeProvider>
  </StrictMode>,
)
```

> `attribute="class"` é necessário e deve ser explícito: o `index.css` usa `@custom-variant dark (&:is(.dark *))`, que exige a classe `.dark` no `<html>`. O `next-themes` usa `attribute="class"` como default, mas declarar explicitamente evita surpresas.
>
> **Não criar `src/app/providers.tsx` aqui.** O diretório `src/app/` e o `providers.tsx` definitivo (com QueryClientProvider + ThemeProvider + TooltipProvider) são criados na Issue #3 junto com o TanStack Router. O ThemeProvider migra para lá nessa issue.

*CSS tokens — substituir tokens em `src/index.css`:*

Substituir apenas os valores de cor dentro de `:root {}` e `.dark {}`.
**Preservar integralmente:** os imports (`tw-animate-css`, `shadcn/tailwind.css`, Geist), o `@custom-variant dark`, o `@theme inline` e o `@layer base`.

**Referência:** `src/index.css` em fabianoneumann/admin-compass — usa Tailwind v3 com valores HSL bare. O setup atual usa Tailwind v4 com `oklch()`. Os valores abaixo são as conversões HSL→oklch dos tokens do admin-compass.

> **Nota sobre naming:** admin-compass usa `--sidebar-background`; o shadcn atual usa `--sidebar`. São o mesmo token — o nome mudou entre versões. Usar o naming atual (`--sidebar`).

**Tokens que precisam mudar (`:root` — light mode):**

| Token | HSL (admin-compass) | oklch |
|---|---|---|
| `--primary` | `239 84% 57%` | ~`oklch(0.452 0.245 264)` |
| `--primary-foreground` | `0 0% 100%` | `oklch(1 0 0)` |
| `--ring` | `239 84% 57%` | ~`oklch(0.452 0.245 264)` |
| `--radius` | `0.5rem` | `0.5rem` (sem conversão) |
| `--sidebar` | `240 5% 97%` | ~`oklch(0.984 0 0)` |
| `--sidebar-primary` | `239 84% 57%` | ~`oklch(0.452 0.245 264)` |
| `--sidebar-primary-foreground` | `0 0% 100%` | `oklch(1 0 0)` |
| `--sidebar-accent` | `240 5% 93%` | ~`oklch(0.943 0 0)` |
| `--sidebar-ring` | `239 84% 57%` | ~`oklch(0.452 0.245 264)` |
| `--chart-1` | `239 84% 57%` | ~`oklch(0.452 0.245 264)` |
| `--chart-2` | `263 70% 58%` | ~`oklch(0.470 0.190 285)` |
| `--chart-3` | `160 60% 45%` | ~`oklch(0.569 0.140 162)` |
| `--chart-4` | `36 80% 56%` | ~`oklch(0.660 0.160 57)` |
| `--chart-5` | `0 72% 58%` | ~`oklch(0.565 0.215 25)` |

**Tokens que precisam mudar (`.dark` — dark mode):**

| Token | HSL (admin-compass) | oklch |
|---|---|---|
| `--primary` | `239 84% 67%` | ~`oklch(0.537 0.245 264)` |
| `--primary-foreground` | `0 0% 100%` | `oklch(1 0 0)` |
| `--ring` | `239 84% 67%` | ~`oklch(0.537 0.245 264)` |
| `--destructive` | `0 63% 31%` | ~`oklch(0.396 0.141 25)` |
| `--sidebar` | `240 10% 5.5%` | ~`oklch(0.162 0 0)` |
| `--sidebar-primary` | `239 84% 67%` | ~`oklch(0.537 0.245 264)` |
| `--sidebar-primary-foreground` | `0 0% 100%` | `oklch(1 0 0)` |
| `--sidebar-accent` | `240 4% 12%` | ~`oklch(0.193 0 0)` |
| `--sidebar-border` | `240 4% 14%` | ~`oklch(0.226 0 0)` |
| `--sidebar-ring` | `239 84% 67%` | ~`oklch(0.537 0.245 264)` |
| `--chart-1` | `239 84% 67%` | ~`oklch(0.537 0.245 264)` |
| `--chart-2` | `263 70% 68%` | ~`oklch(0.572 0.175 285)` |
| `--chart-3` | `160 60% 55%` | ~`oklch(0.651 0.137 162)` |
| `--chart-4` | `36 80% 66%` | ~`oklch(0.740 0.137 59)` |
| `--chart-5` | `0 72% 65%` | ~`oklch(0.635 0.174 25)` |

> Os valores oklch marcados com `~` são aproximações. Usar oklch.com para converter os valores HSL do admin-compass e obter os valores exatos antes de commitar.

**Validate:**
- `pnpm --filter admin dev` inicia sem erros
- `pnpm --filter admin build` completa sem erros
- `pnpm --filter admin lint` sem erros
- `pnpm --filter admin format:check` sem erros
- Dark mode funciona: classe `.dark` no `<html>` altera as variáveis CSS no devtools
- `src/index.css` contém `--primary: oklch(0.452 0.245 264)` (índigo, não neutral cinza)
- Todos os componentes shadcn renderizam sem erros no browser

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
- Create `src/app/providers.tsx` (QueryClientProvider, ThemeProvider, TooltipProvider)
  - `<TooltipProvider>` do shadcn é necessário para todos os componentes `<Tooltip>` da aplicação —
    deve envolver a árvore inteira, conforme padrão do admin-compass (`src/App.tsx`)
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

**Referência de implementação:** `src/pages/Login.tsx` em fabianoneumann/admin-compass

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
- Responsive: left panel hidden on mobile (`hidden lg:flex`)
- Unit test: LoginForm shows validation errors, calls api on valid submit
- E2E test: successful login redirects to /dashboard

**Implementação visual — replicar fielmente do admin-compass:**

*Estrutura geral:*
- `min-h-screen flex` no wrapper raiz
- Painel esquerdo: `hidden lg:flex lg:w-[60%] relative overflow-hidden items-end p-10`
- Painel direito: `flex-1 flex items-center justify-center p-6 lg:p-10 bg-background`

*Fundo do painel esquerdo — inline style com três gradientes radiais:*
```tsx
style={{
  background: `
    radial-gradient(ellipse at 20% 50%, hsl(239 84% 67% / 0.15), transparent 50%),
    radial-gradient(ellipse at 80% 20%, hsl(263 70% 58% / 0.12), transparent 50%),
    radial-gradient(ellipse at 60% 80%, hsl(160 60% 45% / 0.08), transparent 50%),
    hsl(240 10% 3.9%)
  `,
}}
```

*Ícones decorativos — 8 ícones Lucide com `text-white/[0.07]` e posições absolutas:*
```tsx
const decorativeIcons = [
  { Icon: LayoutDashboard, className: "top-[8%] left-[12%] w-16 h-16 rotate-12" },
  { Icon: Users,           className: "top-[22%] left-[55%] w-12 h-12 -rotate-6" },
  { Icon: BarChart3,       className: "top-[50%] left-[18%] w-20 h-20 rotate-[30deg]" },
  { Icon: Shield,          className: "top-[65%] left-[60%] w-14 h-14 -rotate-12" },
  { Icon: Settings,        className: "top-[35%] left-[75%] w-10 h-10 rotate-45" },
  { Icon: Bell,            className: "top-[80%] left-[30%] w-12 h-12 rotate-6" },
  { Icon: LayoutDashboard, className: "top-[12%] left-[80%] w-8 h-8 -rotate-[20deg]" },
  { Icon: Users,           className: "top-[75%] left-[78%] w-16 h-16 rotate-[15deg]" },
]
// Cada ícone: <Icon className={`absolute text-white/[0.07] ${className}`} />
```

*Rodapé do painel esquerdo (`relative z-10`):*
- Logo: `text-2xl font-bold text-white/90` — usar nome do projeto
- Tagline: `text-sm text-white/50 mt-1` — "Gerencie com eficiência."

*Painel direito — container do formulário:*
- `w-full max-w-sm space-y-8`
- Header: nome do projeto em `text-lg font-bold text-foreground`, título `text-2xl font-bold tracking-tight`, subtítulo `text-sm text-muted-foreground`

*Botão show/hide password:*
- `absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`

*Link "Esqueci minha senha":*
- `text-sm text-muted-foreground hover:text-primary transition-colors`

*Botão submit:* `w-full` com `<Loader2 className="mr-2 h-4 w-4 animate-spin" />` quando `isSubmitting`

---

### Issue #8 — [admin] Route guards and protected layout
**Labels:** admin, frontend, auth, chore

**Goal:** Unauthenticated users are redirected to /login. Authenticated users see the app shell.

**Tasks:**
- Add `beforeLoad` guard to `_layout.tsx`: check `useAuthStore.getState().isAuthenticated`;
  redirect to `/login` if false
- Add redirect in `login.tsx` `beforeLoad`: if already authenticated, redirect to `/dashboard`
- Create `src/hooks/use-mobile.ts` — hook `useIsMobile()` via `window.matchMedia("(max-width: 768px)")`,
  usado pelo AppShell para alternar entre sidebar desktop e Sheet mobile
- Create `src/components/layout/Sidebar.tsx`
- Create `src/components/layout/TopBar.tsx`
- Create `src/components/layout/AppShell.tsx`
- Create `src/components/layout/PageLayout.tsx`
- E2E test: unauthenticated access to /dashboard redirects to /login

**Implementação visual — replicar fielmente do admin-compass:**

*AppShell (`src/components/layout/AppShell.tsx`):*
- Wrapper: `flex min-h-screen w-full`
- Sidebar desktop: `w-60 border-r border-sidebar-border flex-shrink-0 sticky top-0 h-screen overflow-hidden`
- Sidebar mobile: `<Sheet side="left" className="p-0 w-64">` — abre com `onMenuClick` da TopBar
- Área de conteúdo: `flex-1 flex flex-col min-w-0`
- `<main>`: `flex-1 p-4 lg:p-6`

*Sidebar (`src/components/layout/Sidebar.tsx`):*
- Container: `flex flex-col h-full bg-sidebar`
- Cabeçalho: `p-6 pb-4` — texto "Admin Panel" em `text-lg font-bold text-sidebar-foreground tracking-tight`
- Nav: `flex-1 px-3 space-y-6 overflow-y-auto`
- Labels de seção: `px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground`
- Itens: `space-y-0.5`
- Link ativo: `bg-primary/10 text-primary font-medium`
- Link inativo: `text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground`
- Padding de cada link: `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors`
- Item desabilitado: `text-muted-foreground/40 cursor-not-allowed`
- Badge "Em breve": `variant="secondary"` com `text-[10px] px-1.5 py-0 font-normal ml-auto`
- Seção Configurações: `px-3 pb-4 border-t border-sidebar-border pt-4 mt-2`
- Botão Sair: mesma classe dos links, `w-full`, abre `<ConfirmDialog>` de logout

*TopBar (`src/components/layout/TopBar.tsx`):*
- `h-14 border-b border-border bg-background/80 backdrop-blur-sm`
- `flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30`
- Ícone menu mobile: `variant="ghost" size="icon" lg:hidden`
- Avatar: `h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold`
- Nome do usuário: `text-sm font-medium hidden sm:inline`
- ThemeToggle: componente separado (ver abaixo)

*ThemeToggle (`src/components/ThemeToggle.tsx`):*
- `Button variant="ghost" size="icon" className="relative"`
- Sol (light): `h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`
- Lua (dark): `absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`

*PageLayout (`src/components/layout/PageLayout.tsx`):*
- Wrapper: `space-y-6`
- Header: `flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between`
- Breadcrumbs: `flex items-center gap-1 text-sm text-muted-foreground mb-1`
  - Separador: `<ChevronRight className="h-3 w-3" />`
  - Link: `hover:text-foreground transition-colors`
  - Item atual: `text-foreground` (sem link)
- Título da página: `text-2xl font-bold tracking-tight`
- Slot de ações: `flex items-center gap-2`

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

**Referência de implementação:** `src/pages/ForgotPassword.tsx` em fabianoneumann/admin-compass

**Tasks:**
- Create `src/app/routes/forgot-password.tsx`
- Create `src/features/auth/components/ForgotPasswordForm.tsx`:
  - React Hook Form + Zod (email required)
  - On submit: `POST /auth/password/forgot`
  - Success state: inline confirmation message (API always returns 204)
  - Link back to `/login`
- Unit test: form shows validation error, renders success state after submit

**Implementação visual — replicar fielmente do admin-compass:**

*Layout da página:*
- `min-h-screen flex items-center justify-center p-6 bg-background`
- `<Card className="w-full max-w-md">`
- `<CardHeader className="text-center">` com `<CardTitle className="text-2xl">`
- `<CardDescription>` muda dinamicamente: formulário vs. estado de sucesso

*Estado de sucesso (após submit):*
- `flex flex-col items-center gap-4 py-4`
- Ícone: `<CheckCircle2 className="h-12 w-12 text-emerald-500" />`
- Mensagem: `text-sm text-muted-foreground text-center`
- Botão "Voltar ao login": `variant="outline"`

*Estado de formulário:*
- Botão submit: `w-full` com `<Loader2 className="mr-2 h-4 w-4 animate-spin" />` quando `isSubmitting`
- Link "Voltar ao login" (abaixo do botão): `text-sm text-muted-foreground hover:text-primary transition-colors`

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

**Implementação visual:**
- Seguir o mesmo padrão visual de ForgotPassword (Issue #10): `Card w-full max-w-md`, `CardHeader text-center`, estados inline de sucesso e erro
- Estado de sucesso: mesmo padrão — `CheckCircle2 h-12 w-12 text-emerald-500` + mensagem + link ao `/login`
- Estado de erro (400): usar `XCircle h-12 w-12 text-destructive` + mensagem "Link inválido ou expirado." + link ao `/forgot-password`

---

## MILESTONE 3 — Users Module

---

### Issue #12 — [admin] Shared DataTable component
**Labels:** admin, frontend, chore

**Goal:** Generic, reusable paginated table using TanStack Table.

**Referência de implementação:**
- `src/components/DataTable.tsx`
- `src/components/EmptyState.tsx`
- `src/components/LoadingSkeleton.tsx`
- `src/components/RoleBadge.tsx`
- `src/components/StatusBadge.tsx`
- `src/components/ConfirmDialog.tsx`

em fabianoneumann/admin-compass

**Tasks:**
- Install `@tanstack/react-table`
- Create `src/components/shared/DataTable/DataTable.tsx`
- Create `src/components/shared/EmptyState.tsx`
- Create `src/components/shared/LoadingSkeleton.tsx`
- Create `src/components/shared/RoleBadge.tsx`
- Create `src/components/shared/StatusBadge.tsx`
- Create `src/components/shared/ConfirmDialog.tsx`
- Unit tests for DataTable: renders data, shows skeleton on loading, shows empty state

**Implementação visual — replicar fielmente do admin-compass:**

*DataTable:*
- Wrapper da tabela: `rounded-md border` (usa o componente `<Table>` do shadcn)
- Paginação (aparece apenas quando `totalPages > 1`):
  - `flex items-center justify-between mt-4 px-1`
  - Contador: `text-sm text-muted-foreground` — "Página X de Y"
  - Botões Anterior/Próxima: `variant="outline" size="sm"`
- Props: `columns`, `data`, `isLoading`, `pagination`, `rowClassName`, `emptyState`
- `rowClassName`: função `(row) => string` aplicada a cada `<TableRow>` — usada para `opacity-50` em linhas deletadas

*RoleBadge — `Badge variant="outline"` com classes específicas por role:*
```tsx
const roleConfig = {
  ADMIN:  "bg-red-500/15 text-red-500 border-red-500/20",
  MEMBER: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  USER:   "bg-muted text-muted-foreground border-border",
}
// Labels: "Admin" | "Member" | "User"
// className base: "text-xs font-medium"
```

*StatusBadge — `Badge variant="outline"`:*
```tsx
// Ativo:   "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
// Deletado:"bg-red-500/15 text-red-400 border-red-500/20"
// Labels: "Ativo" | "Deletado"
// className base: "text-xs font-medium"
```

*ConfirmDialog — usa `AlertDialog` (não `Dialog`) do shadcn:*
- Props: `open`, `onOpenChange`, `title`, `description`, `confirmLabel`, `cancelLabel`, `onConfirm`, `variant`
- Variante destructive: botão de confirmação com `bg-destructive text-destructive-foreground hover:bg-destructive/90`

*EmptyState:*
- `flex flex-col items-center justify-center py-16 text-center`
- Ícone padrão: `SearchX` — `h-12 w-12 text-muted-foreground/50 mb-4`
- Título: `text-lg font-semibold text-foreground mb-1`
- Descrição: `text-sm text-muted-foreground max-w-sm mb-4`
- Botão de ação (opcional): `size="sm"`

*LoadingSkeleton — dois componentes exportados:*
- `TableSkeleton({ rows, cols })`: linha de header + linhas de dados com `Skeleton h-8/h-10 flex-1` em `flex gap-4`
- `CardSkeleton()`: `rounded-lg border bg-card p-6 space-y-3` com dois Skeletons internos

---

### Issue #13 — [admin] Users list page
**Labels:** admin, frontend, users, feature

**User stories:**
- Como **administrador**, quero **visualizar a lista de usuários com paginação e filtros**, para que **eu possa monitorar e gerenciar as contas cadastradas no sistema**.

**Goal:** Paginated, filterable users table connected to `GET /users`.

**Referência de implementação:** `src/pages/Users.tsx` em fabianoneumann/admin-compass

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

**Implementação visual — replicar fielmente do admin-compass:**

*Área de filtros:*
- `flex flex-col sm:flex-row gap-3`
- Input de busca: `sm:max-w-xs` — placeholder "Buscar por nome ou email..."
- Selects de perfil e status: `sm:w-40`

*Coluna "Validado":*
- Validado: `<CheckCircle2 className="h-4 w-4 text-emerald-500" />`
- Não validado: `<XCircle className="h-4 w-4 text-muted-foreground/40" />`

*Botões de ação por linha:*
- Ver e Editar: `variant="ghost" size="icon" className="h-8 w-8"`
- Excluir: `variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"` — oculto se `row.deletedAt`

*DataTable:*
- `rowClassName={(row) => row.deletedAt ? "opacity-50" : ""}` para linhas deletadas
- `emptyState={<EmptyState title="..." description="..." actionLabel="Novo Usuário" onAction={...} />}`

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

**Implementação visual:**
- Usa `<Dialog>` do shadcn (não AlertDialog)
- `<DialogContent>` → `<DialogHeader>` → `<DialogTitle>` "Novo Usuário"
- Campos em `space-y-4`, labels + inputs + mensagens de erro `text-xs text-destructive`
- `<DialogFooter>`: botão "Cancelar" `variant="outline"` + botão "Criar Usuário" com `<Loader2 animate-spin>` enquanto submete

---

### Issue #15 — [admin] User detail page
**Labels:** admin, frontend, users, feature

**User stories:**
- Como **administrador**, quero **visualizar os detalhes completos de um usuário**, para que **eu possa auditar e gerenciar individualmente cada conta**.
- Como **administrador**, quero **editar o nome, e-mail e perfil de um usuário**, para que **eu possa corrigir informações incorretas ou ajustar permissões**.
- Como **administrador**, quero **remover um usuário do sistema**, para que **eu possa excluir contas inativas ou indevidas**.

**Goal:** Full user detail view with edit, role change and delete actions.

**Referência de implementação:** `src/pages/UserDetail.tsx` em fabianoneumann/admin-compass

**Tasks:**
- Create `src/app/routes/_layout/users/$id.tsx`
- Create `src/features/users/api/`:
  - `getUser(id)` → `GET /users/:id`
  - `updateUser(id, data)` → `PATCH /users/:id`
  - `changeUserRole(id, role)` → `PATCH /users/:id/role`
  - `deleteUser(id)` → `DELETE /users/:id`
- Create `src/features/users/hooks/`:
  - `useUser(id)` — TanStack Query useQuery
  - `useUpdateUser()`, `useChangeUserRole()`, `useDeleteUser()` — useMutation com
    query invalidation e toast feedback
- Unit test: page renders user data, delete triggers confirmation

**Implementação visual — replicar fielmente do admin-compass:**

*Layout da página:*
- `PageLayout` com `title={user.name}`, `breadcrumbs={[{label:"Usuários", href:"/users"}, {label:user.name}]}` e botão "Voltar" `variant="outline" size="sm"` como `actions`
- Grid: `grid gap-6 lg:grid-cols-2` — card "Informações" + card "Datas"

*Card "Informações" (modo visualização):*
- `<CardHeader className="flex flex-row items-center justify-between">`
- Botões: "Editar" `variant="outline" size="sm"` com `<Pencil h-3.5 w-3.5 mr-1>`, "Alterar Perfil" com `<ShieldCheck>`, "Excluir" com `text-destructive hover:text-destructive` (oculto se `deletedAt`)
- `<dl className="space-y-3 text-sm">` com itens `flex justify-between`
- Labels: `<dt className="text-muted-foreground">`, valores: `<dd>`
- ID: `<dd className="font-mono text-xs">`
- Perfil e Status: `<dd>` com os componentes RoleBadge e StatusBadge

*Card "Informações" (modo edição — inline no mesmo card):*
- Form em `space-y-4` com inputs de Nome e Email
- Botão "Salvar" `size="sm"` com Loader2

*Card "Datas":*
- Mesmo padrão `<dl>` com Criado em, Atualizado em, Validado em, Excluído em
- Datas nulas exibidas como `"—"`

*Modal de alteração de perfil:*
- `<Dialog>` com `<Select>` para escolher o novo perfil
- `<DialogFooter>`: botão "Cancelar" + botão "Confirmar"

*Diálogo de exclusão:*
- `<ConfirmDialog variant="destructive">` — mensagem cita o nome do usuário

---

## MILESTONE 4 — Profile & Settings

---

### Issue #16 — [admin] Profile page
**Labels:** admin, frontend, auth, feature

**User stories:**
- Como **administrador autenticado**, quero **visualizar e atualizar meu próprio perfil**, para que **eu possa manter meus dados cadastrais corretos**.
- Como **administrador autenticado**, quero **trocar minha senha informando a senha atual**, para que **eu possa alterar minhas credenciais com segurança**.

**Goal:** Logged-in admin can view and update their own profile.

**Referência de implementação:** `src/pages/Profile.tsx` em fabianoneumann/admin-compass

**Tasks:**
- Create `src/app/routes/_layout/profile.tsx`
- Create `src/features/auth/api/`:
  - `getProfile()` → `GET /auth/me`
  - `updateProfile(name)` → `PATCH /auth/me`
  - `changePassword(currentPassword, newPassword)` → `PATCH /auth/me/password`
- Create `src/features/auth/hooks/`:
  - `useProfile()` — TanStack Query useQuery
  - `useUpdateProfile()`, `useChangePassword()` — useMutation with toast feedback
- On password change success: clear session and redirect to `/login`
  (API invalidates token_version — all sessions revoked)
- Unit test: name update calls API, password mismatch shows inline error

**Implementação visual — replicar fielmente do admin-compass:**

*Layout da página:*
- `PageLayout title="Meu Perfil"`
- Wrapper dos cards: `max-w-2xl space-y-6`

*Card "Informações pessoais":*
- `<CardTitle className="text-base">` + `<CardDescription>`
- Campos em `space-y-4`
- Campo Email: `disabled` com nota abaixo `text-xs text-muted-foreground` — "O e-mail não pode ser alterado"
- Botão "Salvar": `size="sm"` com Loader2

*Card "Alterar senha":*
- `<CardTitle className="text-base">` + `<CardDescription>`
- Três campos: senha atual, nova senha, confirmar nova senha — todos `type="password"`
- Botão "Alterar senha": `size="sm"` com Loader2

---

## MILESTONE 5 — Error Pages & Polish

---

### Issue #17 — [admin] Error pages (404 and 403)
**Labels:** admin, frontend, chore

**Goal:** Consistent error pages for not found and forbidden routes.

**Referência de implementação:**
- `src/pages/Forbidden.tsx` em fabianoneumann/admin-compass — referência primária para ambas as páginas
- `src/pages/NotFound.tsx` no admin-compass é minimalista e em inglês; **não replicar** — usar o padrão do Forbidden

**Tasks:**
- Create `src/app/routes/$.tsx` (TanStack Router catch-all → 404 page)
- Create `src/app/routes/403.tsx`
- Wire 403 redirect in route guards for future role-restricted routes

**Implementação visual — replicar o padrão de Forbidden.tsx para ambas as páginas:**

*Estrutura comum (403 e 404):*
- `min-h-screen flex items-center justify-center bg-background`
- `<div className="text-center space-y-4">`
- Código de erro: `text-7xl font-bold text-primary`
- Mensagem: `text-xl text-muted-foreground` — em português
- Botão "Voltar ao painel": `<Button>` apontando para `/dashboard`

*Textos:*
- 404: "Página não encontrada"
- 403: "Você não tem permissão para acessar esta página"

---

### Issue #18 — [admin] Dashboard page
**Labels:** admin, frontend, feature

**User stories:**
- Como **administrador**, quero **visualizar um resumo do estado do sistema ao entrar no painel**, para que **eu possa ter uma visão rápida das métricas mais relevantes sem precisar navegar por outras telas**.

**Goal:** Summary cards and recent users chart connected to real data.

**Referência de implementação:** `src/pages/Dashboard.tsx` em fabianoneumann/admin-compass

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

**Implementação visual — replicar fielmente do admin-compass:**

*Cards de resumo:*
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
- `<CardHeader className="flex flex-row items-center justify-between pb-2">`
- Label: `<CardTitle className="text-sm font-medium text-muted-foreground">`
- Ícone: `h-4 w-4 text-muted-foreground` (Users, UserCheck, UserX, ShieldCheck)
- Valor: `<p className="text-3xl font-bold">`

*Gráfico de barras (Recharts — `BarChart`):*
- `<ResponsiveContainer width="100%" height={280}>`
- `<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />`
- Eixos: `stroke="hsl(var(--muted-foreground))" fontSize={12}`
- Tooltip customizado:
  ```tsx
  contentStyle={{
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "6px",
    color: "hsl(var(--foreground))",
  }}
  ```
- Barras: `fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}`

*Card de usuários recentes:*
- `<CardTitle className="text-base">` "Usuários Recentes"
- Colunas: Nome, Email, Perfil (RoleBadge), Criado em — reutilizar DataTable com `pageSize={5}`

---

## Implementation order

Milestone 1 (Issues #1–5) → Milestone 2 (Issues #6–11) → Milestone 3 (Issues #12–15)
→ Milestone 4 (Issue #16) → Milestone 5 (Issues #17–18)

Start each issue only after the previous is merged and green on CI.
The Lovable project (fabianoneumann/admin-compass) serves as visual and implementation reference throughout.
Each issue with UI lists a **"Referência de implementação"** pointing to the exact file(s) in admin-compass.
The **"Implementação visual"** section in each issue contains the CSS classes, tokens, and patterns
extracted directly from the admin-compass source code — replicar fielmente garante fidelidade visual total.
