import type { Locale } from '@eco-iguassu/shared-types'

export interface InviteEmailContent {
  subject: string
  greeting: string
  body: string
  ctaLabel: string
  expiry: string
  footer: string
}

const translations: Record<Locale, InviteEmailContent> = {
  'pt-BR': {
    subject: 'Seu acesso ao Eco Iguassu foi criado',
    greeting: 'Olá, {{name}}!',
    body: 'Um administrador criou uma conta para você no Eco Iguassu.',
    ctaLabel: 'Clique aqui para definir sua senha e acessar o painel',
    expiry: 'O link expira em 72 horas.',
    footer: 'Equipe Eco Iguassu Adventure',
  },
  en: {
    subject: 'Your Eco Iguassu Adventure access has been created',
    greeting: 'Hello, {{name}}!',
    body: 'An administrator created an account for you on Eco Iguassu Adventure.',
    ctaLabel: 'Click here to set your password and access the dashboard',
    expiry: 'The link expires in 72 hours.',
    footer: 'Eco Iguassu Adventure Team',
  },
  es: {
    subject: 'Tu acceso a Eco Iguassu Adventure ha sido creado',
    greeting: '¡Hola, {{name}}!',
    body: 'Un administrador creó una cuenta para ti en Eco Iguassu Adventure.',
    ctaLabel: 'Haz clic aquí para definir tu contraseña y acceder al panel',
    expiry: 'El enlace expira en 72 horas.',
    footer: 'Equipo Eco Iguassu Adventure',
  },
}

export function getInviteContent(locale: Locale = 'pt-BR'): InviteEmailContent {
  return translations[locale] ?? translations['pt-BR']
}
