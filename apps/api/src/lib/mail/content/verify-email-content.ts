export interface VerifyEmailContent {
  subject: string
  greeting: string
  body: string
  ctaLabel: string
  expiry: string
  footer: string
}

export function getVerifyEmailContent(_locale?: string): VerifyEmailContent {
  return {
    subject: 'Confirme seu e-mail — Eco Iguaçu',
    greeting: 'Olá, {{name}}!',
    body: 'Clique no botão abaixo para confirmar seu endereço de e-mail.',
    ctaLabel: 'Confirmar e-mail',
    expiry: 'O link expira em 24 horas.',
    footer: 'Equipe Eco Iguaçu',
  }
}
