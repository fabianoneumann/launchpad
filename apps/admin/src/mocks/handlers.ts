import { http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:3333'

const defaultAdmin = {
  id: '1',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'ADMIN' as const,
  locale: 'pt-BR',
  validated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const handlers = [
  http.get(`${API_BASE}/auth/me`, () => HttpResponse.json({ user: defaultAdmin })),
  http.get(`${API_BASE}/users`, () => HttpResponse.json({ users: [], total: 0 })),
  http.get(`${API_BASE}/users/stats`, () =>
    HttpResponse.json({
      total: 0,
      active: 0,
      unvalidated: 0,
      byRole: { ADMIN: 0, MEMBER: 0, USER: 0 },
    }),
  ),
]
