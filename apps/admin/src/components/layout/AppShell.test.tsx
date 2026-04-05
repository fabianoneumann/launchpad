import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/features/auth/store/auth-store'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}))
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
  Outlet: () => null,
}))
vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('@/features/auth/api/auth.api', () => ({
  logoutAdmin: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/api/client', () => ({ api: {} }))

const { AppShell } = await import('./AppShell')

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
})

describe('AppShell', () => {
  it('sidebar móvel está fechada por padrão', () => {
    render(<AppShell />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('clique no botão de menu abre a sidebar móvel', async () => {
    render(<AppShell />)
    // o botão de menu é o único com classe lg:hidden
    const menuBtn = screen.getAllByRole('button').find((b) => b.classList.contains('lg:hidden'))!
    await userEvent.click(menuBtn)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
