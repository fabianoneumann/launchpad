# Launchpad

SaaS de vendas de passeios turísticos.

## Estrutura

```
launchpad/
├── apps/
│   ├── api/        ← Backend Node.js + Fastify + Prisma
│   ├── web/        ← Frontend React + Vite (clientes)
│   └── admin/      ← Frontend React + Vite (painel admin)
├── packages/
│   ├── eslint-config/ ← Configuração ESLint compartilhada
│   ├── shared-types/  ← Tipos TypeScript compartilhados
│   └── ui/            ← Design system compartilhado
└── design/
    ├── design-system/ ← Especificação do DS (tokens, guidelines); ver README na pasta
    └── brand/         ← Ativos e diretrizes de marca (logos, paleta, PDFs leves)
```

## Tecnologias

- **Backend:** Node.js, TypeScript, Fastify, Prisma, JWT, Zod
- **Frontend:** React, Vite, TanStack Query, shadcn/ui, Tailwind CSS
- **Banco de Dados:** PostgreSQL
- **Gerenciamento:** pnpm workspaces + Turborepo
- **Deploy:** Vercel (frontend) + Render (backend)

## Pré-requisitos

- **Node.js** ≥ 20
- **pnpm** ≥ 9 — `npm install -g pnpm`
- **Docker** — para o banco de dados PostgreSQL em desenvolvimento

## Setup inicial

```bash
# 1. Instalar dependências — SEMPRE na raiz do monorepo
# Nunca rodar pnpm install dentro de uma app individual (quebra o workspace)
pnpm install

# 2. Configurar variáveis de ambiente
# Cada app tem um .env.example — copie e preencha antes de rodar
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env

# 3. Subir o banco de dados
docker compose -f apps/api/docker-compose.yml up -d

# 4. Rodar as migrations
pnpm --filter api db:migrate

# 5. Popular o banco com dados iniciais
pnpm --filter api exec prisma db seed
```

## Desenvolvimento

```bash
# Rodar todos os apps em paralelo
pnpm dev

# Rodar app específico
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter admin dev

# Inspecionar o banco via UI (Prisma Studio — abre no navegador)
pnpm --filter api db:studio

# Recriar o seed (apaga e repopula os dados de desenvolvimento)
pnpm --filter api exec prisma db seed
```

## Testes

> O banco de dados (Docker) deve estar rodando antes de executar os testes E2E.

```bash
# Testar todos os apps
pnpm test

# Testar app específico
pnpm --filter api test
```

## Qualidade de código

```bash
# Lint em todos os apps
pnpm lint

# Lint em app específico
pnpm --filter api lint

# Verificar formatação (sem alterar arquivos)
pnpm format:check

# Aplicar formatação
pnpm --filter api format
```

## Build

```bash
# Build de todos os apps
pnpm build

# Build de app específico
pnpm --filter api build
```
