import { describe, it, expect, beforeEach } from 'vitest'
import { hash, compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ChangePasswordService } from './change-password.service'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('ChangePasswordService', () => {
  let repository: InMemoryUsersRepository
  let sut: ChangePasswordService

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new ChangePasswordService(repository)
  })

  it('should change the password when current password is correct', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({
      userId: created.id,
      currentPassword: '123456',
      newPassword: 'new-password',
    })

    const updated = await repository.findById(created.id)
    const passwordChanged = await compare('new-password', updated!.password_hash)
    expect(passwordChanged).toBe(true)
  })

  it('should throw InvalidCredentialsError when current password is wrong', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: created.id,
        currentPassword: 'wrong-password',
        newPassword: 'new-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-id',
        currentPassword: '123456',
        newPassword: 'new-password',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should increment token_version after successful password change', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john2@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({
      userId: created.id,
      currentPassword: '123456',
      newPassword: 'new-password',
    })

    const updated = await repository.findById(created.id)
    expect(updated!.token_version).toBe(1)
  })

  it('should not increment token_version when current password is wrong', async () => {
    const created = await repository.create({
      name: 'John Doe',
      email: 'john3@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: created.id,
        currentPassword: 'wrong-password',
        newPassword: 'new-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)

    const unchanged = await repository.findById(created.id)
    expect(unchanged!.token_version).toBe(0)
  })
})
