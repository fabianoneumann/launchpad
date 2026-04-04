import { describe, it, expect, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateUserService } from './update-user.service'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

describe('UpdateUserService', () => {
  let repository: InMemoryUsersRepository
  let sut: UpdateUserService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new UpdateUserService(repository)
  })

  it('should update user name and email', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john@test.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: created.id,
      name: 'John Updated',
      email: 'john-updated@test.com',
    })

    expect(user.name).toBe('John Updated')
    expect(user.email).toBe('john-updated@test.com')
  })

  it('should throw UserAlreadyExistsError when email is taken by another user', async () => {
    await repository.create({
      name: 'Other',
      email: 'other@test.com',
      password_hash: await hash('123456', 6),
    })
    const user = await repository.create({
      name: 'John',
      email: 'john@test.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({ userId: user.id, name: 'John', email: 'other@test.com' }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existent-id', name: 'John', email: 'john@test.com' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should allow updating to the same email', async () => {
    const created = await repository.create({
      name: 'John',
      email: 'john@test.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: created.id,
      name: 'John Updated',
      email: 'john@test.com',
    })

    expect(user.name).toBe('John Updated')
    expect(user.email).toBe('john@test.com')
  })
})
