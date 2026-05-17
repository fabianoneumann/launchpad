# ADR 003: Estratégia de formulários — por app

## Status

Ativo.

## Decisão por app

| App | Padrão | Dependências |
|---|---|---|
| **admin** (forms simples) | `Form / FormField / FormMessage` (shadcn `form.tsx`) + `zodResolver` | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **admin** (campos dinâmicos) | RHF direto + `useFieldArray` | idem |
| **web** | `@base-ui/react Field` + Zod + `useMutation` | `zod` (única dep nova) |

**Não instalar `react-hook-form` nem `@hookform/resolvers` no apps/web.**

## Por que o admin usa shadcn form.tsx

`form.tsx` encapsula `FormProvider` + `Controller` do React Hook Form e expõe
`FormField / FormItem / FormLabel / FormControl / FormMessage`. Elimina o boilerplate de exibição
manual de erros (`{errors.x && <p>...}`) e mantém acessibilidade (aria-invalid, aria-describedby)
automaticamente via `FormControl`.

`useFieldArray` (forms com campos dinâmicos) usa RHF diretamente — o wrapper `FormField` não
adiciona valor nesses casos e dificulta o controle granular do array.

## Por que o web não usa React Hook Form

O web usa `@base-ui/react` como primitivo dos componentes shadcn (style `base-nova`). O pacote
inclui `Field.Root`, `Field.Control`, `Field.Label`, `Field.Error` — equivalente funcional ao
`form.tsx`, mas nativo ao primitivo já instalado. Adicionar RHF seria uma camada extra sobre algo
que `@base-ui/react` já resolve.

Validação no web via `schema.safeParse(new FormData(...))` no `handleSubmit`; erros de API
mapeados para `useState<FieldErrors>` via `onError` do `useMutation`.

## Referências

- Template completo web: `patterns/forms-web.md`
- Template completo admin: `patterns/forms.md`
