import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { createRoute } from '@tanstack/react-router'
import { server } from '@/mocks/node'
import { renderWithRouter, rootRoute } from '@/tests/router-test-utils'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('@/app/routes/reset-password', () => ({
  Route: { useSearch: vi.fn() },
}))

import { Route } from '@/app/routes/reset-password'
const { ResetPasswordForm } = await import('./ResetPasswordForm')

function renderForm() {
  return renderWithRouter({
    initialPath: '/reset-password',
    routes: [
      createRoute({
        getParentRoute: () => rootRoute,
        path: 'reset-password',
        component: ResetPasswordForm,
      }),
      createRoute({
        getParentRoute: () => rootRoute,
        path: 'login',
        component: () => null,
      }),
      createRoute({
        getParentRoute: () => rootRoute,
        path: 'forgot-password',
        component: () => null,
      }),
    ],
  })
}

const API_BASE = 'http://localhost:3333'

describe('ResetPasswordForm — token ausente', () => {
  it('exibe estado de erro sem chamar a API', async () => {
    let apiCalled = false
    server.use(
      http.patch(`${API_BASE}/auth/password/reset`, () => {
        apiCalled = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    vi.mocked(Route.useSearch).mockReturnValue({ token: '' })
    renderForm()

    await waitFor(() => expect(screen.getByText(/inválido ou expirado/i)).toBeInTheDocument())
    expect(apiCalled).toBe(false)
  })
})

describe('ResetPasswordForm — validação', () => {
  it('exibe erro de senha muito curta sem chamar a API', async () => {
    let apiCalled = false
    server.use(
      http.patch(`${API_BASE}/auth/password/reset`, () => {
        apiCalled = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    vi.mocked(Route.useSearch).mockReturnValue({ token: 'valid-token' })
    renderForm()

    await userEvent.type(await screen.findByLabelText('Nova senha'), '1234567')
    await userEvent.type(screen.getByLabelText('Confirmar senha'), '1234567')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))

    await waitFor(() => {
      expect(screen.getByText(/mínimo de 8 caracteres/i)).toBeInTheDocument()
    })
    expect(apiCalled).toBe(false)
  })

  it('exibe erro quando as senhas não conferem', async () => {
    let apiCalled = false
    server.use(
      http.patch(`${API_BASE}/auth/password/reset`, () => {
        apiCalled = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    vi.mocked(Route.useSearch).mockReturnValue({ token: 'valid-token' })
    renderForm()

    await userEvent.type(await screen.findByLabelText('Nova senha'), 'minhasenha123')
    await userEvent.type(screen.getByLabelText('Confirmar senha'), 'senhadiferente')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))

    await waitFor(() => {
      expect(screen.getByText(/não conferem/i)).toBeInTheDocument()
    })
    expect(apiCalled).toBe(false)
  })
})

describe('ResetPasswordForm — submit bem-sucedido', () => {
  it('renderiza estado de sucesso após submit válido', async () => {
    server.use(
      http.patch(`${API_BASE}/auth/password/reset`, () => {
        return new HttpResponse(null, { status: 204 })
      }),
    )

    vi.mocked(Route.useSearch).mockReturnValue({ token: 'valid-token' })
    renderForm()

    await userEvent.type(await screen.findByLabelText('Nova senha'), 'minhasenha123')
    await userEvent.type(screen.getByLabelText('Confirmar senha'), 'minhasenha123')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))

    await waitFor(() => {
      expect(screen.getByText(/Sua senha foi redefinida/i)).toBeInTheDocument()
    })
    expect(screen.queryByLabelText('Nova senha')).not.toBeInTheDocument()
  })
})

describe('ResetPasswordForm — token inválido na API', () => {
  it('renderiza estado de erro quando API retorna 400', async () => {
    server.use(
      http.patch(`${API_BASE}/auth/password/reset`, () => {
        return new HttpResponse(null, { status: 400 })
      }),
    )

    vi.mocked(Route.useSearch).mockReturnValue({ token: 'expired-token' })
    renderForm()

    await userEvent.type(await screen.findByLabelText('Nova senha'), 'minhasenha123')
    await userEvent.type(screen.getByLabelText('Confirmar senha'), 'minhasenha123')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))

    await waitFor(() => {
      expect(screen.getByText(/inválido ou expirado/i)).toBeInTheDocument()
    })
  })
})
