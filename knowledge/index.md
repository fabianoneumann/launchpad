# Knowledge Base — Índice

Base de conhecimento do projeto launchpad. Mantida automaticamente pelo agente.
Antes de implementar qualquer feature, leia os arquivos relevantes para a tarefa.

## Arquitetura

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [architecture/monorepo.md](architecture/monorepo.md) | Turborepo, pnpm workspaces, apps, packages, comandos | Qualquer tarefa no projeto |
| [architecture/api.md](architecture/api.md) | Stack, estrutura de pastas, 3 camadas, RBAC, Fastify config | Trabalhar em apps/api |
| [architecture/admin.md](architecture/admin.md) | Stack, shadcn/ui, Axios client, auth store, DataTable, feature folders | Trabalhar em apps/admin |

## Patterns — API e Admin

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [patterns/backend-module.md](patterns/backend-module.md) | Factory, repository, service, controller, rotas, testes | Criar módulo ou service no backend |
| [patterns/forms.md](patterns/forms.md) | Tabela de decisão web vs admin; padrão admin (RHF + FileDropzone) | Criar formulário no admin ou decidir qual padrão usar |
| [patterns/routing-admin.md](patterns/routing-admin.md) | TanStack Router file-based, auth guard, `to` vs `href` | Criar ou modificar rotas no admin |
| [patterns/shadcn-components.md](patterns/shadcn-components.md) | Primitivos por app: admin=radix-ui, web=@base-ui/react; regra de isolamento cross-app | Adicionar componente ou importar primitivo shadcn/ui |
| [patterns/data-fetching.md](patterns/data-fetching.md) | Axios + interceptors, TanStack Query (admin SPA) | Implementar chamadas HTTP no admin |
| [patterns/testing.md](patterns/testing.md) | API: Vitest+InMemory+Supertest. Admin: Vitest+MSW+Playwright | Escrever ou corrigir testes na API ou no admin |
| [patterns/i18n.md](patterns/i18n.md) | i18n de conteúdo (API), UI pt-BR (admin), next-intl (web recomendado) | API: dados multilingual \| Web: interface ou locale switcher \| (Admin: UI é pt-BR fixo) |
| [patterns/error-handling.md](patterns/error-handling.md) | AppError, 3 padrões de e-mail por criticidade, logging | Adicionar tratamento de erros na API \| Escolher criticidade de envio de e-mail |
| [patterns/soft-delete.md](patterns/soft-delete.md) | deleted_at, flags showDeleted/onlyDeleted, critério de aplicação | Implementar deleção de entidade na API |
| [patterns/mail-provider.md](patterns/mail-provider.md) | Interface MailProvider, Resend/Fake, React Email render | Criar ou modificar qualquer envio de e-mail |
| [patterns/storage-provider.md](patterns/storage-provider.md) | Interface StorageProvider, R2, Fake, upload multipart, key convention | Criar ou modificar upload/deleção de arquivos |

## Patterns — Web (Next.js 16 + App Router)

> Patterns para quando apps/web for um site público com SEO, conteúdo multilingual e renderização híbrida (SSR/ISR + Client Components). Se o caso de uso for diferente — SPA interna, app mobile-first, dashboard — avalie outras stacks antes de seguir estes patterns.

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [patterns/forms-web.md](patterns/forms-web.md) | Field+Zod+useMutation, Field.Error com match, cross-field, input controlado async | Implementar formulários no web |
| [patterns/server-components.md](patterns/server-components.md) | Server vs Client Components, HydrationBoundary, cache tags | Implementar fetch ou rendering no web |
| [patterns/data-fetching-web.md](patterns/data-fetching-web.md) | serverFetch, Axios client, dual QueryClient singleton, HydrationBoundary, ISR vs force-dynamic | Implementar chamadas HTTP no web |
| [patterns/testing-web.md](patterns/testing-web.md) | Vitest, E2E mocked (page.route) vs servidor real, armadilha bundle JS | Escrever ou corrigir testes no web |
| [patterns/json-ld.md](patterns/json-ld.md) | JSON-LD em Server Components: técnica, ISR, sem fetch extra | Implementar structured data no web |

## Domain

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [domain/users.md](domain/users.md) | Modelo User, campo locale, token versioning | Qualquer feature relacionada a usuários ou locale preference |

## Skills

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [skills/when-to-use.md](skills/when-to-use.md) | Quando acionar cada skill disponível | Início de qualquer tarefa nova |

## Decisions (ADRs)

| Arquivo | Descrição |
|---|---|
| [decisions/001-soft-delete.md](decisions/001-soft-delete.md) | Por que usar soft delete em entidades com referências em histórico financeiro/operacional |
| [decisions/002-i18n-strategy.md](decisions/002-i18n-strategy.md) | i18n frouxa (locales parciais) vs estrita (todos obrigatórios) — critério de decisão |
| [decisions/003-form-pattern.md](decisions/003-form-pattern.md) | Web: Field+Zod+useMutation (sem RHF). Admin: RHF direto (migração pendente) |
| [decisions/004-rendering-strategy.md](decisions/004-rendering-strategy.md) | Server Components (conteúdo público + ISR) vs Client Components (páginas do usuário) |

## Analysis

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [analysis/nextjs-16-breaking-changes.md](analysis/nextjs-16-breaking-changes.md) | Breaking changes Next.js 16 vs 15: proxy.ts, noStore/cacheTag, params como Promise | Antes de scaffoldar ou implementar apps/web |

## Tooling

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [tooling/claude-code.md](tooling/claude-code.md) | Hooks, `$CLAUDE_PROJECT_DIR`, CWD, formato correto de scripts externos | Antes de modificar `.claude/settings.json` ou criar hooks |

## Commands

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [commands/known-issues.md](commands/known-issues.md) | Armadilhas e erros conhecidos em comandos e testes | Ao encontrar erro inesperado ou entrar em loop de erros ao executar comandos, hooks ou testes |
| [commands/reference.md](commands/reference.md) | Referência completa de comandos (watch, coverage, e2e:ui, studio) | Ao buscar flag ou variante não listada no CLAUDE.md, ou ao entrar em loop de erros ao executar comandos |

## Meta

| Arquivo | Descrição | Ler quando |
|---|---|---|
| [llm-wiki.md](llm-wiki.md) | Padrão arquitetural desta base de conhecimento: índice, schema, operações de ingestão e lint | Ao redesenhar, expandir ou reconfigurar a estrutura da base de conhecimento |
