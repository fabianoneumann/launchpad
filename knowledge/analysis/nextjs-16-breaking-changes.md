# Análise: Breaking Changes do Next.js 16

**Contexto:** Este projeto usa Next.js 16.2.4. Muita documentação e tutoriais ainda referenciam
Next.js 15 — esta análise mapeia os breaking changes relevantes para quem implementar o apps/web.

**Fonte:** documentação oficial (`/vercel/next.js/v16.2.2` via context7), confirmada em 2026-05-04.

---

## Breaking changes relevantes

### 1. `middleware.ts` → `proxy.ts` — **impacto alto**

Next.js 16 renomeou o arquivo de middleware de `middleware.ts` para `proxy.ts`. A função de export
segue a mesma convenção: `export default function proxy(request: NextRequest)`.

**Ponto crítico de composição:** Next.js suporta apenas um arquivo `proxy.ts` por projeto.
next-intl e auth guard precisam coexistir no mesmo arquivo:

```ts
const handleI18nRouting = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  // auth guard primeiro; i18n routing depois
  if (isProtected && !token) return NextResponse.redirect(loginUrl)
  return handleI18nRouting(request)
}
```

---

### 2. `unstable_noStore` / `unstable_cacheTag` → sem prefixo — **impacto baixo**

APIs do `next/cache` que eram prefixadas com `unstable_` foram estabilizadas:

| Next.js ≤ 15 | Next.js 16 |
|---|---|
| `unstable_noStore()` | `noStore()` |
| `unstable_cacheTag()` | `cacheTag()` |
| `revalidateTag()` | `revalidateTag()` (sem mudança) |

São o padrão natural para caching avançado em Server Components.
**Knowledge atualizado:** `patterns/server-components.md`

---

## Breaking changes sem impacto direto

| Mudança | Por que não impacta |
|---|---|
| `turbopack` top-level no `next.config.ts` (era `experimental.turbopack`) | Usar apenas o flag `--turbopack` no script `dev` — sem configurar opções |
| `eslint` removido do `next.config` | Usar `packages/eslint-config` — sem config ESLint via next.config |
| `skipProxyUrlNormalize` (era `skipMiddlewareUrlNormalize`) | Não usado |

---

## `params` e `searchParams` como Promise

Mudança introduzida no Next.js 15, mantida no 16. Sempre usar `await`:

```ts
const { locale, id } = await params
const page = Number((await searchParams).page ?? 1)
```
