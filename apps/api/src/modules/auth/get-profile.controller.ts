import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetProfileService } from '@/shared/factories/make-get-profile-service'

export async function getProfileController(request: FastifyRequest, reply: FastifyReply) {
  const service = makeGetProfileService()
  const { user } = await service.execute({ userId: request.user.sub })

  return reply.status(200).send({ user })
}
