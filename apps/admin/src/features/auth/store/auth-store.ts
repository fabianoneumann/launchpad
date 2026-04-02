import { create } from 'zustand'
import type { AuthUser } from '../types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setSession: (user: AuthUser, token: string) => void
  clearSession: () => void
  setToken: (token: string) => void
  updateName: (name: string) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setSession: (user, token) => set({ user, token, isAuthenticated: true }),
  clearSession: () => set({ user: null, token: null, isAuthenticated: false }),
  setToken: (token) => set({ token }),
  updateName: (name) => {
    const { user } = get()
    if (user) set({ user: { ...user, name } })
  },
}))
