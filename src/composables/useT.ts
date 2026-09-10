import { useLangStore } from '@/stores/useLangStore'
import { getLocalizedString, type LocaleMessage } from '@/utils/getLocalizedString'
import { storeToRefs } from 'pinia'

export function useT() {
  const { currentLang } = storeToRefs(useLangStore())

  const t = (message: LocaleMessage | undefined) => getLocalizedString(message, currentLang.value)

  return { t, currentLang }
}
