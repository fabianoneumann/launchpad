---
name: create-module
description: Cria a estrutura completa de um módulo do backend (apps/api) no projeto eco-iguassu seguindo todos os padrões arquiteturais definidos. Use esta skill quando o usuário pedir para criar, implementar ou adicionar um novo domínio, módulo, recurso ou funcionalidade no backend — como "crie o módulo de tours", "implemente o CRUD de passeios", "adicione o módulo de bookings". Gera controller, service, repository interface, implementação Prisma, in-memory para testes, factory e testes unitários e E2E.
---

O usuário quer criar um novo módulo no backend do eco-iguassu. Seu papel é gerar todos os arquivos necessários seguindo rigorosamente os padrões da Cursor Rule do projeto (`api.mdc`).

## Antes de começar

Confirme com o usuário:
1. **Nome do módulo** (ex: `tours`, `bookings`, `payments`)
2. **Operações necessárias** (ex: listar, criar, buscar por ID, atualizar, deletar)
3. **Quais rotas são públicas e quais exigem autenticação/papel**
4. **Schema Prisma** — o modelo já existe? Se não, quais campos o usuário quer?

Se o usuário for direto ("crie o módulo de tours com CRUD completo"), extraia o que puder do contexto e pergunte apenas o que for realmente necessário.

## Estrutura a criar

Para um módulo `[nome]`, crie os seguintes arquivos:

```
apps/api/src/
├── modules/[nome]/
│   ├── [nome].routes.ts              ← registro de rotas no Fastify
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
    └── factories/
        └── make-[operacao]-service.ts  ← uma factory por operação
```

## Padrões obrigatórios por arquivo

### `[nome]-repository.ts` (interface)
```typescript
import { Prisma, [Entidade] } from '@prisma/client';

export interface [Nome]Repository {
  findById(id: string): Promise<[Entidade] | null>;
  findMany(): Promise<[Entidade][]>;
  create(data: Prisma.[Entidade]CreateInput): Promise<[Entidade]>;
  save(entity: [Entidade]): Promise<[Entidade]>;
  delete(id: string): Promise<void>;
}
```
Inclua apenas os métodos que as operações do módulo realmente precisam.

### `prisma-[nome]-repository.ts`
```typescript
import { prisma } from '@/lib/prisma';
import { [Nome]Repository } from '@/repositories/[nome]-repository';

export class Prisma[Nome]Repository implements [Nome]Repository {
  // implementações usando prisma.[entidade].findUnique, findMany, create, update, delete
}
```

### `in-memory-[nome]-repository.ts`
```typescript
import { [Nome]Repository } from '@/repositories/[nome]-repository';

export class InMemory[Nome]Repository implements [Nome]Repository {
  public items: [Entidade][] = [];
  // implementações com operações em array em memória
}
```
Exponha `items` como público para facilitar setup nos testes.

### `[operacao].service.ts`
```typescript
interface [Operacao]ServiceRequest {
  // campos tipados
}

interface [Operacao]ServiceResponse {
  // campos tipados
}

export class [Operacao]Service {
  constructor(private repository: [Nome]Repository) {}

  async execute(request: [Operacao]ServiceRequest): Promise<[Operacao]ServiceResponse> {
    // lógica de negócio — sem Prisma, sem Fastify
  }
}
```

### `make-[operacao]-service.ts` (factory)
```typescript
import { Prisma[Nome]Repository } from '@/repositories/prisma/prisma-[nome]-repository';
import { [Operacao]Service } from '@/modules/[nome]/[operacao].service';

export function make[Operacao]Service() {
  const repository = new Prisma[Nome]Repository();
  return new [Operacao]Service(repository);
}
```

### `[operacao].controller.ts`
```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { make[Operacao]Service } from '@/shared/factories/make-[operacao]-service';

export async function [operacao]Controller(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({ /* campos */ });
  const { campo } = bodySchema.parse(request.body); // ou params, query

  const service = make[Operacao]Service();
  const result = await service.execute({ campo });

  return reply.status(201).send(result);
}
```
Não use try/catch para erros de domínio — o error handler global do `app.ts` trata isso.

### `[nome].routes.ts`
```typescript
import { FastifyInstance } from 'fastify';
import { verifyJWT } from '@/shared/middlewares/verify-jwt';
import { verifyUserRole } from '@/shared/middlewares/verify-user-role';

export async function [nome]Routes(app: FastifyInstance) {
  // rotas públicas
  app.get('/[nome]', list[Nome]Controller);

  // rotas autenticadas
  app.post('/[nome]', { onRequest: [verifyJWT] }, create[Nome]Controller);

  // rotas restritas por papel
  app.delete('/[nome]/:id', { onRequest: [verifyJWT, verifyUserRole('ADMIN')] }, delete[Nome]Controller);
}
```

### `[operacao].service.spec.ts` (teste unitário)
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { InMemory[Nome]Repository } from '@/repositories/in-memory/in-memory-[nome]-repository';
import { [Operacao]Service } from './[operacao].service';

describe('[Operacao]Service', () => {
  let repository: InMemory[Nome]Repository;
  let sut: [Operacao]Service;

  beforeEach(() => {
    repository = new InMemory[Nome]Repository();
    sut = new [Operacao]Service(repository);
  });

  it('should [comportamento esperado]', async () => {
    // arrange → act → assert
  });

  it('should throw [ErroEspecífico] when [condição de erro]', async () => {
    await expect(() => sut.execute({ /* dados inválidos */ }))
      .rejects.toBeInstanceOf([ErroEspecífico]);
  });
});
```
Cubra o caminho feliz e os principais casos de erro.

### `[operacao].e2e.spec.ts` (teste E2E)
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('[Operacao] E2E', () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it('should return 201 when [condição de sucesso]', async () => {
    const response = await request(app.server)
      .post('/[nome]')
      .send({ /* body */ });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ /* estrutura esperada */ });
  });
});
```

## Após criar os arquivos

1. Lembre o usuário de **registrar as rotas** no `app.ts`:
```typescript
app.register([nome]Routes);
```

2. Se o módulo tem novo modelo Prisma, lembre de:
   - Atualizar `prisma/schema.prisma`
   - Rodar `npx prisma migrate dev --name add-[nome]`
   - Rodar `npx prisma generate`

3. Se há novos erros de domínio, lembre de **registrá-los no error handler** do `app.ts`.

## Checklist final

Antes de considerar o módulo criado, confirme mentalmente:
- [ ] Interface do repositório criada
- [ ] Implementação Prisma criada
- [ ] In-memory repository criada (sem typos no nome do arquivo)
- [ ] Service(s) criado(s) com Request/Response tipados
- [ ] Factory(ies) criada(s)
- [ ] Controller(s) criado(s) sem lógica de negócio
- [ ] Routes registrado no arquivo de rotas do módulo
- [ ] Testes unitários com in-memory repository
- [ ] Testes E2E com supertest
- [ ] Sem `console.log` no código de produção
- [ ] Sem imports de `prisma` fora de `repositories/prisma/`
