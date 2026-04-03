import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  title: 'Confirmar ação',
  description: 'Tem certeza que deseja continuar?',
  onConfirm: vi.fn(),
}

describe('ConfirmDialog', () => {
  it('renderiza título e descrição', () => {
    render(<ConfirmDialog {...defaultProps} />)

    expect(screen.getByText('Confirmar ação')).toBeInTheDocument()
    expect(screen.getByText('Tem certeza que deseja continuar?')).toBeInTheDocument()
  })

  it('chama onConfirm ao clicar no botão de confirmação', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)

    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('não chama onConfirm ao cancelar', async () => {
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} onOpenChange={onOpenChange} />)

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onConfirm).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
