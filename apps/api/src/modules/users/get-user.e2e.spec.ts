import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'get-admin@test.com'
const targetEmail = 'get-target@test.com'

describe('Get User E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, targetEmail] } } })
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, password_hash: await hash('123456', 6), role: 'ADMIN' },
    })
    await prisma.user.create({
      data: { name: 'Target User', email: targetEmail, password_hash: await hash('123456', 6) },
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, targetEmail] } } })
    await app.close()
  })

  it('should return 200 with user data when admin requests a valid id', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const target = await prisma.user.findUnique({ where: { email: targetEmail } })

    const response = await request(app.server).get(`/users/${target!.id}`).set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.user).toMatchObject({ email: targetEmail })
    expect(response.body.user).not.toHaveProperty('password_hash')
  })

  it('should return 404 when user id does not exist', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(404)
  })
})
