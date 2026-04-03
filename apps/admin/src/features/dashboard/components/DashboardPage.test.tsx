import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { server } from '@/mocks/node'

const { DashboardPage } = await import('./DashboardPage')

const API_BASE = 'http://localhost:3333'

const mockUser = {
  id: 'user-1',
  name: 'Alice Silva',
  email: 'alice@test.com',
  role: 'MEMBER' as const,
  locale: 'pt-BR',
  validated_at: null,
  deleted_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('DashboardPage — cards de estatísticas', () => {
  it('exibe valores vindos de GET /users/stats', async () => {
    server.use(
      http.get(`${API_BASE}/users/stats`, () =>
        HttpResponse.json({
          total: 42,
          active: 38,
          unvalidated: 5,
          byRole: { ADMIN: 2, MEMBER: 10, USER: 26 },
        }),
      ),
    )

    render(<DashboardPage />, { wrapper: createWrapper() })

    await waitFor(() => expect(screen.getByText('42')).toBeInTheDocument())
    expect(screen.getByText('38')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})

describe('DashboardPage — usuários recentes', () => {
  it('exibe dados vindos de GET /users', async () => {
    server.use(
      http.get(`${API_BASE}/users`, () => HttpResponse.json({ users: [mockUser], total: 1 })),
    )

    render(<DashboardPage />, { wrapper: createWrapper() })

    await waitFor(() => expect(screen.getByText('Alice Silva')).toBeInTheDocument())
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })
})
