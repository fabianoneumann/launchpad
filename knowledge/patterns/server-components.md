# Pattern: Server Components (Web)

> **Quando usar:** apps/web implementado como site público com SEO, conteúdo multilingual e
> renderização híbrida (SSR/ISR + Client Components). Se o caso de uso for diferente —
> SPA interna, dashboard, app mobile-first — avalie outras abordagens antes de aplicar estes padrões.
>
> Stack recomendada para esse cenário: Next.js 16 + App Router.

## Quando usar Server vs Client Component

| Necessidade | Tipo |
|---|---|
| Fetch de dados, SEO, sem interatividade | **Server Component** (padrão) |
| Estado (`useState`), eventos (`onClick`), hooks de browser | **Client Component** (`'use client'`) |
| Providers (QueryClientProvider, NextIntlClientProvider) | **Client Component** |

Server Component é o padrão no App Router — usar `'use client'` apenas quando necessário.

## Fetch em Server Component

```ts
// NÃO usar Axios em Server Components — usar fetch nativo
import { getLocale } from 'next-intl/server'

export default async function ToursPage() {
  const locale = await getLocale()
  const tours = await fetch(`${process.env.API_URL}/tours?locale=${locale}`, {
    next: { tags: ['tours'] },  // cache tag para revalidação seletiva
  }).then(r => r.json())

  return <TourGrid tours={tours} />
}
```

## Cache tags e revalidação

```ts
// fetch com cache tag
fetch(url, { next: { tags: ['tours'] } })

// revalidar de forma seletiva (ex: após mutação)
import { revalidateTag } from 'next/cache'
revalidateTag('tours')
```

## HydrationBoundary (prefetch para Client Components)

```tsx
// page.tsx (Server Component) — NÃO usar new QueryClient(), usar getQueryClient()
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query/query-client'
import { serverFetch } from '@/lib/api/server'

export default async function ToursPage() {
  const queryClient = getQueryClient()  // React.cache → uma instância por request
  await queryClient.prefetchQuery({ queryKey: ['tours'], queryFn: () => serverFetch('/tours') })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
```

`getQueryClient()` usa `React.cache()` — garante isolamento de instância entre requests no servidor.
`new QueryClient()` direto criaria uma instância nova a cada chamada sem esse isolamento.

## ISR (Incremental Static Regeneration)

```ts
// revalidação baseada em tempo
export const revalidate = 60  // segundos

// revalidação sob demanda via route handler
// POST /api/revalidate → revalidateTag('tours')
```

## Fetch em Client Component

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'  // Axios client

export function TourDetail({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => api.get(`/tours/${id}`).then(r => r.data),
  })
  return <div>{data?.name}</div>
}
```

## APIs de cache do Next.js 16 (`next/cache`)

> **Next.js 16:** o prefixo `unstable_` foi removido das APIs estabilizadas. Usar sempre sem o prefixo.

```ts
// Opt-out de cache em Server Component (ex: dados sempre frescos)
import { noStore } from 'next/cache'   // ← não 'unstable_noStore'
export default async function Page() {
  noStore()
  const data = await fetch(...)
}

// Cache tag granular (complementa next: { tags: [...] } no fetch)
import { cacheTag } from 'next/cache'  // ← não 'unstable_cacheTag'
cacheTag('tours')

// Revalidação sob demanda (sempre foi estável — sem mudança)
import { revalidateTag } from 'next/cache'
revalidateTag('tours')
```

## Regra: Axios apenas em Client Components

Server Components usam `fetch()` nativo com cache semântico do Next.js.
Axios não tem integração com o sistema de cache do App Router.

## Ver também

- [`patterns/json-ld.md`](json-ld.md) — schemas estruturados (JSON-LD) em Server Components
