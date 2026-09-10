import type { LocalizedString } from '@/types/LocalizedString'

export type LocaleMessage = Partial<LocalizedString> & {
  en: string
}

const FALLBACK = 'String not found'

export const getLocalizedString = (localized: LocaleMessage | undefined, lang: string): string => {
  if (!localized) return FALLBACK
  if (typeof localized !== 'object') return FALLBACK
  if (!Object.keys(localized).length) return FALLBACK

  return localized[lang as keyof LocalizedString] || localized.en || FALLBACK
}
