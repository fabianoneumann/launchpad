import { createHash, randomBytes } from 'node:crypto'
import { render } from '@react-email/render'
import type { User } from '@/generated/prisma/client'
import type { Locale } from '@eco-iguassu/shared-types'
import type { EmailVerificationTokensRepository } from '@/repositories/email-verification-tokens-repository'
import type { MailProvider } from '@/lib/mail/mail-provider'
import { VerifyEmail } from '@/lib/mail/emails/verify-email'
import { getVerifyEmailContent } from '@/lib/mail/content/verify-email-content'
import { env } from '@/env'

export async function generateAndSendVerificationEmail(
  user: User,
  emailVerificationTokensRepository: EmailVerificationTokensRepository,
  mailProvider: MailProvider,
): Promise<void> {
  const token = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24)

  await emailVerificationTokensRepository.create({ tokenHash, userId: user.id, expiresAt })

  const verificationLink = `${env.APP_URL ?? 'http://localhost:5173'}/verify-email?token=${token}`
  const content = getVerifyEmailContent(user.locale as Locale)
  const html = await render(VerifyEmail({ name: user.name, verificationLink, content }))

  await mailProvider.send({ to: user.email, subject: content.subject, html })
}
