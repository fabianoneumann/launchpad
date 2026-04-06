import { createFileRoute, redirect, isRedirect } from '@tanstack/react-router'
import { z } from 'zod'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { api } from '@/lib/api/client'
import type { AuthUser } from '@/features/auth/types'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ search }) => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }

    try {
      const { data: tokenData } = await api.patch<{ token: string; user: AuthUser }>('/auth/token/refresh')
      useAuthStore.getState().setSession(tokenData.user, tokenData.token)
      if (search.redirect?.startsWith('/')) {
        throw redirect({ href: search.redirect })
      } else {
        throw redirect({ to: '/dashboard' })
      }
    } catch (err) {
      if (isRedirect(err)) throw err
      // Refresh failed — show login form
    }
  },
  component: LoginForm,
})
