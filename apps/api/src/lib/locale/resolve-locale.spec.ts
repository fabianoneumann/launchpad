import { describe, it, expect } from 'vitest'
import { resolveLocale } from './resolve-locale'

describe('resolveLocale', () => {
  describe('fallback', () => {
    it('should return pt-BR when header is undefined', () => {
      expect(resolveLocale(undefined)).toBe('pt-BR')
    })

    it('should return pt-BR when header is empty string', () => {
      expect(resolveLocale('')).toBe('pt-BR')
    })

    it('should return pt-BR when locale is unsupported (fr)', () => {
      expect(resolveLocale('fr')).toBe('pt-BR')
    })

    it('should return pt-BR when all candidates are unsupported', () => {
      expect(resolveLocale('fr,de,ja')).toBe('pt-BR')
    })
  })

  describe('exact match', () => {
    it('should return pt-BR for exact pt-BR', () => {
      expect(resolveLocale('pt-BR')).toBe('pt-BR')
    })

    it('should return en for exact en', () => {
      expect(resolveLocale('en')).toBe('en')
    })

    it('should return es for exact es', () => {
      expect(resolveLocale('es')).toBe('es')
    })
  })

  describe('language base match', () => {
    it('should resolve en-US to en', () => {
      expect(resolveLocale('en-US')).toBe('en')
    })

    it('should resolve en-GB to en', () => {
      expect(resolveLocale('en-GB')).toBe('en')
    })

    it('should resolve pt-PT to pt-BR (same language base)', () => {
      expect(resolveLocale('pt-PT')).toBe('pt-BR')
    })

    it('should resolve es-MX to es', () => {
      expect(resolveLocale('es-MX')).toBe('es')
    })
  })

  describe('multiple values with quality weights', () => {
    it('should pick the first supported locale in order', () => {
      expect(resolveLocale('fr,en;q=0.9,pt-BR;q=0.8')).toBe('en')
    })

    it('should respect order when first value is supported', () => {
      expect(resolveLocale('pt-BR,en;q=0.9')).toBe('pt-BR')
    })

    it('should fallback when no candidate is supported', () => {
      expect(resolveLocale('fr;q=1.0,de;q=0.9')).toBe('pt-BR')
    })

    it('should resolve by language base in a list', () => {
      expect(resolveLocale('fr,en-US;q=0.8')).toBe('en')
    })
  })
})
