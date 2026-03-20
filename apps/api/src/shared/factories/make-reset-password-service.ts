import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaPasswordResetTokensRepository } from '@/repositories/prisma/prisma-password-reset-tokens-repository'
import { ResetPasswordService } from '@/modules/auth/reset-password.service'

export function makeResetPasswordService() {
  const usersRepository = new PrismaUsersRepository()
  const passwordResetTokensRepository = new PrismaPasswordResetTokensRepository()
  return new ResetPasswordService(usersRepository, passwordResetTokensRepository)
}
