import { describe, it, expect, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterService } from './register.service'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

describe('RegisterService', () => {
  let repository: InMemoryUsersRepository
  let sut: RegisterService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new RegisterService(repository)
  })

  it('should register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.email).toBe('john@example.com')
  })

  it('should hash the password on registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('should throw UserAlreadyExistsError when email is already taken', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Another User',
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
