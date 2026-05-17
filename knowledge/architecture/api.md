# Architecture: API (apps/api)

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js | 22 LTS | runtime |
| TypeScript | 5.8 | linguagem (ESM estrito) |
| Fastify | 5.0.0 | framework HTTP |
| Prisma | 7.0.0 | ORM + migrations |
| PostgreSQL | 16 | banco de dados (Docker dev) |
| Zod | 4.0.0 | validação de schemas |
| pino | latest | logging estruturado |

## Estrutura de pastas

```
apps/api/src/
├── modules/            ← domínios de negócio
│   ├── auth/
│   ├── users/
│   ├── tours/
│   └── extras/
├── repositories/
│   ├── prisma/         ← implementação de produção (7 repositórios)
│   └── in-memory/      ← implementação para testes (7 repositórios)
├── shared/
│   └── factories/      ← 38 factories de services
├── lib/
│   ├── mail/
│   │   ├── content/    ← templates de conteúdo por locale
│   │   └── emails/     ← templates React Email
│   └── ...
├── generated/
│   └── prisma/         ← NUNCA EDITAR — gerado por `prisma generate`
├── app.ts              ← configuração do Fastify
└── server.ts           ← entry point
```

## Arquitetura em 3 camadas

```
Routes → Controller → Service → Repository
```

Cada módulo tem exatamente 4 artefatos:
1. **routes**: define endpoints, validação Zod de input/output, aplica middlewares
2. **controller**: recebe request, chama service via factory, faz logging, retorna response
3. **service**: lógica de negócio pura, recebe `Request` tipado, retorna `Response` tipado
4. **repository** (interface): contrato da camada de dados — sem implementação

## Regras críticas

**ESM:** `"type": "module"` no package.json — imports **sempre com extensão `.js`** mesmo em `.ts`
```ts
import { makeCreateTourService } from '../shared/factories/make-create-tour-service.js'
```

**Factory obrigatória:** services nunca são instanciados diretamente — sempre via factory
```ts
// controller
const service = makeCreateTourService()
const result = await service.execute(request)
```

**Logging no controller:** `request.log.info/warn/error` — nunca no service
```ts
request.log.info({ tourId: result.id }, 'tour created')
```

**`src/generated/prisma/`:** gerado por `prisma generate` — nunca editar manualmente

## RBAC

```ts
// rota pública
fastify.get('/tours', { schema }, listToursController)

// rota autenticada
fastify.post('/tours', { onRequest: [verifyJWT, verifyUserRole('ADMIN')], schema }, createTourController)
```

Hierarquia numérica de roles definida em `verifyUserRole`.

## Banco de dados (dev)

- PostgreSQL 16 via Docker — `docker compose -f apps/api/docker-compose.yml up -d`
- Credenciais: `user=docker`, `password=docker`, `db=launchpad`, porta 5432
- Seed: `admin-login@test.com` / `123456` + dados de exemplo para desenvolvimento

## Autenticação e revogação de tokens

JWT com dois tokens:
- **Access token** (10min) — enviado no header `Authorization: Bearer`
- **Refresh token** (httpOnly cookie) — renovado via `PATCH /auth/token/refresh`

**Token versioning — mecanismo de revogação:**

Cada User tem `token_version: number` no banco. O JWT embute `tokenVersion` no payload no
momento do login. O middleware `verify-jwt.ts` valida assinatura **e** compara versões:

```ts
if (user.token_version !== request.user.tokenVersion) {
  throw new AppError('Token revogado', 401)
}
```

Chamar `incrementTokenVersion(userId)` invalida **todos os tokens ativos** daquele usuário.

**Quando chamar `incrementTokenVersion`:**
- Logout (`logout.service.ts`)
- Troca de senha (`change-password.service.ts`)
- Reset de senha (`reset-password.service.ts`)
- Troca de role pelo admin (`change-user-role.service.ts`)

Qualquer service que deva invalidar sessões ativas precisa chamar `incrementTokenVersion`.

## Variáveis de ambiente

Declaradas e validadas em `src/env/index.ts` via Zod. **Sempre declarar novas vars aqui.**

Em produção (`NODE_ENV=production`), as vars de R2 são obrigatórias via `superRefine` —
a API falha na inicialização se estiverem ausentes. Em dev/test são opcionais.

## Infraestrutura do Fastify (app.ts)

- Swagger + Swagger UI (documentação automática)
- Helmet (headers de segurança)
- CORS (origin configurável via `CORS_ORIGIN`)
- Rate limiting (produção)
- JWT — access token 10min, refresh token em cookie httpOnly
- Multipart — limite 5MB por arquivo
- Validador: `fastify-type-provider-zod`
- Error handler global para `AppError`
- Health check: `GET /health`
