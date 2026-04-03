import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '@/lib/react-query/query-client'
import { changeUserRole } from '../api/users.api'
import type { User } from '../types'

export function useChangeUserRole(id: string) {
  return useMutation({
    mutationFn: (role: User['role']) => changeUserRole(id, role),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['users', id], { user })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Perfil alterado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao alterar perfil')
    },
  })
}
