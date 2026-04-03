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

export async function getUser(id: string) {
  const { data } = await api.get<{ user: User }>(`/users/${id}`)
  return data
}

export async function updateUser(id: string, data: { name: string; email: string }) {
  const { data: res } = await api.patch<{ user: User }>(`/users/${id}`, data)
  return res
}

export async function changeUserRole(id: string, role: User['role']) {
  const { data } = await api.patch<{ user: User }>(`/users/${id}/role`, { role })
  return data
}
