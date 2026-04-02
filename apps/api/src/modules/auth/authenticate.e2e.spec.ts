import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'auth-john@test.com'

describe('Authenticate E2E', () => {
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

  it('should return 200 and a token when credentials are valid', async () => {
    const response = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: { id: expect.any(String), email: testEmail, role: 'USER' },
    })
    expect(response.body.user).not.toHaveProperty('password_hash')
    expect(response.body.user).not.toHaveProperty('token_version')
    expect(response.headers['set-cookie']).toBeDefined()
  })

  it('should return 401 when credentials are invalid', async () => {
    const response = await request(app.server).post('/auth/login').send({
      email: 'nobody@test.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(401)
  })
})
