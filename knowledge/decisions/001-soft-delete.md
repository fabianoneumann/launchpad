# ADR 001: Soft Delete

## Decisão

Usar soft delete (campo `deleted_at: DateTime?`) em entidades que são referenciadas por
registros históricos (financeiros ou operacionais) em vez de remoção física.

## Justificativa

Registros de histórico (ex: itens de pedido, logs de transação) referenciam entidades pelo ID.
Se uma entidade fosse deletada fisicamente, o histórico perderia a referência e ficaria
impossível reconstruir dados operacionais ou financeiros passados.

O soft delete preserva a integridade referencial sem exigir FK com `ON DELETE SET NULL`.

## Implementação

- Campo `deleted_at: DateTime?` na entidade
- Queries padrão sempre filtram `deleted_at: null`
- API admin expõe flags opcionais: `showDeleted` (inclui deletados) e `onlyDeleted` (só deletados)

## Critério para aplicar soft delete

Aplicar em entidades que:
- São referenciadas por registros imutáveis de histórico (pedidos, transações, logs)
- Precisam ser "removidas" da UI sem perder a rastreabilidade

Não aplicar em entidades onde o dado não precisa ser preservado para contexto histórico
(ex: usuário cujos dados relevantes já estão em snapshot no registro de pedido).
