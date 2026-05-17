# Pattern: Data Fetching — Web (apps/web)

> **Quando usar:** apps/web implementado como site público com Next.js 16 + App Router,
> com páginas públicas em Server Components (ISR/SSR) e páginas protegidas em Client Components.
> Se o web for uma SPA pura, o padrão do admin (Axios + TanStack Query client-side) pode ser mais simples.
>
> Dual approach: Server Components usam `fetch` nativo; Client Components usam Axios.
> Ver `patterns/data-fetching.md` para o padrão do admin.

## Server Components → `serverFetch`

```ts
// src/lib/api/server.ts
export async function serverFetch<T>(
  path: string,
  options?: RequestInit & { tags?: string[] },
): Promise<T> {
  const { tags, ...rest } = options ?? {}
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...rest,
    ...(tags ? { next: { tags } } : {}),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json() as Promise<T>
}

// uso com cache tag (ISR via revalidateTag)
const tours = await serverFetch('/tours', { tags: ['tours'] })
// uso com revalidação temporal
const tours = await serverFetch('/tours', { next: { revalidate: 60 } })
```

**Atenção Next.js 15+:** `fetch()` sem opções de cache usa `no-store` por padrão. Passar `tags`
ou `next.revalidate` explicitamente — não assumir cache automático.

## Client Components → Axios

```ts
// src/lib/api/client.ts
// baseURL: process.env.NEXT_PUBLIC_API_URL (não VITE_API_URL)
// withCredentials: true (refresh token em cookie httpOnly)
// interceptors: Bearer token + refresh automático em 401

const SKIP_REFRESH_URLS = [
  '/auth/token/refresh',  // evita loop infinito
  '/auth/login',
  '/auth/register',
  '/auth/logout',
  '/auth/me/password',    // 401 aqui = senha atual errada, não token expirado
]
// Diferença do admin: sem '/auth/admin/login'

// Redirect em falha de refresh: window.location.href = '/login'
// (useRouter() não funciona fora de componentes React)
```

## TanStack Query — dois singletons distintos

`React.cache()` não persiste entre re-renders no cliente. O web usa duas funções separadas:

```ts
// src/lib/react-query/query-client.ts
import { cache } from 'react'

// Para Server Components: uma instância por request HTTP
export const getQueryClient = cache(makeQueryClient)

// Para Providers (cliente): variável de módulo — persiste entre re-renders
let browserQueryClient: QueryClient | undefined = undefined
export function getBrowserQueryClient(): QueryClient {
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}
```

| Contexto | Função | Motivo |
|---|---|---|
| Server Component (prefetch) | `getQueryClient()` | `React.cache()` garante isolamento por request |
| `Providers` (client) | `getBrowserQueryClient()` | Variável de módulo persiste entre re-renders |

```tsx
// src/app/providers.tsx — usa getBrowserQueryClient, NÃO getQueryClient
'use client'
export function Providers({ children }) {
  const queryClient = getBrowserQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
// ReactQueryDevtools: obrigatório dynamic(..., { ssr: false }) — usa DOM APIs
```

```tsx
// Server Component com prefetch (usa getQueryClient)
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query/query-client'

export default async function ToursPage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: ['tours'], queryFn: () => serverFetch('/tours') })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ToursList />
    </HydrationBoundary>
  )
}
```

## Padrão de prefetch para listagens públicas (Server → Client via HydrationBoundary)

Separar fetch em dois arquivos — Server Components não podem importar `'use client'` diretamente:

```ts
// src/features/{dominio}/fetch-{dominio}.ts — sem 'use client', para Server Components
export const queryKey = (p: Params) => ['{dominio}', p.locale, { page: p.page ?? 1 }] as const

export function fetchItems(p: Params): Promise<Response> {
  return serverFetch(`/{dominio}?locale=${p.locale}`, { tags: ['{dominio}'] })
}

// src/features/{dominio}/use-{dominio}.ts — 'use client', para Client Components
export function useItems(p: Params) {
  return useQuery<Response>({
    queryKey: queryKey(p),
    queryFn: () => api.get('/{dominio}', { params: p }).then(r => r.data),
  })
}
```

O Client Component usa `useItems` com dados já no cache via `HydrationBoundary` — sem loading state na primeira renderização.

## ISR vs force-dynamic em páginas de detalhe

**Atenção:** rotas com `generateStaticParams` retornando `[]` (API inalcançável no build)
combinadas com `export const revalidate = N` causam 500 persistente em plataformas como Vercel —
o ISR cacheia a falha e serve o erro para todas as requisições seguintes.

**Regra:** se `generateStaticParams` pode retornar `[]` em produção (API dormindo no build),
use `force-dynamic` em vez de `revalidate`. O cache de dados (`tags`) ainda funciona; só
o cache de HTML da página é desativado.

```ts
// ✅ seguro quando generateStaticParams pode retornar []
export const dynamic = 'force-dynamic'

// ❌ problema: ISR cacheia renderização falha se generateStaticParams retornar []
export const revalidate = 60
```

## next/image com storage externo (ex: Cloudflare R2)

Se a URL do bucket não estiver configurada, `next/image` lança erro de hostname não autorizado.
Usar wildcard de fallback para desenvolvimento ou quando a variável pode estar ausente:

```ts
// next.config.ts
const bucketHostname = process.env.STORAGE_PUBLIC_URL
  ? new URL(process.env.STORAGE_PUBLIC_URL).hostname
  : null
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: bucketHostname ?? '*.r2.dev' }],
  },
}
```

## Ver também

- [`patterns/data-fetching.md`](data-fetching.md) — padrão do admin (Axios + TanStack Query SPA)
- [`architecture/api.md`](../architecture/api.md) — token versioning e revogação de sessão
