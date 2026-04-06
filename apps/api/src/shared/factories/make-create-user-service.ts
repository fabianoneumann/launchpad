import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaPasswordResetTokensRepository } from '@/repositories/prisma/prisma-password-reset-tokens-repository'
import { ResendMailProvider } from '@/lib/mail/resend-mail-provider'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { CreateUserService } from '@/modules/users/create-user.service'
import { env } from '@/env'

export function makeCreateUserService() {
  const usersRepository = new PrismaUsersRepository()
  const passwordResetTokensRepository = new PrismaPasswordResetTokensRepository()
  const mailProvider =
    env.NODE_ENV === 'production' ? new ResendMailProvider() : new FakeMailProvider()
  return new CreateUserService(usersRepository, passwordResetTokensRepository, mailProvider)
}
