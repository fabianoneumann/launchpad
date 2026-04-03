import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../hooks/useDashboardStats')
vi.mock('../hooks/useRecentUsers')

import { useDashboardStats } from '../hooks/useDashboardStats'
import { useRecentUsers } from '../hooks/useRecentUsers'
const { DashboardPage } = await import('./DashboardPage')

describe('DashboardPage — renderização', () => {
  it('renderiza cards com valores vindos do hook', () => {
    vi.mocked(useDashboardStats).mockReturnValue({
      data: {
        total: 42,
        active: 38,
        unvalidated: 5,
        byRole: { ADMIN: 2, MEMBER: 10, USER: 26 },
      },
      isLoading: false,
    } as ReturnType<typeof useDashboardStats>)

    vi.mocked(useRecentUsers).mockReturnValue({
      data: { users: [], total: 0 },
      isLoading: false,
    } as ReturnType<typeof useRecentUsers>)

    render(<DashboardPage />)

    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('38')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
