import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type {
  IgwChangelogEntry,
  IgwChangelogDtlEntry,
  TranslationSource,
  LocaleJobStatus,
  LocaleCode
} from '~/types/translations'
import { asIgwChangelog, asIgwChangelogDtl } from '~/utils/strapi'

export const useIgwChangelogsStore = defineStore('igw-changelogs', () => {
  // Metadata parents (non-translatable)
  const parentEntries = ref<IgwChangelogEntry[]>([])
  
  // Translatable detail entries (en source)
  const sourceEntries = ref<IgwChangelogDtlEntry[]>([])
  
  const isPulled = ref(false)
  
  // Translatable detail entries per locale
  const localeEntries = ref<Record<string, IgwChangelogDtlEntry[]>>({})
  
  // Active translation session state
  const activeSelectedLocales = ref<LocaleCode[]>([])
  const activeTranslations = ref<Record<string, string[]>>({})
  
  const localeSource = ref<Record<string, TranslationSource>>({})
  const localeJobStatus = ref<Record<string, LocaleJobStatus>>({})
  const translationProgress = reactive({ current: 0, total: 0 })
  const syncedLocales = ref<Record<string, { at: string; count: number }>>({})

  /**
   * Initialize the store with data pulled from Strapi.
   * Handles the parent/child mapping by storing parents separately.
   */
  function setSource(dtls: IgwChangelogDtlEntry[], parents: IgwChangelogEntry[]) {
    sourceEntries.value = dtls
    parentEntries.value = parents
    isPulled.value = true
    
    // Reset all translation state
    localeEntries.value = {}
    localeSource.value = {}
    localeJobStatus.value = {}
    translationProgress.current = 0
    translationProgress.total = 0
    syncedLocales.value = {}
  }

  /**
   * Store translated entries for a specific locale.
   */
  function setLocaleEntries(locale: LocaleCode, entries: IgwChangelogDtlEntry[], source: TranslationSource) {
    localeEntries.value[locale] = entries
    localeSource.value[locale] = source
  }

  function setLocaleJobStatus(locale: LocaleCode, status: LocaleJobStatus) {
    localeJobStatus.value[locale] = status
  }

  function setProgress(current: number, total: number) {
    translationProgress.current = current
    translationProgress.total = total
  }

  function markSynced(locale: LocaleCode, count: number) {
    syncedLocales.value[locale] = {
      at: new Date().toISOString(),
      count
    }
  }

  /**
   * Helper to retrieve the parent metadata for a given detail entry.
   */
  const getParent = (dtl: IgwChangelogDtlEntry): IgwChangelogEntry | undefined => {
    return parentEntries.value.find(p => p.id === dtl.parentId)
  }

  /**
   * Formatted mapping of detail entries with their parent metadata.
   */
  const entriesWithMetadata = computed(() => {
    return sourceEntries.value.map(dtl => ({
      ...dtl,
      parent: getParent(dtl)
    }))
  })

  function reset() {
    parentEntries.value = []
    sourceEntries.value = []
    isPulled.value = false
    localeEntries.value = {}
    localeSource.value = {}
    localeJobStatus.value = {}
    translationProgress.current = 0
    translationProgress.total = 0
    syncedLocales.value = {}
    activeSelectedLocales.value = []
    activeTranslations.value = {}
  }

  function resetActiveSession() {
    activeSelectedLocales.value = []
    activeTranslations.value = {}
  }

  return {
    parentEntries,
    sourceEntries,
    isPulled,
    localeEntries,
    localeSource,
    localeJobStatus,
    translationProgress,
    syncedLocales,
    activeSelectedLocales,
    activeTranslations,
    entriesWithMetadata,
    setSource,
    setLocaleEntries,
    setLocaleJobStatus,
    setProgress,
    markSynced,
    getParent,
    reset,
    resetActiveSession
  }
})
