import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'update-profile@test.com'

describe('Update Profile E2E', () => {
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

  it('should return 200 with updated user when name is valid', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: testEmail, password: '123456' })
    const { token } = loginResponse.body

    const response = await request(app.server)
      .patch('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Updated' })

    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toBe('John Updated')
    expect(response.body.user.password_hash).toBeUndefined()
  })

  it('should return 400 when name is empty', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: testEmail, password: '123456' })
    const { token } = loginResponse.body

    const response = await request(app.server)
      .patch('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })

    expect(response.statusCode).toBe(400)
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(app.server).patch('/auth/me').send({ name: 'John Updated' })

    expect(response.statusCode).toBe(401)
  })
})
