import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { StrapiEntry, TranslationSource, LocaleJobStatus } from '~/types/translations'

export const useChangelogsStore = defineStore('changelogs', () => {
  const sourceEntries = ref<StrapiEntry[]>([])
  const isPulled = ref(false)
  const localeEntries = ref<Record<string, StrapiEntry[]>>({})
  const localeSource = ref<Record<string, TranslationSource>>({})
  const localeJobStatus = ref<Record<string, LocaleJobStatus>>({})
  const translationProgress = reactive({ current: 0, total: 0 })
  const syncedLocales = ref<Record<string, { at: string; count: number }>>({})

  function setSource(entries: StrapiEntry[]) {
    sourceEntries.value = entries
    isPulled.value = true
    
    // Reset all translation state
    localeEntries.value = {}
    localeSource.value = {}
    localeJobStatus.value = {}
    translationProgress.current = 0
    translationProgress.total = 0
    syncedLocales.value = {}
  }

  function setLocaleEntries(locale: string, entries: StrapiEntry[], source: TranslationSource) {
    localeEntries.value[locale] = entries
    localeSource.value[locale] = source
  }

  function setLocaleJobStatus(locale: string, status: LocaleJobStatus) {
    localeJobStatus.value[locale] = status
  }

  function setProgress(current: number, total: number) {
    translationProgress.current = current
    translationProgress.total = total
  }

  function markSynced(locale: string, count: number) {
    syncedLocales.value[locale] = {
      at: new Date().toISOString(),
      count
    }
  }

  function reset() {
    sourceEntries.value = []
    isPulled.value = false
    localeEntries.value = {}
    localeSource.value = {}
    localeJobStatus.value = {}
    translationProgress.current = 0
    translationProgress.total = 0
    syncedLocales.value = {}
  }

  return {
    sourceEntries,
    isPulled,
    localeEntries,
    localeSource,
    localeJobStatus,
    translationProgress,
    syncedLocales,
    setSource,
    setLocaleEntries,
    setLocaleJobStatus,
    setProgress,
    markSynced,
    reset
  }
})
