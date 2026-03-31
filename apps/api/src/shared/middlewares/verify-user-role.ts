import type { FastifyReply, FastifyRequest } from 'fastify'

const roleHierarchy = { ADMIN: 3, MEMBER: 2, USER: 1 } as const

type Role = keyof typeof roleHierarchy

export function verifyUserRole(roleToVerify: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (roleHierarchy[role] < roleHierarchy[roleToVerify]) {
      return reply.status(403).send({ message: 'Não autorizado.' })
    }
  }
}
