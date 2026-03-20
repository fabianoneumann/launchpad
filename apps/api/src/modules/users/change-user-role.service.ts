import { Role, User } from '@/generated/prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { CannotTargetSelfError } from '@/shared/errors/cannot-target-self-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

interface ChangeUserRoleServiceRequest {
  adminId: string
  userId: string
  role: Role
}

interface ChangeUserRoleServiceResponse {
  user: User
}

export class ChangeUserRoleService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ adminId, userId, role }: ChangeUserRoleServiceRequest): Promise<ChangeUserRoleServiceResponse> {
    if (adminId === userId) {
      throw new CannotTargetSelfError()
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const updatedUser = await this.usersRepository.update(userId, { role })

    return { user: updatedUser }
  }
}
