import bcrypt from 'bcryptjs'
const { compare, hash } = bcrypt
import type { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

interface ChangePasswordServiceRequest {
  userId: string
  currentPassword: string
  newPassword: string
}

export class ChangePasswordService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    currentPassword,
    newPassword,
  }: ChangePasswordServiceRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const doesPasswordMatch = await compare(currentPassword, user.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    const password_hash = await hash(newPassword, 6)

    await this.usersRepository.update(userId, { password_hash })
    await this.usersRepository.incrementTokenVersion(userId)
  }
}
