import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { server } from '@/mocks/node'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('@/app/routes/_layout/users/$id', () => ({
  Route: { useParams: vi.fn() },
}))

import { router } from '@/app/router'
import { Route } from '@/app/routes/_layout/users/$id'
const { UserDetailPage } = await import('./UserDetailPage')

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

beforeEach(() => {
  vi.mocked(Route.useParams).mockReturnValue({ id: 'user-1' })
  vi.clearAllMocks()
  server.use(http.get(`${API_BASE}/users/user-1`, () => HttpResponse.json({ user: mockUser })))
})

describe('UserDetailPage — renderização', () => {
  it('renderiza dados do usuário', async () => {
    render(<UserDetailPage />, { wrapper: createWrapper() })

    await waitFor(() => expect(screen.getAllByText('Alice Silva').length).toBeGreaterThan(0))
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('user-1')).toBeInTheDocument()
  })
})

describe('UserDetailPage — edição', () => {
  it('botão Editar exibe formulário inline', async () => {
    render(<UserDetailPage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getAllByText('Alice Silva'))
    await userEvent.click(screen.getByRole('button', { name: /editar/i }))

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('submit chama PATCH /users/:id com os dados corretos', async () => {
    let patchBody: unknown
    server.use(
      http.patch(`${API_BASE}/users/user-1`, async ({ request }) => {
        patchBody = await request.json()
        return HttpResponse.json({ user: { ...mockUser, name: 'Novo Nome' } })
      }),
    )

    render(<UserDetailPage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getAllByText('Alice Silva'))
    await userEvent.click(screen.getByRole('button', { name: /editar/i }))
    await userEvent.clear(screen.getByLabelText('Nome'))
    await userEvent.type(screen.getByLabelText('Nome'), 'Novo Nome')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => expect(patchBody).toEqual({ name: 'Novo Nome', email: 'alice@test.com' }))
  })

  it('resposta 409 exibe erro inline no campo email', async () => {
    server.use(
      http.patch(`${API_BASE}/users/user-1`, () => HttpResponse.json(null, { status: 409 })),
    )

    render(<UserDetailPage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getAllByText('Alice Silva'))
    await userEvent.click(screen.getByRole('button', { name: /editar/i }))
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => expect(screen.getByText('Este email já está em uso')).toBeInTheDocument())
  })
})

describe('UserDetailPage — exclusão', () => {
  it('confirmar exclusão chama DELETE /users/:id e navega para /users', async () => {
    let deleteCalled = false
    server.use(
      http.delete(`${API_BASE}/users/user-1`, () => {
        deleteCalled = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    render(<UserDetailPage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getAllByText('Alice Silva'))
    await userEvent.click(screen.getByRole('button', { name: /excluir/i }))
    await userEvent.click(screen.getByRole('button', { name: /^excluir$/i }))

    await waitFor(() => expect(deleteCalled).toBe(true))
    expect(vi.mocked(router.navigate)).toHaveBeenCalledWith({ to: '/_layout/users/' })
  })
})

describe('UserDetailPage — alterar perfil', () => {
  it('confirmar novo role chama PATCH /users/:id/role', async () => {
    let roleBody: unknown
    server.use(
      http.patch(`${API_BASE}/users/user-1/role`, async ({ request }) => {
        roleBody = await request.json()
        return HttpResponse.json({ user: { ...mockUser, role: 'ADMIN' } })
      }),
    )

    render(<UserDetailPage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getAllByText('Alice Silva'))
    await userEvent.click(screen.getByRole('button', { name: /alterar perfil/i }))

    await waitFor(() => screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('combobox'))

    await waitFor(() => screen.getByRole('option', { name: 'Admin' }))
    fireEvent.click(screen.getByRole('option', { name: 'Admin' }))

    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    await waitFor(() => expect(roleBody).toEqual({ role: 'ADMIN' }))
  })
})

describe('UserDetailPage — usuário excluído', () => {
  it('botões de ação ficam ocultos quando deleted_at está preenchido', async () => {
    server.use(
      http.get(`${API_BASE}/users/user-1`, () =>
        HttpResponse.json({ user: { ...mockUser, deleted_at: '2024-06-01T00:00:00Z' } }),
      ),
    )

    render(<UserDetailPage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getAllByText('Alice Silva'))
    expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
  })
})
