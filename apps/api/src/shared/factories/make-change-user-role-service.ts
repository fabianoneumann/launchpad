import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ChangeUserRoleService } from '@/modules/users/change-user-role.service'

export function makeChangeUserRoleService() {
  const repository = new PrismaUsersRepository()
  return new ChangeUserRoleService(repository)
}
