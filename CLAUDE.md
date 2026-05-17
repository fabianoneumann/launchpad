# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Monorepo Turborepo com três apps:
- `apps/api` — Fastify 5 + Prisma 7 (backend)
- `apps/admin` — React 19 + Vite + TanStack Router (painel administrativo)
- `apps/web` — site público (não scaffoldado — Next.js 16 + App Router para sites com SEO, i18n e ISR; ver patterns em `knowledge/`)

**Gerenciador de pacotes**: pnpm 9. Sempre instale dependências na raiz — nunca dentro dos apps individualmente.
**Repositório remoto**: `fabianoneumann/launchpad` (o nome da pasta local pode diferir).

## Comandos

### Testes
```bash
# API — Vitest
pnpm --filter api test            # Unitários e integração
pnpm --filter api test:e2e        # E2E (Vitest + Supertest) — requer Docker rodando

# Admin — Vitest + Playwright
pnpm --filter admin test          # Vitest (jsdom)
pnpm --filter admin test:e2e      # Playwright — requer dev server rodando

# Web — Vitest + Playwright
pnpm --filter web test            # Vitest (jsdom)
pnpm --filter web test:e2e        # Playwright — requer dev server rodando
```

### Banco de dados
```bash
pnpm --filter api db:push         # Sincroniza schema sem gerar migration (dev rápido)
pnpm --filter api db:migrate      # Cria e aplica migration
```

> Referência completa (watch, coverage, e2e:ui, studio, etc.): `knowledge/commands/reference.md`


## Base de conhecimento

Antes de qualquer tarefa de implementação, leia `knowledge/index.md`.

- Backend (apps/api): leia `knowledge/architecture/api.md`
- Frontend admin (apps/admin): leia `knowledge/architecture/admin.md`
- Frontend web (apps/web — ao implementar): consulte os patterns em `knowledge/patterns/` com sufixo `-web`
- Skills disponíveis: consulte `knowledge/skills/when-to-use.md`
- Configuração do Claude Code: leia `knowledge/tooling/claude-code.md`

## Manutenção do knowledge/

**Ao finalizar qualquer tarefa de implementação, antes de commitar:** verifique se algum gatilho abaixo foi ativado.

- Novo padrão ou exceção válida → adicionar em `knowledge/patterns/` no arquivo relevante
- Lib nova instalada + documentação consultada → adicionar em `knowledge/patterns/` no arquivo relevante
- Armadilha de comando encontrada → adicionar em `knowledge/commands/known-issues.md`
- Decisão arquitetural significativa → criar ADR numerado em `knowledge/decisions/`
- Regra de negócio nova ou corrigida → adicionar em `knowledge/domain/` no arquivo relevante
- Contradição entre knowledge/ e código/issue identificada → corrigir o arquivo afetado e verificar arquivos relacionados na mesma operação
- Configuração ou comportamento do Claude Code → atualizar `knowledge/tooling/claude-code.md`
- Análise gerada que respondeu pergunta recorrente ou levaria mais de uma sessão para reproduzir → arquivar em `knowledge/analysis/` (não deixar no histórico do chat)

**Cascata obrigatória:** ao escrever em qualquer arquivo de `knowledge/`, se o conteúdo adicionado altera o critério de leitura do arquivo, atualizar `knowledge/index.md` na mesma operação.

- Tamanho máximo por arquivo: ~150 linhas. Se ultrapassar, dividir em arquivo mais específico.
- Padrão arquitetural da base: ver `knowledge/llm-wiki.md` (índice, schema, operações de lint)

### Lint — quando fazer

Varrer `knowledge/` buscando contradições, entradas obsoletas e versões desatualizadas após:
- Upgrade de lib ou framework
- Nova ADR criada
- Mudança que afetou mais de um app simultaneamente

## Convenções

### Commits
Conventional Commits em inglês:
```
feat(api): description of the feature
fix(admin): description of the fix
chore(design): design adjustment
```
Scope = name of the app (`api`, `admin`, `web`, `design`). References to issues: `closes #N` or `Issue #N` in the description.

### Branches
Prefixo convencional igual ao do commit: `feat/*`, `fix/*`, `chore/*`.

### Código
- Prettier: `printWidth=100`, 2 espaços, trailing commas, LF.
- ESLint via `packages/eslint-config` — não crie configs ESLint locais nos apps.
- TypeScript estrito em todos os apps.

## Variáveis de ambiente

Copie os arquivos de exemplo antes de rodar localmente:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/web/.env.example apps/web/.env
```

Variáveis críticas da API: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `RESEND_API_KEY`, credenciais `R2_*` (Cloudflare R2 para uploads de imagens).

## Observações

- `packages/ui` fornece tokens de design e config Tailwind base, mas **não** é uma lib de componentes; cada app instala shadcn/ui independentemente.
