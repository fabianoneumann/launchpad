# Pattern: Backend Module

> Usar a skill `.agents/skills/create-module` para criar módulos novos — nunca criar a estrutura manualmente.

## Estrutura obrigatória

Cada módulo em `src/modules/{domínio}/` tem exatamente 4 artefatos:

```
src/modules/{dominio}/
├── {dominio}.controller.ts    ← ou controllers separados por operação
├── {dominio}.service.ts       ← ou services separados por operação
├── {dominio}.repository.ts    ← interface do repositório
└── {dominio}.routes.ts        ← definição de rotas + schemas Zod
```

Repositórios ficam fora do módulo:
```
src/repositories/prisma/{dominio}-repository.ts      ← produção
src/repositories/in-memory/in-memory-{dominio}-repository.ts  ← testes
src/shared/factories/make-{acao}-{dominio}-service.ts         ← factories
```

## Repository (interface)

```ts
export interface ToursRepository {
  create(data: CreateTourData): Promise<Tour>
  findById(id: string): Promise<Tour | null>
  // ...
}
```

## PrismaRepository

```ts
export class PrismaTourRepository implements ToursRepository {
  async findById(id: string) {
    return this.prisma.tour.findUnique({
      where: { id },
      include: { translations: true, images: true, extras: true }, // include sempre obrigatório
    })
  }
}
```

## InMemoryRepository

```ts
export class InMemoryToursRepository implements ToursRepository {
  public items: Tour[] = []          // exposto para verificação nos testes
  public translations: TourTranslation[] = []

  async create(data: CreateTourData) {
    const tour = { id: randomUUID(), ...data }
    this.items.push(tour)
    return tour
  }
}
```

## Service

```ts
interface Request { name: string; locale: string; /* ... */ }
interface Response { tour: Tour }

export class CreateTourService {
  constructor(private toursRepository: ToursRepository) {}

  async execute(request: Request): Promise<Response> {
    // lógica de negócio pura — sem request/response HTTP, sem logging
    const tour = await this.toursRepository.create(request)
    return { tour }
  }
}
```

Tipos `Request` e `Response` são próprios do service — nunca usar `Prisma.TourCreateInput`.

## Factory

```ts
// src/shared/factories/make-create-tour-service.ts
export function makeCreateTourService() {
  const repository = new PrismaToursRepository()
  return new CreateTourService(repository)
}
```

## Controller

```ts
export async function createTourController(request: FastifyRequest, reply: FastifyReply) {
  const service = makeCreateTourService()
  const result = await service.execute(request.body)
  request.log.info({ tourId: result.tour.id }, 'tour created')  // logging aqui, não no service
  return reply.status(201).send(result)
}
```

## Routes

```ts
export async function tourRoutes(fastify: FastifyInstance) {
  // rota pública
  fastify.get('/tours', { schema: { response: { 200: listToursResponseSchema } } }, listToursController)

  // rota admin — middleware por rota individual
  fastify.post('/tours', {
    onRequest: [verifyJWT, verifyUserRole('ADMIN')],
    schema: { body: createTourBodySchema, response: { 201: createTourResponseSchema } },
  }, createTourController)
}
```

Registrar em `src/app.ts`:
```ts
fastify.register(tourRoutes, { prefix: '/tours' })
```

## Testes unitários

```ts
describe('CreateTourService', () => {
  let sut: CreateTourService
  let repository: InMemoryToursRepository

  beforeEach(() => {
    repository = new InMemoryToursRepository()
    sut = new CreateTourService(repository)  // sut = System Under Test
  })

  it('should create a tour', async () => {
    const result = await sut.execute({ name: 'Item Exemplo', locale: 'pt-BR' })
    expect(result.tour.id).toBeDefined()
    expect(repository.items).toHaveLength(1)
  })
})
```

## Ver também

- [`patterns/testing.md`](testing.md) — padrões de teste unitário e E2E para módulos
