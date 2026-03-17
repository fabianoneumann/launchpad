import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate.service'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

describe('AuthenticateService', () => {
  let repository: InMemoryUsersRepository
  let sut: AuthenticateService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new AuthenticateService(repository)
  })

  it('should authenticate a user with valid credentials', async () => {
    await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'john@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.email).toBe('john@example.com')
  })

  it('should throw InvalidCredentialsError when email does not exist', async () => {
    await expect(() =>
      sut.execute({
        email: 'nonexistent@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw InvalidCredentialsError when password is wrong', async () => {
    await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
