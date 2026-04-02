import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))

const { ForgotPasswordForm } = await import('./ForgotPasswordForm')

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

    render(<ForgotPasswordForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'nao-e-email')
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

    render(<ForgotPasswordForm />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'admin@test.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar instruções/i }))

    await waitFor(() => {
      expect(screen.getByText(/receberá as instruções/i)).toBeInTheDocument()
    })
    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument()
  })
})
