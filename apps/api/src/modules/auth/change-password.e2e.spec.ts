import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'change-password@test.com'

describe('Change Password E2E', () => {
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

  it('should return 204 when current password is correct', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: testEmail, password: '123456' })
    const { token } = loginResponse.body

    const response = await request(app.server)
      .patch('/auth/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: '123456', newPassword: 'new-password' })

    expect(response.statusCode).toBe(204)
  })

  it('should return 401 when current password is wrong', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: testEmail, password: 'new-password' })
    const { token } = loginResponse.body

    const response = await request(app.server)
      .patch('/auth/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'wrong-password', newPassword: 'another-password' })

    expect(response.statusCode).toBe(401)
  })

  it('should return 400 when new password is too short', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: testEmail, password: 'new-password' })
    const { token } = loginResponse.body

    const response = await request(app.server)
      .patch('/auth/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'new-password', newPassword: '123' })

    expect(response.statusCode).toBe(400)
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(app.server)
      .patch('/auth/me/password')
      .send({ currentPassword: '123456', newPassword: 'new-password' })

    expect(response.statusCode).toBe(401)
  })

  it('should invalidate the access token and refresh cookie after password change', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: testEmail, password: 'new-password' })
    const { token: oldToken } = loginResponse.body
    const oldCookies = loginResponse.headers['set-cookie']

    await request(app.server)
      .patch('/auth/me/password')
      .set('Authorization', `Bearer ${oldToken}`)
      .send({ currentPassword: 'new-password', newPassword: 'another-password' })

    const accessResponse = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${oldToken}`)

    expect(accessResponse.statusCode).toBe(401)

    const refreshResponse = await request(app.server)
      .patch('/auth/token/refresh')
      .set('Cookie', oldCookies)

    expect(refreshResponse.statusCode).toBe(401)
  })
})
