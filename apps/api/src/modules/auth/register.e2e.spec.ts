import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const emails = ['reg-john@test.com', 'reg-duplicate@test.com']

describe('Register E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: { in: emails } } })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: emails } } })
    await app.close()
  })

  it('should return 201 when registering a new user', async () => {
    const response = await request(app.server).post('/auth/register').send({
      name: 'John Doe',
      email: emails[0],
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body.user).toMatchObject({
      id: expect.any(String),
      email: emails[0],
    })
  })

  it('should return 409 when email is already taken', async () => {
    await request(app.server).post('/auth/register').send({
      name: 'John Doe',
      email: emails[1],
      password: '123456',
    })

    const response = await request(app.server).post('/auth/register').send({
      name: 'Another User',
      email: emails[1],
      password: '123456',
    })

    expect(response.statusCode).toBe(409)
  })

  it('should return 400 when body is invalid', async () => {
    const response = await request(app.server).post('/auth/register').send({
      email: 'not-an-email',
      password: '123',
    })

    expect(response.statusCode).toBe(400)
  })
})
