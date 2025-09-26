import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, getDefaultLanguage, type Language, type Translations } from '../lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get saved language from localStorage first
    const saved = localStorage.getItem('wamail-language') as Language
    if (saved && Object.keys(translations).includes(saved)) {
      return saved
    }
    return getDefaultLanguage()
  })

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wamail-language', language)
  }, [language])

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
