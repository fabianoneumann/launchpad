---
name: create-module
description: Cria a estrutura completa de um módulo do backend (apps/api) seguindo todos os padrões arquiteturais definidos. Use esta skill quando o usuário pedir para criar, implementar ou adicionar um novo domínio, módulo, recurso ou funcionalidade no backend — como "crie o módulo de tours", "implemente o CRUD de passeios", "adicione o módulo de bookings". Gera controller, service, repositório interface, implementação Prisma, in-memory para testes, factory, schema de resposta e testes unitários e E2E.
---

O usuário quer criar um novo módulo no backend. Seu papel é gerar todos os arquivos necessários seguindo rigorosamente os padrões arquiteturais do projeto — observados diretamente nos módulos `users/` e `auth/`.

## Antes de começar

Confirme com o usuário:
1. **Nome do módulo** (ex: `tours`, `bookings`, `payments`)
2. **Operações necessárias** (ex: listar, criar, buscar por ID, atualizar, deletar)
3. **Quais rotas são públicas e quais exigem autenticação/papel**
4. **Schema Prisma** — o modelo já existe? Se não, quais campos?
5. **Soft delete** — o modelo precisa de `deleted_at DateTime?`?
6. **Entidade relacionada** — o modelo tem traduções, imagens ou sub-entidades?

Se o usuário for direto ("crie o módulo de tours com CRUD completo"), extraia o que puder do contexto e pergunte apenas o que for realmente necessário.

## Estrutura a criar

```
apps/api/src/
├── modules/[nome]/
│   ├── [nome].routes.ts
│   ├── [operacao].controller.ts      ← um arquivo por operação
│   ├── [operacao].service.ts         ← um arquivo por operação
│   ├── [operacao].service.spec.ts    ← teste unitário por operação
│   └── [operacao].e2e.spec.ts        ← teste E2E por operação
├── repositories/
│   ├── [nome]-repository.ts          ← interface do repositório
│   ├── prisma/
│   │   └── prisma-[nome]-repository.ts
│   └── in-memory/
│       └── in-memory-[nome]-repository.ts
└── shared/
    ├── factories/
    │   └── make-[operacao]-service.ts  ← uma factory por operação
    └── schemas/
        └── [nome]-response-schema.ts   ← schema Zod de resposta reutilizável
```

---

## Padrões obrigatórios por arquivo

### `[nome]-repository.ts` (interface)

```typescript
import type { Prisma, [Entidade] } from '@/generated/prisma/client'

export interface [Nome]Repository {
  findById(id: string): Promise<[Entidade] | null>
  findMany(params: {
    page: number
    perPage: number
    // filtros relevantes ao domínio
  }): Promise<[Entidade][]>
  count(params: {
    // mesmos filtros de findMany, sem page/perPage
  }): Promise<number>
  create(data: Prisma.[Entidade]CreateInput): Promise<[Entidade]>
  update(id: string, data: Prisma.[Entidade]UpdateInput): Promise<[Entidade]>
  delete(id: string): Promise<void>
}
```

- Inclua apenas os métodos que as operações realmente precisam.
- Se o módulo tiver listagem paginada, inclua sempre `findMany()` + `count()` (chamados em `Promise.all` no service).
- Se o módulo usar soft delete, `findById` e `findMany` filtram `deleted_at: null` por padrão. O método `delete(id)` executa `update({ deleted_at: new Date() })` — nunca `prisma.[entidade].delete`.

### `prisma-[nome]-repository.ts`

```typescript
import type { Prisma, [Entidade] } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { [Nome]Repository } from '@/repositories/[nome]-repository'

export class Prisma[Nome]Repository implements [Nome]Repository {
  async findById(id: string): Promise<[Entidade] | null> {
    return prisma.[entidade].findFirst({ where: { id, deleted_at: null } })
  }

  async findMany({ page, perPage, ...filtros }): Promise<[Entidade][]> {
    return prisma.[entidade].findMany({
      where: { deleted_at: null, ...filtros },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { created_at: 'desc' },
    })
  }

  async count({ ...filtros }): Promise<number> {
    return prisma.[entidade].count({ where: { deleted_at: null, ...filtros } })
  }

  async create(data: Prisma.[Entidade]CreateInput): Promise<[Entidade]> {
    return prisma.[entidade].create({ data })
  }

  async update(id: string, data: Prisma.[Entidade]UpdateInput): Promise<[Entidade]> {
    return prisma.[entidade].update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await prisma.[entidade].update({ where: { id }, data: { deleted_at: new Date() } })
  }
}
```

