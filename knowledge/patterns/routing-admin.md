# Pattern: Routing (Admin)

## File-based routing com TanStack Router

Rotas ficam em `src/app/routes/`. O plugin Vite gera `routeTree.gen.ts` automaticamente.
**Nunca editar `routeTree.gen.ts`** — qualquer edição é sobrescrita na próxima compilação.

## Convenções de nomes de arquivo

| Arquivo | Resultado |
|---|---|
| `index.tsx` | rota `/` |
| `login.tsx` | rota `/login` |
| `_layout.tsx` | layout para rotas filhas (sem segmento de URL) |
| `__root.tsx` | root layout (sem segmento de URL) |
| `_layout/tours/index.tsx` | rota `/tours` dentro do layout autenticado |
| `_layout/tours/$id.tsx` | rota `/tours/:id` (parâmetro dinâmico) |
| `$.tsx` | rota 404 (catch-all) |

## Rotas existentes

```
/                   → index.tsx (redirect)
/login              → login.tsx
/forgot-password    → forgot-password.tsx
/reset-password     → reset-password.tsx
/403                → 403.tsx
/*                  → $.tsx (404)
/_layout            → _layout.tsx (wrapper autenticado)
  /dashboard        → _layout/dashboard/index.tsx
  /tours            → _layout/tours/index.tsx
  /tours/new        → _layout/tours/new.tsx
  /tours/:id        → _layout/tours/$id.tsx
  /extras           → _layout/extras/index.tsx
  /extras/new       → _layout/extras/new.tsx
  /extras/:id       → _layout/extras/$id.tsx
  /users            → _layout/users/index.tsx
  /users/:id        → _layout/users/$id.tsx
  /profile          → _layout/profile.tsx
```

## Auth guard com beforeLoad

```ts
// _layout.tsx
export const Route = createFileRoute('/_layout')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AuthenticatedLayout,
})
```

## Navegação interna

```tsx
import { Link, useNavigate } from '@tanstack/react-router'

// Link tipado — TypeScript valida se a rota existe
<Link to="/items/$id" params={{ id: item.id }}>Ver item</Link>

// Programático
const navigate = useNavigate()
navigate({ to: '/tours', search: { page: 1 } })
```

**`to` vs `href`:**
- `to` — rotas internas, tipado pelo router, auto-complete
- `href` — apenas links externos (ex: `href="https://..."`)
Usar `href` para rotas internas causa erros silenciosos de tipagem.

## Parâmetros de rota e busca

```ts
// acessar parâmetro de URL (/tours/:id)
const { id } = Route.useParams()

// acessar query params (/tours?page=1)
const { page } = Route.useSearch()
```
