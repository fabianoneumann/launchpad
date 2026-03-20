import { describe, it, expect, beforeEach } from 'vitest'
import { hash, compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryPasswordResetTokensRepository } from '@/repositories/in-memory/in-memory-password-reset-tokens-repository'
import { ResetPasswordService } from './reset-password.service'
import { InvalidOrExpiredTokenError } from '@/shared/errors/invalid-or-expired-token-error'

describe('ResetPasswordService', () => {
  let usersRepository: InMemoryUsersRepository
  let passwordResetTokensRepository: InMemoryPasswordResetTokensRepository
  let sut: ResetPasswordService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    sut = new ResetPasswordService(usersRepository, passwordResetTokensRepository)
  })

  it('should reset the password with a valid token', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('old-password', 6),
    })

    await passwordResetTokensRepository.create({
      token: 'valid-token',
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    })

    await sut.execute({ token: 'valid-token', newPassword: 'new-password' })

    const updatedUser = await usersRepository.findById(user.id)
    const passwordMatches = await compare('new-password', updatedUser!.password_hash)
    expect(passwordMatches).toBe(true)
  })

  it('should invalidate the token after use', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('old-password', 6),
    })

    await passwordResetTokensRepository.create({
      token: 'valid-token',
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    })

    await sut.execute({ token: 'valid-token', newPassword: 'new-password' })

    await expect(
      sut.execute({ token: 'valid-token', newPassword: 'another-password' }),
    ).rejects.toBeInstanceOf(InvalidOrExpiredTokenError)
  })

  it('should throw InvalidOrExpiredTokenError for an invalid token', async () => {
    await expect(
      sut.execute({ token: 'invalid-token', newPassword: 'new-password' }),
    ).rejects.toBeInstanceOf(InvalidOrExpiredTokenError)
  })

  it('should throw InvalidOrExpiredTokenError for an expired token', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('old-password', 6),
    })

    await passwordResetTokensRepository.create({
      token: 'expired-token',
      userId: user.id,
      expiresAt: new Date(Date.now() - 1000),
    })

    await expect(
      sut.execute({ token: 'expired-token', newPassword: 'new-password' }),
    ).rejects.toBeInstanceOf(InvalidOrExpiredTokenError)
  })
})
