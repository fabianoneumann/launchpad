import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RefreshTokenService } from './refresh-token.service'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

describe('RefreshTokenService', () => {
  let repository: InMemoryUsersRepository
  let sut: RefreshTokenService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new RefreshTokenService(repository)
  })

  it('should return user when userId exists and tokenVersion matches', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hash',
    })

    const { user } = await sut.execute({ userId: created.id, tokenVersion: 0 })

    expect(user.id).toBe(created.id)
    expect(user.email).toBe('john@example.com')
  })

  it('should throw InvalidCredentialsError when user is not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'nonexistent-id', tokenVersion: 0 }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw InvalidCredentialsError when tokenVersion does not match', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hash',
    })

    await repository.incrementTokenVersion(created.id)

    await expect(() =>
      sut.execute({ userId: created.id, tokenVersion: 0 }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
