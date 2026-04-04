import { useStrapi } from '~/composables/useStrapi'
import { useGemini } from '~/composables/useGemini'
import type { LocaleCode } from '~/types/translations'

interface EnDetailWithLocs {
  id: string
  title: string
  content: string
  localizations: Array<{ id: string; locale: string }>
}

export const useIgwTranslate = () => {
  const strapi = useStrapi()
  const gemini = useGemini()

  /**
   * Fetches all 'en' details for a parent changelog and their existing localizations.
   */
  const getEnDetailsWithLocalizations = async (parentId: string): Promise<EnDetailWithLocs[]> => {
    const query = `
      query IgwChangelogEnDetails($parentId: ID) {
        igwChangelog(id: $parentId) {
          data {
            id
            attributes {
              igw_changelog_dtls(filters: { locale: { eq: "en" } }, pagination: { pageSize: 1000 }) {
                data {
                  id
                  attributes {
                    Title
                    Changes
                    localizations(pagination: { pageSize: 1000 }) {
                      data {
                        id
                        attributes {
                          locale
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    const data = await strapi.graphqlFetch<any>(query, { parentId })
    const dtls = data.igwChangelog?.data?.attributes?.igw_changelog_dtls?.data || []
    
    return dtls.map((d: any): EnDetailWithLocs => ({
      id: d.id as string,
      title: d.attributes.Title as string,
      content: d.attributes.Changes as string,
      localizations: (d.attributes.localizations?.data || []).map((loc: any) => ({
        id: loc.id as string,
        locale: loc.attributes.locale as string
      }))
    }))
  }

  /**
   * Main function to prepare and sync translations for a parent changelog in bulk.
   * This is intended for use in non-interactive contexts (e.g. workspace view).
   */
  const prepareAndSyncTranslations = async (
    parentId: string, 
    targetLocales: LocaleCode[],
    onProgress?: (locale: string, status: 'translating' | 'syncing' | 'done' | 'error', message?: string) => void
  ): Promise<void> => {
    try {
      console.log(`[useIgwTranslate] Starting prepareAndSync for parent ${parentId} to locales: ${targetLocales.join(', ')}`)
      
      // 1. Fetch 'en' details
      const enDetails = await getEnDetailsWithLocalizations(parentId)
      if (enDetails.length === 0) {
        throw new Error(`No English source details found for changelog ID ${parentId}.`)
      }

      // 2. Extract contents for translation (only translating the 'Changes' field)
      const contentsToTranslate = enDetails.map(d => d.content)

      // 3. Perform AI Translation
      const translationResults = await gemini.translateAllLocales(
        contentsToTranslate,
        targetLocales,
        'igw-changelogs',
        (locale, status, _data, error) => {
          if (status === 'running') {
            onProgress?.(locale, 'translating')
          } else if (status === 'error') {
            console.error(`[useIgwTranslate] AI Translation error for ${locale}:`, error)
            onProgress?.(locale, 'error', error)
          }
        }
      )

      // 4. Sync translated details to Strapi
      const syncPromises = Object.entries(translationResults).map(async ([locale, translatedContents]) => {
        try {
          // Safety check for translatedContents (Tiger-Style defensive programming)
          if (!translatedContents || !Array.isArray(translatedContents)) {
            console.warn(`[useIgwTranslate] No valid translation contents found for locale: ${locale}`);
            return;
          }

          onProgress?.(locale, 'syncing')
          
          for (let i = 0; i < enDetails.length; i++) {
            const enDtl = enDetails[i]
            if (!enDtl) continue

            const translatedContent = translatedContents[i]

            // Safety check for individual translation element
            if (translatedContent === undefined || translatedContent === null) {
              console.warn(`[useIgwTranslate] Missing translation for index ${i} in locale ${locale}. Skipping.`);
              continue;
            }
            
            // Check if localization already exists for this locale
            const existingLoc = enDtl.localizations.find(l => l.locale === locale)
            
            const payload = {
              Title: enDtl.title, // Note: We currently don't translate the title string
              Changes: translatedContent,
              igw_changelog: parentId,
              publishedAt: new Date().toISOString()
            }

            if (existingLoc) {
              await strapi.updateIgwChangelogDtl(existingLoc.id, payload)
            } else {
              await strapi.submitIgwChangelogDtl(enDtl.id, locale, payload)
            }
          }
          
          onProgress?.(locale, 'done')
          console.log(`[useIgwTranslate] Successfully synced ${locale} for parent ${parentId}`)
        } catch (e: any) {
          console.error(`[useIgwTranslate] Sync failed for locale ${locale}:`, e)
          onProgress?.(locale, 'error', `Sync failed: ${e.message}`)
        }
      })

      await Promise.all(syncPromises)
      console.log(`[useIgwTranslate] Completed bulk sync for parent ${parentId}`)
      
    } catch (error: any) {
      console.error('[useIgwTranslate] Fatal Error:', error)
      throw error
    }
  }

  return {
    prepareAndSyncTranslations
  }
}
