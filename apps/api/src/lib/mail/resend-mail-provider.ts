import { Resend } from 'resend'
import { env } from '@/env'
import { MailProvider } from './mail-provider'

export class ResendMailProvider implements MailProvider {
  private client: Resend

  constructor() {
    if (!env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não está definida.')
    }
    this.client = new Resend(env.RESEND_API_KEY)
  }

  async send({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
    const { error } = await this.client.emails.send({
      from: env.MAIL_FROM,
      to: [to],
      subject,
      html,
    })
    if (error) throw new Error(error.message)
  }
}
