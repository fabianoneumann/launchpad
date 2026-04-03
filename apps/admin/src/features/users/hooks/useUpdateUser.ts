import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '@/lib/react-query/query-client'
import { updateUser } from '../api/users.api'

export function useUpdateUser(id: string) {
  return useMutation({
    mutationFn: (data: { name: string; email: string }) => updateUser(id, data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['users', id], { user })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário atualizado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao atualizar usuário')
    },
  })
}
