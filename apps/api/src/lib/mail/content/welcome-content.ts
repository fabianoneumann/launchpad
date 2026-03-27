export interface WelcomeEmailContent {
  subject: string
  greeting: string
  body: string
  footer: string
}

export function getWelcomeEmailContent(locale?: string): WelcomeEmailContent {
  return {
    subject: 'Bem-vindo ao Eco Iguaçu!',
    greeting: 'Olá, {{name}}!',
    body: 'Sua conta foi criada com sucesso. Estamos felizes em tê-lo conosco.',
    footer: 'Equipe Eco Iguaçu',
  }
}
