import { FastifyRequest, FastifyReply } from 'fastify'
import { makeAdminAuthenticateService } from '@/shared/factories/make-admin-authenticate-service'

export async function adminAuthenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = request.body as { email: string; password: string }

  const service = makeAdminAuthenticateService()
  const { user } = await service.execute({ email, password })

  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
