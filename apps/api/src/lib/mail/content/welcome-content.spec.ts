import { describe, it, expect } from 'vitest'
import { SUPPORTED_LOCALES } from '@launchpad/shared-types'
import { getWelcomeEmailContent } from './welcome-content'

describe('getWelcomeEmailContent', () => {
  it('should return pt-BR content when no locale is provided', () => {
    const content = getWelcomeEmailContent()
    expect(content.subject).toBe('Bem-vindo ao Launchpad!')
  })

  it.each(SUPPORTED_LOCALES)(
    'should return complete content with all required fields for locale %s',
    (locale) => {
      const content = getWelcomeEmailContent(locale)
      expect(content.subject).toBeTruthy()
      expect(content.greeting).toBeTruthy()
      expect(content.body).toBeTruthy()
      expect(content.footer).toBeTruthy()
    },
  )

  it('should return different subjects for different locales', () => {
    const ptBR = getWelcomeEmailContent('pt-BR')
    const en = getWelcomeEmailContent('en')
    const es = getWelcomeEmailContent('es')
    expect(ptBR.subject).not.toBe(en.subject)
    expect(ptBR.subject).not.toBe(es.subject)
    expect(en.subject).not.toBe(es.subject)
  })
})
