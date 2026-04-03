import { api } from '@/lib/api/client'
import type { User } from '../types'

interface ListUsersParams {
  page: number
  perPage: number
  role?: 'ADMIN' | 'MEMBER' | 'USER'
  search?: string
  showDeleted?: boolean
  onlyDeleted?: boolean
}

export async function listUsers(params: ListUsersParams) {
  const { data } = await api.get<{ users: User[]; total: number }>('/users', { params })
  return data
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`)
}
