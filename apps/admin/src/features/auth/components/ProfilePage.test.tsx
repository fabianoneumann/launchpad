import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { server } from '@/mocks/node'
import { useAuthStore } from '@/features/auth/store/auth-store'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))

import { router } from '@/app/router'
const { ProfilePage } = await import('./ProfilePage')

const API_BASE = 'http://localhost:3333'

const defaultAdmin = {
  id: '1',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'ADMIN' as const,
  locale: 'pt-BR',
  validated_at: '2024-01-01T00:00:00Z',
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
  useAuthStore.setState({ user: defaultAdmin, token: 'tok', isAuthenticated: true })
  vi.clearAllMocks()
})

describe('ProfilePage — renderização', () => {
  it('renderiza dados do usuário nos formulários', async () => {
    render(<ProfilePage />, { wrapper: createWrapper() })

    await waitFor(() => expect(screen.getByDisplayValue('Admin')).toBeInTheDocument())
    expect(screen.getByDisplayValue('admin@test.com')).toBeInTheDocument()
  })
})

describe('ProfilePage — atualização de perfil', () => {
  it('atualizar nome chama PATCH /auth/me e atualiza o store', async () => {
    server.use(
      http.patch(`${API_BASE}/auth/me`, async ({ request }) => {
        const body = (await request.json()) as { name: string }
        return HttpResponse.json({ user: { ...defaultAdmin, name: body.name } })
      }),
    )

    render(<ProfilePage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getByDisplayValue('Admin'))
    await userEvent.clear(screen.getByLabelText('Nome'))
    await userEvent.type(screen.getByLabelText('Nome'), 'Novo Nome')
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))

    await waitFor(() => expect(useAuthStore.getState().user?.name).toBe('Novo Nome'))
  })
})

describe('ProfilePage — alterar senha', () => {
  it('senhas não coincidem exibe erro inline sem chamar a API', async () => {
    let apiCalled = false
    server.use(
      http.patch(`${API_BASE}/auth/me/password`, () => {
        apiCalled = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    render(<ProfilePage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getByDisplayValue('Admin'))
    await userEvent.type(screen.getByLabelText('Nova senha'), 'senha123')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'senhadiferente')
    await userEvent.click(screen.getByRole('button', { name: /alterar senha/i }))

    await waitFor(() => expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument())
    expect(apiCalled).toBe(false)
  })

  it('senha atual incorreta retorna 401 e exibe erro inline', async () => {
    server.use(
      http.patch(`${API_BASE}/auth/me/password`, () => HttpResponse.json(null, { status: 401 })),
    )

    render(<ProfilePage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getByDisplayValue('Admin'))
    await userEvent.type(screen.getByLabelText('Senha atual'), 'errada')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'nova123')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'nova123')
    await userEvent.click(screen.getByRole('button', { name: /alterar senha/i }))

    await waitFor(() => expect(screen.getByText('Senha atual incorreta')).toBeInTheDocument())
  })

  it('troca de senha com sucesso limpa sessão e navega para /login', async () => {
    server.use(
      http.patch(`${API_BASE}/auth/me/password`, () => new HttpResponse(null, { status: 204 })),
    )

    render(<ProfilePage />, { wrapper: createWrapper() })

    await waitFor(() => screen.getByDisplayValue('Admin'))
    await userEvent.type(screen.getByLabelText('Senha atual'), 'senhaatual')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'nova123')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'nova123')
    await userEvent.click(screen.getByRole('button', { name: /alterar senha/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(vi.mocked(router.navigate)).toHaveBeenCalledWith({ to: '/login' })
    })
  })
})
