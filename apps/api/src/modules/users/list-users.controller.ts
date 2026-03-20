import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeListUsersService } from '@/shared/factories/make-list-users-service'

export async function listUsersController(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    perPage: z.coerce.number().int().positive().default(20),
    role: z.enum(['ADMIN', 'MEMBER', 'USER']).optional(),
  })

  const { page, perPage, role } = querySchema.parse(request.query)

  const service = makeListUsersService()
  const { users, total } = await service.execute({ page, perPage, role })

  const usersWithoutPassword = users.map(({ password_hash: _, ...user }) => user)

  return reply.status(200).send({ users: usersWithoutPassword, total })
}
