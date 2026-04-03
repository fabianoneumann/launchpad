import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

export const Route = createFileRoute('/reset-password')({
  validateSearch: z.object({
    token: z.string().catch(''),
  }),
  component: ResetPasswordForm,
})
