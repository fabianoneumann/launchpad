import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUsersStatsService } from './get-users-stats.service'

describe('GetUsersStatsService', () => {
  let repository: InMemoryUsersRepository
  let sut: GetUsersStatsService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new GetUsersStatsService(repository)
  })

  it('should return zeros when there are no users', async () => {
    const stats = await sut.execute()

    expect(stats).toEqual({
      total: 0,
      active: 0,
      unvalidated: 0,
      byRole: { ADMIN: 0, MEMBER: 0, USER: 0 },
    })
  })

  it('should count total including soft-deleted users', async () => {
    const passwordHash = await hash('123456', 6)
    await repository.create({ name: 'User 1', email: 'u1@test.com', password_hash: passwordHash })
    const u2 = await repository.create({
      name: 'User 2',
      email: 'u2@test.com',
      password_hash: passwordHash,
    })
    await repository.delete(u2.id)

    const stats = await sut.execute()

    expect(stats.total).toBe(2)
    expect(stats.active).toBe(1)
  })

  it('should count unvalidated only among active users', async () => {
    const passwordHash = await hash('123456', 6)
    // validated active
    await repository.create({
      name: 'Validated',
      email: 'v@test.com',
      password_hash: passwordHash,
      validated_at: new Date(),
    })
    // unvalidated active
    await repository.create({
      name: 'Unvalidated',
      email: 'uv@test.com',
      password_hash: passwordHash,
    })
    // unvalidated but deleted — should NOT count
    const deleted = await repository.create({
      name: 'Deleted',
      email: 'd@test.com',
      password_hash: passwordHash,
    })
    await repository.delete(deleted.id)

    const stats = await sut.execute()

    expect(stats.unvalidated).toBe(1)
  })

  it('should count byRole only among active users', async () => {
    const passwordHash = await hash('123456', 6)
    await repository.create({
      name: 'Admin Active',
      email: 'admin@test.com',
      password_hash: passwordHash,
      role: 'ADMIN',
    })
    const deletedAdmin = await repository.create({
      name: 'Admin Deleted',
      email: 'admin-d@test.com',
      password_hash: passwordHash,
      role: 'ADMIN',
    })
    await repository.delete(deletedAdmin.id)

    const stats = await sut.execute()

    expect(stats.byRole.ADMIN).toBe(1)
  })

  it('should return correct full stats with mixed users', async () => {
    const passwordHash = await hash('123456', 6)
    await repository.create({
      name: 'Admin',
      email: 'admin@test.com',
      password_hash: passwordHash,
      role: 'ADMIN',
      validated_at: new Date(),
    })
    await repository.create({
      name: 'Member',
      email: 'member@test.com',
      password_hash: passwordHash,
      role: 'MEMBER',
      validated_at: new Date(),
    })
    await repository.create({
      name: 'User Unvalidated',
      email: 'user@test.com',
      password_hash: passwordHash,
    })
    const deleted = await repository.create({
      name: 'Deleted',
      email: 'deleted@test.com',
      password_hash: passwordHash,
    })
    await repository.delete(deleted.id)

    const stats = await sut.execute()

    expect(stats.total).toBe(4)
    expect(stats.active).toBe(3)
    expect(stats.unvalidated).toBe(1)
    expect(stats.byRole).toEqual({ ADMIN: 1, MEMBER: 1, USER: 1 })
  })
})
