import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ListUsersService } from '@/modules/users/list-users.service'

export function makeListUsersService() {
  const repository = new PrismaUsersRepository()
  return new ListUsersService(repository)
}
