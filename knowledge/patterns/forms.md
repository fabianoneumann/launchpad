# Pattern: Forms

## Padrões por app

| App | Padrão | Arquivo de referência |
|---|---|---|
| **web** | `@base-ui/react Field` + Zod + `useMutation` | [`forms-web.md`](forms-web.md) |
| **admin** | RHF direto + erros manuais | abaixo |

Ver `decisions/003-form-pattern.md` para o histórico e justificativa por app.

---

## Padrão admin — RHF direto (legado, sem migração imediata)

Usar no `apps/admin` enquanto a migração para shadcn `form.tsx` não ocorre.
Aplicar também para qualquer form com `useFieldArray` (campos dinâmicos), em qualquer app.

```tsx
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function TourForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { translations: [] },
  })
  const { fields } = useFieldArray({ control: form.control, name: 'translations' })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {fields.map((field, i) => (
        <div key={field.id}>
          <Input {...form.register(`translations.${i}.name`)} />
          {form.formState.errors.translations?.[i]?.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.translations[i].name.message}
            </p>
          )}
        </div>
      ))}
    </form>
  )
}
```

---

## Upload de arquivo (admin) — FileDropzone

Componente reutilizável em `src/components/shared/FileDropzone.tsx`:

```tsx
<FileDropzone
  onFileSelected={(file) => mutation.mutate(file)}
  isPending={mutation.isPending}
/>
```

Mutation hook padrão: `useMutation` + `onSuccess` invalida a query da entidade + `onError` com toast.
Ver o hook de upload da entidade correspondente em `src/features/{dominio}/hooks/` como referência.
