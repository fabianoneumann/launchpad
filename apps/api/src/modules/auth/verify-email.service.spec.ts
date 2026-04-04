import { describe, it, expect, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { createHash } from 'node:crypto'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryEmailVerificationTokensRepository } from '@/repositories/in-memory/in-memory-email-verification-tokens-repository'
import { VerifyEmailService } from './verify-email.service'
import { InvalidOrExpiredTokenError } from '@/shared/errors/invalid-or-expired-token-error'

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

describe('VerifyEmailService', () => {
  let usersRepository: InMemoryUsersRepository
  let emailVerificationTokensRepository: InMemoryEmailVerificationTokensRepository
  let sut: VerifyEmailService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    emailVerificationTokensRepository = new InMemoryEmailVerificationTokensRepository()
    sut = new VerifyEmailService(usersRepository, emailVerificationTokensRepository)
  })

  it('should set validated_at with a valid token', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await emailVerificationTokensRepository.create({
      tokenHash: sha256('valid-token'),
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    await sut.execute({ token: 'valid-token' })

    const updatedUser = await usersRepository.findById(user.id)
    expect(updatedUser!.validated_at).toBeInstanceOf(Date)
  })

  it('should invalidate the token after use', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await emailVerificationTokensRepository.create({
      tokenHash: sha256('valid-token'),
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    await sut.execute({ token: 'valid-token' })

    await expect(sut.execute({ token: 'valid-token' })).rejects.toBeInstanceOf(
      InvalidOrExpiredTokenError,
    )
  })

  it('should throw InvalidOrExpiredTokenError for an invalid token', async () => {
    await expect(sut.execute({ token: 'invalid-token' })).rejects.toBeInstanceOf(
      InvalidOrExpiredTokenError,
    )
  })

  it('should throw InvalidOrExpiredTokenError for an expired token', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await emailVerificationTokensRepository.create({
      tokenHash: sha256('expired-token'),
      userId: user.id,
      expiresAt: new Date(Date.now() - 1000),
    })

    await expect(sut.execute({ token: 'expired-token' })).rejects.toBeInstanceOf(
      InvalidOrExpiredTokenError,
    )
  })
})
