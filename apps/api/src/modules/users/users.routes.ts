import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/shared/middlewares/verify-jwt'
import { verifyUserRole } from '@/shared/middlewares/verify-user-role'
import { listUsersController } from './list-users.controller'
import { getUserController } from './get-user.controller'
import { updateUserController } from './update-user.controller'
import { changeUserRoleController } from './change-user-role.controller'
import { deleteUserController } from './delete-user.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.addHook('onRequest', verifyUserRole('ADMIN'))

  app.get('/users', listUsersController)
  app.get('/users/:id', getUserController)
  app.patch('/users/:id', updateUserController)
  app.patch('/users/:id/role', changeUserRoleController)
  app.delete('/users/:id', deleteUserController)
}
