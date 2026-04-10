import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth-store'
import type { AuthUser } from '../types'

const mockUser: AuthUser = {
  id: 'user-1',
  name: 'Alice',
  email: 'alice@test.com',
  role: 'ADMIN',
  locale: 'pt-BR',
}

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
})

describe('useAuthStore', () => {
  it('starts with empty session', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('setSession populates user, token and sets isAuthenticated to true', () => {
    useAuthStore.getState().setSession(mockUser, 'my-token')

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe('my-token')
    expect(state.isAuthenticated).toBe(true)
  })

  it('clearSession resets everything to empty', () => {
    useAuthStore.getState().setSession(mockUser, 'my-token')
    useAuthStore.getState().clearSession()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('setToken updates only the token, leaving user and isAuthenticated intact', () => {
    useAuthStore.getState().setSession(mockUser, 'old-token')
    useAuthStore.getState().setToken('new-token')

    const state = useAuthStore.getState()
    expect(state.token).toBe('new-token')
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('updateName updates only user.name, leaving other fields intact', () => {
    useAuthStore.getState().setSession(mockUser, 'my-token')
    useAuthStore.getState().updateName('Bob')

    const state = useAuthStore.getState()
    expect(state.user?.name).toBe('Bob')
    expect(state.user?.id).toBe(mockUser.id)
    expect(state.user?.email).toBe(mockUser.email)
    expect(state.user?.role).toBe(mockUser.role)
    expect(state.token).toBe('my-token')
    expect(state.isAuthenticated).toBe(true)
  })

  it('updateName does nothing when user is null', () => {
    useAuthStore.getState().updateName('Bob')
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('state is readable outside React components via getState()', () => {
    useAuthStore.getState().setSession(mockUser, 'my-token')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