- **Nunca** importe `prisma` fora de `repositories/prisma/`.
- **Nunca** importe de `'@prisma/client'` — use sempre `'@/generated/prisma/client'`.

### `in-memory-[nome]-repository.ts`

```typescript
import { randomUUID } from 'node:crypto'
import type { Prisma, [Entidade] } from '@/generated/prisma/client'
import type { [Nome]Repository } from '@/repositories/[nome]-repository'

export class InMemory[Nome]Repository implements [Nome]Repository {
  public items: [Entidade][] = []

  async findById(id: string): Promise<[Entidade] | null> {
    return this.items.find((item) => item.id === id && item.deleted_at === null) ?? null
  }

  async findMany({ page, perPage, ...filtros }): Promise<[Entidade][]> {
    return this.items
      .filter((item) => item.deleted_at === null)
      // aplique filtros adicionais aqui
      .slice((page - 1) * perPage, page * perPage)
  }

  async count({ ...filtros }): Promise<number> {
    return this.items
      .filter((item) => item.deleted_at === null)
      // aplique filtros adicionais aqui
      .length
  }

  async create(data: Prisma.[Entidade]CreateInput): Promise<[Entidade]> {
    const entity: [Entidade] = {
      id: randomUUID(),
      // mapeie todos os campos do model Prisma
      deleted_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(entity)
    return entity
  }

  async update(id: string, data: Prisma.[Entidade]UpdateInput): Promise<[Entidade]> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('[Entidade] not found')
    this.items[index] = { ...this.items[index], ...data, updated_at: new Date() }
    return this.items[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) this.items[index].deleted_at = new Date()
  }
}
```

- Exponha `items` como `public` para setup nos testes.
- Replique exatamente os mesmos filtros de `deleted_at` do repositório Prisma.
- Usada **exclusivamente em testes unitários**.

### `[operacao].service.ts`

```typescript
import type { [Entidade] } from '@/generated/prisma/client'
import type { [Nome]Repository } from '@/repositories/[nome]-repository'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

interface [Operacao]ServiceRequest {
  // campos tipados
}

interface [Operacao]ServiceResponse {
  [entidade]: [Entidade]
  // ou: { [entidades]: [Entidade][], total: number }
}

export class [Operacao]Service {
  constructor(private [nome]Repository: [Nome]Repository) {}

  async execute(request: [Operacao]ServiceRequest): Promise<[Operacao]ServiceResponse> {
    // lógica de negócio
    // lança erros de domínio (AppError e subclasses) — nunca status HTTP, nunca Prisma
  }
}
```

- **Nunca** importe Fastify ou Prisma nos services.
- Services **não recebem logger** — logging fica no controller via `request.log`.
- Para listagem paginada, use `Promise.all([findMany(...), count(...)])`.

### `make-[operacao]-service.ts` (factory)

```typescript
import { Prisma[Nome]Repository } from '@/repositories/prisma/prisma-[nome]-repository'
import { [Operacao]Service } from '@/modules/[nome]/[operacao].service'

export function make[Operacao]Service() {
  const repository = new Prisma[Nome]Repository()
  return new [Operacao]Service(repository)
}
```

### `[operacao].controller.ts`

```typescript
import type { FastifyRequest, FastifyReply } from 'fastify'
import { make[Operacao]Service } from '@/shared/factories/make-[operacao]-service'

export async function [operacao]Controller(request: FastifyRequest, reply: FastifyReply) {
  // A validação Zod já foi feita na rota — apenas faça o cast
  const { campo } = request.body as { campo: string }
  // ou: request.params as { id: string }
  // ou: request.query as { page: number; perPage: number }

  const service = make[Operacao]Service()
  const result = await service.execute({ campo })

  request.log.info({
    event: '[nome].[acao]',      // ex: 'tour.created', 'tour.deleted'
    [entidade]Id: result.[entidade].id,
    adminId: request.user.sub,   // omitir em rotas públicas
  })

  return reply.status(201).send(result)  // 200 para GET/PATCH, 201 para POST, 204 para DELETE
}
```

