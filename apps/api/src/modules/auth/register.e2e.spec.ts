import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const emails = [
  'reg-john@test.com',
  'reg-duplicate@test.com',
  'reg-locale-en@test.com',
  'reg-locale-en-us@test.com',
  'reg-locale-fallback@test.com',
  'reg-locale-fr@test.com',
]

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

  it('should create a verification token after registration', async () => {
    const user = await prisma.user.findFirst({ where: { email: emails[0] } })
    await vi.waitFor(
      async () => {
        const tokens = await prisma.emailVerificationToken.findMany({
          where: { user_id: user!.id },
        })
        expect(tokens.length).toBeGreaterThanOrEqual(1)
      },
      { timeout: 2000 },
    )
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

  it('should detect locale from Accept-Language header', async () => {
    await request(app.server)
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: emails[2],
        password: '123456',
      })
      .set('Accept-Language', 'en')

    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: emails[2], password: '123456' })
    const meResponse = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)

    expect(meResponse.body.user.locale).toBe('en')
  })

  it('should normalize Accept-Language by language base (en-US → en)', async () => {
    await request(app.server)
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: emails[3],
        password: '123456',
      })
      .set('Accept-Language', 'en-US')

    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: emails[3], password: '123456' })
    const meResponse = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)

    expect(meResponse.body.user.locale).toBe('en')
  })

  it('should fallback to pt-BR when Accept-Language header is absent', async () => {
    await request(app.server).post('/auth/register').send({
      name: 'John Doe',
      email: emails[4],
      password: '123456',
    })

    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: emails[4], password: '123456' })
    const meResponse = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)

    expect(meResponse.body.user.locale).toBe('pt-BR')
  })

  it('should fallback to pt-BR when Accept-Language is unsupported (fr)', async () => {
    await request(app.server)
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: emails[5],
        password: '123456',
      })
      .set('Accept-Language', 'fr')

    const loginResponse = await request(app.server)
      .post('/auth/login')
      .send({ email: emails[5], password: '123456' })
    const meResponse = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)

    expect(meResponse.body.user.locale).toBe('pt-BR')
  })

  it('should return 400 when body is invalid', async () => {
    const response = await request(app.server).post('/auth/register').send({
      email: 'not-an-email',
      password: '123',
    })

    expect(response.statusCode).toBe(400)
  })
})
