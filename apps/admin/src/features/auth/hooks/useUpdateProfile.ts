import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateProfile } from '../api/auth.api'
import { useAuthStore } from '../store/auth-store'
import { queryClient } from '@/lib/react-query/query-client'

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: ({ user }) => {
      useAuthStore.getState().updateName(user.name)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Perfil atualizado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao atualizar perfil')
    },
  })
}
