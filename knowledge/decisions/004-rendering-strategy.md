# ADR 004: Estratégia de renderização — Server Components vs Client Components

## Status

Recomendado — aplicar ao scaffoldar apps/web com Next.js 16 + App Router.

## Contexto

O apps/web tem duas categorias de página radicalmente diferentes em comportamento e requisitos:

**Páginas de conteúdo público:** catálogo, landing pages, páginas de detalhe. Iguais para
qualquer visitante. Google precisa indexar. Dados mudam raramente. Velocidade é crítica para
conversão e SEO.

**Páginas do usuário (protegidas ou de auth):** login, cadastro, recuperação de senha,
perfil, histórico. Específicas de cada usuário. Google não indexa (conteúdo privado).
Requerem JavaScript de qualquer forma (Zustand, routing).

## Critério de decisão

Duas perguntas determinam o tipo de componente para qualquer página nova:

1. **Google precisa indexar este conteúdo?**
2. **O conteúdo é idêntico para qualquer pessoa que abrir a URL?**

Se ambas as respostas forem **sim** → Server Component + ISR.
Qualquer **não** → Client Component.

## Decisão

| Categoria | Páginas | Estratégia | Ferramentas |
|---|---|---|---|
| Conteúdo público | Home, listagens, páginas de detalhe | **Server Component + ISR** | `serverFetch`, `revalidate`, `generateStaticParams` |
| Auth | `/login`, `/register`, `/password/*` | **Client Component** | Axios `api`, `useMutation`, `@base-ui/react Field` |
| Protegidas do usuário | área de conta, histórico, checkout | **Client Component** | Axios `api`, `useQuery`, `useSuspenseQuery`, Zustand |

## Por que Client Components nas páginas do usuário

**A auth requer Zustand de qualquer forma.** Após login, `useAuthStore.getState().setSession()`
precisa ser chamado no cliente. Server Actions não eliminam essa etapa — apenas empurram o resultado
para um `useEffect`, adicionando complexidade sem ganho.

**Páginas protegidas não têm SEO a perder.** Perfil, histórico e checkout nunca serão
indexados pelo Google. Não há motivo para render server-side.

**Server Actions trazem valor quando** o resultado é uma redirect pura sem atualização de estado
cliente-side. Páginas de auth com Zustand não se enquadram nesse caso.

## Por que Server Components no conteúdo público

**ISR serve a mesma resposta cacheada para todos os visitantes**, com revalidação a cada N segundos
ou sob demanda. Um único render do servidor serve milhares de requests sem custo de CPU adicional.

**SEO depende do HTML inicial.** Título, descrição e JSON-LD precisam estar no HTML que o Google
recebe, não injetados por JS.

## Consequências

- `serverFetch` (`src/lib/api/server.ts`) é a única ferramenta de fetch em Server Components.
- Axios (`src/lib/api/client.ts`) nunca é importado em Server Components.
- O critério "requer token do Zustand" implica automaticamente Client Component.
- `HydrationBoundary` é usado quando uma Server Page precisa prefetchar dados para um Client Component filho.
- O grupo de rotas `(auth)` usa layout próprio sem Header/Footer completo (rotas de auth são Client Components em layout minimalista).

## Referências

- `patterns/server-components.md` — exemplos de fetch, ISR, HydrationBoundary
- `patterns/data-fetching-web.md` — serverFetch e Axios client, dois singletons do QueryClient
- `patterns/forms-web.md` — padrão de formulário para Client Components do web
