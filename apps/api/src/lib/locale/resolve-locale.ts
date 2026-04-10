import type { Locale } from '@launchpad/shared-types'
import { SUPPORTED_LOCALES } from '@launchpad/shared-types'

const FALLBACK: Locale = 'pt-BR'

export function resolveLocale(acceptLanguage: string | undefined): Locale {
  if (!acceptLanguage) return FALLBACK

  const candidates = acceptLanguage
    .split(',')
    .map((entry) => entry.split(';')[0].trim())
    .filter(Boolean)

  for (const candidate of candidates) {
    const exact = SUPPORTED_LOCALES.find((l) => l === candidate)
    if (exact) return exact

    const base = candidate.split('-')[0]
    const byBase = SUPPORTED_LOCALES.find((l) => l.split('-')[0] === base)
    if (byBase) return byBase
  }

  return FALLBACK
}
