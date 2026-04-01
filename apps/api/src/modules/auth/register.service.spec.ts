import { describe, it, expect, beforeEach, vi } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { RegisterService } from './register.service'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

describe('RegisterService', () => {
  let repository: InMemoryUsersRepository
  let mailProvider: FakeMailProvider
  let sut: RegisterService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    mailProvider = new FakeMailProvider()
    sut = new RegisterService(repository, mailProvider)
  })

  it('should register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      locale: 'pt-BR',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.email).toBe('john@example.com')
  })

  it('should hash the password on registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      locale: 'pt-BR',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('should throw UserAlreadyExistsError when email is already taken', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      locale: 'pt-BR',
    })

    await expect(() =>
      sut.execute({
        name: 'Another User',
        email: 'john@example.com',
        password: '123456',
        locale: 'pt-BR',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should persist the locale passed to the service', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john-locale@example.com',
      password: '123456',
      locale: 'en',
    })

    expect(user.locale).toBe('en')
  })

  it('should send a welcome email after registration', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      locale: 'pt-BR',
    })

    await vi.waitFor(() => {
      expect(mailProvider.sent).toHaveLength(1)
    })

    expect(mailProvider.sent[0].to).toBe('john@example.com')
    expect(mailProvider.sent[0].subject).toBe('Bem-vindo ao Eco Iguaçu!')
  })
})
