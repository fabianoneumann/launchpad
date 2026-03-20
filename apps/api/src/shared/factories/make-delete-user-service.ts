import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteUserService } from '@/modules/users/delete-user.service'

export function makeDeleteUserService() {
  const repository = new PrismaUsersRepository()
  return new DeleteUserService(repository)
}
