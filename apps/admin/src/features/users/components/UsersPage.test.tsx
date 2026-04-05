import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse, delay } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { server } from '@/mocks/node'
import { renderWithRouter, rootRoute } from '@/tests/router-test-utils'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('@/app/routes/_layout/users/', () => ({
  Route: { useSearch: vi.fn() },
}))

import { router } from '@/app/router'
import { Route } from '@/app/routes/_layout/users/'
import { useAuthStore } from '@/features/auth/store/auth-store'
const { UsersPage } = await import('./UsersPage')

const API_BASE = 'http://localhost:3333'

const defaultSearch = {
  page: 1,
  perPage: 10,
  role: undefined,
  search: undefined,
  status: 'active' as const,
}

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

function renderPage() {
  const usersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'users',
    component: UsersPage,
  })
  const userDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'users/$id',
    component: () => null, // stub — apenas para o Link resolver
  })
  return renderWithRouter({
    initialPath: '/users',
    routes: [usersRoute, userDetailRoute],
  })
}

beforeEach(() => {
  vi.mocked(Route.useSearch).mockReturnValue(defaultSearch)
  vi.clearAllMocks()
})

describe('UsersPage — renderização', () => {
  it('renderiza dados retornados por GET /users', async () => {
    server.use(
      http.get(`${API_BASE}/users`, () => HttpResponse.json({ users: [mockUser], total: 1 })),
    )

    renderPage()

    await waitFor(() => expect(screen.getByText('Alice Silva')).toBeInTheDocument())
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })

  it('exibe skeleton enquanto a requisição está pendente', async () => {
    server.use(
      http.get(`${API_BASE}/users`, async () => {
        await delay('infinite')
        return HttpResponse.json({ users: [], total: 0 })
      }),
    )

    render(<UsersPage />, { wrapper: createWrapper() })

    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(screen.queryByText('Alice Silva')).not.toBeInTheDocument()
  })
})

describe('UsersPage — filtros', () => {
  it('selecionar role chama router.navigate com role correto', async () => {
    server.use(http.get(`${API_BASE}/users`, () => HttpResponse.json({ users: [], total: 0 })))

    render(<UsersPage />, { wrapper: createWrapper() })

    const [roleSelect] = screen.getAllByRole('combobox')
    fireEvent.click(roleSelect)

    await waitFor(() => screen.getByRole('option', { name: 'Admin' }))
    fireEvent.click(screen.getByRole('option', { name: 'Admin' }))

    expect(vi.mocked(router.navigate)).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.objectContaining({ role: 'ADMIN', page: 1 }),
      }),
    )
  })

  it('busca por Enter chama router.navigate com search correto', async () => {
    server.use(http.get(`${API_BASE}/users`, () => HttpResponse.json({ users: [], total: 0 })))

    render(<UsersPage />, { wrapper: createWrapper() })

    const input = screen.getByPlaceholderText(/buscar/i)
    await userEvent.type(input, 'alice{Enter}')

    expect(vi.mocked(router.navigate)).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.objectContaining({ search: 'alice', page: 1 }),
      }),
    )
  })
})

describe('UsersPage — exclusão', () => {
  it('botão Excluir fica disabled na linha do próprio admin logado', async () => {
    server.use(
      http.get(`${API_BASE}/users`, () => HttpResponse.json({ users: [mockUser], total: 1 })),
    )

    useAuthStore.setState({
      user: { id: 'user-1', name: 'Alice Silva', email: 'alice@test.com', role: 'ADMIN' },
      token: 'tok',
      isAuthenticated: true,
    })

    renderPage()

    await waitFor(() => screen.getByText('Alice Silva'))

    const row = screen.getByText('Alice Silva').closest('tr')!
    const deleteBtn = within(row).getAllByRole('button').at(-1)!
    expect(deleteBtn).toBeDisabled()
  })

  afterEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
  })

  it('confirmar exclusão chama DELETE /users/:id', async () => {
    let deleteCalled = false

    server.use(
      http.get(`${API_BASE}/users`, () => HttpResponse.json({ users: [mockUser], total: 1 })),
      http.delete(`${API_BASE}/users/user-1`, () => {
        deleteCalled = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderPage()

    await waitFor(() => screen.getByText('Alice Silva'))

    const row = screen.getByText('Alice Silva').closest('tr')!
    const deleteBtn = within(row).getAllByRole('button').at(-1)!
    await userEvent.click(deleteBtn)

    await userEvent.click(screen.getByRole('button', { name: /^excluir$/i }))

    await waitFor(() => expect(deleteCalled).toBe(true))
  })
})
