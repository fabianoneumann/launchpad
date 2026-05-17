# Domain: Users

## Modelo de dados

| Campo | Tipo | Notas |
|---|---|---|
| `id` | String (UUID) | imutável |
| `name` | String | editável |
| `email` | String (unique) | editável |
| `password_hash` | String | interno |
| `role` | Enum (ADMIN, MEMBER, USER) | editável via `PATCH /users/:id/role` |
| `locale` | String | default `"pt-BR"` — preferência de idioma da UI |
| `token_version` | Int | controle de invalidação de JWT — ver `architecture/api.md` |
| `validated_at` | DateTime? | null até verificação de e-mail |
| `deleted_at` | DateTime? | soft delete |

## Acesso por role aos apps

| Role | Admin panel (`apps/admin`) | Web público (`apps/web`) |
|---|---|---|
| `ADMIN` | ✅ | ✅ |
| `MEMBER` | ✅ | ✅ |
| `USER` | ❌ | ✅ |

O web não tem nenhuma lógica de role — todo o conteúdo é público ou pertence ao próprio
usuário (perfil, reservas). ADMIN e MEMBER podem usar o web como qualquer cliente, inclusive
para fazer reservas pessoais ou testar a experiência do cliente.

Cadastros via `POST /auth/register` (web público) sempre criam `role: USER` — o default do
schema. Roles elevados (MEMBER, ADMIN) são atribuídos pelo admin panel via `PATCH /users/:id/role`.

**Implicação para `AuthUser` no web:** o tipo deve refletir o que a API retorna:
`role: 'ADMIN' | 'MEMBER' | 'USER'` — não apenas `'USER'`.

## Campo `locale`

Representa a **preferência de idioma do usuário para a UI** — independente do país e independente do locale do conteúdo multilingual da API (resolvido via `?locale=` nas chamadas). Locales suportados: `pt-BR`, `en`, `es`.

### Endpoints e suporte ao `locale`

| Endpoint | Quem usa | Suporte ao `locale` |
|---|---|---|
| `POST /auth/register` | auto-cadastro | detecta via `Accept-Language` e persiste ✅ |
| `POST /users` | admin cria usuário | aceita `locale` opcional ✅ |
| `PATCH /auth/me` | usuário atualiza próprio perfil | aceita `name` e/ou `locale` ✅ |
| `PATCH /users/:id` | admin atualiza usuário | aceita apenas `name` e `email` ⚠️ |

**Comportamento intencional no endpoint admin:** `PATCH /users/:id` não expõe `locale` — design deliberado. Locale é preferência pessoal do usuário e deve ser gerenciada exclusivamente por ele via `PATCH /auth/me`. Admin não deve sobrescrever isso.

## Token versioning e invalidação de sessão

O campo `token_version` é incrementado por qualquer ação de segurança relevante — ver `architecture/api.md` para o mecanismo completo.

**Implicação para o frontend (admin e web):** quando `token_version` é incrementado no backend (troca de senha, reset de senha, troca de role, logout em outro dispositivo), o access token corrente e o refresh token são invalidados simultaneamente. O interceptor Axios detecta o 401 do access token, tenta refresh, recebe outro 401 (refresh endpoint também valida `token_version`), executa `clearSession()` e redireciona para `/login`. O comportamento já está implementado nos interceptors — ver `patterns/data-fetching.md`.

**Por que `/auth/me/password` está em `SKIP_REFRESH_URLS`:** ao trocar a própria senha, o frontend já sabe que a sessão vai ser invalidada e não deve tentar refresh — vai direto para logout/redirect após o 200 da troca.
