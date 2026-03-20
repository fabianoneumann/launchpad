import { FastifyRequest, FastifyReply } from 'fastify'
import { makeAuthenticateService } from '@/shared/factories/make-authenticate-service'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = request.body as { email: string; password: string }

  const service = makeAuthenticateService()
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
