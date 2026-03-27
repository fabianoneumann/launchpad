# eco-iguassu — Admin App

Aplicação de administração do projeto eco-iguassu. Este README documenta decisões de arquitetura, estrutura de pastas planejada e pontos em aberto para quando o desenvolvimento for iniciado.

---

## Contexto

- App ainda não iniciado — scaffold pendente (Issue eco-iguassu#12).
- O projeto é um monorepo (Turborepo + pnpm). A stack da API é Fastify + Prisma + Zod.
- O **Lovable** foi usado como ferramenta de design/prototipação — não como fonte de código. O output serve como referência visual e de escopo de features. O código é gerado aqui, no monorepo, conectado à API real.

### Artefatos do processo de planejamento

| Arquivo | Descrição |
|---|---|
| `prompt-lovable.txt` | Prompt usado para gerar o protótipo no Lovable. Inclui link para o repositório gerado ao final. |
| `issues-plan.txt` | Plano de trabalho com todas as issues do painel admin, organizadas por milestone. Usado como rascunho antes de criar cada issue no GitHub. |

**Referência visual:** [fabianoneumann/admin-compass](https://github.com/fabianoneumann/admin-compass) — projeto gerado pelo Lovable a partir do `prompt-lovable.txt`. Usado como referência de UI e escopo de features durante a implementação. O código não é compatível com a arquitetura deste projeto (usa React Router v6 e estrutura `pages/` flat).

---

## Stack planejada

| Camada | Ferramenta |
|---|---|
| Framework | React + Vite + TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Roteamento | TanStack Router |
| Estado servidor | TanStack Query (React Query) |
| Estado global cliente | Zustand |
| Tabelas | TanStack Table |
| Formulários | React Hook Form + Zod |
| Requisições HTTP | Axios |
| Testes unitários/integração | Vitest + React Testing Library |
| Testes E2E | Playwright |
| Mock de API em testes | MSW (Mock Service Worker) |

---

## Decisão: TanStack Router

**Roteador escolhido: TanStack Router.**

Racional:

- **Type-safety de ponta a ponta** — params, search params e estado de navegação todos tipados; erro em tempo de compilação se errar um param
- **File-based routing nativo** — estrutura de arquivos vira estrutura de rotas automaticamente
- **Integração nativa com TanStack Query** — prefetch e loaders integrados à rota sem boilerplate manual; os dois fazem parte do mesmo ecossistema (TanStack)
- **Devtools incluídas**

O React Router v7 (evolução do Remix) seria preferível em projetos full-stack onde os loaders rodam no servidor e acessam o banco diretamente, eliminando a necessidade de uma API REST separada. Esse não é o caso aqui: o admin é um cliente da API Fastify existente, e o TanStack Query já resolve o data fetching com cache, retry e invalidation.

---

## Decisão: Zustand para estado global

**Estado global escolhido: Zustand.**

O estado verdadeiramente global do admin é pequeno — sessão do usuário autenticado e pouco mais. O Context API resolveria funcionalmente, mas tem uma limitação relevante para este projeto: hooks só funcionam dentro de componentes React, o que impede a leitura do estado de autenticação fora do React.

O caso concreto é o interceptor do axios (`lib/api/client.ts`): ao capturar um 401, ele precisa ler o token, chamar o refresh e atualizar o estado — tudo fora de componentes. Com Zustand isso é direto:

```ts
// fora do React — funciona
const { token, setToken } = useAuthStore.getState()
```

TanStack Query cuida de todo o estado do servidor. Zustand cobre apenas o estado de sessão do cliente.

---

## Decisão: Axios para requisições HTTP

**Cliente HTTP escolhido: Axios.**

O fluxo de refresh token exige interceptors — capturar o 401, tentar o refresh, e reexecutar a request original de forma transparente para o chamador. O Axios tem suporte nativo a interceptors de request e response, tornando esse padrão direto de implementar sem boilerplate extra.

---

## Estrutura de pastas planejada

```
apps/admin/
├── src/
│   ├── app/                        # roteamento, layout raiz e providers
│   │   ├── routes/                 # páginas organizadas por rota (file-based routing)
│   │   │   ├── __root.tsx          # rota raiz obrigatória do TanStack Router
│   │   │   ├── _layout.tsx         # layout sem path (pathless layout route)
│   │   │   ├── dashboard/
│   │   │   │   ├── index.tsx
│   │   │   │   └── dashboard.test.tsx
│   │   │   └── users/
│   │   │       ├── index.tsx
│   │   │       └── $id.tsx         # param dinâmico — convenção TanStack Router
│   │   ├── router.ts               # instância do router (createRouter)
│   │   ├── routeTree.gen.ts        # gerado automaticamente pelo TanStack Router — não editar
│   │   └── providers.tsx           # QueryClient, Auth, Theme...
│   │
│   ├── features/                   # domínios da aplicação (feature-first)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── LoginForm.test.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useAuth.test.ts
│   │   │   ├── api/
│   │   │   │   └── auth.api.ts
│   │   │   └── index.ts            # barrel export — só expõe o que é público
│   │   ├── users/
│   │   ├── dashboard/
│   │   └── ...                     # uma pasta por domínio
│   │
│   ├── components/                 # componentes verdadeiramente compartilhados entre features
│   │   ├── ui/                     # shadcn/ui (não modificar diretamente)
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── shared/
│   │       ├── DataTable/
│   │       │   ├── DataTable.tsx
│   │       │   └── DataTable.test.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts           # instância do axios apontando para apps/api (com interceptors de auth)
│   │   ├── react-query/
│   │   │   └── query-client.ts
│   │   └── utils.ts
│   │
│   ├── hooks/                      # hooks globais (tema, media query, etc.)
│   └── types/                      # tipos locais do admin, complementares ao shared-types
│
├── tests/
│   ├── e2e/                        # Playwright
│   │   ├── auth.spec.ts
│   │   └── users.spec.ts
│   └── setup.ts                    # setup global do Vitest
│
├── .env.example
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

### Princípios da estrutura

**Feature-first, não file-type-first.** Tudo relacionado a `users` fica junto em `features/users/` — componentes, hooks, chamadas de API. Não espalhado em pastas separadas por tipo de arquivo.

**Testes co-located.** `LoginForm.test.tsx` fica ao lado de `LoginForm.tsx`. Quando o componente é movido ou deletado, o teste vai junto.

**Separação `app/` vs `features/`.** `app/` cuida de roteamento e providers. `features/` cuida de lógica de negócio. O Lovable mistura tudo em `pages/` — aqui há separação explícita de responsabilidades.

**Barrel exports.** Cada feature tem um `index.ts` que expõe apenas a interface pública da feature. Detalhes internos ficam encapsulados.

---

## Sobre o `packages/ui` e os componentes shadcn

O monorepo tem um `packages/ui` para componentes compartilhados entre apps. A questão é: o shadcn/ui do admin vai para lá ou fica local?

**Regra prática adotada aqui:** o shadcn fica local em cada app (`src/components/ui/`), e o `packages/ui` recebe apenas componentes que sejam **comprovadamente idênticos** entre o admin e o web.

**Por quê?** Admin e web têm públicos e objetivos diferentes. O admin tende a ser mais denso em dados (tabelas, filtros, formulários complexos). O web pode ser mais voltado ao consumidor final. Forçar o compartilhamento desde o início cria acoplamento prematuro — uma mudança no Button do web pode afetar o admin sem intenção.

**O que faz sentido em `packages/ui`:**
- Design tokens (cores, tipografia, espaçamento) definidos como Tailwind config
- Componentes que são **de fato** os mesmos nas duas apps após uso real (ex: Notification toast, Avatar, Badge de status)

**O que fica local em cada app:**
- shadcn/ui base — você é o dono do código, customize conforme a necessidade de cada app
- Componentes compostos específicos do contexto (DataTable do admin não faz sentido no web)

> Mover algo de local para `packages/ui` quando a duplicação for confirmada é barato. Criar um pacote compartilhado prematuro e depois descobrir que as apps divergem é caro.

---

## Estratégia de testes

| Camada | Ferramenta | O que testa |
|---|---|---|
| Unitário | Vitest + React Testing Library | hooks, utils, componentes isolados |
| Integração | Vitest + MSW | features completas com API mockada |
| E2E | Playwright | fluxos críticos no browser real |

Testes co-located com o código que testam. Configuração global em `tests/setup.ts`.

---

## Convenção: links de e-mail transacionais

Links enviados em e-mails transacionais (recuperação de senha, verificação de e-mail) **sempre apontam para o frontend** (`APP_URL`), nunca diretamente para a API.

```
E-mail → link aponta para rota do frontend
  → frontend extrai o token da URL
  → frontend chama o endpoint da API via axios
  → frontend exibe o resultado ao usuário (sucesso ou erro)
```

| E-mail | Link no e-mail | Rota do frontend | Endpoint da API chamado pelo frontend |
|---|---|---|---|
| Recuperação de senha | `APP_URL/auth/reset-password?token=` | `reset-password.tsx` | `PATCH /auth/password/reset` |
| Verificação de e-mail | `APP_URL/verify-email?token=` | `verify-email.tsx` (futuro) | `GET /auth/email/verify?token=` |

Os endpoints de API existem para serem chamados via fetch/axios pelo frontend — não para serem acessados diretamente pelo navegador ao clicar no link. `APP_URL` é definido no backend (`apps/api/.env`) e aponta para a URL pública do frontend.

---

## Fluxo de kickoff

1. ~~Usar Lovable para prototipar as telas do admin — anotar rotas, entidades, componentes por tela~~ ✓ **Concluído** — protótipo em [fabianoneumann/admin-compass](https://github.com/fabianoneumann/admin-compass), plano de issues em `issues-plan.txt`
2. Gerar scaffold do app no monorepo com estrutura acima já configurada (Issue eco-iguassu#12)
3. Configurar Vitest e Playwright antes de escrever a primeira feature
4. Implementar features uma a uma, partindo da autenticação
