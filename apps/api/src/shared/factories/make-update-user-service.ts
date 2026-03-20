import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUserService } from '@/modules/users/update-user.service'

export function makeUpdateUserService() {
  const repository = new PrismaUsersRepository()
  return new UpdateUserService(repository)
}
