import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AxiosError } from 'axios'

vi.mock('@/app/router', () => ({ router: { navigate: vi.fn() } }))
vi.mock('../hooks/useProfile')
vi.mock('../hooks/useUpdateProfile')
vi.mock('../hooks/useChangePassword')

import { useProfile } from '../hooks/useProfile'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import { useChangePassword } from '../hooks/useChangePassword'
const { ProfilePage } = await import('./ProfilePage')

const mockUser = {
  id: '1',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'ADMIN' as const,
}

function mockHooks(overrides?: {
  updateMutate?: ReturnType<typeof vi.fn>
  changeMutate?: ReturnType<typeof vi.fn>
}) {
  vi.mocked(useProfile).mockReturnValue({
    data: { user: mockUser },
    isLoading: false,
  } as ReturnType<typeof useProfile>)

  vi.mocked(useUpdateProfile).mockReturnValue({
    mutate: overrides?.updateMutate ?? vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useUpdateProfile>)

  vi.mocked(useChangePassword).mockReturnValue({
    mutate: overrides?.changeMutate ?? vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useChangePassword>)
}

describe('ProfilePage — renderização', () => {
  it('renderiza dados do usuário nos formulários', () => {
    mockHooks()

    render(<ProfilePage />)

    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument()
    expect(screen.getByDisplayValue('admin@test.com')).toBeInTheDocument()
  })
})

describe('ProfilePage — atualização de perfil', () => {
  it('chama mutate com o nome ao submeter o formulário de perfil', async () => {
    const updateMutate = vi.fn()
    mockHooks({ updateMutate })

    render(<ProfilePage />)

    const nameInput = screen.getByLabelText('Nome')
    fireEvent.change(nameInput, { target: { value: 'Novo Nome' } })

    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    await waitFor(() => {
      expect(updateMutate).toHaveBeenCalledWith({ name: 'Novo Nome' })
    })
  })
})

describe('ProfilePage — alterar senha', () => {
  it('exibe erro inline quando mutate retorna 401', async () => {
    const changeMutate = vi.fn().mockImplementation((_data, options) => {
      const error = new AxiosError('Unauthorized')
      error.response = { status: 401 } as AxiosError['response']
      options?.onError?.(error)
    })
    mockHooks({ changeMutate })

    render(<ProfilePage />)

    fireEvent.change(screen.getByLabelText('Senha atual'), {
      target: { value: 'senhaerrada' },
    })
    fireEvent.change(screen.getByLabelText('Nova senha'), {
      target: { value: 'novasenha' },
    })
    fireEvent.change(screen.getByLabelText('Confirmar nova senha'), {
      target: { value: 'novasenha' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Alterar senha' }))

    await waitFor(() => {
      expect(screen.getByText('Senha atual incorreta')).toBeInTheDocument()
    })
  })
})
