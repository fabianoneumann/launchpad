import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserService } from '@/modules/users/get-user.service'

export function makeGetUserService() {
  const repository = new PrismaUsersRepository()
  return new GetUserService(repository)
}
