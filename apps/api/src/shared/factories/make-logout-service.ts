import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { LogoutService } from '@/modules/auth/logout.service'

export function makeLogoutService() {
  const repository = new PrismaUsersRepository()
  return new LogoutService(repository)
}
