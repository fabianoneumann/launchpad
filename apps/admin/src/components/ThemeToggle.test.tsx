import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockSetTheme = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}))

import { useTheme } from 'next-themes'
const { ThemeToggle } = await import('./ThemeToggle')

describe('ThemeToggle', () => {
  it('clique quando tema é "light" chama setTheme("dark")', async () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: mockSetTheme } as ReturnType<
      typeof useTheme
    >)
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('clique quando tema é "dark" chama setTheme("light")', async () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', setTheme: mockSetTheme } as ReturnType<
      typeof useTheme
    >)
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
