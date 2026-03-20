import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaPasswordResetTokensRepository } from '@/repositories/prisma/prisma-password-reset-tokens-repository'
import { ResendMailProvider } from '@/lib/mail/resend-mail-provider'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { ForgotPasswordService } from '@/modules/auth/forgot-password.service'
import { env } from '@/env'

export function makeForgotPasswordService() {
  const usersRepository = new PrismaUsersRepository()
  const passwordResetTokensRepository = new PrismaPasswordResetTokensRepository()
  const mailProvider = env.NODE_ENV === 'test' ? new FakeMailProvider() : new ResendMailProvider()
  return new ForgotPasswordService(usersRepository, passwordResetTokensRepository, mailProvider)
}
