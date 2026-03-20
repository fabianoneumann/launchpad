import { z } from 'zod'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { verifyJWT } from '@/shared/middlewares/verify-jwt'
import { registerController } from './register.controller'
import { authenticateController } from './authenticate.controller'
import { refreshTokenController } from './refresh-token.controller'
import { logoutController } from './logout.controller'
import { getProfileController } from './get-profile.controller'
import { forgotPasswordController } from './forgot-password.controller'
import { resetPasswordController } from './reset-password.controller'

const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['ADMIN', 'MEMBER', 'USER']),
  created_at: z.date(),
})

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'POST',
    url: '/auth/register',
    schema: {
      body: z.object({
        name: z.string().min(1),
        email: z.email(),
        password: z.string().min(6),
      }),
      response: {
        201: z.object({ user: userResponseSchema }),
      },
    },
    handler: registerController,
  })

  app.route({
    method: 'POST',
    url: '/auth/login',
    schema: {
      body: z.object({
        email: z.email(),
        password: z.string().min(6),
      }),
      response: {
        200: z.object({ token: z.string() }),
      },
    },
    handler: authenticateController,
  })

  app.route({
    method: 'PATCH',
    url: '/auth/token/refresh',
    schema: {
      response: {
        200: z.object({ token: z.string() }),
      },
    },
    handler: refreshTokenController,
  })

  app.route({
    method: 'DELETE',
    url: '/auth/logout',
    schema: {
      response: {
        204: z.null(),
      },
    },
    onRequest: [verifyJWT],
    handler: logoutController,
  })

  app.route({
    method: 'GET',
    url: '/auth/me',
    schema: {
      response: {
        200: z.object({ user: userResponseSchema }),
      },
    },
    onRequest: [verifyJWT],
    handler: getProfileController,
  })

  app.route({
    method: 'POST',
    url: '/auth/password/forgot',
    schema: {
      body: z.object({
        email: z.email(),
      }),
      response: {
        204: z.null(),
      },
    },
    handler: forgotPasswordController,
  })

  app.route({
    method: 'PATCH',
    url: '/auth/password/reset',
    schema: {
      body: z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }),
      response: {
        204: z.null(),
      },
    },
    handler: resetPasswordController,
  })
}
