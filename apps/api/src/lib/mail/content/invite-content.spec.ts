import { describe, it, expect } from 'vitest'
import { SUPPORTED_LOCALES } from '@launchpad/shared-types'
import { getInviteContent } from './invite-content'

describe('getInviteContent', () => {
  it('should return pt-BR content when no locale is provided', () => {
    const content = getInviteContent()
    expect(content.subject).toBe('Seu acesso ao Launchpad foi criado')
  })

  it.each(SUPPORTED_LOCALES)(
    'should return complete content with all required fields for locale %s',
    (locale) => {
      const content = getInviteContent(locale)
      expect(content.subject).toBeTruthy()
      expect(content.greeting).toBeTruthy()
      expect(content.body).toBeTruthy()
      expect(content.ctaLabel).toBeTruthy()
      expect(content.expiry).toBeTruthy()
      expect(content.footer).toBeTruthy()
    },
  )

  it('should return different subjects for different locales', () => {
    const ptBR = getInviteContent('pt-BR')
    const en = getInviteContent('en')
    const es = getInviteContent('es')
    expect(ptBR.subject).not.toBe(en.subject)
    expect(ptBR.subject).not.toBe(es.subject)
    expect(en.subject).not.toBe(es.subject)
  })
})
