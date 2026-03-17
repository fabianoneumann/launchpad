import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetProfileService } from './get-profile.service'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('GetProfileService', () => {
  let repository: InMemoryUsersRepository
  let sut: GetProfileService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new GetProfileService(repository)
  })

  it('should return the user profile by id', async () => {
    const createdUser = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toBe(createdUser.id)
    expect(user.email).toBe('john@example.com')
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
