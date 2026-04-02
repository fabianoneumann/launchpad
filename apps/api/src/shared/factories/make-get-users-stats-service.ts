import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUsersStatsService } from '@/modules/users/get-users-stats.service'

export function makeGetUsersStatsService() {
  const usersRepository = new PrismaUsersRepository()
  return new GetUsersStatsService(usersRepository)
}
