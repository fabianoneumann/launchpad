import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'logout-john@test.com'

describe('Logout E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await request(app.server).post('/auth/register').send({
      name: 'John Doe',
      email: testEmail,
      password: '123456',
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await app.close()
  })

  it('should return 204 and clear the refresh token cookie', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })

    const cookies = loginResponse.headers['set-cookie']

    const response = await request(app.server)
      .delete('/auth/logout')
      .set('Cookie', cookies)

    expect(response.statusCode).toBe(204)

    const setCookieHeader = response.headers['set-cookie'] as unknown as
      | string[]
      | undefined
    const clearedCookie = setCookieHeader?.find((c) =>
      c.includes('refreshToken=;'),
    )
    expect(clearedCookie).toBeDefined()
  })
})