**Regras:**
- **Não** use `z.parse()` ou `bodySchema.parse()` no controller — a validação acontece no schema da rota.
- **Não** use try/catch para erros de domínio — o error handler global do `app.ts` trata `AppError` e subclasses automaticamente.
- Use try/catch **apenas** para erros que precisam de resposta HTTP específica diferente do padrão (ex: `UserAlreadyExistsError` → 409).
- `request.log.info({ event: '...', ... })` é **obrigatório** em toda mutação (POST, PATCH, DELETE).

### `[nome].routes.ts`

```typescript
import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { verifyJWT } from '@/shared/middlewares/verify-jwt'
import { verifyUserRole } from '@/shared/middlewares/verify-user-role'
import { [operacao]Controller } from './[operacao].controller'
import { [nomedoschema]ResponseSchema } from '@/shared/schemas/[nome]-response-schema'

export const [nome]Routes: FastifyPluginAsyncZod = async (app) => {
  // ─── Rotas públicas ────────────────────────────────────────────────
  app.route({
    method: 'GET',
    url: '/[nome]',
    schema: {
      querystring: z.object({
        page: z.coerce.number().int().positive().default(1),
        perPage: z.coerce.number().int().positive().default(20),
        locale: z.string().optional(),
      }),
      response: {
        200: z.object({ [entidades]: z.array([nomedoschema]ResponseSchema), total: z.number() }),
      },
    },
    handler: list[Nome]Controller,
  })

  // ─── Rotas protegidas (ADMIN) ──────────────────────────────────────
  app.route({
    method: 'POST',
    url: '/[nome]',
    onRequest: [verifyJWT, verifyUserRole('ADMIN')],
    schema: {
      body: z.object({ /* campos */ }),
      response: { 201: z.object({ [entidade]: [nomedoschema]ResponseSchema }) },
    },
    handler: create[Nome]Controller,
  })

  app.route({
    method: 'DELETE',
    url: '/[nome]/:id',
    onRequest: [verifyJWT, verifyUserRole('ADMIN')],
    schema: {
      params: z.object({ id: z.string().uuid() }),
      response: { 204: z.null() },
    },
    handler: delete[Nome]Controller,
  })
}
```

**Padrões de autenticação nas rotas:**
- **Módulo 100% protegido** (ex: `users/`): use `app.addHook('onRequest', verifyJWT)` + `app.addHook('onRequest', verifyUserRole('ADMIN'))` no início do plugin — aplica a todas as rotas.
- **Módulo misto** (rotas públicas + protegidas, ex: `tours/`): use `onRequest: [verifyJWT, verifyUserRole('ADMIN')]` por rota nas rotas protegidas. Não use `addHook` global.

**Validação com Zod v4 — use as APIs diretas:**
- `z.email()` — não `z.string().email()`
- `z.url()` — não `z.string().url()`
- `z.uuid()` — não `z.string().uuid()`
- `z.stringbool()` — para query params boolean (`"true"`/`"false"` → `boolean`)
- `z.coerce.number()` — para query params numéricos

### `shared/schemas/[nome]-response-schema.ts`

```typescript
import { z } from 'zod'

// Schema público (visitantes)
export const [nome]ResponseSchema = z.object({
  id: z.string().uuid(),
  // campos expostos publicamente
  created_at: z.date(),
  updated_at: z.date(),
})

// Schema admin (expõe campos extras como deleted_at, is_active)
export const admin[Nome]ResponseSchema = [nome]ResponseSchema.extend({
  is_active: z.boolean(),
  deleted_at: z.date().nullable(),
})
```

### `[operacao].service.spec.ts` (teste unitário)

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemory[Nome]Repository } from '@/repositories/in-memory/in-memory-[nome]-repository'
import { [Operacao]Service } from './[operacao].service'

