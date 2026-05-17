# Commands: Referência Completa

Comandos disponíveis no projeto que não estão listados no CLAUDE.md por serem interativos,
de uso exclusivamente humano, ou raramente necessários durante implementação.

Consulte este arquivo ao buscar uma flag específica ou ao entrar em loop de erros ao executar
comandos — o comando correto ou uma variante pode estar aqui.

## Testes

```bash
# Todos os apps (requer build prévio)
pnpm test

# API
pnpm --filter api test:watch      # Modo watch
pnpm --filter api test:coverage   # Relatório de cobertura

# Admin
pnpm --filter admin test:e2e:ui   # Playwright com UI interativa (abre janela)

# Web
pnpm --filter web test:watch      # Modo watch
pnpm --filter web test:e2e:ui     # Playwright com UI interativa (abre janela)
```

## Banco de dados

```bash
pnpm --filter api db:seed         # Popula o banco com dados de desenvolvimento
pnpm --filter api db:studio       # Abre o Prisma Studio (UI visual do banco)
```
