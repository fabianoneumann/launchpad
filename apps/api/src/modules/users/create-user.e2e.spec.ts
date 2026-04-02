import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const adminEmail = 'create-admin@test.com'
const regularEmail = 'create-regular@test.com'
const newUserEmail = 'create-new@test.com'
const duplicateEmail = 'create-duplicate@test.com'

describe('Create User E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, regularEmail, newUserEmail, duplicateEmail] } },
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
      data: {
        name: 'Regular',
        email: regularEmail,
        password_hash: await hash('123456', 6),
      },
    })
    await prisma.user.create({
      data: {
        name: 'Duplicate User',
        email: duplicateEmail,
        password_hash: await hash('123456', 6),
      },
    })
  })

  afterAll(async () => {
    await prisma.passwordResetToken.deleteMany({
      where: { user: { email: { in: [newUserEmail] } } },
    })
    await prisma.user.deleteMany({
      where: { email: { in: [adminEmail, regularEmail, newUserEmail, duplicateEmail] } },
    })
    await app.close()
  })

  it('should return 201 with created user when admin is authenticated', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New User', email: newUserEmail, role: 'USER' })

    expect(response.statusCode).toBe(201)
    expect(response.body.user).toMatchObject({
      id: expect.any(String),
      email: newUserEmail,
      role: 'USER',
    })
    expect(response.body.user).not.toHaveProperty('password_hash')
  })

  it('should set validated_at on the created user', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const user = await prisma.user.findFirst({ where: { email: newUserEmail } })
    expect(user?.validated_at).not.toBeNull()

    const response = await request(app.server)
      .get(`/users/${user!.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.body.user.validated_at).not.toBeNull()
  })

  it('should create a password reset token in the database', async () => {
    const user = await prisma.user.findFirst({ where: { email: newUserEmail } })
    const token = await prisma.passwordResetToken.findFirst({
      where: { user_id: user!.id },
    })

    expect(token).not.toBeNull()
    expect(token!.used_at).toBeNull()
    expect(token!.expires_at.getTime()).toBeGreaterThan(Date.now())
  })

  it('should return 409 when email is already taken', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Another', email: duplicateEmail, role: 'USER' })

    expect(response.statusCode).toBe(409)
  })

  it('should return 401 when no token is provided', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: 'New User', email: 'no-auth@test.com', role: 'USER' })

    expect(response.statusCode).toBe(401)
  })

  it('should return 403 when authenticated as non-admin', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: regularEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New User', email: 'forbidden@test.com', role: 'USER' })

    expect(response.statusCode).toBe(403)
  })

  it('should return 400 when body is invalid', async () => {
    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: adminEmail, password: '123456' })
    const token = loginResponse.body.token

    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New User', email: 'not-an-email' })

    expect(response.statusCode).toBe(400)
  })
})