describe('[Operacao]Service', () => {
  let repository: InMemory[Nome]Repository
  let sut: [Operacao]Service  // System Under Test

  beforeEach(() => {
    repository = new InMemory[Nome]Repository()
    sut = new [Operacao]Service(repository)
  })

  it('should [caminho feliz]', async () => {
    // arrange
    await repository.create({ /* dados mínimos válidos */ })

    // act
    const result = await sut.execute({ /* request */ })

    // assert
    expect(result).toMatchObject({ /* estrutura esperada */ })
  })

  it('should throw [ErroEspecífico] when [condição de erro]', async () => {
    await expect(() => sut.execute({ /* dados inválidos */ }))
      .rejects.toBeInstanceOf([ErroEspecífico])
  })
})
```

- Cubra: caminho feliz, principais erros de domínio, paginação (se aplicável), filtros (se aplicável), soft delete (se aplicável).
- Nunca use `console.log` em testes.

### `[operacao].e2e.spec.ts` (teste E2E)

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = '[modulo]-admin@test.com'

describe('[Operacao] E2E', () => {
  beforeAll(async () => {
    await app.ready()
    // limpe dados de teste antes de criar fixtures
    await prisma.user.deleteMany({ where: { email: adminEmail } })
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, password_hash: await hash('123456', 6), role: 'ADMIN' },
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: adminEmail } })
    await app.close()
  })

  it('should return 201 when admin creates [entidade]', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .post('/[nome]')
      .set('Authorization', `Bearer ${token}`)
      .send({ /* body válido */ })

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({ /* estrutura esperada */ })
  })

  it('should return 401 when no token is provided', async () => {
    const response = await request(app.server).post('/[nome]').send({ /* body */ })
    expect(response.statusCode).toBe(401)
  })

  it('should return 403 when authenticated as non-admin', async () => {
    // login como USER e testar rota protegida
    expect(response.statusCode).toBe(403)
  })
})
```

---

## Erros de domínio

Erros de domínio herdam de `AppError` e são tratados automaticamente pelo error handler global — **não é necessário registrá-los individualmente** no `app.ts`.

```typescript
// shared/errors/[nome]-not-found-error.ts
import { AppError } from './app-error'

export class [Nome]NotFoundError extends AppError {
  constructor() {
    super('[Entidade] not found.', 404)
  }
}
```

Use try/catch no controller **apenas** para erros que precisam de status HTTP diferente do definido no `AppError` (ex: conflito 409 para recurso já existente).

---

## Após criar os arquivos

1. **Registrar as rotas** em `apps/api/src/app.ts`:
```typescript
import { [nome]Routes } from '@/modules/[nome]/[nome].routes'
// ...
app.register([nome]Routes)
```

2. **Se o módulo tem novo modelo Prisma:**
   - Atualizar `prisma/schema.prisma`
   - Rodar `pnpm --filter @launchpad/api db:generate` (regenera o cliente Prisma)
   - Rodar `pnpm --filter @launchpad/api db:migrate` (aplica a migration)

3. **Verificar** que nenhum arquivo de produção tem `console.log`.

---

## Checklist final

- [ ] Interface do repositório criada com `findMany()` + `count()` (se paginado)
- [ ] Implementação Prisma com `deleted_at: null` em todos os métodos `find*` (se soft delete)
- [ ] `delete()` faz soft delete via `update({ deleted_at: new Date() })` — nunca `.delete()`
- [ ] InMemory replica exatamente os mesmos filtros do Prisma
- [ ] InMemory usa `randomUUID()` de `node:crypto`
- [ ] `public items: [Entidade][] = []` exposto no InMemory
- [ ] Services com `Request`/`Response` tipados, sem Fastify, sem Prisma
- [ ] Factories em `shared/factories/`
- [ ] Controllers sem `z.parse()` manual — validação fica no schema da rota
- [ ] `request.log.info({ event: '...', ... })` em toda mutação
- [ ] Rotas usando `FastifyPluginAsyncZod` com `app.route({ schema, handler })`
- [ ] `onRequest: [verifyJWT, verifyUserRole('ADMIN')]` por rota em módulos mistos
- [ ] `app.addHook` global apenas em módulos 100% protegidos
- [ ] Zod v4: `z.email()`, `z.url()`, `z.uuid()`, `z.stringbool()`, `z.coerce.number()`
- [ ] Imports de tipos Prisma: `'@/generated/prisma/client'` — nunca `'@prisma/client'`
- [ ] Schema de resposta em `shared/schemas/[nome]-response-schema.ts`
- [ ] Testes unitários com InMemory (Arrange-Act-Assert)
- [ ] Testes E2E com Supertest + login real + cleanup no `beforeAll`/`afterAll`
- [ ] Sem `console.log` no código de produção ou testes
