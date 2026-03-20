import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteOwnAccountService } from '@/modules/auth/delete-own-account.service'

export function makeDeleteOwnAccountService() {
  const repository = new PrismaUsersRepository()
  return new DeleteOwnAccountService(repository)
}
