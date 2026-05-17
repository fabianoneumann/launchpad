import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaEmailVerificationTokensRepository } from '@/repositories/prisma/prisma-email-verification-tokens-repository'
import { ResendMailProvider } from '@/lib/mail/resend-mail-provider'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { EnsureVerificationLinkValidService } from '@/modules/auth/ensure-verification-link-valid.service'
import { env } from '@/env'

export function makeEnsureVerificationLinkValidService() {
  const usersRepository = new PrismaUsersRepository()
  const emailVerificationTokensRepository = new PrismaEmailVerificationTokensRepository()
  const mailProvider = env.NODE_ENV === 'test' ? new FakeMailProvider() : new ResendMailProvider()
  return new EnsureVerificationLinkValidService(
    usersRepository,
    emailVerificationTokensRepository,
    mailProvider,
  )
}
