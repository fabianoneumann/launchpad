import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'forgot-pw-test@test.com'

describe('Forgot Password E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await prisma.user.create({
      data: {
        name: 'Forgot PW User',
        email: testEmail,
        password_hash: 'hashed',
      },
    })
  })

  afterAll(async () => {
    await prisma.passwordResetToken.deleteMany({
      where: { user: { email: testEmail } },
    })
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await app.close()
  })

  it('should return 204 when email exists', async () => {
    const response = await request(app.server)
      .post('/auth/password/forgot')
      .send({ email: testEmail })

    expect(response.statusCode).toBe(204)
  })

  it('should return 204 when email does not exist (no reveal)', async () => {
    const response = await request(app.server)
      .post('/auth/password/forgot')
      .send({ email: 'nonexistent@test.com' })

    expect(response.statusCode).toBe(204)
  })

  it('should return 400 when body is invalid', async () => {
    const response = await request(app.server)
      .post('/auth/password/forgot')
      .send({ email: 'not-an-email' })

    expect(response.statusCode).toBe(400)
  })
})
