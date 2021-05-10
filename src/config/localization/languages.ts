export const EN: Language = { code: 'EN', language: 'English' }

export const languages = {
  'EN': EN,
}

export const languageList = Object.values(languages)

// Export this here to avoid dependency cycle
export type LanguageCode = keyof typeof languages

export interface Language {
  code: LanguageCode
  language: string
}
