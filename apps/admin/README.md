# eco-iguassu — Admin App

Aplicação de administração do projeto eco-iguassu. Este README documenta decisões de arquitetura, estrutura de pastas planejada e pontos em aberto para quando o desenvolvimento for iniciado.

---

## Contexto

- App ainda não iniciado — este arquivo substitui o `.gitkeep` como registro das decisões tomadas antes do kickoff.
- O projeto é um monorepo (Turborepo + pnpm). A stack da API é Fastify + Prisma + Zod.
- A abordagem planejada é usar o **Lovable** como ferramenta de design/prototipação — não como fonte de código. O output do Lovable (gerado com Supabase como backend) serve como referência visual e de escopo de features. O código é gerado aqui, no monorepo, conectado à API real.

---

## Stack planejada

| Camada | Ferramenta |
|---|---|
| Framework | React + Vite + TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Roteamento | **A definir** — ver seção abaixo |
| Estado servidor | TanStack Query (React Query) |
| Testes unitários/integração | Vitest + React Testing Library |
| Testes E2E | Playwright |
| Mock de API em testes | MSW (Mock Service Worker) |

---

## Ponto em aberto: React Router vs TanStack Router

A decisão de roteamento está em aberto e deve ser tomada antes de iniciar o desenvolvimento.

**React Router v6/v7**
- Mais maduro e com ecossistema maior
- v7 introduz file-based routing opcional (modo framework)
- Documentação abundante, mais fácil de encontrar ajuda
- Mais familiar para a maioria dos devs React

**TanStack Router**
- Type-safety de rotas de ponta a ponta (params, search params, loaders — tudo tipado)
- File-based routing nativo
- Integração natural com TanStack Query (mesmo ecossistema)
- Mais novo, ecossistema menor, curva de aprendizado maior

**Recomendação para considerar:** Se type-safety estrita nas rotas for prioridade e o time tiver familiaridade com o ecossistema TanStack, o TanStack Router é a escolha mais coerente. Para times que priorizam velocidade de onboarding, React Router v7 é mais seguro.

> **Decisão:** pendente — definir antes de iniciar o scaffold do app.

---

## Estrutura de pastas planejada

```
apps/admin/
├── src/
│   ├── app/                        # roteamento, layout raiz e providers
│   │   ├── routes/                 # páginas organizadas por rota
│   │   │   ├── _layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── index.tsx
│   │   │   │   └── dashboard.test.tsx
│   │   │   └── users/
│   │   │       ├── index.tsx
│   │   │       └── [id].tsx
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
│   │   │   └── client.ts           # instância do fetch/axios apontando para apps/api
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

## Fluxo de kickoff sugerido

1. Definir roteador (React Router vs TanStack Router)
2. Usar Lovable para prototipar as telas do admin — anotar rotas, entidades, componentes por tela
3. Gerar scaffold do app no monorepo com estrutura acima já configurada
4. Configurar Vitest e Playwright antes de escrever a primeira feature
5. Implementar features uma a uma, partindo da autenticação
