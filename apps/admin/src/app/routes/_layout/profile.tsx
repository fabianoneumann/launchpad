import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/auth/components/ProfilePage'

export const Route = createFileRoute('/_layout/profile')({
  component: ProfilePage,
})
