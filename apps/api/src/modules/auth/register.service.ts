import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { render } from '@react-email/render'
import type { User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import type { MailProvider } from '@/lib/mail/mail-provider'
import { WelcomeEmail } from '@/lib/mail/emails/welcome'
import { getWelcomeEmailContent } from '@/lib/mail/content/welcome-content'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(
    private usersRepository: UsersRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    const content = getWelcomeEmailContent()
    render(WelcomeEmail({ name: user.name, content }))
      .then((html) => this.mailProvider.send({ to: user.email, subject: content.subject, html }))
      .catch(() => {})

    return { user }
  }
}
