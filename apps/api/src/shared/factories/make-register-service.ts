import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterService } from '@/modules/auth/register.service'

export function makeRegisterService() {
  const usersRepository = new PrismaUsersRepository()
  return new RegisterService(usersRepository)
}
