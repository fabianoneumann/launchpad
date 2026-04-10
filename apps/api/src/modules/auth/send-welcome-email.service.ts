import { render } from '@react-email/render'
import type { Locale } from '@launchpad/shared-types'
import type { UsersRepository } from '@/repositories/users-repository'
import type { MailProvider } from '@/lib/mail/mail-provider'
import { WelcomeEmail } from '@/lib/mail/emails/welcome'
import { getWelcomeEmailContent } from '@/lib/mail/content/welcome-content'

interface SendWelcomeEmailServiceRequest {
  userId: string
}

export class SendWelcomeEmailService {
  constructor(
    private usersRepository: UsersRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({ userId }: SendWelcomeEmailServiceRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return
    }

    const content = getWelcomeEmailContent(user.locale as Locale)
    const html = await render(WelcomeEmail({ name: user.name, content }))
    await this.mailProvider.send({ to: user.email, subject: content.subject, html })
  }
}
