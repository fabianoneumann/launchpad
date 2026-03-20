import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'role-admin@test.com'
const targetEmail = 'role-target@test.com'

describe('Change User Role E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, targetEmail] } } })
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, password_hash: await hash('123456', 6), role: 'ADMIN' },
    })
    await prisma.user.create({
      data: { name: 'Target', email: targetEmail, password_hash: await hash('123456', 6) },
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, targetEmail] } } })
    await app.close()
  })

  it('should return 200 when admin changes a user role', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const target = await prisma.user.findUnique({ where: { email: targetEmail } })

    const response = await request(app.server)
      .patch(`/users/${target!.id}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'MEMBER' })

    expect(response.statusCode).toBe(200)
    expect(response.body.user.role).toBe('MEMBER')
    expect(response.body.user).not.toHaveProperty('password_hash')
  })

  it('should return 400 when admin tries to change own role', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const admin = await prisma.user.findUnique({ where: { email: adminEmail } })

    const response = await request(app.server)
      .patch(`/users/${admin!.id}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'USER' })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when role is invalid', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const target = await prisma.user.findUnique({ where: { email: targetEmail } })

    const response = await request(app.server)
      .patch(`/users/${target!.id}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'SUPERUSER' })

    expect(response.statusCode).toBe(400)
  })
})
