import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { AppShell } from '@/components/layout/AppShell'
import { api } from '@/lib/api/client'
import type { AuthUser } from '@/features/auth/types'

export const Route = createFileRoute('/_layout')({
  beforeLoad: async ({ location }) => {
    if (useAuthStore.getState().isAuthenticated) return

    try {
      const { data: tokenData } = await api.patch<{ token: string; user: AuthUser }>('/auth/token/refresh')
      useAuthStore.getState().setSession(tokenData.user, tokenData.token)
    } catch {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AppShell,
})
