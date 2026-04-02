import type { FastifyRequest, FastifyReply } from 'fastify'
import type { Role } from '@/generated/prisma/client'
import { makeListUsersService } from '@/shared/factories/make-list-users-service'

export async function listUsersController(request: FastifyRequest, reply: FastifyReply) {
  const { page, perPage, role, search, showDeleted, onlyDeleted } = request.query as {
    page: number
    perPage: number
    role?: Role
    search?: string
    showDeleted: boolean
    onlyDeleted: boolean
  }

  const service = makeListUsersService()
  const { users, total } = await service.execute({
    page,
    perPage,
    role,
    search,
    showDeleted,
    onlyDeleted,
  })

  return reply.status(200).send({ users, total })
}
