import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateProfileService } from '@/modules/auth/update-profile.service'

export function makeUpdateProfileService() {
  const repository = new PrismaUsersRepository()
  return new UpdateProfileService(repository)
}
