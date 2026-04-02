import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginForm,
})
