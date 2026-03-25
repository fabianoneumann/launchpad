import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { LogoutService } from './logout.service'

describe('LogoutService', () => {
  let repository: InMemoryUsersRepository
  let sut: LogoutService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new LogoutService(repository)
  })

  it('should increment token_version on logout', async () => {
    const user = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    expect(user.token_version).toBe(0)

    await sut.execute({ userId: user.id })

    const updated = await repository.findById(user.id)
    expect(updated!.token_version).toBe(1)
  })

  it('should increment token_version with the correct user id', async () => {
    const userA = await repository.create({
      name: 'User A',
      email: 'a@example.com',
      password_hash: await hash('123456', 6),
    })
    const userB = await repository.create({
      name: 'User B',
      email: 'b@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({ userId: userA.id })

    const updatedA = await repository.findById(userA.id)
    const updatedB = await repository.findById(userB.id)

    expect(updatedA!.token_version).toBe(1)
    expect(updatedB!.token_version).toBe(0)
  })
})
