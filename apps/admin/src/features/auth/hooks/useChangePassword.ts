import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { router } from '@/app/router'
import { changePassword } from '../api/auth.api'
import { useAuthStore } from '../store/auth-store'

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      useAuthStore.getState().clearSession()
      router.navigate({ to: '/login' })
    },
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status !== 401) {
        toast.error('Erro ao alterar senha')
      }
    },
  })
}
