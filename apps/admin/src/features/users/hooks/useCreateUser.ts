import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '@/lib/react-query/query-client'
import { createUser } from '../api/users.api'

export function useCreateUser() {
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário criado. Um convite foi enviado para o e-mail cadastrado.')
    },
  })
}
