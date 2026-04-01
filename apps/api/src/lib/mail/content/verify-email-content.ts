import type { Locale } from '@eco-iguassu/shared-types'

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
    subject: 'Confirme seu e-mail — Eco Iguaçu',
    greeting: 'Olá, {{name}}!',
    body: 'Clique no botão abaixo para confirmar seu endereço de e-mail.',
    ctaLabel: 'Confirmar e-mail',
    expiry: 'O link expira em 24 horas.',
    footer: 'Equipe Eco Iguaçu',
  },
  en: {
    subject: 'Confirm your email — Eco Iguaçu',
    greeting: 'Hello, {{name}}!',
    body: 'Click the button below to confirm your email address.',
    ctaLabel: 'Confirm email',
    expiry: 'The link expires in 24 hours.',
    footer: 'Eco Iguaçu Team',
  },
  es: {
    subject: 'Confirma tu correo electrónico — Eco Iguaçu',
    greeting: '¡Hola, {{name}}!',
    body: 'Haz clic en el botón de abajo para confirmar tu dirección de correo electrónico.',
    ctaLabel: 'Confirmar correo',
    expiry: 'El enlace expira en 24 horas.',
    footer: 'Equipo Eco Iguaçu',
  },
}

export function getVerifyEmailContent(locale: Locale = 'pt-BR'): VerifyEmailContent {
  return translations[locale] ?? translations['pt-BR']
}
