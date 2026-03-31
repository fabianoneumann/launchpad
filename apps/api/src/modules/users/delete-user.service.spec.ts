import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { DeleteUserService } from './delete-user.service'
import { CannotTargetSelfError } from '@/shared/errors/cannot-target-self-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('DeleteUserService', () => {
  let repository: InMemoryUsersRepository
  let sut: DeleteUserService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new DeleteUserService(repository)
  })

  it('should soft-delete a user', async () => {
    const admin = await repository.create({
      name: 'Admin',
      email: 'admin@test.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    })
    const user = await repository.create({
      name: 'User',
      email: 'user@test.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({ adminId: admin.id, userId: user.id })

    const found = await repository.findById(user.id)
    expect(found).toBeNull()
  })

  it('should throw CannotTargetSelfError when admin targets itself', async () => {
    const admin = await repository.create({
      name: 'Admin',
      email: 'admin@test.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    })

    await expect(() => sut.execute({ adminId: admin.id, userId: admin.id })).rejects.toBeInstanceOf(
      CannotTargetSelfError,
    )
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    const admin = await repository.create({
      name: 'Admin',
      email: 'admin@test.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    })

    await expect(() =>
      sut.execute({ adminId: admin.id, userId: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
