import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaEmailVerificationTokensRepository } from '@/repositories/prisma/prisma-email-verification-tokens-repository'
import { VerifyEmailService } from '@/modules/auth/verify-email.service'

export function makeVerifyEmailService() {
  const usersRepository = new PrismaUsersRepository()
  const emailVerificationTokensRepository = new PrismaEmailVerificationTokensRepository()
  return new VerifyEmailService(usersRepository, emailVerificationTokensRepository)
}
