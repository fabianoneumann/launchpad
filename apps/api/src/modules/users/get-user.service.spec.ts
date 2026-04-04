import { describe, it, expect, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserService } from './get-user.service'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('GetUserService', () => {
  let repository: InMemoryUsersRepository
  let sut: GetUserService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new GetUserService(repository)
  })

  it('should return user by id', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john@test.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: created.id })

    expect(user.id).toBe(created.id)
    expect(user.email).toBe('john@test.com')
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(() => sut.execute({ userId: 'non-existent-id' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
