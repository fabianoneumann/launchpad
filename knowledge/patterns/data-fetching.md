# Pattern: Data Fetching

## Admin — Axios + TanStack Query

O admin é SPA pura. Todo fetch é client-side via Axios + TanStack Query.

### HTTP client (src/lib/api/client.ts)

```ts
import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/auth-store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // envia cookies (refresh token httpOnly)
})

// injeta token em todas as requisições
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// refresh automático em 401
api.interceptors.response.use(null, async error => {
  const originalRequest = error.config
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    try {
      const { data } = await api.patch('/auth/token/refresh')
      useAuthStore.getState().setToken(data.token)
      return api(originalRequest)
    } catch {
      useAuthStore.getState().clearSession()
      window.location.href = '/login'
    }
  }
  return Promise.reject(error)
})
```

URLs que não tentam refresh (SKIP_REFRESH_URLS):
`/auth/me/password`, `/auth/token/refresh`, `/auth/admin/login`, `/auth/login`, `/auth/logout`

**Comportamento em revogação de token (`token_version`):** quando o backend incrementa `token_version` (mudança de senha, reset de senha, troca de role), o access token e o refresh token são invalidados simultaneamente. O interceptor tenta refresh, recebe 401 novamente (o endpoint de refresh também valida `token_version`), cai no `catch` → `clearSession()` + redirect `/login`. O fluxo já está correto — não adicionar lógica extra de retry nesse caminho.

### TanStack Query

```ts
// query
export function useTours(params: ListToursParams) {
  return useQuery({
    queryKey: ['tours', params],
    queryFn: () => api.get('/tours', { params }).then(r => r.data),
  })
}

// mutation
export function useCreateTour() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTourData) => api.post('/tours', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tours'] }),
  })
}
```

## Web — Dual approach

> Padrão completo em [`patterns/data-fetching-web.md`](data-fetching-web.md).

`serverFetch` (fetch nativo) para Server Components; Axios para Client Components.
TanStack Query usa dois singletons distintos — `getQueryClient` (server) e `getBrowserQueryClient` (client).

## Ver também

- [`patterns/data-fetching-web.md`](data-fetching-web.md) — implementação completa do web
- [`architecture/api.md`](../architecture/api.md) — token versioning e mecanismo de revogação de sessão
