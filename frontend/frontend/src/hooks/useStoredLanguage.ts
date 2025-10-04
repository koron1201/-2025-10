import { useEffect, useState } from 'react'
import { getDefaultLanguage, type Language, translations } from '../lib/i18n'

export default function useStoredLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('aimailor-language') as Language | null
    if (saved && saved in getAvailableLanguages()) {
      return saved
    }
    return getDefaultLanguage()
  })

  useEffect(() => {
    localStorage.setItem('aimailor-language', language)
  }, [language])

  return [language, setLanguage]
}

function getAvailableLanguages(): Record<Language, true> {
  return Object.keys(translations).reduce((acc, key) => {
    acc[key as Language] = true
    return acc
  }, {} as Record<Language, true>)
}

