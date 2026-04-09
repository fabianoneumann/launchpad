import { describe, it, expect, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryPasswordResetTokensRepository } from '@/repositories/in-memory/in-memory-password-reset-tokens-repository'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { getForgotPasswordContent } from '@/lib/mail/content/forgot-password-content'
import { ForgotPasswordService } from './forgot-password.service'

describe('ForgotPasswordService', () => {
  let usersRepository: InMemoryUsersRepository
  let passwordResetTokensRepository: InMemoryPasswordResetTokensRepository
  let mailProvider: FakeMailProvider
  let sut: ForgotPasswordService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    mailProvider = new FakeMailProvider()
    sut = new ForgotPasswordService(usersRepository, passwordResetTokensRepository, mailProvider)
  })

  it('should create a reset token and send an email when user exists', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({ email: 'john@example.com' })

    expect(passwordResetTokensRepository.items).toHaveLength(1)
    expect(mailProvider.sent).toHaveLength(1)
    expect(mailProvider.sent[0].to).toBe('john@example.com')
    expect(mailProvider.sent[0].subject).toBe(getForgotPasswordContent('pt-BR').subject)
  })

  it('should do nothing when user does not exist', async () => {
    await sut.execute({ email: 'nonexistent@example.com' })

    expect(passwordResetTokensRepository.items).toHaveLength(0)
    expect(mailProvider.sent).toHaveLength(0)
  })

  it('should set token expiration to 2 hours from now', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const before = new Date()
    await sut.execute({ email: 'john@example.com' })
    const after = new Date()

    const token = passwordResetTokensRepository.items[0]
    const twoHoursFromBefore = new Date(before.getTime() + 1000 * 60 * 60 * 2)
    const twoHoursFromAfter = new Date(after.getTime() + 1000 * 60 * 60 * 2)

    expect(token.expires_at.getTime()).toBeGreaterThanOrEqual(twoHoursFromBefore.getTime())
    expect(token.expires_at.getTime()).toBeLessThanOrEqual(twoHoursFromAfter.getTime())
  })
})
