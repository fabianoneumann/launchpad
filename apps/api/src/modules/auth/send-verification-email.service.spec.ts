import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryEmailVerificationTokensRepository } from '@/repositories/in-memory/in-memory-email-verification-tokens-repository'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { SendVerificationEmailService } from './send-verification-email.service'

describe('SendVerificationEmailService', () => {
  let usersRepository: InMemoryUsersRepository
  let emailVerificationTokensRepository: InMemoryEmailVerificationTokensRepository
  let mailProvider: FakeMailProvider
  let sut: SendVerificationEmailService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    emailVerificationTokensRepository = new InMemoryEmailVerificationTokensRepository()
    mailProvider = new FakeMailProvider()
    sut = new SendVerificationEmailService(usersRepository, emailVerificationTokensRepository, mailProvider)
  })

  it('should create a verification token and send an email', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({ userId: user.id })

    expect(emailVerificationTokensRepository.items).toHaveLength(1)
    expect(mailProvider.sent).toHaveLength(1)
    expect(mailProvider.sent[0].to).toBe('john@example.com')
  })

  it('should set token expiration to 24 hours from now', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const before = new Date()
    await sut.execute({ userId: user.id })
    const after = new Date()

    const token = emailVerificationTokensRepository.items[0]
    const twentyFourHoursFromBefore = new Date(before.getTime() + 1000 * 60 * 60 * 24)
    const twentyFourHoursFromAfter = new Date(after.getTime() + 1000 * 60 * 60 * 24)

    expect(token.expires_at.getTime()).toBeGreaterThanOrEqual(twentyFourHoursFromBefore.getTime())
    expect(token.expires_at.getTime()).toBeLessThanOrEqual(twentyFourHoursFromAfter.getTime())
  })

  it('should do nothing when user does not exist', async () => {
    await sut.execute({ userId: 'non-existent-id' })

    expect(emailVerificationTokensRepository.items).toHaveLength(0)
    expect(mailProvider.sent).toHaveLength(0)
  })
})
