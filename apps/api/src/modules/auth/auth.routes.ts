import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/shared/middlewares/verify-jwt'
import { registerController } from './register.controller'
import { authenticateController } from './authenticate.controller'
import { refreshTokenController } from './refresh-token.controller'
import { logoutController } from './logout.controller'
import { getProfileController } from './get-profile.controller'
import { forgotPasswordController } from './forgot-password.controller'
import { resetPasswordController } from './reset-password.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', registerController)
  app.post('/auth/login', authenticateController)
  app.patch('/auth/token/refresh', refreshTokenController)
  app.delete('/auth/logout', { onRequest: [verifyJWT] }, logoutController)
  app.get('/auth/me', { onRequest: [verifyJWT] }, getProfileController)
  app.post('/auth/password/forgot', forgotPasswordController)
  app.patch('/auth/password/reset', resetPasswordController)
}
