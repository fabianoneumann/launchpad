import { FastifyRequest, FastifyReply } from 'fastify'
import { Role } from '@/generated/prisma/client'
import { makeListUsersService } from '@/shared/factories/make-list-users-service'

export async function listUsersController(request: FastifyRequest, reply: FastifyReply) {
  const { page, perPage, role } = request.query as {
    page: number
    perPage: number
    role?: Role
  }

  const service = makeListUsersService()
  const { users, total } = await service.execute({ page, perPage, role })

  return reply.status(200).send({ users, total })
}
