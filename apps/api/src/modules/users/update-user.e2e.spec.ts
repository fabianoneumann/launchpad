import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'update-admin@test.com'
const targetEmail = 'update-target@test.com'
const otherEmail = 'update-other@test.com'

describe('Update User E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, targetEmail, otherEmail] } },
    })
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password_hash: await hash('123456', 6),
        role: 'ADMIN',
      },
    })
    await prisma.user.create({
      data: { name: 'Target', email: targetEmail, password_hash: await hash('123456', 6) },
    })
    await prisma.user.create({
      data: { name: 'Other', email: otherEmail, password_hash: await hash('123456', 6) },
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, otherEmail] } } })
    await prisma.user.deleteMany({ where: { email: 'updated-target@test.com' } })
    await app.close()
  })

  it('should return 200 when admin updates a user', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const target = await prisma.user.findUnique({ where: { email: targetEmail } })

    const response = await request(app.server)
      .patch(`/users/${target!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Target Updated', email: 'updated-target@test.com' })

    expect(response.statusCode).toBe(200)
    expect(response.body.user).toMatchObject({
      name: 'Target Updated',
      email: 'updated-target@test.com',
    })
    expect(response.body.user).not.toHaveProperty('password_hash')
  })

  it('should return 409 when email is already taken', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const admin = await prisma.user.findUnique({ where: { email: adminEmail } })

    const response = await request(app.server)
      .patch(`/users/${admin!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Admin', email: otherEmail })

    expect(response.statusCode).toBe(409)
  })
})
