import { AppError } from '@/shared/errors/app-error'

export class CannotTargetSelfError extends AppError {
  constructor() {
    super('Você não pode realizar esta ação em sua própria conta.', 400)
  }
}
