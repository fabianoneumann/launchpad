import type { User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

interface GetProfileServiceRequest {
  userId: string
}

interface GetProfileServiceResponse {
  user: User
}

export class GetProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetProfileServiceRequest): Promise<GetProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
