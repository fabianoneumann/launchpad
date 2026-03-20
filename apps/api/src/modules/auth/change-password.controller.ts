import { FastifyRequest, FastifyReply } from 'fastify'
import { makeChangePasswordService } from '@/shared/factories/make-change-password-service'

export async function changePasswordController(request: FastifyRequest, reply: FastifyReply) {
  const { currentPassword, newPassword } = request.body as {
    currentPassword: string
    newPassword: string
  }

  const service = makeChangePasswordService()
  await service.execute({ userId: request.user.sub, currentPassword, newPassword })

  return reply.status(204).send()
}
