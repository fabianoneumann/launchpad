# Pattern: Backend Controllers — padrões de runtime

Complementa `backend-module.md` com padrões aplicados dentro de controllers e na configuração
de rotas.

## Fire-and-forget

Quando uma operação secundária não deve bloquear a resposta principal, dispará-la sem `await`
e com `.catch()` para logar o erro sem propagar:

```ts
if (!user.validated_at) {
  makeEnsureVerificationLinkValidService()
    .execute({ userId: user.id })
    .catch((err) =>
      request.log.error({ event: 'email.verify_ensure_failed', userId: user.id, error: err.message }),
    )
}
```

O `.catch()` é obrigatório — sem ele, rejeições da promise viram `UnhandledPromiseRejection`.

## Rate limiting por rota

O plugin global (`@fastify/rate-limit`) cobre todas as rotas como fallback e deve ser registrado
apenas em produção:

```ts
if (env.NODE_ENV === 'production') {
  app.register(fastifyRateLimit, { max: 500, timeWindow: '1 minute' })
}
```

Para limites específicos por rota (ex: brute force em login), usar `config.rateLimit`:

```ts
fastify.post('/auth/login', {
  config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
  schema: { ... },
}, loginController)
```

O limite por rota sobrepõe o global. Rotas sem `config.rateLimit` usam o global como fallback.
Em `dev` e `test`, nenhum rate limit é aplicado — os testes E2E não recebem `429`.
