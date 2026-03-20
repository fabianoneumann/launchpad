import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteUserService } from '@/shared/factories/make-delete-user-service'

export async function deleteUserController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const service = makeDeleteUserService()
  await service.execute({ adminId: request.user.sub, userId: id })

  return reply.status(204).send()
}
