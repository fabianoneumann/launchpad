# Architecture: Monorepo

## Stack

- **Monorepo:** Turborepo
- **Package manager:** pnpm 9 (workspaces)
- **TypeScript:** 5.8+ estrito em todos os apps

## Estrutura

```
launchpad/
├── apps/
│   ├── api/        ← Fastify 5 + Prisma 7 (backend)
│   ├── admin/      ← React 19 + Vite + TanStack Router (painel admin)
│   └── web/        ← Next.js 16 + App Router (site público — não scaffoldado)
├── packages/
│   ├── eslint-config/   ← config ESLint compartilhada
│   ├── shared-types/    ← tipos TypeScript compartilhados
│   └── ui/              ← VAZIO (só README.md — cada app instala shadcn independentemente)
└── design/                            ← design system do projeto (definido pelo fork)
```

## Regras críticas

**Dependências:** sempre instalar na raiz ou via filter — nunca dentro de um app diretamente.

```bash
pnpm add <pacote> -w                        # dependência na raiz (compartilhada)
pnpm add <pacote> --filter api              # dependência só na api
pnpm add <pacote> --filter admin            # dependência só no admin
pnpm add <pacote> --filter web              # dependência só no web
```

**ESLint:** nunca criar configs ESLint locais nos apps — todas as regras ficam em `packages/eslint-config`.

**shadcn/ui:** cada app instala e configura shadcn independentemente. O `packages/ui` está vazio.

## Comandos raiz

```bash
pnpm dev              # todos os apps em paralelo
pnpm lint             # ESLint em todos os apps
pnpm format:check     # Prettier check em todos os apps
pnpm build            # build de todos (requerido pelo CI)
pnpm test             # todos os testes (depende de build)
```

## Comandos por app

```bash
pnpm --filter api dev             # API (tsx watch, porta 3333)
pnpm --filter admin dev           # Admin (Vite, porta 5173)
pnpm --filter web dev             # Web (Next.js, porta 3000)
pnpm --filter api test            # unitários API
pnpm --filter api test:e2e        # E2E API (Vitest + Supertest)
pnpm --filter admin test:e2e      # E2E Admin (Playwright)
pnpm --filter web test            # unitários Web (Vitest)
pnpm --filter web test:e2e        # E2E Web (Playwright)
pnpm --filter api db:migrate      # criar e aplicar migration
pnpm --filter api db:push         # sync schema sem migration
pnpm --filter api db:studio       # Prisma Studio UI
```
