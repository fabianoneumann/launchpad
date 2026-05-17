# Pattern: Forms

## Padrões por app

| App | Padrão | Arquivo de referência |
|---|---|---|
| **web** | `@base-ui/react Field` + Zod + `useMutation` | [`forms-web.md`](forms-web.md) |
| **admin** (forms simples) | shadcn `Form / FormField / FormMessage` + `zodResolver` | abaixo |
| **admin** (campos dinâmicos) | RHF direto + `useFieldArray` | abaixo |

Ver `decisions/003-form-pattern.md` para o histórico e justificativa por app.

---

## Padrão admin — forms simples (shadcn form.tsx)

Usar para qualquer form sem `useFieldArray`. Sempre declarar `defaultValues` no `useForm`
para evitar o warning "uncontrolled input to be controlled" do React.

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export function ExampleForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', name: '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>Enviar</Button>
      </form>
    </Form>
  )
}
```

Para campos com Select ou outros componentes controlados, o `render` prop do `FormField`
substitui diretamente o `Controller` do RHF — `field.value` e `field.onChange` passam para
o componente:

```tsx
<FormField control={form.control} name="role" render={({ field }) => (
  <FormItem>
    <FormLabel>Perfil</FormLabel>
    <Select value={field.value} onValueChange={field.onChange}>
      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
      <SelectContent>...</SelectContent>
    </Select>
  </FormItem>
)} />
```

Para campo com botão sobreposto (ex: toggle de visibilidade de senha), o botão fica fora do
`FormControl` mas dentro de um `div relative` que envolve `FormControl` + botão:

```tsx
<FormField control={form.control} name="password" render={({ field }) => (
  <FormItem>
    <FormLabel>Senha</FormLabel>
    <div className="relative">
      <FormControl>
        <Input type={showPassword ? 'text' : 'password'} {...field} />
      </FormControl>
      <Button type="button" variant="ghost" size="icon-sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
        onClick={() => setShowPassword(p => !p)}>
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>
    </div>
    <FormMessage />
  </FormItem>
)} />
```

---

## Padrão admin — campos dinâmicos (useFieldArray)

Usar quando o form tem arrays de campos. RHF direto — o wrapper `FormField` não adiciona
valor nesses casos e dificulta o controle granular do array.

```tsx
import { useForm, useFieldArray } from 'react-hook-form'
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
