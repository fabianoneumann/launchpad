import type { User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

interface RefreshTokenServiceRequest {
  userId: string
  tokenVersion: number
}

interface RefreshTokenServiceResponse {
  user: User
}

export class RefreshTokenService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    tokenVersion,
  }: RefreshTokenServiceRequest): Promise<RefreshTokenServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user || user.token_version !== tokenVersion) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
