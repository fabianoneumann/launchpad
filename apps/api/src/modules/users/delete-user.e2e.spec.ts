import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'delete-admin@test.com'
const targetEmail = 'delete-target@test.com'

describe('Delete User E2E', () => {
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

  it('should return 204 when admin deletes a user', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const target = await prisma.user.findUnique({ where: { email: targetEmail } })

    const response = await request(app.server)
      .delete(`/users/${target!.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(204)
  })

  it('should return 400 when admin tries to delete own account', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const admin = await prisma.user.findUnique({ where: { email: adminEmail } })

    const response = await request(app.server)
      .delete(`/users/${admin!.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(400)
  })

  it('should return 404 when user id does not exist', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .delete('/users/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(404)
  })
})
