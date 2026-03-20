import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

interface DeleteOwnAccountServiceRequest {
  userId: string
}

export class DeleteOwnAccountService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteOwnAccountServiceRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    await this.usersRepository.delete(userId)
  }
}
