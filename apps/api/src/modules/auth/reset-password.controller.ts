import { FastifyRequest, FastifyReply } from 'fastify'
import { makeResetPasswordService } from '@/shared/factories/make-reset-password-service'

export async function resetPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token, newPassword } = request.body as { token: string; newPassword: string }

  const service = makeResetPasswordService()
  await service.execute({ token, newPassword })

  return reply.status(204).send()
}
