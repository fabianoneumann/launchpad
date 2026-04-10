import type { Locale } from '@launchpad/shared-types'

export interface VerifyEmailContent {
  subject: string
  greeting: string
  body: string
  ctaLabel: string
  expiry: string
  footer: string
}

const translations: Record<Locale, VerifyEmailContent> = {
  'pt-BR': {
    subject: 'Confirme seu e-mail — Launchpad',
    greeting: 'Olá, {{name}}!',
    body: 'Clique no botão abaixo para confirmar seu endereço de e-mail.',
    ctaLabel: 'Confirmar e-mail',
    expiry: 'O link expira em 24 horas.',
    footer: 'Equipe Launchpad',
  },
  en: {
    subject: 'Confirm your email — Launchpad',
    greeting: 'Hello, {{name}}!',
    body: 'Click the button below to confirm your email address.',
    ctaLabel: 'Confirm email',
    expiry: 'The link expires in 24 hours.',
    footer: 'Launchpad Team',
  },
  es: {
    subject: 'Confirma tu correo electrónico — Launchpad',
    greeting: '¡Hola, {{name}}!',
    body: 'Haz clic en el botón de abajo para confirmar tu dirección de correo electrónico.',
    ctaLabel: 'Confirmar correo',
    expiry: 'El enlace expira en 24 horas.',
    footer: 'Equipo Launchpad',
  },
}

export function getVerifyEmailContent(locale: Locale = 'pt-BR'): VerifyEmailContent {
  return translations[locale] ?? translations['pt-BR']
}
