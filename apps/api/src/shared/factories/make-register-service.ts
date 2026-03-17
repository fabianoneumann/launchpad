import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterService } from '@/modules/auth/register.service'

export function makeRegisterService() {
  const repository = new PrismaUsersRepository()
  return new RegisterService(repository)
}
