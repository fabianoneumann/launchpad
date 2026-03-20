# Eco Iguassu

SaaS de vendas de passeios turísticos.

## Estrutura

```
eco-iguassu/
├── apps/
│   ├── api/        ← Backend Node.js + Fastify + Prisma
│   ├── web/        ← Frontend React + Vite (clientes)
│   └── admin/      ← Frontend React + Vite (painel admin)
├── packages/
│   ├── shared-types/ ← Tipos TypeScript compartilhados
│   └── ui/           ← Design system compartilhado
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

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Rodar todos os apps em paralelo
turbo run dev

# Rodar app específico
pnpm --filter @eco-iguassu/api dev
pnpm --filter @eco-iguassu/web dev
pnpm --filter @eco-iguassu/admin dev
```
