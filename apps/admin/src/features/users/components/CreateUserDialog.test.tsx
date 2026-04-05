import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { server } from '@/mocks/node'
import { CreateUserDialog } from './CreateUserDialog'

const API_BASE = 'http://localhost:3333'

const mockUser = {
  id: 'user-2',
  name: 'Bob Costa',
  email: 'bob@test.com',
  role: 'USER' as const,
  locale: 'pt-BR',
  validated_at: new Date().toISOString(),
  deleted_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  )
}

function renderDialog(onOpenChange = vi.fn()) {
  return render(<CreateUserDialog open onOpenChange={onOpenChange} />, {
    wrapper: createWrapper(),
  })
}

describe('CreateUserDialog', () => {
  it('submit chama POST /users com os dados corretos', async () => {
    let body: unknown
    server.use(
      http.post(`${API_BASE}/users`, async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({ user: mockUser })
      }),
    )

    renderDialog()

    await userEvent.type(screen.getByLabelText('Nome'), 'Bob Costa')
    await userEvent.type(screen.getByLabelText('Email'), 'bob@test.com')

    await userEvent.click(screen.getByRole('button', { name: /criar/i }))

    await waitFor(() =>
      expect(body).toEqual({
        name: 'Bob Costa',
        email: 'bob@test.com',
        role: 'USER',
        locale: 'pt-BR',
      }),
    )
  })

  it('resposta 409 exibe erro inline no campo email', async () => {
    server.use(http.post(`${API_BASE}/users`, () => HttpResponse.json(null, { status: 409 })))

    renderDialog()

    await userEvent.type(screen.getByLabelText('Nome'), 'Bob Costa')
    await userEvent.type(screen.getByLabelText('Email'), 'bob@test.com')
    await userEvent.click(screen.getByRole('button', { name: /criar/i }))

    await waitFor(() => expect(screen.getByText('Este email já está em uso')).toBeInTheDocument())
  })

  it('campos obrigatórios e email inválido exibem erros de validação sem chamar a API', async () => {
    let postCalled = false
    server.use(
      http.post(`${API_BASE}/users`, () => {
        postCalled = true
        return HttpResponse.json({})
      }),
    )

    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: /criar/i }))

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter ao menos 2 caracteres')).toBeInTheDocument()
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
    })
    expect(postCalled).toBe(false)
  })

  it('sucesso fecha o dialog', async () => {
    const onOpenChange = vi.fn()
    server.use(http.post(`${API_BASE}/users`, () => HttpResponse.json({ user: mockUser })))

    renderDialog(onOpenChange)

    await userEvent.type(screen.getByLabelText('Nome'), 'Bob Costa')
    await userEvent.type(screen.getByLabelText('Email'), 'bob@test.com')
    await userEvent.click(screen.getByRole('button', { name: /criar/i }))

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })
})
