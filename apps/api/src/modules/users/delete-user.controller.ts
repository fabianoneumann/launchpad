import { FastifyRequest, FastifyReply } from 'fastify'
import { makeDeleteUserService } from '@/shared/factories/make-delete-user-service'

export async function deleteUserController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }

  const service = makeDeleteUserService()
  await service.execute({ adminId: request.user.sub, userId: id })

  return reply.status(204).send()
}
