import type { FastifyRequest, FastifyReply } from 'fastify'
import type { Role } from '@/generated/prisma/client'
import { makeChangeUserRoleService } from '@/shared/factories/make-change-user-role-service'

export async function changeUserRoleController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const { role } = request.body as { role: Role }

  const service = makeChangeUserRoleService()
  const { user } = await service.execute({ adminId: request.user.sub, userId: id, role })

  request.log.info({ event: 'user.role_changed', userId: id, role, adminId: request.user.sub })

  return reply.status(200).send({ user })
}
