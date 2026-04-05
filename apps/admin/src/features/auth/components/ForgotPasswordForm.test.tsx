import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { createRoute } from '@tanstack/react-router'
import { server } from '@/mocks/node'
import { renderWithRouter, rootRoute } from '@/tests/router-test-utils'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))

const { ForgotPasswordForm } = await import('./ForgotPasswordForm')

function renderForm() {
  return renderWithRouter({
    initialPath: '/forgot-password',
    routes: [
      createRoute({
        getParentRoute: () => rootRoute,
        path: 'forgot-password',
        component: ForgotPasswordForm,
      }),
      createRoute({
        getParentRoute: () => rootRoute,
        path: 'login',
        component: () => null,
      }),
    ],
  })
}

const API_BASE = 'http://localhost:3333'

describe('ForgotPasswordForm — validação', () => {
  it('exibe erro de e-mail inválido sem chamar a API', async () => {
    let apiCalled = false
    server.use(
      http.post(`${API_BASE}/auth/password/forgot`, () => {
        apiCalled = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderForm()
    await userEvent.type(await screen.findByLabelText('E-mail'), 'nao-e-email')
    await userEvent.click(screen.getByRole('button', { name: /enviar instruções/i }))

    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    })
    expect(apiCalled).toBe(false)
  })
})

describe('ForgotPasswordForm — submit bem-sucedido', () => {
  it('renderiza estado de sucesso após submit válido', async () => {
    server.use(
      http.post(`${API_BASE}/auth/password/forgot`, () => {
        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderForm()
    await userEvent.type(await screen.findByLabelText('E-mail'), 'admin@test.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar instruções/i }))

    await waitFor(() => {
      expect(screen.getByText(/receberá as instruções/i)).toBeInTheDocument()
    })
    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument()
  })
})
