# Pattern: Error Handling

## API — AppError + error handler global

### AppError

```ts
// lançar erros de negócio com código HTTP explícito
throw new AppError('Recurso não encontrado', 404)
throw new AppError('Nome já existe', 409)
throw new AppError('Sem permissão', 403)
```

O error handler global em `src/app.ts` captura `AppError` e retorna:
```json
{ "message": "Recurso não encontrado", "statusCode": 404 }
```

Erros não capturados retornam 500 com mensagem genérica.

### Logging de erros

```ts
// controller — logar antes de lançar ou após capturar
request.log.info({ resourceId }, 'resource created')
request.log.warn({ userId, resourceId }, 'resource not found for user')
request.log.error({ error, resourceId }, 'failed to process resource')
```

Logging sempre no controller, nunca no service.

## Padrões de envio de e-mail por criticidade

### Fire-and-forget (baixa criticidade)

Para e-mails de boas-vindas, confirmações, notificações secundárias.
Falha silenciosa — não bloqueia a operação principal.

```ts
// no controller, após operação bem-sucedida
sendWelcomeEmail(user.email, user.name).catch(error => {
  request.log.warn({ error, userId: user.id }, 'failed to send welcome email')
})
// não usa await — não bloqueia resposta
```

### Fail-fast (alta criticidade)

Para e-mails essenciais ao fluxo do usuário (ex: verificação de e-mail).
Falha propaga erro — a operação falha se o e-mail não puder ser enviado.

```ts
// lança se falhar — usuário recebe erro
await sendVerificationEmail(user.email, token)
```

### Absorver + log (criticidade média)

Para notificações importantes mas que não devem bloquear o fluxo.

```ts
try {
  await sendOrderConfirmationEmail(order)
} catch (error) {
  request.log.error({ error, orderId: order.id }, 'failed to send order confirmation')
  // operação continua — erro não propaga para o usuário
}
```

## Admin — Erros de API

Erros de API são capturados via interceptor Axios e exibidos via Sonner (toast):

```ts
// genérico
toast.error('Erro ao salvar. Tente novamente.')

// específico (conflito de dados)
if (error.response?.status === 409) {
  form.setError('name', { message: 'Já existe um registro com este nome' })
}
```
