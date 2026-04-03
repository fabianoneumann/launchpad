import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('@/app/routes/_layout/users/$id', () => ({
  Route: { useParams: vi.fn() },
}))
vi.mock('../hooks/useUser')
vi.mock('../hooks/useUpdateUser')
vi.mock('../hooks/useChangeUserRole')
vi.mock('../hooks/useDeleteUser')

import { Route } from '@/app/routes/_layout/users/$id'
import { useUser } from '../hooks/useUser'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { useChangeUserRole } from '../hooks/useChangeUserRole'
import { useDeleteUser } from '../hooks/useDeleteUser'
const { UserDetailPage } = await import('./UserDetailPage')

const mockUser = {
  id: 'user-1',
  name: 'Alice Silva',
  email: 'alice@test.com',
  role: 'MEMBER' as const,
  locale: 'pt-BR',
  validated_at: null,
  deleted_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

function mockHooks() {
  vi.mocked(Route.useParams).mockReturnValue({ id: 'user-1' })
  vi.mocked(useUser).mockReturnValue({
    data: { user: mockUser },
    isLoading: false,
  } as ReturnType<typeof useUser>)
  vi.mocked(useUpdateUser).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useUpdateUser>)
  vi.mocked(useChangeUserRole).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useChangeUserRole>)
  vi.mocked(useDeleteUser).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useDeleteUser>)
}

describe('UserDetailPage — renderização', () => {
  it('renderiza dados do usuário', () => {
    mockHooks()

    render(<UserDetailPage />)

    expect(screen.getAllByText('Alice Silva').length).toBeGreaterThan(0)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('user-1')).toBeInTheDocument()
  })
})

describe('UserDetailPage — exclusão', () => {
  it('botão Excluir abre o diálogo de confirmação', () => {
    mockHooks()

    render(<UserDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: /excluir/i }))

    expect(screen.getByText('Tem certeza que deseja excluir Alice Silva?')).toBeInTheDocument()
  })
})
