import type { Locale } from '@launchpad/shared-types'

export interface WelcomeEmailContent {
  subject: string
  greeting: string
  body: string
  footer: string
}

const translations: Record<Locale, WelcomeEmailContent> = {
  'pt-BR': {
    subject: 'Bem-vindo ao Launchpad!',
    greeting: 'Olá, {{name}}!',
    body: 'Sua conta foi criada com sucesso. Estamos felizes em tê-lo conosco.',
    footer: 'Equipe Launchpad',
  },
  en: {
    subject: 'Welcome to Launchpad!',
    greeting: 'Hello, {{name}}!',
    body: 'Your account has been created successfully. We are happy to have you with us.',
    footer: 'Launchpad Team',
  },
  es: {
    subject: '¡Bienvenido a Launchpad!',
    greeting: '¡Hola, {{name}}!',
    body: 'Tu cuenta ha sido creada con éxito. Estamos felices de tenerte con nosotros.',
    footer: 'Equipo Launchpad',
  },
}

export function getWelcomeEmailContent(locale: Locale = 'pt-BR'): WelcomeEmailContent {
  return translations[locale] ?? translations['pt-BR']
}
