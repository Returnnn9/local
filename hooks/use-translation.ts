"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { translations, type Language } from "@/lib/translations"

interface TranslationStore {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.ru
}

export const useTranslation = create<TranslationStore>()(
  persist(
    (set, get) => ({
      language: "ru",
      setLanguage: (lang: Language) => {
        set({ language: lang, t: translations[lang] })
      },
      t: translations.ru,
    }),
    {
      name: "language-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.language]
        }
      },
    },
  ),
)
