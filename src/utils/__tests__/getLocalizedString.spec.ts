import { describe, expect, it } from 'vitest'
import { getLocalizedString } from '@/utils/getLocalizedString'

describe('getLocalizedString', () => {
  it('returns string for requested language', () => {
    expect(getLocalizedString({ en: 'Destroyer', ru: 'Эсминец' }, 'ru')).toBe('Эсминец')
  })

  it('falls back to English when translation is missing', () => {
    expect(getLocalizedString({ en: 'Destroyer' }, 'ru')).toBe('Destroyer')
  })

  it('returns fallback for empty input', () => {
    expect(getLocalizedString(undefined, 'en')).toBe('String not found')
    expect(getLocalizedString({} as { en: string }, 'en')).toBe('String not found')
  })
})
