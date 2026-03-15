import type { ContentType, LocaleCode } from '~/types/translations'
import { useStrapi } from '~/composables/useStrapi'
import { useGemini } from '~/composables/useGemini'
import { useCategoriesStore } from '~/stores/categories'
import { useChangelogsStore } from '~/stores/changelogs'
import { useFaqsStore } from '~/stores/faqs'

export const useContentType = (type: ContentType) => {
  const strapi = useStrapi()
  const gemini = useGemini()
  
  // These stores are implemented in app/stores/
  // Nuxt auto-imports make them available, but explicit imports are used for clarity.
  const store = type === 'categories'
    ? useCategoriesStore()
    : type === 'changelogs'
    ? useChangelogsStore()
    : useFaqsStore()

  /**
   * Fetch from Strapi and store in sourceEntries.
   */
  const pull = async (unpublishedOnly = false) => {
    const entries = await strapi.fetchCollection(type, unpublishedOnly)
    store.setSource(entries)
  }

  /**
   * Extract translatable strings, send to Gemini, and merge results back.
   */
  const aiTranslate = async (locales: string[]) => {
    const values = strapi.extractTranslatableFields(type, store.sourceEntries)
    
    store.setProgress(0, locales.length)
    let completed = 0
    
    await gemini.translateAllLocales(
      values, 
      locales, 
      type, 
      (locale: string, status: "running" | "done" | "error", data?: string[]) => {
        store.setLocaleJobStatus(locale as LocaleCode, status as any)
        
        if (status === 'done' && data) {
          const mergedEntries = strapi.mergeTranslations(type, store.sourceEntries, data)
          store.setLocaleEntries(locale as LocaleCode, mergedEntries, 'ai-generated')
          completed++
          store.setProgress(completed, locales.length)
        } else if (status === 'error') {
          completed++
          store.setProgress(completed, locales.length)
        }
      }
    )
  }

  /**
   * Push stored locale entry array directly to Strapi.
   */
  const syncToStrapi = async (locale: string) => {
    const entries = store.localeEntries[locale]
    if (!entries) {
      return { synced: 0, failed: 0, errors: [`No data found for locale ${locale}`] }
    }
    return strapi.pushLocaleToStrapi(type, locale, entries)
  }

  return {
    store,
    pull,
    aiTranslate,
    syncToStrapi
  }
}
