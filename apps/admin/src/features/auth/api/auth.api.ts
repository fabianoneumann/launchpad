import { api } from '@/lib/api/client'
import type { AuthUser } from '../types'

export async function loginAdmin(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/admin/login', {
    email,
    password,
  })
  return data
}

export async function getProfile() {
  const { data } = await api.get<{ user: AuthUser }>('/auth/me')
  return data
}

export async function logoutAdmin() {
  await api.delete('/auth/logout')
}

export async function forgotPassword(email: string) {
  await api.post('/auth/password/forgot', { email })
}
