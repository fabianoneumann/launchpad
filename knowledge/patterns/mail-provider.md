# Pattern: Mail Provider

## Interface

```ts
// src/lib/mail/mail-provider.ts
export interface MailProvider {
  send(options: { to: string; subject: string; html: string }): Promise<void>
}
```

## Implementações

| Classe | Arquivo | Quando usar |
|---|---|---|
| `ResendMailProvider` | `src/lib/mail/resend-mail-provider.ts` | Produção (requer `RESEND_API_KEY`) |
| `FakeMailProvider` | `src/lib/mail/fake-mail-provider.ts` | Testes unitários |

O `FakeMailProvider` acumula emails em `public sent: SentEmail[]` — útil para assertions:

```ts
const mailProvider = new FakeMailProvider()
await service.execute({ email: 'user@example.com' })
expect(mailProvider.sent[0].subject).toBe('Redefinição de senha')
```

## Templates com React Email

Emails são componentes React convertidos para HTML via `@react-email/render`:

```ts
import { render } from '@react-email/render'
import { ForgotPasswordEmail } from '@/lib/mail/emails/forgot-password'
import { getForgotPasswordContent } from '@/lib/mail/content/forgot-password-content'

const content = getForgotPasswordContent(locale) // textos por locale
const html = await render(ForgotPasswordEmail({ name, resetLink, content }))

await mailProvider.send({ to: user.email, subject: content.subject, html })
```

## Estrutura de arquivos de email

```
src/lib/mail/
├── content/
│   ├── pt-BR/    ← getForgotPasswordContent, etc.
│   ├── en/
│   └── es/
└── emails/
    └── forgot-password.tsx   ← componente React Email
```

**Convenção ao criar um novo email:**
1. Criar o template React em `emails/`
2. Criar o conteúdo por locale em `content/{locale}/`
3. Criar uma função `get{Name}Content(locale: Locale)` que importa o locale correto
4. Consultar `patterns/error-handling.md` para escolher a criticidade do envio (fire-and-forget vs fail-fast)

## Ver também

- [`patterns/error-handling.md`](error-handling.md) — fire-and-forget vs fail-fast vs absorver+log
