import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { AuthUser } from '@/features/auth/types'
import type { ReactNode } from 'react'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('@/features/auth/api/auth.api', () => ({
  logoutAdmin: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/api/client', () => ({ api: {} }))
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    className,
  }: {
    children: ReactNode
    to: string
    className?: string
    activeProps?: unknown
  }) => <a className={className}>{children}</a>,
}))

const { router } = await import('@/app/router')
const { logoutAdmin } = await import('@/features/auth/api/auth.api')
const { Sidebar } = await import('./Sidebar')

const mockUser: AuthUser = {
  id: 'user-1',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'ADMIN',
  locale: 'pt-BR',
}

const defaultProps = { mobileOpen: false, onClose: vi.fn() }

beforeEach(() => {
  useAuthStore.setState({ user: mockUser, token: 'tok', isAuthenticated: true })
})

describe('Sidebar — logout', () => {
  it('clicar "Sair" abre o ConfirmDialog', async () => {
    render(<Sidebar {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /sair/i }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('confirmar chama clearSession e navega para /login', async () => {
    render(<Sidebar {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /sair/i }))
    await userEvent.click(screen.getByRole('button', { name: /^sair$/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
    expect(logoutAdmin).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith({ to: '/login' })
  })

  it('cancelar não chama clearSession', async () => {
    render(<Sidebar {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /sair/i }))
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(router.navigate).not.toHaveBeenCalled()
  })
})
