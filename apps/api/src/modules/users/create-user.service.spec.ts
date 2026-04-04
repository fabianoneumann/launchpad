import { describe, it, expect, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryPasswordResetTokensRepository } from '@/repositories/in-memory/in-memory-password-reset-tokens-repository'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'
import { CreateUserService } from './create-user.service'

describe('CreateUserService', () => {
  let usersRepository: InMemoryUsersRepository
  let passwordResetTokensRepository: InMemoryPasswordResetTokensRepository
  let mailProvider: FakeMailProvider
  let sut: CreateUserService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    mailProvider = new FakeMailProvider()
    sut = new CreateUserService(usersRepository, passwordResetTokensRepository, mailProvider)
  })

  it('should create user, generate invite token and send invite email', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
    })

    expect(usersRepository.items).toHaveLength(1)
    expect(user.email).toBe('john@example.com')
    expect(passwordResetTokensRepository.items).toHaveLength(1)
    expect(mailProvider.sent).toHaveLength(1)
    expect(mailProvider.sent[0].to).toBe('john@example.com')
    expect(mailProvider.sent[0].subject).toBe('Seu acesso ao Eco Iguassu foi criado')
  })

  it('should set validated_at to current date on creation', async () => {
    const before = new Date()
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
    })
    const after = new Date()

    expect(user.validated_at).not.toBeNull()
    expect(user.validated_at!.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(user.validated_at!.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('should set token expiration to 72 hours from now', async () => {
    const before = new Date()
    await sut.execute({ name: 'John Doe', email: 'john@example.com', role: 'USER' })
    const after = new Date()

    const token = passwordResetTokensRepository.items[0]
    const seventyTwoHoursFromBefore = new Date(before.getTime() + 1000 * 60 * 60 * 72)
    const seventyTwoHoursFromAfter = new Date(after.getTime() + 1000 * 60 * 60 * 72)

    expect(token.expires_at.getTime()).toBeGreaterThanOrEqual(seventyTwoHoursFromBefore.getTime())
    expect(token.expires_at.getTime()).toBeLessThanOrEqual(seventyTwoHoursFromAfter.getTime())
  })

  it('should persist role and locale correctly', async () => {
    const { user } = await sut.execute({
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      locale: 'en',
    })

    expect(user.role).toBe('ADMIN')
    expect(user.locale).toBe('en')
  })

  it('should use default locale pt-BR when not provided', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
    })

    expect(user.locale).toBe('pt-BR')
  })

  it('should throw UserAlreadyExistsError when email is already taken', async () => {
    await usersRepository.create({
      name: 'Existing User',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(
      sut.execute({ name: 'John Doe', email: 'john@example.com', role: 'USER' }),
    ).rejects.toThrow(UserAlreadyExistsError)
  })
})
