import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { createHash } from 'node:crypto'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryEmailVerificationTokensRepository } from '@/repositories/in-memory/in-memory-email-verification-tokens-repository'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { ResendVerificationEmailService } from './resend-verification-email.service'

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

describe('ResendVerificationEmailService', () => {
  let usersRepository: InMemoryUsersRepository
  let emailVerificationTokensRepository: InMemoryEmailVerificationTokensRepository
  let mailProvider: FakeMailProvider
  let sut: ResendVerificationEmailService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    emailVerificationTokensRepository = new InMemoryEmailVerificationTokensRepository()
    mailProvider = new FakeMailProvider()
    sut = new ResendVerificationEmailService(
      usersRepository,
      emailVerificationTokensRepository,
      mailProvider,
    )
  })

  it('should invalidate previous token and send a new verification email', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await emailVerificationTokensRepository.create({
      tokenHash: sha256('old-token'),
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    await sut.execute({ userId: user.id })

    expect(emailVerificationTokensRepository.items).toHaveLength(2)
    expect(emailVerificationTokensRepository.items[0].used_at).toBeInstanceOf(Date)
    expect(emailVerificationTokensRepository.items[1].used_at).toBeNull()
    expect(mailProvider.sent).toHaveLength(1)
    expect(mailProvider.sent[0].to).toBe('john@example.com')
  })

  it('should send a new email even when no previous token exists', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({ userId: user.id })

    expect(emailVerificationTokensRepository.items).toHaveLength(1)
    expect(mailProvider.sent).toHaveLength(1)
  })

  it('should not invalidate an already used token', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const oldToken = await emailVerificationTokensRepository.create({
      tokenHash: sha256('already-used-token'),
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })
    await emailVerificationTokensRepository.markAsUsed(oldToken.id)

    await sut.execute({ userId: user.id })

    expect(emailVerificationTokensRepository.items).toHaveLength(2)
    expect(mailProvider.sent).toHaveLength(1)
  })

  it('should do nothing when user does not exist', async () => {
    await sut.execute({ userId: 'non-existent-id' })

    expect(emailVerificationTokensRepository.items).toHaveLength(0)
    expect(mailProvider.sent).toHaveLength(0)
  })
})
