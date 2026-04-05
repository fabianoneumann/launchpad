import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { TopBar } from './TopBar'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}))

const defaultProps = { onMenuClick: vi.fn() }

afterEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
})

describe('TopBar', () => {
  it('exibe o nome do usuário autenticado', () => {
    useAuthStore.setState({
      user: { id: '1', name: 'Alice Silva', email: 'alice@test.com', role: 'ADMIN' },
      token: 'tok',
      isAuthenticated: true,
    })
    render(<TopBar {...defaultProps} />)
    expect(screen.getByText('Alice Silva')).toBeInTheDocument()
  })

  it('exibe as iniciais corretas no avatar', () => {
    useAuthStore.setState({
      user: { id: '1', name: 'Alice Silva', email: 'alice@test.com', role: 'ADMIN' },
      token: 'tok',
      isAuthenticated: true,
    })
    render(<TopBar {...defaultProps} />)
    expect(screen.getByText('AS')).toBeInTheDocument()
  })

  it('exibe fallback "AD" e "Admin" quando user é null', () => {
    render(<TopBar {...defaultProps} />)
    expect(screen.getByText('AD')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
