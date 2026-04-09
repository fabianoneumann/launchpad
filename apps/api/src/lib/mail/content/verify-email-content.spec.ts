import { describe, it, expect } from 'vitest'
import { SUPPORTED_LOCALES } from '@eco-iguassu/shared-types'
import { getVerifyEmailContent } from './verify-email-content'

describe('getVerifyEmailContent', () => {
  it('should return pt-BR content when no locale is provided', () => {
    const content = getVerifyEmailContent()
    expect(content.subject).toBe('Confirme seu e-mail — Eco Iguassu Adventure')
  })

  it.each(SUPPORTED_LOCALES)(
    'should return complete content with all required fields for locale %s',
    (locale) => {
      const content = getVerifyEmailContent(locale)
      expect(content.subject).toBeTruthy()
      expect(content.greeting).toBeTruthy()
      expect(content.body).toBeTruthy()
      expect(content.ctaLabel).toBeTruthy()
      expect(content.expiry).toBeTruthy()
      expect(content.footer).toBeTruthy()
    },
  )

  it('should return different subjects for different locales', () => {
    const ptBR = getVerifyEmailContent('pt-BR')
    const en = getVerifyEmailContent('en')
    const es = getVerifyEmailContent('es')
    expect(ptBR.subject).not.toBe(en.subject)
    expect(ptBR.subject).not.toBe(es.subject)
    expect(en.subject).not.toBe(es.subject)
  })
})
