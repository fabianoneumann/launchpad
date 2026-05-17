# Architecture: Admin (apps/admin)

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19.2.4 | UI |
| Vite | 8.0.1 | bundler + dev server (porta 5173) |
| TanStack Router | 1.168.10 | roteamento file-based |
| TanStack Query | 5.96.1 | cache e estado de servidor |
| Zustand | 5.0.12 | estado global (auth, UI prefs) |
| React Hook Form | 7.72.0 | formulários |
| Zod | 4.0.0 | validação de schemas |
| Axios | 1.14.0 | HTTP client com interceptors |
| shadcn/ui | CLI 4.1.2 | componentes UI (style: new-york, primitivo: **radix-ui**) |
| Tailwind CSS | 4.2.2 | utility-first CSS |
| Lucide React | 1.7.0 | ícones |

## Estrutura de pastas

```
apps/admin/src/
├── app/
│   ├── routes/             ← rotas file-based (17 rotas)
│   ├── routeTree.gen.ts    ← NUNCA EDITAR — gerado pelo TanStack Router
│   ├── providers.tsx
│   └── router.ts
├── components/
│   └── ui/                 ← 24 componentes shadcn/ui — atualizar via CLI, não editar
├── features/               ← domínios (auth, dashboard, extras, tours, users)
│   └── {domínio}/
│       ├── api/            ← chamadas HTTP (React Query hooks)
│       ├── components/     ← componentes do domínio
│       ├── hooks/          ← hooks específicos
│       └── types.ts
└── lib/
    ├── api/
    │   └── client.ts       ← Axios instance + interceptors JWT
    ├── react-query/
    │   └── query-client.ts ← configuração do QueryClient
    ├── stores/
    │   └── ui-preferences-store.ts  ← Zustand persist
    └── utils.ts
```

## HTTP Client (src/lib/api/client.ts)

Axios com interceptors automáticos:
- **Request:** injeta `Authorization: Bearer {token}` se autenticado
- **Response 401:** tenta refresh via `PATCH /auth/token/refresh` (máx 1 tentativa, flag `_retry`)
- Se refresh falhar: `clearSession()` + navega para `/login`

URLs que ignoram o interceptor de refresh (SKIP_REFRESH_URLS):
`/auth/me/password`, `/auth/token/refresh`, `/auth/admin/login`, `/auth/login`, `/auth/logout`

## Auth Store (src/features/auth/store/auth-store.ts)

Estado global de autenticação via Zustand:
- `user: AuthUser | null`
- `token: string | null`
- `isAuthenticated: boolean`
- Métodos: `setSession()`, `clearSession()`, `setToken()`, `updateName()`

## Roteamento

File-based routing gerado pelo plugin TanStack Router no Vite:
- Rotas em `src/app/routes/`
- `routeTree.gen.ts` **nunca editar** — gerado automaticamente
- `_layout.tsx` — wrapper para todas as rotas autenticadas
- `__root.tsx` — root layout com providers

Rotas existentes: login, forgot-password, reset-password, dashboard, tours (list/new/$id), extras (list/new/$id), users (list/$id), profile, 403, 404 ($).

## Regras críticas

**UI sempre pt-BR:** o painel admin é monolíngue — nunca adicionar i18n de interface.

**shadcn/ui:** não editar `src/components/ui/` diretamente — usar CLI para adicionar ou atualizar componentes. O primitivo de base é `radix-ui` (pacote unificado `^1.4.3`); **nunca importar de `@base-ui/react`** neste app — esse é o primitivo do `apps/web`. Ver `knowledge/patterns/shadcn-components.md`.

**routeTree.gen.ts:** nunca editar — qualquer edição será sobrescrita na próxima compilação.

**`to` vs `href`:** usar `to` (tipado pelo router) para links internos, `href` apenas para links externos.

## DataTable (src/components/shared/DataTable)

Componente genérico sobre `@tanstack/react-table` v8 com paginação manual:

```tsx
<DataTable
  columns={columns}         // ColumnDef<T>[]
  data={data}
  isLoading={isLoading}
  rowCount={total}          // total de registros (para calcular páginas)
  pagination={{
    page,
    pageSize,
    onPageChange: setPage,
    onPageSizeChange: setPageSize,  // opcional — exibe select de itens/página
  }}
  emptyState={<p>Nenhum item encontrado.</p>}  // opcional
/>
```

- Opções de page size: `[10, 20, 50, 100]`; padrão: `20`
- `page` começa em 1 (não 0) — o componente converte internamente para `pageIndex`
- Page size persistido por entidade via `useUIPreferencesStore` (Zustand + localStorage)

## Stack adicional

- **Sonner:** toasts (substituiu react-hot-toast)
- **React MD Editor (`@uiw/react-md-editor`):** editor rich text para campos de descrição.
  Requer import de CSS: `import '@uiw/react-md-editor/markdown-editor.css'`
- **Recharts:** gráficos no dashboard
- **MSW 2:** mock de API em testes
- **Playwright:** E2E (baseURL: localhost:5173, global-setup em `tests/e2e/global-setup.ts`)
