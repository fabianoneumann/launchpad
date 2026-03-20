import { User } from '@/generated/prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

interface GetUserServiceRequest {
  userId: string
}

interface GetUserServiceResponse {
  user: User
}

export class GetUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserServiceRequest): Promise<GetUserServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
