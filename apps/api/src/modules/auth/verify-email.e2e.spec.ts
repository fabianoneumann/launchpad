import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createHash } from 'node:crypto'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

const testEmail = 'verify-email-john@test.com'
const expiredTestEmail = 'verify-email-expired@test.com'

describe('Verify Email E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: { in: [testEmail, expiredTestEmail] } } })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [testEmail, expiredTestEmail] } } })
    await app.close()
  })

  it('should return 204 and set validated_at with a valid token', async () => {
    const registerResponse = await request(app.server).post('/auth/register').send({
      name: 'John Doe',
      email: testEmail,
      password: '123456',
    })

    const userId = registerResponse.body.user.id

    await prisma.emailVerificationToken.create({
      data: {
        token_hash: sha256('e2e-valid-token'),
        user_id: userId,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    const response = await request(app.server)
      .get('/auth/email/verify')
      .query({ token: 'e2e-valid-token' })

    expect(response.statusCode).toBe(204)

    const user = await prisma.user.findUnique({ where: { id: userId } })
    expect(user!.validated_at).toBeInstanceOf(Date)
  })

  it('should return 400 when using an already used token', async () => {
    const response = await request(app.server)
      .get('/auth/email/verify')
      .query({ token: 'e2e-valid-token' })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 for an expired token', async () => {
    const registerResponse = await request(app.server).post('/auth/register').send({
      name: 'John Doe Expired',
      email: expiredTestEmail,
      password: '123456',
    })

    const userId = registerResponse.body.user.id

    await prisma.emailVerificationToken.create({
      data: {
        token_hash: sha256('e2e-expired-token'),
        user_id: userId,
        expires_at: new Date(Date.now() - 1000),
      },
    })

    const response = await request(app.server)
      .get('/auth/email/verify')
      .query({ token: 'e2e-expired-token' })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 for an invalid token', async () => {
    const response = await request(app.server)
      .get('/auth/email/verify')
      .query({ token: 'non-existent-token' })

    expect(response.statusCode).toBe(400)
  })
})
