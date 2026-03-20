import { AppError } from './app-error'

export class InvalidOrExpiredTokenError extends AppError {
  constructor() {
    super('Token inválido ou expirado.', 400)
  }
}
