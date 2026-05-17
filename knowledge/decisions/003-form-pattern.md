# ADR 003: Estratégia de formulários — por app

## Status

Ativo. Admin: migração para shadcn `form.tsx` concluída (issue #59). Web: padrão recomendado para quando apps/web for implementado.

## Contexto e histórico

O projeto usa Zod v4. O `form.tsx` do shadcn/ui integra React Hook Form via `zodResolver`.
Quando o admin foi desenvolvido, `@hookform/resolvers` estava em v3.x e não suportava Zod v4 —
o `zodResolver` não formatava erros corretamente, quebrando `FormMessage`. A saída foi usar
RHF diretamente, acessando `form.formState.errors.field` manualmente.

`@hookform/resolvers` foi atualizado para v5, suportando Zod v4. O bloqueio técnico sumiu.
A migração dos forms simples do admin foi concluída na issue [#59](https://github.com/fabianoneumann/launchpad/issues/59).

## Por que o web não usa React Hook Form

O web já tem `@base-ui/react` instalado como primitivo dos componentes shadcn/ui (style
`base-nova`). O pacote inclui `Field.Root`, `Field.Control`, `Field.Label`, `Field.Error` —
exatamente o que RHF + `form.tsx` fornecia, mas nativo ao primitivo já presente no projeto.

Adicionar `react-hook-form` + `@hookform/resolvers` seria uma camada de abstração sobre algo
que o `@base-ui/react` já resolve. A única dependência nova no web é `zod`.

## Decisão por app

| App | Padrão | Dependências |
|---|---|---|
| **web** | `@base-ui/react Field` + Zod + `useMutation` | `zod` (única nova dep) |
| **admin** (forms simples) | `Form / FormField / FormMessage` (shadcn `form.tsx`) + `zodResolver` | já instalado |
| **admin** (campos dinâmicos) | RHF direto + `useFieldArray` | já instalado |

**Não instalar `react-hook-form` nem `@hookform/resolvers` no apps/web.**

## Consequências

- Admin usa `Form / FormField / FormControl / FormLabel / FormMessage` (shadcn `form.tsx`) nos forms simples; `useFieldArray` permanece com RHF direto nos forms dinâmicos (`TourFormPage`, `ExtraFormPage`)
- Web usa `Field` de `@base-ui/react/field` diretamente (sem wrapper shadcn necessário)
- Validação no web acontece no `handleSubmit` via `schema.safeParse(new FormData(...))`
- Erros de API são mapeados para estado local (`useState<FieldErrors>`) via `onError` do `useMutation`
- Ver `patterns/forms-web.md` para o template completo do web; `patterns/forms.md` para o admin
