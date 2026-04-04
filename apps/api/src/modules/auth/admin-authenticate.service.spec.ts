import { describe, it, expect, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AdminAuthenticateService } from './admin-authenticate.service'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'
import { InsufficientRoleError } from '@/shared/errors/insufficient-role-error'

describe('AdminAuthenticateService', () => {
  let repository: InMemoryUsersRepository
  let sut: AdminAuthenticateService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new AdminAuthenticateService(repository)
  })

  it('should authenticate a MEMBER user', async () => {
    await repository.create({
      name: 'Member User',
      email: 'member@example.com',
      password_hash: await hash('123456', 6),
      role: 'MEMBER',
    })

    const { user } = await sut.execute({ email: 'member@example.com', password: '123456' })

    expect(user.role).toBe('MEMBER')
  })

  it('should authenticate an ADMIN user', async () => {
    await repository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    })

    const { user } = await sut.execute({ email: 'admin@example.com', password: '123456' })

    expect(user.role).toBe('ADMIN')
  })

  it('should throw InsufficientRoleError when user has role USER', async () => {
    await repository.create({
      name: 'Regular User',
      email: 'user@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({ email: 'user@example.com', password: '123456' }),
    ).rejects.toBeInstanceOf(InsufficientRoleError)
  })

  it('should throw InvalidCredentialsError when email does not exist', async () => {
    await expect(() =>
      sut.execute({ email: 'nonexistent@example.com', password: '123456' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw InvalidCredentialsError when password is wrong', async () => {
    await repository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    })

    await expect(() =>
      sut.execute({ email: 'admin@example.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
