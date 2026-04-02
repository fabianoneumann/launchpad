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

  it('should filter users by search term matching name', async () => {
    await repository.create({
      name: 'Alice Silva',
      email: 'alice@test.com',
      password_hash: await hash('123456', 6),
    })
    await repository.create({
      name: 'Bob Souza',
      email: 'bob@test.com',
      password_hash: await hash('123456', 6),
    })

    const { users, total } = await sut.execute({ page: 1, perPage: 20, search: 'alice' })

    expect(users).toHaveLength(1)
    expect(total).toBe(1)
    expect(users[0].name).toBe('Alice Silva')
  })

  it('should filter users by search term matching email', async () => {
    await repository.create({
      name: 'Carol',
      email: 'carol@example.com',
      password_hash: await hash('123456', 6),
    })
    await repository.create({
      name: 'Dave',
      email: 'dave@test.com',
      password_hash: await hash('123456', 6),
    })

    const { users, total } = await sut.execute({ page: 1, perPage: 20, search: 'example.com' })

    expect(users).toHaveLength(1)
    expect(total).toBe(1)
    expect(users[0].email).toBe('carol@example.com')
  })

  it('should be case-insensitive when filtering by search', async () => {
    await repository.create({
      name: 'Eduardo Costa',
      email: 'eduardo@test.com',
      password_hash: await hash('123456', 6),
    })

    const { users } = await sut.execute({ page: 1, perPage: 20, search: 'EDUARDO' })

    expect(users).toHaveLength(1)
    expect(users[0].name).toBe('Eduardo Costa')
  })

  it('should return soft-deleted users when showDeleted is true', async () => {
    const user = await repository.create({
      name: 'Deleted User',
      email: 'deleted@test.com',
      password_hash: await hash('123456', 6),
    })
    await repository.delete(user.id)

    const { users, total } = await sut.execute({ page: 1, perPage: 20, showDeleted: true })

    expect(users.some((u) => u.id === user.id)).toBe(true)
    expect(total).toBeGreaterThanOrEqual(1)
  })

  it('should return only deleted users when onlyDeleted is true', async () => {
    const active = await repository.create({
      name: 'Active User',
      email: 'active@test.com',
      password_hash: await hash('123456', 6),
    })
    const deleted = await repository.create({
      name: 'Deleted User',
      email: 'deleted@test.com',
      password_hash: await hash('123456', 6),
    })
    await repository.delete(deleted.id)

    const { users, total } = await sut.execute({ page: 1, perPage: 20, onlyDeleted: true })

    expect(users).toHaveLength(1)
    expect(total).toBe(1)
    expect(users[0].id).toBe(deleted.id)
    expect(users.some((u) => u.id === active.id)).toBe(false)
  })

  it('should return only deleted users when onlyDeleted is true even if showDeleted is false', async () => {
    const deleted = await repository.create({
      name: 'Deleted User 2',
      email: 'deleted2@test.com',
      password_hash: await hash('123456', 6),
    })
    await repository.delete(deleted.id)

    const { users, total } = await sut.execute({
      page: 1,
      perPage: 20,
      onlyDeleted: true,
      showDeleted: false,
    })

    expect(users).toHaveLength(1)
    expect(total).toBe(1)
    expect(users[0].id).toBe(deleted.id)
  })

  it('should not return soft-deleted users when showDeleted is false', async () => {
    const user = await repository.create({
      name: 'Hidden User',
      email: 'hidden@test.com',
      password_hash: await hash('123456', 6),
    })
    await repository.delete(user.id)

    const { users, total } = await sut.execute({ page: 1, perPage: 20, showDeleted: false })

    expect(users.some((u) => u.id === user.id)).toBe(false)
    expect(total).toBe(0)
  })
})
