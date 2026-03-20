import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'list-admin@test.com'
const userEmail = 'list-user@test.com'

describe('List Users E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, userEmail] } } })
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, password_hash: await hash('123456', 6), role: 'ADMIN' },
    })
    await prisma.user.create({
      data: { name: 'User', email: userEmail, password_hash: await hash('123456', 6) },
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, userEmail] } } })
    await app.close()
  })

  it('should return 200 with user list when admin is authenticated', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server).get('/users').set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ users: expect.any(Array), total: expect.any(Number) })
    expect(response.body.users[0]).not.toHaveProperty('password_hash')
  })

  it('should return 401 when no token is provided', async () => {
    const response = await request(app.server).get('/users')

    expect(response.statusCode).toBe(401)
  })

  it('should return 403 when authenticated as non-admin', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: userEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server).get('/users').set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(403)
  })

  it('should filter users by role', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server).get('/users?role=ADMIN').set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.users.every((u: { role: string }) => u.role === 'ADMIN')).toBe(true)
  })
})
