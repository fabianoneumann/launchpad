import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'list-admin@test.com'
const userEmail = 'list-user@test.com'
const searchableEmail = 'list-searchable@test.com'
const deletedEmail = 'list-deleted@test.com'

describe('List Users E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, userEmail, searchableEmail, deletedEmail] } },
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
      data: { name: 'User', email: userEmail, password_hash: await hash('123456', 6) },
    })
    await prisma.user.create({
      data: {
        name: 'Searchable Person',
        email: searchableEmail,
        password_hash: await hash('123456', 6),
      },
    })
    const deletedUser = await prisma.user.create({
      data: { name: 'Deleted Person', email: deletedEmail, password_hash: await hash('123456', 6) },
    })
    await prisma.user.update({ where: { id: deletedUser.id }, data: { deleted_at: new Date() } })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, userEmail, searchableEmail, deletedEmail] } },
    })
    await app.close()
  })

  it('should return 200 with user list when admin is authenticated', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
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
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: userEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server).get('/users').set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(403)
  })

  it('should filter users by role', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users?role=ADMIN')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.users.every((u: { role: string }) => u.role === 'ADMIN')).toBe(true)
  })

  it('should filter users by search term', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users?search=Searchable')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.users.every((u: { name: string }) => u.name.includes('Searchable'))).toBe(
      true,
    )
    expect(response.body.total).toBeGreaterThanOrEqual(1)
  })

  it('should not return soft-deleted users by default', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users?search=Deleted+Person')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toHaveLength(0)
    expect(response.body.total).toBe(0)
  })

  it('should return only soft-deleted users when onlyDeleted=true', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users?search=Deleted+Person&onlyDeleted=true')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toHaveLength(1)
    expect(response.body.users[0].email).toBe(deletedEmail)
    expect(response.body.total).toBe(1)
    expect(response.body.users[0].deleted_at).not.toBeNull()
  })

  it('should return only soft-deleted users when onlyDeleted=true and showDeleted=false', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users?search=Deleted+Person&onlyDeleted=true&showDeleted=false')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toHaveLength(1)
    expect(response.body.users[0].email).toBe(deletedEmail)
  })

  it('should return soft-deleted users when showDeleted=true', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .get('/users?search=Deleted+Person&showDeleted=true')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toHaveLength(1)
    expect(response.body.users[0].email).toBe(deletedEmail)
    expect(response.body.total).toBe(1)
  })
})
