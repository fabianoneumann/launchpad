import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeResetPasswordService } from '@/shared/factories/make-reset-password-service'
import { InvalidOrExpiredTokenError } from '@/shared/errors/invalid-or-expired-token-error'

export async function resetPasswordController(request: FastifyRequest, reply: FastifyReply) {
  const { token, newPassword } = request.body as { token: string; newPassword: string }

  const service = makeResetPasswordService()

  try {
    await service.execute({ token, newPassword })
    request.log.info({ event: 'user.password_reset' })
  } catch (err) {
    if (err instanceof InvalidOrExpiredTokenError) {
      request.log.warn({ event: 'auth.token_invalid', context: 'password_reset' })
    }
    throw err
  }

  return reply.status(204).send()
}
