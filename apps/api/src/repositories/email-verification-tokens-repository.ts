import { EmailVerificationToken } from '@/generated/prisma/client'

export interface EmailVerificationTokensRepository {
  create(data: { tokenHash: string; userId: string; expiresAt: Date }): Promise<EmailVerificationToken>
  findByToken(token: string): Promise<EmailVerificationToken | null>
  findLatestByUserId(userId: string): Promise<EmailVerificationToken | null>
  markAsUsed(id: string): Promise<void>
}
