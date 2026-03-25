import { UsersRepository } from '@/repositories/users-repository'

interface LogoutServiceRequest {
  userId: string
}

export class LogoutService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: LogoutServiceRequest): Promise<void> {
    await this.usersRepository.incrementTokenVersion(userId)
  }
}
