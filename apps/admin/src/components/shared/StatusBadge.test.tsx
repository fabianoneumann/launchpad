import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renderiza "Ativo" quando deletedAt é null', () => {
    render(<StatusBadge deletedAt={null} />)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('renderiza "Deletado" quando deletedAt está preenchido', () => {
    render(<StatusBadge deletedAt="2024-06-01T00:00:00Z" />)
    expect(screen.getByText('Deletado')).toBeInTheDocument()
  })
})
