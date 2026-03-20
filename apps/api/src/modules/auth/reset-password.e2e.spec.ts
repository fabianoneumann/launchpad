import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { randomBytes } from 'node:crypto'

const testEmail = 'reset-pw-test@test.com'

describe('Reset Password E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await prisma.user.create({
      data: {
        name: 'Reset PW User',
        email: testEmail,
        password_hash: await hash('old-password', 6),
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

  it('should return 204 when token is valid', async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: testEmail } })

    const token = randomBytes(32).toString('hex')
    await prisma.passwordResetToken.create({
      data: {
        token,
        user_id: user.id,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 2),
      },
    })

    const response = await request(app.server)
      .patch('/auth/password/reset')
      .send({ token, newPassword: 'new-password' })

    expect(response.statusCode).toBe(204)
  })

  it('should return 400 when token is invalid', async () => {
    const response = await request(app.server)
      .patch('/auth/password/reset')
      .send({ token: 'invalid-token', newPassword: 'new-password' })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when token is expired', async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: testEmail } })

    const token = randomBytes(32).toString('hex')
    await prisma.passwordResetToken.create({
      data: {
        token,
        user_id: user.id,
        expires_at: new Date(Date.now() - 1000),
      },
    })

    const response = await request(app.server)
      .patch('/auth/password/reset')
      .send({ token, newPassword: 'new-password' })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when body is invalid', async () => {
    const response = await request(app.server)
      .patch('/auth/password/reset')
      .send({ token: 'some-token', newPassword: '123' })

    expect(response.statusCode).toBe(400)
  })
})
