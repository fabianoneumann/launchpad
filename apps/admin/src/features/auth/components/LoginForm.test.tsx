import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { useAuthStore } from '@/features/auth/store/auth-store'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

const { router } = await import('@/app/router')
const { toast } = await import('sonner')
const { LoginForm } = await import('./LoginForm')

const API_BASE = 'http://localhost:3333'

const mockUser = { id: 'u1', name: 'Admin', email: 'admin@test.com', role: 'ADMIN' as const }

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
  vi.clearAllMocks()
})

describe('LoginForm — validação', () => {
  it('exibe erro de e-mail inválido sem chamar a API', async () => {
    let apiCalled = false
    server.use(
      http.post(`${API_BASE}/auth/admin/login`, () => {
        apiCalled = true
        return HttpResponse.json({ token: 'tok', user: mockUser })
      }),
    )

    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'nao-e-email')
    await userEvent.type(screen.getByLabelText('Senha'), '123456')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    })
    expect(apiCalled).toBe(false)
  })

  it('exibe erro de senha curta', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'admin@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), '123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument()
    })
  })
})

describe('LoginForm — submit bem-sucedido', () => {
  it('chama setSession e navega para /dashboard', async () => {
    server.use(
      http.post(`${API_BASE}/auth/admin/login`, () => {
        return HttpResponse.json({ token: 'my-token', user: mockUser })
      }),
    )

    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'admin@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), '123456')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().token).toBe('my-token')
      expect(useAuthStore.getState().user).toEqual(mockUser)
    })
    expect(router.navigate).toHaveBeenCalledWith({ to: '/dashboard' })
  })
})

describe('LoginForm — credenciais inválidas', () => {
  it('exibe toast de erro e não navega quando a API retorna 401', async () => {
    server.use(
      http.post(`${API_BASE}/auth/admin/login`, () => {
        return HttpResponse.json(null, { status: 401 })
      }),
    )

    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'admin@test.com')
    await userEvent.type(screen.getByLabelText('Senha'), '123456')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciais inválidas')
    })
    expect(router.navigate).not.toHaveBeenCalled()
  })
})
