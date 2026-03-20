import { AppError } from './app-error'

export class InsufficientRoleError extends AppError {
  constructor() {
    super('Acesso não autorizado para este painel.', 403)
  }
}
