import { useQuery } from '@tanstack/react-query'
import { listUsers } from '@/features/users/api/users.api'

export function useRecentUsers() {
  return useQuery({
    queryKey: ['dashboard', 'recent-users'],
    queryFn: () => listUsers({ page: 1, perPage: 5, showDeleted: false }),
  })
}
