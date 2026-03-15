export type LocaleCode =
  | 'cs' | 'da' | 'de' | 'el' | 'es' | 'fi' | 'fr' | 'hu'
  | 'id' | 'it' | 'ja' | 'nb' | 'nb_no' | 'pt' | 'sk'
  | 'sv' | 'th' | 'vi' | 'zh'

export const SUPPORTED_LOCALES: { code: LocaleCode; name: string }[] = [
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'es', name: 'Spanish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'nb', name: 'Norwegian Bokmål' },
  { code: 'nb_no', name: 'Norwegian Bokmål NO' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sv', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' }
]

export type ContentType = 'categories' | 'changelogs' | 'faqs'

export type KeyStatus = 'missing' | 'ai-generated' | 'manual' | 'translated'

export type LocaleJobStatus = 'idle' | 'running' | 'done' | 'error'

export type TranslationSource = 'ai-generated' | 'manual'

/**
 * Record of locale to translated string values (in order)
 */
export type TranslationMap = Record<string, string[]>

export interface BaseStrapiEntry {
  id: string
}

export interface CategoryEntry extends BaseStrapiEntry {
  category: string
}

export interface ChangelogEntry extends BaseStrapiEntry {
  appVersion: string
  changes: string
  releaseDate: string
}

export interface FaqEntry extends BaseStrapiEntry {
  title: string
  category: string
  content: string
}

export type StrapiEntry = CategoryEntry | ChangelogEntry | FaqEntry

export interface ContentTypeState {
  sourceEntries: StrapiEntry[]
  isPulled: boolean
  localeEntries: Record<string, StrapiEntry[]>
  localeSource: Record<string, TranslationSource>
  localeJobStatus: Record<string, LocaleJobStatus>
  translationProgress: {
    current: number
    total: number
  }
  syncedLocales: Record<string, { at: string; count: number }>
}
