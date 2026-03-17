import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'profile-john@test.com'

describe('Get Profile E2E', () => {
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

  it('should return 200 with user profile when authenticated', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })

    const { token } = loginResponse.body

    const response = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.user).toMatchObject({
      id: expect.any(String),
      email: testEmail,
    })
    expect(response.body.user.password_hash).toBeUndefined()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(app.server).get('/auth/me')

    expect(response.statusCode).toBe(401)
  })
})
