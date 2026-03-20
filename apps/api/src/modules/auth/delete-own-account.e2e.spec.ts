import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'delete-account@test.com'
const secondEmail = 'delete-account-2@test.com'

describe('Delete Own Account E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: { in: [testEmail, secondEmail] } } })
    await request(app.server).post('/auth/register').send({
      name: 'John Doe',
      email: testEmail,
      password: '123456',
    })
    await request(app.server).post('/auth/register').send({
      name: 'Jane Doe',
      email: secondEmail,
      password: '123456',
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [testEmail, secondEmail] } } })
    await app.close()
  })

  it('should return 204 when authenticated user deletes own account', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: testEmail, password: '123456' })
    const { token } = loginResponse.body

    const response = await request(app.server)
      .delete('/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(204)
  })

  it('should return 401 when deleted user tries to login again', async () => {
    const response = await request(app.server)
      .post('/auth/login')
      .send({ email: testEmail, password: '123456' })

    expect(response.statusCode).toBe(401)
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(app.server).delete('/auth/me')

    expect(response.statusCode).toBe(401)
  })
})
