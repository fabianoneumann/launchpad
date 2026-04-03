import { useQuery } from '@tanstack/react-query'
import { listUsers } from '../api/users.api'

interface UseUsersParams {
  page: number
  perPage: number
  role?: 'ADMIN' | 'MEMBER' | 'USER'
  search?: string
  status: 'active' | 'deleted' | 'all'
}

export function useUsers({ page, perPage, role, search, status }: UseUsersParams) {
  return useQuery({
    queryKey: ['users', { page, perPage, role, search, status }],
    queryFn: () =>
      listUsers({
        page,
        perPage,
        role,
        search,
        showDeleted: status === 'all' || status === 'deleted',
        onlyDeleted: status === 'deleted',
      }),
  })
}
