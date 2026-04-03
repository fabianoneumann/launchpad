import { createFileRoute } from '@tanstack/react-router'
import { UserDetailPage } from '@/features/users/components/UserDetailPage'

export const Route = createFileRoute('/_layout/users/$id')({
  component: UserDetailPage,
})
