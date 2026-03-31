import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ListUsersService } from './list-users.service'

describe('ListUsersService', () => {
  let repository: InMemoryUsersRepository
  let sut: ListUsersService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new ListUsersService(repository)
  })

  it('should return a paginated list of users', async () => {
    for (let i = 1; i <= 3; i++) {
      await repository.create({
        name: `User ${i}`,
        email: `user${i}@test.com`,
        password_hash: await hash('123456', 6),
      })
    }

    const { users, total } = await sut.execute({ page: 1, perPage: 2 })

    expect(users).toHaveLength(2)
    expect(total).toBe(3)
  })

  it('should filter users by role', async () => {
    await repository.create({
      name: 'Admin',
      email: 'admin@test.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    })
    await repository.create({
      name: 'User',
      email: 'user@test.com',
      password_hash: await hash('123456', 6),
    })

    const { users, total } = await sut.execute({ page: 1, perPage: 20, role: 'ADMIN' })

    expect(users).toHaveLength(1)
    expect(total).toBe(1)
    expect(users[0].role).toBe('ADMIN')
  })

  it('should return empty list when no users exist', async () => {
    const { users, total } = await sut.execute({ page: 1, perPage: 20 })

    expect(users).toHaveLength(0)
    expect(total).toBe(0)
  })

  it('should not return soft-deleted users', async () => {
    const user = await repository.create({
      name: 'User',
      email: 'user@test.com',
      password_hash: await hash('123456', 6),
    })
    await repository.delete(user.id)

    const { users, total } = await sut.execute({ page: 1, perPage: 20 })

    expect(users).toHaveLength(0)
    expect(total).toBe(0)
  })
})
