import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateProfileService } from './update-profile.service'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('UpdateProfileService', () => {
  let repository: InMemoryUsersRepository
  let sut: UpdateProfileService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new UpdateProfileService(repository)
  })

  it('should update the user name', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: created.id, name: 'John Updated' })

    expect(user.name).toBe('John Updated')
    expect(user.email).toBe('john@example.com')
  })

  it('should update the user locale', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john-locale@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: created.id, locale: 'en' })

    expect(user.locale).toBe('en')
    expect(user.name).toBe('John Doe')
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existent-id', name: 'John' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
