# Pattern: Testing (Web)

Padrões de teste recomendados para `apps/web` com Next.js 16 + App Router.
Ver [`testing.md`](testing.md) para os padrões de API e Admin.

---

## Vitest — diferenças em relação ao admin

- `baseURL`: `http://localhost:3000` (Next.js — não 5173)
- Server Components **não** testados via Vitest — testados integralmente via Playwright E2E
- Requer `@vitejs/plugin-react` explícito (Next.js não o inclui no env de teste)
- Env var: `NEXT_PUBLIC_API_URL` (não `VITE_API_URL`)
- Tipos de globals: `"types": ["vitest/globals"]` adicionado ao `tsconfig.json` raiz do app

```ts
// vitest.config.ts
import react from '@vitejs/plugin-react'
plugins: [react()],
env: { NEXT_PUBLIC_API_URL: 'http://localhost:3333' }
```

Mocks em `src/mocks/handlers.ts` e `src/mocks/node.ts` — padrão MSW v2.

---

## E2E Playwright — dois níveis de validação

### Nível 1 — Mocked (padrão geral)

A maioria dos testes usa `page.route()` para interceptar chamadas HTTP. O Playwright sobe o Next.js
via `webServer` (`reuseExistingServer: !CI`).

**Armadilha crítica com `page.route` em páginas SSR + HydrationBoundary:**
O padrão glob `'**/tours*'` intercepta TAMBÉM os bundles JS do Next.js (ex:
`/_next/static/chunks/app/.../tours/page-HASH.js`), devolvendo JSON no lugar de JavaScript.
Isso quebra a hidratação React silenciosamente: a página exibe o HTML do SSR mas perde
toda interatividade no cliente.

**Regra:** Para páginas cujo segmento de rota aparece no nome do bundle Next.js
(ex: `tours`, `account`, `admin`), use o host explícito no pattern:

```ts
// ❌ intercepta o bundle JS também
await page.route('**/tours*', ...)

// ✅ só a API no port 3333
await page.route('http://localhost:3333/tours*', ...)
```

**Páginas com SSR + HydrationBoundary:** o `page.route` intercept só afeta requisições do browser.
O `prefetchQuery` (SSR server-side) busca da API real — os dados reais já estão no cache.
O client não refaz a chamada (staleTime=60s). Mock nunca dispara para os dados principais.
→ Nessas páginas, **não usar mocks para dados de conteúdo** — escrever os testes contra o
servidor real e usar assertions com regex (ex: `/\d+ itens disponíveis/`).

```bash
pnpm --filter web test:e2e
```

Padrão de mock de autenticação (usado em todos os testes de rotas protegidas):

```ts
await context.addCookies([
  { name: 'refreshToken', value: 'fake-refresh-token', url: 'http://localhost:3000' },
])
await page.route(`${API}/auth/token/refresh`, (route) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ token: 'access-token', user: mockUser }),
  }),
)
```

### Nível 2 — Servidor real (validação manual pós-implementação)

Após implementar uma feature, validar com servidores reais para cobrir o que os mocks não cobrem:
autenticação real, persistência no banco, locale redirect, fluxos de e-mail, etc.

**Antes de rodar, verificar disponibilidade:**

```bash
# API acessível?
curl -s http://localhost:3333/health || echo "API offline"

# Banco de dados acessível? (requer Docker rodando)
pnpm --filter api db:push --dry-run 2>&1 | head -3
```

Se a API não responder, iniciar antes de testar:

```bash
# Terminal 1
pnpm --filter api dev   # porta 3333

# Terminal 2
pnpm --filter web dev   # porta 3000
```

Usar a skill `playwright-cli` para navegar e validar o golden path visualmente.
