import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'admin-login@test.com'
const memberEmail = 'member-login@test.com'
const userEmail = 'user-login@test.com'

describe('Admin Authenticate E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, memberEmail, userEmail] } },
    })
    await prisma.user.createMany({
      data: [
        { name: 'Admin', email: adminEmail, password_hash: await hash('123456', 6), role: 'ADMIN' },
        {
          name: 'Member',
          email: memberEmail,
          password_hash: await hash('123456', 6),
          role: 'MEMBER',
        },
        { name: 'User', email: userEmail, password_hash: await hash('123456', 6), role: 'USER' },
      ],
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, memberEmail, userEmail] } },
    })
    await app.close()
  })

  it('should return 200 and a token when ADMIN authenticates', async () => {
    const response = await request(app.server)
      .post('/auth/admin/login')
      .send({ email: adminEmail, password: '123456' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ token: expect.any(String) })
    expect(response.headers['set-cookie']).toBeDefined()
  })

  it('should return 200 and a token when MEMBER authenticates', async () => {
    const response = await request(app.server)
      .post('/auth/admin/login')
      .send({ email: memberEmail, password: '123456' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ token: expect.any(String) })
    expect(response.headers['set-cookie']).toBeDefined()
  })

  it('should return 403 when USER tries to authenticate', async () => {
    const response = await request(app.server)
      .post('/auth/admin/login')
      .send({ email: userEmail, password: '123456' })

    expect(response.statusCode).toBe(403)
  })

  it('should return 401 when credentials are invalid', async () => {
    const response = await request(app.server)
      .post('/auth/admin/login')
      .send({ email: adminEmail, password: 'wrong-password' })

    expect(response.statusCode).toBe(401)
  })
})
