import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '@/lib/react-query/query-client'
import { deleteUser } from '../api/users.api'

export function useDeleteUser() {
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário excluído com sucesso')
    },
    onError: () => {
      toast.error('Erro ao excluir usuário')
    },
  })
}
