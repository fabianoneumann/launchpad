import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeResetPasswordService } from '@/shared/factories/make-reset-password-service'

export async function resetPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    token: z.string(),
    newPassword: z.string().min(6),
  })

  const { token, newPassword } = bodySchema.parse(request.body)

  const service = makeResetPasswordService()
  await service.execute({ token, newPassword })

  return reply.status(204).send()
}
