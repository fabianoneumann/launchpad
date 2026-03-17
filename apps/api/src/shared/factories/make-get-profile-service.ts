import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetProfileService } from '@/modules/auth/get-profile.service'

export function makeGetProfileService() {
  const repository = new PrismaUsersRepository()
  return new GetProfileService(repository)
}
