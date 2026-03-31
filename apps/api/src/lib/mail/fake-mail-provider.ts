import type { MailProvider } from './mail-provider'

interface SentEmail {
  to: string
  subject: string
  html: string
}

export class FakeMailProvider implements MailProvider {
  public sent: SentEmail[] = []

  async send(options: { to: string; subject: string; html: string }): Promise<void> {
    this.sent.push(options)
  }
}
