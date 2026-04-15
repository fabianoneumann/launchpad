import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { verifyJWTOptional } from './verify-jwt-optional'

const testEmail = 'optional-jwt@test.com'

// Rota de teste mínima registrada antes de app.ready()
app.get('/test/optional-auth', { onRequest: [verifyJWTOptional] }, async (req, reply) => {
  return reply.status(200).send({ authenticated: !!req.user, user: req.user ?? null })
})

describe('verifyJWTOptional E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await request(app.server).post('/auth/register').send({
      name: 'Optional JWT User',
      email: testEmail,
      password: '123456',
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await app.close()
  })

  it('should return 200 without token and not populate request.user', async () => {
    const response = await request(app.server).get('/test/optional-auth')

    expect(response.statusCode).toBe(200)
    expect(response.body.authenticated).toBe(false)
    expect(response.body.user).toBeNull()
  })

  it('should return 200 with valid token and populate request.user', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })
    const { token } = loginResponse.body

    const response = await request(app.server)
      .get('/test/optional-auth')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.authenticated).toBe(true)
    expect(response.body.user).toMatchObject({
      sub: expect.any(String),
      role: 'USER',
    })
  })

  it('should return 200 with revoked token (after logout) and not populate request.user', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })
    const { token } = loginResponse.body
    const cookies = loginResponse.headers['set-cookie']

    await request(app.server)
      .delete('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)

    const response = await request(app.server)
      .get('/test/optional-auth')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.authenticated).toBe(false)
    expect(response.body.user).toBeNull()
  })
})
