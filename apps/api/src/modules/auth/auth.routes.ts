import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { SUPPORTED_LOCALES } from '@eco-iguassu/shared-types'
import { verifyJWT } from '@/shared/middlewares/verify-jwt'
import { registerController } from './register.controller'
import { authenticateController } from './authenticate.controller'
import { refreshTokenController } from './refresh-token.controller'
import { logoutController } from './logout.controller'
import { getProfileController } from './get-profile.controller'
import { forgotPasswordController } from './forgot-password.controller'
import { resetPasswordController } from './reset-password.controller'
import { adminAuthenticateController } from './admin-authenticate.controller'
import { updateProfileController } from './update-profile.controller'
import { changePasswordController } from './change-password.controller'
import { deleteOwnAccountController } from './delete-own-account.controller'
import { verifyEmailController } from './verify-email.controller'
import { resendVerificationEmailController } from './resend-verification-email.controller'

const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['ADMIN', 'MEMBER', 'USER']),
  locale: z.string(),
  validated_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
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

  app.route({
    method: 'PATCH',
    url: '/auth/me',
    schema: {
      body: z
        .object({
          name: z.string().min(1).optional(),
          locale: z.enum(SUPPORTED_LOCALES).optional(),
        })
        .refine((data) => data.name !== undefined || data.locale !== undefined, {
          message: 'Pelo menos um campo deve ser fornecido',
        }),
      response: {
        200: z.object({ user: userResponseSchema }),
      },
    },
    onRequest: [verifyJWT],
    handler: updateProfileController,
  })

  app.route({
    method: 'PATCH',
    url: '/auth/me/password',
    schema: {
      body: z.object({
        currentPassword: z.string().min(6),
        newPassword: z.string().min(6),
      }),
      response: {
        204: z.null(),
      },
    },
    onRequest: [verifyJWT],
    handler: changePasswordController,
  })

  app.route({
    method: 'DELETE',
    url: '/auth/me',
    schema: {
      response: {
        204: z.null(),
      },
    },
    onRequest: [verifyJWT],
    handler: deleteOwnAccountController,
  })

  app.route({
    method: 'GET',
    url: '/auth/email/verify',
    schema: {
      querystring: z.object({ token: z.string() }),
      response: {
        204: z.null(),
      },
    },
    handler: verifyEmailController,
  })

  app.route({
    method: 'POST',
    url: '/auth/email/verify/resend',
    schema: {
      response: {
        204: z.null(),
      },
    },
    onRequest: [verifyJWT],
    handler: resendVerificationEmailController,
  })

  app.route({
    method: 'POST',
    url: '/auth/admin/login',
    schema: {
      body: z.object({
        email: z.email(),
        password: z.string().min(6),
      }),
      response: {
        200: z.object({ token: z.string() }),
      },
    },
    handler: adminAuthenticateController,
  })
}
