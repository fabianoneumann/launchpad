# Pattern: Soft Delete

## Implementação

Entidades com soft delete têm o campo `deleted_at: DateTime?` no schema Prisma.
Deleção marca o campo com `new Date()`. Nenhum registro é removido fisicamente.

```ts
// service — soft delete
async delete(id: string) {
  await this.repository.softDelete(id)
}

// repository Prisma
async softDelete(id: string) {
  return this.prisma.tour.update({
    where: { id },
    data: { deleted_at: new Date() },
  })
}
```

## Queries padrão

**Sempre filtrar `deleted_at: null`** em queries que não solicitam explicitamente deletados:

```ts
// padrão — exclui deletados
async findMany(params: ListToursParams) {
  return this.prisma.tour.findMany({
    where: {
      deleted_at: params.onlyDeleted ? { not: null } : params.showDeleted ? undefined : null,
    },
  })
}
```

## Flags de API (padrão admin)

| Flag | Comportamento |
|---|---|
| nenhuma | retorna apenas não-deletados (`deleted_at: null`) |
| `showDeleted=true` | retorna todos (deletados + não-deletados) |
| `onlyDeleted=true` | retorna apenas deletados |

Exemplo em query params: `GET /tours?showDeleted=true`

## Quando aplicar soft delete

Aplicar em entidades referenciadas por registros imutáveis de histórico (pedidos, transações, logs).
Ver `decisions/001-soft-delete.md` para o critério completo.

## InMemoryRepository

```ts
// soft delete em InMemory (para testes)
async softDelete(id: string) {
  const item = this.items.find(i => i.id === id)
  if (item) item.deleted_at = new Date()
}
```

## Ver também

- [`decisions/001-soft-delete.md`](../decisions/001-soft-delete.md) — justificativa da decisão (preservar histórico de reservas)
