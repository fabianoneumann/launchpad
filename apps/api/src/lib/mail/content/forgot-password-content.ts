import type { Locale } from '@launchpad/shared-types'

export interface ForgotPasswordEmailContent {
  subject: string
  greeting: string
  body: string
  ctaLabel: string
  expiry: string
  footer: string
  ignore: string
}

const translations: Record<Locale, ForgotPasswordEmailContent> = {
  'pt-BR': {
    subject: 'Redefinição de senha — Launchpad',
    greeting: 'Olá, {{name}}!',
    body: 'Recebemos uma solicitação para redefinir a senha da sua conta.',
    ctaLabel: 'Clique aqui para redefinir sua senha',
    expiry: 'O link expira em 2 horas.',
    ignore: 'Se você não solicitou a redefinição, ignore este e-mail.',
    footer: 'Equipe Launchpad',
  },
  en: {
    subject: 'Password reset — Launchpad',
    greeting: 'Hello, {{name}}!',
    body: 'We received a request to reset your account password.',
    ctaLabel: 'Click here to reset your password',
    expiry: 'The link expires in 2 hours.',
    ignore: 'If you did not request a reset, please ignore this email.',
    footer: 'Launchpad Team',
  },
  es: {
    subject: 'Restablecimiento de contraseña — Launchpad',
    greeting: '¡Hola, {{name}}!',
    body: 'Recibimos una solicitud para restablecer la contraseña de tu cuenta.',
    ctaLabel: 'Haz clic aquí para restablecer tu contraseña',
    expiry: 'El enlace expira en 2 horas.',
    ignore: 'Si no solicitaste el restablecimiento, ignora este correo.',
    footer: 'Equipo Launchpad',
  },
}

export function getForgotPasswordContent(locale: Locale = 'pt-BR'): ForgotPasswordEmailContent {
  return translations[locale] ?? translations['pt-BR']
}
