import { api } from '@/lib/api/client'

export interface DashboardStats {
  total: number
  active: number
  unvalidated: number
  byRole: { ADMIN: number; MEMBER: number; USER: number }
}

export async function getDashboardStats() {
  const { data } = await api.get<DashboardStats>('/users/stats')
  return data
}
