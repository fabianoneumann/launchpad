import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserService } from '@/shared/factories/make-get-user-service'

export async function getUserController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const service = makeGetUserService()
  const { user } = await service.execute({ userId: id })

  const { password_hash: _, ...userWithoutPassword } = user

  return reply.status(200).send({ user: userWithoutPassword })
}
