import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'resend-verify-john@test.com'

describe('Resend Verification Email E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: testEmail } })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await app.close()
  })

  it('should return 204 and create a new token when authenticated', async () => {
    await request(app.server).post('/auth/register').send({
      name: 'John Doe',
      email: testEmail,
      password: '123456',
    })

    const loginResponse = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })

    const { token } = loginResponse.body

    const response = await request(app.server)
      .post('/auth/email/verify/resend')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(204)

    const user = await prisma.user.findFirst({ where: { email: testEmail } })
    const tokens = await prisma.emailVerificationToken.findMany({
      where: { user_id: user!.id },
      orderBy: { created_at: 'asc' },
    })
    expect(tokens.length).toBeGreaterThanOrEqual(1)
    expect(tokens[tokens.length - 1].used_at).toBeNull()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(app.server).post('/auth/email/verify/resend')

    expect(response.statusCode).toBe(401)
  })
})
