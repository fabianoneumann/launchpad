import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { UsersPage } from '@/features/users/components/UsersPage'

export const Route = createFileRoute('/_layout/users/')({
  validateSearch: z.object({
    page: z.number().int().positive().catch(1),
    perPage: z.number().int().positive().catch(10),
    role: z.enum(['ADMIN', 'MEMBER', 'USER']).optional().catch(undefined),
    search: z.string().optional().catch(undefined),
    status: z.enum(['active', 'deleted', 'all']).catch('active'),
  }),
  component: UsersPage,
})
