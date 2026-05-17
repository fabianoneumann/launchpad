import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeAuthenticateService } from '@/shared/factories/make-authenticate-service'
import { makeEnsureVerificationLinkValidService } from '@/shared/factories/make-ensure-verification-link-valid-service'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string }

  const service = makeAuthenticateService()

  try {
    const { user } = await service.execute({ email, password })

    const token = await reply.jwtSign(
      { role: user.role, tokenVersion: user.token_version },
      { sign: { sub: user.id } },
    )

    const refreshToken = await reply.jwtSign(
      { role: user.role, tokenVersion: user.token_version },
      { sign: { sub: user.id, expiresIn: '7d' } },
    )

    request.log.info({ event: 'user.login_success', userId: user.id, role: user.role })

    if (!user.validated_at) {
      makeEnsureVerificationLinkValidService()
        .execute({ userId: user.id })
        .catch((err) =>
          request.log.error({
            event: 'email.verify_ensure_failed',
            userId: user.id,
            error: err.message,
          }),
        )
    }

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token, user })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      request.log.warn({ event: 'user.login_failed', email, ip: request.ip })
    }
    throw err
  }
}
