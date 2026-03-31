import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserService } from '@/shared/factories/make-get-user-service'

export async function getUserController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }

  const service = makeGetUserService()
  const { user } = await service.execute({ userId: id })

  return reply.status(200).send({ user })
}
