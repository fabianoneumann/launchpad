import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { DeleteOwnAccountService } from './delete-own-account.service'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('DeleteOwnAccountService', () => {
  let repository: InMemoryUsersRepository
  let sut: DeleteOwnAccountService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new DeleteOwnAccountService(repository)
  })

  it('should soft-delete own account', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({ userId: created.id })

    const user = await repository.findById(created.id)
    expect(user).toBeNull()
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
