import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AdminAuthenticateService } from '@/modules/auth/admin-authenticate.service'

export function makeAdminAuthenticateService() {
  const repository = new PrismaUsersRepository()
  return new AdminAuthenticateService(repository)
}
