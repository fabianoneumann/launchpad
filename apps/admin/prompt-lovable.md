Build a generic admin panel web application in React + TypeScript to be used as a reusable starter template.
                                                                                                                             
  ## Tech stack                                                                                                                - React + TypeScript
  - TanStack Router (file-based routing)                                                                                     
  - Zustand (auth state)
  - React Hook Form + Zod (forms and validation)
  - Shadcn/ui + Tailwind CSS
  - Lucide React (icons)
  - Mock data only — no external API, no Supabase, no Axios

  ## Design system
  - Dark mode as default, with light mode toggle
  - Color palette based on CSS custom properties (easy to rebrand by changing a few variables)
  - Neutral base: zinc/slate scale
  - Single accent color: indigo or violet (configurable via CSS variable)
  - Typography: clean sans-serif, Inter or system font
  - Sober, professional tone — no playful elements

  ---

  ## Layout

  ### Shell
  - Fixed sidebar on the left (240px)
  - Top bar with: page title, breadcrumb, logged-in user name + avatar initials, dark/light toggle
  - Main content area with consistent padding
  - Sidebar collapses to icon-only on mobile (hamburger trigger)

  ### Sidebar navigation sections
  1. **Geral**
     - Dashboard (`/dashboard`) — LayoutDashboard icon
  2. **Usuários**
     - Usuários (`/users`) — Users icon
  3. **Operações** *(Em breve — items disabled with "Em breve" badge)*
     - Reservas — CalendarDays icon
     - Passeios — Map icon
  4. **Financeiro** *(Em breve — items disabled with "Em breve" badge)*
     - Pagamentos — CreditCard icon
  5. **Configurações** (bottom of sidebar)
     - Meu Perfil (`/profile`) — UserCircle icon
     - Sair — LogOut icon

  ---

  ## Pages

  ### /login (public, split-screen)

  **Left panel (60% width, dark background zinc-950):**
  - Background: subtle gradient mesh — 2 or 3 large blurred color blobs (indigo + violet + emerald at ~15% opacity) creating 
  depth
  - Over the background: large Lucide outline icons (LayoutDashboard, Users, BarChart3, Shield, Settings, Bell) scattered as 
  a wallpaper pattern at ~10% opacity, various sizes
  - Bottom-left corner: placeholder logo text `Logo` in white with a small tagline below: *"Gerencie com eficiência."*       

  **Right panel (40% width, clean card):**
  - Vertically centered form
  - Top: text `Fabiano Neumann` as logo placeholder (bold, medium size)
  - Heading: `Entrar no painel`
  - Subheading: `Acesse com suas credenciais de administrador`
  - Fields: Email, Senha (with show/hide toggle)
  - Submit button: `Entrar` (full width, accent color)
  - On submit with any valid-looking email+password: redirect to /dashboard
  - Link below: `Esqueci minha senha` (leads to /forgot-password)

  ### /forgot-password (public)
  - Centered card layout (no split screen)
  - Heading: `Recuperar senha`
  - Field: Email
  - Button: `Enviar instruções`
  - Success state: show confirmation message inline
  - Link: `Voltar ao login`

  ### /dashboard (protected)
  Four summary cards at the top:
  - Total de Usuários: 128
  - Usuários Ativos: 115
  - Não Validados: 8
  - Administradores: 5

  Below cards: a bar chart (use Recharts or a simple Shadcn chart) showing mock "Novos usuários por mês" for the last 6      
  months.

  Below chart: a small table "Usuários Recentes" showing last 5 mock users (name, email, role badge, created_at).

  ### /users (protected)
  Full data table with:
  - **Columns:** Nome, Email, Perfil (role badge), Validado (CheckCircle2 or XCircle icon), Status (Ativo/Deletado badge),   
  Criado em, Ações
  - **Filters row:** input search by name/email, role select (Todos / Admin / Member / User), status toggle (Ativos /        
  Deletados / Todos)
  - Deleted rows appear visually dimmed (opacity-50)
  - Pagination: 10 per page, with previous/next controls and page count
  - **Ações column:** View (Eye icon), Edit (Pencil icon), Delete (Trash2 icon)
  - Top right: button `+ Novo Usuário` → opens create user modal
  - Empty state component when filters return no results

  **Create User modal:**
  - Fields: Nome, Email, Perfil (select: User / Member / Admin)
  - Zod validation on all fields
  - Buttons: Cancelar / Criar Usuário
  - On submit: add mock user to local list and show success toast

  ### /users/:id (protected)
  - User detail card: all fields displayed (id, name, email, role, validated_at, deleted_at, created_at, updated_at)
  - Breadcrumb: Usuários > [Nome do Usuário]
  - Action buttons:
    - `Editar` → opens inline edit form (name, email)
    - `Alterar Perfil` → modal with role selector and confirmation
    - `Excluir` → confirmation dialog before soft-deleting (sets deleted_at in mock state)
  - Back link to /users

  ### /profile (protected)
  - Card with logged-in admin's mock data
  - Section 1: Edit name — React Hook Form, save button
  - Section 2: Change password — currentPassword + newPassword + confirm, Zod validation
  - Success/error toasts on submit

  ### /404 (catch-all)
  - Centered layout
  - Large `404` number in accent color
  - Message: `Página não encontrada`
  - Button: `Voltar ao painel`

  ### /403
  - Same layout as 404
  - Large `403`
  - Message: `Você não tem permissão para acessar esta página`
  - Button: `Voltar ao painel`

  ---

  ## Reusable components to generate

  - `PageLayout` — wraps every protected page with consistent title, breadcrumb slot and optional action button slot
  - `DataTable` — generic paginated table component used in /users and /dashboard recent users
  - `EmptyState` — icon + title + description + optional action button
  - `LoadingSkeleton` — skeleton rows for tables and cards
  - `ConfirmDialog` — reusable confirmation modal (title, description, confirm/cancel)
  - `RoleBadge` — colored badge for ADMIN (red), MEMBER (blue), USER (gray)
  - `StatusBadge` — Ativo (green) / Deletado (red/dimmed)

  ---

  ## Mock data
  Generate a mock dataset of 25 users with varied roles, some with deleted_at filled, some with validated_at null. Store in a
   local Zustand store or a plain mock file. All CRUD operations (create, edit, role change, soft delete) should update this 
  in-memory state so interactions feel real.

  ## Auth mock
  - Zustand store with: `user`, `token`, `isAuthenticated`, `login()`, `logout()`
  - Any email + password (min 6 chars) logs in as a mock ADMIN user
  - `login()` sets mock user data and redirects to /dashboard
  - `logout()` clears state and redirects to /login
  - TanStack Router `beforeLoad` guard on all protected routes

  ## UX details
  - Toast notifications (Sonner or Shadcn toast) for all mutations: success and error variants
  - All forms show inline validation errors (React Hook Form + Zod)
  - Confirmation dialogs for: delete user, change role, logout
  - Loading spinner on form submit buttons
  - Responsive: sidebar becomes a slide-over drawer on mobile

  ## Code and documentation in English
  - All variable names, function names, component names, comments, and file names in English
  - All user-facing text (labels, headings, buttons, messages) in Portuguese (Brazil)

Code gerenated and pushed to:
   https://github.com/fabianoneumann/admin-compass.git