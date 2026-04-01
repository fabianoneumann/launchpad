export const SUPPORTED_LOCALES = ['pt-BR', 'en', 'es'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
