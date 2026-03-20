import { User } from '@/generated/prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

interface UpdateUserServiceRequest {
  userId: string
  name: string
  email: string
}

interface UpdateUserServiceResponse {
  user: User
}

export class UpdateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, name, email }: UpdateUserServiceRequest): Promise<UpdateUserServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (email !== user.email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email)
      if (userWithSameEmail) {
        throw new UserAlreadyExistsError()
      }
    }

    const updatedUser = await this.usersRepository.update(userId, { name, email })

    return { user: updatedUser }
  }
}
