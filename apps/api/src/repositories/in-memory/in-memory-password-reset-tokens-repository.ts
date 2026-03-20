import { randomUUID } from 'node:crypto'
import { PasswordResetToken } from '@/generated/prisma/client'
import { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository'

export class InMemoryPasswordResetTokensRepository implements PasswordResetTokensRepository {
  public items: PasswordResetToken[] = []

  async create(data: {
    token: string
    userId: string
    expiresAt: Date
  }): Promise<PasswordResetToken> {
    const resetToken: PasswordResetToken = {
      id: randomUUID(),
      token: data.token,
      user_id: data.userId,
      expires_at: data.expiresAt,
      used_at: null,
      created_at: new Date(),
    }
    this.items.push(resetToken)
    return resetToken
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return this.items.find((item) => item.token === token) ?? null
  }

  async markAsUsed(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items[index].used_at = new Date()
    }
  }
}
