import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ResendMailProvider } from '@/lib/mail/resend-mail-provider'
import { FakeMailProvider } from '@/lib/mail/fake-mail-provider'
import { RegisterService } from '@/modules/auth/register.service'
import { env } from '@/env'

export function makeRegisterService() {
  const usersRepository = new PrismaUsersRepository()
  const mailProvider = env.NODE_ENV === 'test' ? new FakeMailProvider() : new ResendMailProvider()
  return new RegisterService(usersRepository, mailProvider)
}
