import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { server } from '@/mocks/node'
import { useCreateUser } from './useCreateUser'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const mockInvalidateQueries = vi.hoisted(() => vi.fn())
vi.mock('@/lib/react-query/query-client', () => ({
  queryClient: { invalidateQueries: mockInvalidateQueries },
}))

import { toast } from 'sonner'

const API_BASE = 'http://localhost:3333'

const mockUser = {
  id: 'u2',
  name: 'Bob',
  email: 'bob@test.com',
  role: 'USER' as const,
  locale: 'pt-BR',
  validated_at: null,
  deleted_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

let queryClient: QueryClient

function createWrapper() {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

beforeEach(() => {
  mockInvalidateQueries.mockResolvedValue(undefined)
})

describe('useCreateUser', () => {
  it('onSuccess: exibe toast de sucesso e invalida query ["users"]', async () => {
    server.use(http.post(`${API_BASE}/users`, () => HttpResponse.json({ user: mockUser })))

    const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() })

    result.current.mutate({ name: 'Bob', email: 'bob@test.com', role: 'USER', locale: 'pt-BR' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(toast.success).toHaveBeenCalledWith(
      'Usuário criado. Um convite foi enviado para o e-mail cadastrado.',
    )
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['users'] })
  })

  it('onError: propaga o erro sem chamar toast.error', async () => {
    server.use(http.post(`${API_BASE}/users`, () => HttpResponse.json(null, { status: 409 })))

    const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() })

    result.current.mutate({ name: 'Bob', email: 'bob@test.com', role: 'USER', locale: 'pt-BR' })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast.error).not.toHaveBeenCalled()
  })
})
