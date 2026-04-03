import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('@/app/routes/_layout/users/', () => ({
  Route: { useSearch: vi.fn() },
}))
vi.mock('../hooks/useUsers')

import { Route } from '@/app/routes/_layout/users/'
import { useUsers } from '../hooks/useUsers'
const { UsersPage } = await import('./UsersPage')

const defaultSearch = {
  page: 1,
  perPage: 10,
  role: undefined,
  search: undefined,
  status: 'active' as const,
}

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
}

const mockUser = {
  id: '1',
  name: 'Alice Silva',
  email: 'alice@test.com',
  role: 'ADMIN' as const,
  locale: 'pt-BR',
  validated_at: null,
  deleted_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('UsersPage — renderização', () => {
  it('renderiza dados da tabela vindos do hook', () => {
    vi.mocked(Route.useSearch).mockReturnValue(defaultSearch)
    vi.mocked(useUsers).mockReturnValue({
      data: { users: [mockUser], total: 1 },
      isLoading: false,
    } as ReturnType<typeof useUsers>)

    render(<UsersPage />, { wrapper })

    expect(screen.getByText('Alice Silva')).toBeInTheDocument()
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })

  it('exibe skeleton quando isLoading=true', () => {
    vi.mocked(Route.useSearch).mockReturnValue(defaultSearch)
    vi.mocked(useUsers).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useUsers>)

    render(<UsersPage />, { wrapper })

    expect(screen.queryByText('Alice Silva')).not.toBeInTheDocument()
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
