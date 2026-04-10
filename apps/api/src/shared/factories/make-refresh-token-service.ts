import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RefreshTokenService } from '@/modules/auth/refresh-token.service'

export function makeRefreshTokenService() {
  const repository = new PrismaUsersRepository()
  return new RefreshTokenService(repository)
}
