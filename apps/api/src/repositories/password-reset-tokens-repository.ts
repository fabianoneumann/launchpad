import { PasswordResetToken } from '@/generated/prisma/client'

export interface PasswordResetTokensRepository {
  create(data: { token: string; userId: string; expiresAt: Date }): Promise<PasswordResetToken>
  findByToken(token: string): Promise<PasswordResetToken | null>
  markAsUsed(id: string): Promise<void>
}
