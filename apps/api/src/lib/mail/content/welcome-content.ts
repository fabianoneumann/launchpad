import type { Locale } from '@eco-iguassu/shared-types'

export interface WelcomeEmailContent {
  subject: string
  greeting: string
  body: string
  footer: string
}

const translations: Record<Locale, WelcomeEmailContent> = {
  'pt-BR': {
    subject: 'Bem-vindo ao Eco Iguassu Adventure!',
    greeting: 'Olá, {{name}}!',
    body: 'Sua conta foi criada com sucesso. Estamos felizes em tê-lo conosco.',
    footer: 'Equipe Eco Iguassu Adventure',
  },
  en: {
    subject: 'Welcome to Eco Iguassu Adventure!',
    greeting: 'Hello, {{name}}!',
    body: 'Your account has been created successfully. We are happy to have you with us.',
    footer: 'Eco Iguassu Adventure Team',
  },
  es: {
    subject: '¡Bienvenido a Eco Iguassu Adventure!',
    greeting: '¡Hola, {{name}}!',
    body: 'Tu cuenta ha sido creada con éxito. Estamos felices de tenerte con nosotros.',
    footer: 'Equipo Eco Iguassu Adventure',
  },
}

export function getWelcomeEmailContent(locale: Locale = 'pt-BR'): WelcomeEmailContent {
  return translations[locale] ?? translations['pt-BR']
}
