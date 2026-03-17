import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '@/modules/auth/authenticate.service'

export function makeAuthenticateService() {
  const repository = new PrismaUsersRepository()
  return new AuthenticateService(repository)
}
