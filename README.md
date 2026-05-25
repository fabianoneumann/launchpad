# Launchpad

Template opinativo de monorepo para SaaS — API Fastify + Prisma e painel admin prontos, com estrutura sugerida para o frontend web.

## Estrutura

```
launchpad/
├── apps/
│   ├── api/        ← Backend Node.js + Fastify + Prisma
│   ├── admin/      ← Frontend React + Vite (painel admin)
│   └── web/        ← Não scaffoldado — estrutura sugerida: Next.js + App Router
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

## Primeiros passos

Siga esta sequência para ter o projeto rodando na sua máquina:

**Pré-requisitos manuais (antes de tudo):**
- Crie uma conta no [GitHub](https://github.com) caso não tenha
- Instale o [Git](https://git-scm.com) caso não tenha
- Crie uma conta no [Resend](https://resend.com) e gere uma API key em **API Keys**

**Fluxo de setup:**

1. Crie seu repositório a partir deste template no GitHub (botão **"Use this template"**)
2. Instale os pré-requisitos técnicos: Node.js, pnpm e Docker (detalhes abaixo)
3. Clone seu repositório e abra a pasta no Claude Code (ou outro editor com agente de IA)
4. Peça ao agente: _"Leia o README e configure o projeto"_ — ele executa a instalação de dependências, cria os arquivos `.env`, sobe o banco, roda as migrations e configura o upstream do template
5. Preencha manualmente as variáveis que só você conhece em `apps/api/.env`:
   - `RESEND_API_KEY` — sua API key gerada no Resend
   - `JWT_SECRET` — qualquer string longa e aleatória (ex: resultado de `openssl rand -hex 32`)
6. Peça ao agente para iniciar o projeto: _"Suba o banco e inicie os apps"_
7. Peça ao agente para rodar os testes e confirmar que tudo está funcionando
8. Faça sua primeira modificação

## Usando como template

Este repositório está marcado como **GitHub Template**. Para criar um novo projeto a partir dele:

1. Clique em **"Use this template"** → **"Create a new repository"**
2. Escolha nome, visibilidade (pode ser privado) e crie o repositório
3. Clone o repositório criado na sua máquina e siga o setup abaixo

> Usar "Use this template" cria um repositório independente, sem vínculo de fork com este projeto.

## Pré-requisitos

- **Node.js** ≥ 20
- **pnpm** ≥ 9 — `npm install -g pnpm`
- **Docker** — para o banco de dados PostgreSQL em desenvolvimento
- **Conta no Resend** — serviço de e-mail transacional usado no cadastro ([resend.com](https://resend.com))

## Setup inicial

```bash
# 1. Instalar dependências — SEMPRE na raiz do monorepo
# Nunca rodar pnpm install dentro de uma app individual (quebra o workspace)
pnpm install

# 2. Configurar variáveis de ambiente
# Cada app tem um .env.example — copie e preencha antes de rodar
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env

# 3. Preencher a variável RESEND_API_KEY em apps/api/.env
# Gere sua API key em: https://resend.com/api-keys
# Exemplo: RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# 4. Subir o banco de dados
docker compose -f apps/api/docker-compose.yml up -d

# 5. Rodar as migrations
pnpm --filter api db:migrate

# 6. Popular o banco com dados iniciais
pnpm --filter api exec prisma db seed
```

## Desenvolvimento

```bash
# Rodar todos os apps em paralelo
pnpm dev

# Rodar app específico
pnpm --filter api dev
pnpm --filter admin dev

# Inspecionar o banco via UI (Prisma Studio — abre no navegador)
pnpm --filter api db:studio

# Recriar o seed (apaga e repopula os dados de desenvolvimento)
pnpm --filter api exec prisma db seed
```

## Recebendo atualizações do template

Este projeto foi criado a partir de um template do GitHub. Diferente de um fork, não há vínculo automático com o repositório de origem — atualizações publicadas no template original não chegam automaticamente.

Para configurar o upstream:

```bash
git remote add upstream https://github.com/fabianoneumann/launchpad.git
git remote set-url --push upstream no_push
```

Para verificar a configuração:

```bash
git remote -v
# origin    https://github.com/SEU_USUARIO/SEU_REPO.git (fetch)
# origin    https://github.com/SEU_USUARIO/SEU_REPO.git (push)
# upstream  https://github.com/fabianoneumann/launchpad.git (fetch)
# upstream  no_push (push)
```

Para baixar atualizações quando disponíveis:

```bash
git fetch upstream
git merge upstream/main
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
