import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ChangePasswordService } from '@/modules/auth/change-password.service'

export function makeChangePasswordService() {
  const repository = new PrismaUsersRepository()
  return new ChangePasswordService(repository)
}
