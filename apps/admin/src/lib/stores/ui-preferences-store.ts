import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIPreferencesState {
  usersPerPage: number
  setUsersPerPage: (n: number) => void
}

export const useUIPreferencesStore = create<UIPreferencesState>()(
  persist(
    (set) => ({
      usersPerPage: 20,
      setUsersPerPage: (n) => set({ usersPerPage: n }),
    }),
    { name: 'admin-ui-preferences' },
  ),
)
