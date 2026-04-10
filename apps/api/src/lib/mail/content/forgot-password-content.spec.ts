import { describe, it, expect } from 'vitest'
import { SUPPORTED_LOCALES } from '@launchpad/shared-types'
import { getForgotPasswordContent } from './forgot-password-content'

describe('getForgotPasswordContent', () => {
  it('should return pt-BR content when no locale is provided', () => {
    const content = getForgotPasswordContent()
    expect(content.subject).toBe('Redefinição de senha — Launchpad')
  })

  it.each(SUPPORTED_LOCALES)(
    'should return complete content with all required fields for locale %s',
    (locale) => {
      const content = getForgotPasswordContent(locale)
      expect(content.subject).toBeTruthy()
      expect(content.greeting).toBeTruthy()
      expect(content.body).toBeTruthy()
      expect(content.ctaLabel).toBeTruthy()
      expect(content.expiry).toBeTruthy()
      expect(content.footer).toBeTruthy()
      expect(content.ignore).toBeTruthy()
    },
  )

  it('should return different subjects for different locales', () => {
    const ptBR = getForgotPasswordContent('pt-BR')
    const en = getForgotPasswordContent('en')
    const es = getForgotPasswordContent('es')
    expect(ptBR.subject).not.toBe(en.subject)
    expect(ptBR.subject).not.toBe(es.subject)
    expect(en.subject).not.toBe(es.subject)
  })
})
