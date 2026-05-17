# Pattern: Testing

Para testes E2E do `apps/web` (Playwright com dois níveis de validação), ver [`testing-web.md`](testing-web.md).

---

## API — Vitest + InMemory + Supertest

### Testes unitários (.spec.ts)

Ficam no mesmo módulo que o service. Usam InMemoryRepository para isolar lógica de negócio.

```ts
describe('CreateTourService', () => {
  let sut: CreateTourService
  let toursRepository: InMemoryToursRepository

  beforeEach(() => {
    toursRepository = new InMemoryToursRepository()
    sut = new CreateTourService(toursRepository)
  })

  it('should create an item', async () => {
    const result = await sut.execute({ name: 'Item Exemplo', locale: 'pt-BR' })
    expect(result.item.id).toBeDefined()
    expect(toursRepository.items).toHaveLength(1)
  })
})
```

### Testes E2E (.e2e.spec.ts)

Ficam no controller. Fazem requisições HTTP reais contra o banco de dados.

```ts
describe('[E2E] POST /tours', () => {
  let app: FastifyInstance
  let authToken: string

  beforeAll(async () => {
    app = await buildApp()
    const response = await supertest(app.server)
      .post('/auth/admin/login')
      .send({ email: 'admin-login@test.com', password: '123456' })
    authToken = response.body.token
  })

  afterAll(async () => {
    await app.prisma.tour.deleteMany({ where: { name: 'Test Tour' } })
    await app.close()
  })

  it('should create a tour', async () => {
    const response = await supertest(app.server)
      .post('/tours')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Tour', locale: 'pt-BR' })
    expect(response.status).toBe(201)
  })
})
```

**UUIDs do seed:** definidos em `prisma/seed.ts` — testes E2E do admin podem navegar diretamente por esses IDs; seed deve estar íntegro antes de rodar.

**Regra:** cada suite garante o estado do banco antes de rodar (`beforeAll` com seed/truncate).
Nunca depender de estado de runs anteriores.

---

## Admin — Vitest + MSW + Playwright

### Testes unitários (Vitest + jsdom)

```ts
import { render, screen } from '@testing-library/react'
import { ItemCard } from './ItemCard'

it('renders item name', () => {
  render(<ItemCard item={{ name: 'Item Exemplo' }} />)
  expect(screen.getByText('Item Exemplo')).toBeInTheDocument()
})
```

**MSW 2** para mockar chamadas de API em testes de componentes:

```ts
import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'

beforeEach(() => {
  server.use(http.get('/items', () => HttpResponse.json({ items: [mockItem] })))
})
```

### Testes E2E (Playwright)

```ts
test('should create an item', async ({ page }) => {
  await page.goto('/items/new')
  await page.fill('[name="name"]', 'Item Exemplo')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/items\/[a-z0-9-]+/)
})
```

Config: `playwright.config.ts`
- `baseURL`: `http://localhost:5173`
- `globalSetup`: `./tests/e2e/global-setup.ts`
- Single worker (não-CI), trace on failure, reporter HTML
