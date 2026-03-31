import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaEmailVerificationTokensRepository } from '@/repositories/prisma/prisma-email-verification-tokens-repository'
import { ResendMailProvider } from '@/lib/mail/resend-mail-provider'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { ResendVerificationEmailService } from '@/modules/auth/resend-verification-email.service'
import { env } from '@/env'

export function makeResendVerificationEmailService() {
  const usersRepository = new PrismaUsersRepository()
  const emailVerificationTokensRepository = new PrismaEmailVerificationTokensRepository()
  const mailProvider = env.NODE_ENV === 'test' ? new FakeMailProvider() : new ResendMailProvider()
  return new ResendVerificationEmailService(
    usersRepository,
    emailVerificationTokensRepository,
    mailProvider,
  )
}
