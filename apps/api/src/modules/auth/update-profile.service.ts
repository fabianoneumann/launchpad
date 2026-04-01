import type { User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

interface UpdateProfileServiceRequest {
  userId: string
  name?: string
  locale?: string
}

interface UpdateProfileServiceResponse {
  user: User
}

export class UpdateProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    locale,
  }: UpdateProfileServiceRequest): Promise<UpdateProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const updatedUser = await this.usersRepository.update(userId, {
      ...(name !== undefined && { name }),
      ...(locale !== undefined && { locale }),
    })

    return { user: updatedUser }
  }
}
