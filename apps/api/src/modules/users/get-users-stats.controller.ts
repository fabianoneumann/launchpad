import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUsersStatsService } from '@/shared/factories/make-get-users-stats-service'

export async function getUsersStatsController(request: FastifyRequest, reply: FastifyReply) {
  const service = makeGetUsersStatsService()
  const stats = await service.execute()
  return reply.status(200).send(stats)
}
