export interface MailProvider {
  send(options: { to: string; subject: string; html: string }): Promise<void>
}
