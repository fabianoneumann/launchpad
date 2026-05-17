# Pattern: Forms (Web)

> **Quando usar:** apps/web usando `@base-ui/react` como primitivo shadcn (style `base-nova`,
> instalado com shadcn CLI ≥ 4.6). O `@base-ui/react` já inclui `Field.Root/Control/Error`,
> tornando React Hook Form redundante nesse stack.
> Se o web usar outro primitivo ou shadcn style diferente, reavaliar.

Padrão recomendado para formulários no `apps/web` (stack Next.js 16 + @base-ui/react).
Não instalar `react-hook-form` nem `@hookform/resolvers` — `@base-ui/react` já provê
a gestão de campo nativamente.

Ver também: [`shadcn-components.md`](shadcn-components.md) (primitivos `Field.*` são de `@base-ui/react`),
[`data-fetching-web.md`](data-fetching-web.md) (contexto de `useMutation` e `useQuery`).

---

## Estrutura base — Field + Zod + useMutation

```tsx
'use client'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import { z } from 'zod'
import { Field } from '@base-ui/react/field'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { api } from '@/lib/api/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// 1. Schema Zod — única fonte de verdade da validação
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type LoginData = z.infer<typeof loginSchema>
type FieldErrors = Partial<Record<keyof LoginData | 'root', string>>

// 2. Helper — transforma ZodError em mapa campo → mensagem
function formatZodErrors(error: z.ZodError): FieldErrors {
  return Object.fromEntries(error.issues.map((i) => [i.path[0], i.message]))
}

export function LoginForm() {
  const t = useTranslations('auth')
  const [errors, setErrors] = useState<FieldErrors>({})

  const mutation = useMutation({
    mutationFn: (data: LoginData) => api.post('/auth/login', data),
    onSuccess: ({ data }) => { /* ... */ },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        setErrors({ root: t('errors.invalidCredentials') })
      }
    },
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const raw = Object.fromEntries(new FormData(e.currentTarget))
    const result = loginSchema.safeParse(raw)
    if (!result.success) { setErrors(formatZodErrors(result.error)); return }
    setErrors({})
    mutation.mutate(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field.Root invalid={!!errors.email}>
        <Field.Control render={<Input name="email" type="email" />} />
        {/* Field.Error exige match — sem ele, usa ValidityState nativo (não dispara com noValidate) */}
        <Field.Error match={!!errors.email}>{errors.email}</Field.Error>
      </Field.Root>

      <Field.Root invalid={!!errors.password}>
        <Field.Control render={<Input name="password" type="password" />} />
        <Field.Error match={!!errors.password}>{errors.password}</Field.Error>
      </Field.Root>

      {/* errors.root: fora de Field.Root, usa <p> */}
      {errors.root && <p className="text-sm text-destructive">{errors.root}</p>}

      <Button type="submit" disabled={mutation.isPending}>submit</Button>
    </form>
  )
}
```

---

## Variações comuns

### Validação cross-field (ex: confirmar senha)

No Zod 4, `.refine()` não aceita funções de tradução (escopo de módulo). Padrão: `message: ''`
no schema, substituído pela tradução no `handleSubmit` após `formatZodErrors`:

```ts
const schema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: '',            // vazio — tradução aplicada no handleSubmit
  path: ['confirmPassword'],
})

// No handleSubmit:
const fieldErrors = formatZodErrors(result.error)
if (fieldErrors.confirmPassword === '') {
  fieldErrors.confirmPassword = t('errors.passwordMismatch')
}
setErrors(fieldErrors)
```

### Input controlado com dados assíncronos

Quando o valor inicial vem de uma query (ex: `useMeQuery`), `defaultValue` causa warning do Base UI
("changing the default value state of an uncontrolled FieldControl"). Usar input controlado:

```tsx
const { data: user } = useMeQuery()
const [name, setName] = useState(user?.name ?? '')

useEffect(() => {
  if (user?.name !== undefined) setName(user.name)
}, [user?.name])

// No form:
<Field.Control render={
  <Input value={name} onChange={(e) => setName(e.target.value)} />
} />

// No handleSubmit — usar estado diretamente, não FormData:
const result = schema.safeParse({ name })
```

### Erros da API mapeados para campos

```ts
onError: (error) => {
  if (isAxiosError(error) && error.response?.status === 409) {
    setErrors({ email: t('errors.emailTaken') })
  } else {
    setErrors({ root: t('errors.generic') })
  }
}
```
