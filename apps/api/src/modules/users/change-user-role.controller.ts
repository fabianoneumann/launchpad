import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeChangeUserRoleService } from '@/shared/factories/make-change-user-role-service'

export async function changeUserRoleController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({ role: z.enum(['ADMIN', 'MEMBER', 'USER']) })

  const { id } = paramsSchema.parse(request.params)
  const { role } = bodySchema.parse(request.body)

  const service = makeChangeUserRoleService()
  const { user } = await service.execute({ adminId: request.user.sub, userId: id, role })

  const { password_hash: _, ...userWithoutPassword } = user

  return reply.status(200).send({ user: userWithoutPassword })
}
