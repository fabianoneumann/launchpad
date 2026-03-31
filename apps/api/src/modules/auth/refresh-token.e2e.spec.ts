import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

const testEmail = 'refresh-john@test.com'

describe('Refresh Token E2E', () => {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await request(app.server).post('/auth/register').send({
      name: 'John Doe',
      email: testEmail,
      password: '123456',
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } })
    await app.close()
  })

  it('should return 200 and a new token when refresh token cookie is valid', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })

    const cookies = loginResponse.headers['set-cookie']

    const response = await request(app.server).patch('/auth/token/refresh').set('Cookie', cookies)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ token: expect.any(String) })
    expect(response.headers['set-cookie']).toBeDefined()
  })

  it('should return 401 when no refresh token cookie is provided', async () => {
    const response = await request(app.server).patch('/auth/token/refresh')

    expect(response.statusCode).toBe(401)
  })

  it('should return 401 when refresh token has outdated token version', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })
    const { token } = loginResponse.body
    const cookies = loginResponse.headers['set-cookie']

    await request(app.server)
      .delete('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)

    const response = await request(app.server).patch('/auth/token/refresh').set('Cookie', cookies)

    expect(response.statusCode).toBe(401)
  })

  it('should return new tokens with role and tokenVersion from database', async () => {
    const loginResponse = await request(app.server).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    })
    const cookies = loginResponse.headers['set-cookie']

    const response = await request(app.server).patch('/auth/token/refresh').set('Cookie', cookies)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ token: expect.any(String) })
    expect(response.headers['set-cookie']).toBeDefined()
  })
})
