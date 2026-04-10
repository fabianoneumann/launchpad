import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { AuthUser } from '@/features/auth/types'

vi.mock('@/app/router', () => ({
  router: { navigate: vi.fn() },
}))

// Import after mock to get the mocked version
const { router } = await import('@/app/router')
const { api } = await import('./client')

const API_BASE = 'http://localhost:3333'

const mockUser: AuthUser = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@test.com',
  role: 'ADMIN',
  locale: 'pt-BR',
}

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
  vi.clearAllMocks()
})

describe('request interceptor', () => {
  it('injects Authorization header when token is set', async () => {
    let capturedAuth: string | null = null

    server.use(
      http.get(`${API_BASE}/api/data`, ({ request }) => {
        capturedAuth = request.headers.get('Authorization')
        return HttpResponse.json({ data: 'ok' })
      }),
    )

    useAuthStore.getState().setSession(mockUser, 'my-token')
    await api.get('/api/data')

    expect(capturedAuth).toBe('Bearer my-token')
  })

  it('does not inject Authorization header when no token', async () => {
    let capturedAuth: string | null = 'not-checked'

    server.use(
      http.get(`${API_BASE}/api/data`, ({ request }) => {
        capturedAuth = request.headers.get('Authorization')
        return HttpResponse.json({ data: 'ok' })
      }),
    )

    await api.get('/api/data')

    expect(capturedAuth).toBeNull()
  })
})

describe('response interceptor — 401 with refresh success', () => {
  it('retries original request with new token after successful refresh', async () => {
    let dataCallCount = 0

    server.use(
      http.get(`${API_BASE}/api/protected`, () => {
        dataCallCount++
        if (dataCallCount === 1) return HttpResponse.json(null, { status: 401 })
        return HttpResponse.json({ data: 'ok' })
      }),
      http.patch(`${API_BASE}/auth/token/refresh`, () => {
        return HttpResponse.json({ token: 'refreshed-token' })
      }),
    )

    useAuthStore.getState().setSession(mockUser, 'old-token')
    const response = await api.get('/api/protected')

    expect(response.data).toEqual({ data: 'ok' })
    expect(useAuthStore.getState().token).toBe('refreshed-token')
    expect(dataCallCount).toBe(2)
  })
})

describe('response interceptor — 401 with refresh failure', () => {
  it('calls clearSession and navigates to /login when refresh fails', async () => {
    server.use(
      http.get(`${API_BASE}/api/protected`, () => {
        return HttpResponse.json(null, { status: 401 })
      }),
      http.patch(`${API_BASE}/auth/token/refresh`, () => {
        return HttpResponse.json(null, { status: 401 })
      }),
    )

    useAuthStore.getState().setSession(mockUser, 'old-token')

    await expect(api.get('/api/protected')).rejects.toThrow()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()
    expect(router.navigate).toHaveBeenCalledWith({ to: '/login' })
  })
})

describe('response interceptor — SKIP_REFRESH_URLS', () => {
  it('propagates 401 directly without attempting refresh for /auth/me/password', async () => {
    let refreshCalled = false

    server.use(
      http.patch(`${API_BASE}/auth/me/password`, () => {
        return HttpResponse.json(null, { status: 401 })
      }),
      http.patch(`${API_BASE}/auth/token/refresh`, () => {
        refreshCalled = true
        return HttpResponse.json({ token: 'new-token' })
      }),
    )

    useAuthStore.getState().setSession(mockUser, 'my-token')

    await expect(api.patch('/auth/me/password')).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(refreshCalled).toBe(false)
  })
})
