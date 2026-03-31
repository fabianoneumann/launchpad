import type { UsersRepository } from '@/repositories/users-repository'
import { CannotTargetSelfError } from '@/shared/errors/cannot-target-self-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

interface DeleteUserServiceRequest {
  adminId: string
  userId: string
}

export class DeleteUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ adminId, userId }: DeleteUserServiceRequest): Promise<void> {
    if (adminId === userId) {
      throw new CannotTargetSelfError()
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    await this.usersRepository.delete(userId)
  }
}
