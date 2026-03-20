import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ChangeUserRoleService } from './change-user-role.service'
import { CannotTargetSelfError } from '@/shared/errors/cannot-target-self-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('ChangeUserRoleService', () => {
  let repository: InMemoryUsersRepository
  let sut: ChangeUserRoleService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new ChangeUserRoleService(repository)
  })

  it('should change user role', async () => {
    const admin = await repository.create({ name: 'Admin', email: 'admin@test.com', password_hash: await hash('123456', 6), role: 'ADMIN' })
    const user = await repository.create({ name: 'User', email: 'user@test.com', password_hash: await hash('123456', 6) })

    const { user: updated } = await sut.execute({ adminId: admin.id, userId: user.id, role: 'MEMBER' })

    expect(updated.role).toBe('MEMBER')
  })

  it('should throw CannotTargetSelfError when admin targets itself', async () => {
    const admin = await repository.create({ name: 'Admin', email: 'admin@test.com', password_hash: await hash('123456', 6), role: 'ADMIN' })

    await expect(() =>
      sut.execute({ adminId: admin.id, userId: admin.id, role: 'USER' }),
    ).rejects.toBeInstanceOf(CannotTargetSelfError)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    const admin = await repository.create({ name: 'Admin', email: 'admin@test.com', password_hash: await hash('123456', 6), role: 'ADMIN' })

    await expect(() =>
      sut.execute({ adminId: admin.id, userId: 'non-existent-id', role: 'MEMBER' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
