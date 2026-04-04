import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'stats-admin@test.com'
const memberEmail = 'stats-member@test.com'
const userEmail = 'stats-user@test.com'
const deletedEmail = 'stats-deleted@test.com'

describe('Get Users Stats E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, memberEmail, userEmail, deletedEmail] } },
    })
    await prisma.user.create({
      data: {
        name: 'Stats Admin',
        email: adminEmail,
        password_hash: await hash('123456', 6),
        role: 'ADMIN',
        validated_at: new Date(),
      },
    })
    await prisma.user.create({
      data: {
        name: 'Stats Member',
        email: memberEmail,
        password_hash: await hash('123456', 6),
        role: 'MEMBER',
        validated_at: new Date(),
      },
    })
    await prisma.user.create({
      data: {
        name: 'Stats User',
        email: userEmail,
        password_hash: await hash('123456', 6),
      },
    })
    const deleted = await prisma.user.create({
      data: {
        name: 'Stats Deleted',
        email: deletedEmail,
        password_hash: await hash('123456', 6),
      },
    })
    await prisma.user.update({ where: { id: deleted.id }, data: { deleted_at: new Date() } })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, memberEmail, userEmail, deletedEmail] } },
    })
    await app.close()
  })

  it('should return 200 with correct stats shape when admin is authenticated', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users/stats')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      total: expect.any(Number),
      active: expect.any(Number),
      unvalidated: expect.any(Number),
      byRole: {
        ADMIN: expect.any(Number),
        MEMBER: expect.any(Number),
        USER: expect.any(Number),
      },
    })
  })

  it('should include soft-deleted users in total but not in active', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users/stats')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body.total).toBeGreaterThan(response.body.active)
  })

  it('should return 401 when no token is provided', async () => {
    const response = await request(app.server).get('/users/stats')

    expect(response.statusCode).toBe(401)
  })

  it('should return 403 when authenticated as non-admin', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: userEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users/stats')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(403)
  })
})
