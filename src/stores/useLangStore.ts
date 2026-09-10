import { languages } from '@/consts'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const supportedLanguages: string[] = languages.map((language) => language.value)
export const defaultLanguage = supportedLanguages[0] as string

export const useLangStore = defineStore(
  'lang',
  () => {
    const currentLang = ref<string>(defaultLanguage)

    const setLang = (lang: string) => {
      if (supportedLanguages.includes(lang)) {
        currentLang.value = lang
      } else {
        currentLang.value = defaultLanguage
      }
    }

    return {
      currentLang,
      setLang,
    }
  },
  {
    persist: {
      key: 'lang',
      storage: localStorage,
    },
  },
)
