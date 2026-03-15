import { SUPPORTED_LOCALES } from '~/types/translations'
import type { ContentType, LocaleCode } from '~/types/translations'

export const useGemini = () => {
  const localeMap: Record<string, string> = SUPPORTED_LOCALES.reduce((acc: Record<string, string>, l: any) => {
    acc[l.code] = l.name
    return acc
  }, {})

  const translateStrings = async (
    values: string[],
    targetLocale: string,
    contentType: ContentType,
    onProgress?: (done: number, total: number) => void
  ): Promise<string[]> => {
    const BATCH_SIZE = 200
    const results: string[] = []
    
    for (let i = 0; i < values.length; i += BATCH_SIZE) {
      const batch = values.slice(i, i + BATCH_SIZE)
      const translatedBatch = await translateBatchWithRetry(batch, targetLocale, contentType)
      results.push(...translatedBatch)
      
      if (onProgress) {
        onProgress(results.length, values.length)
      }
    }
    
    return results
  }

  const translateBatchWithRetry = async (
    batch: string[],
    targetLocale: string,
    contentType: ContentType,
    isRetry = false
  ): Promise<string[]> => {
    const languageName = localeMap[targetLocale] || targetLocale
    const prompt = `
You are a professional software localisation translator.
Translate the following JSON array of strings from English to ${languageName} (${targetLocale}).
This content is from a SaaS product's ${contentType} section.

Rules:
- Return ONLY a valid JSON array of strings. No markdown, no explanation, no code fences.
- The output array MUST have exactly the same number of elements as the input array.
- Translate each string at the same index; do not merge, split, skip, or reorder elements.
- Do NOT translate interpolation placeholders: {variable}, %s, %d, {{var}}, %(name)s
- Preserve newlines (\\n) exactly as they appear in the source strings.
- Preserve capitalisation style (ALL CAPS stays ALL CAPS, Title Case stays Title Case).
- For categories: translate short UI labels concisely.
- For changelogs: translate product update prose naturally; preserve version numbers, app version strings, and product names exactly.
- For faqs: translate question-and-answer pairs clearly; keep the question mark.

Input JSON array:
${JSON.stringify(batch)}
`.trim()

    try {
      // SECURE: Now calling local Nitro proxy instead of direct Gemini SDK in browser
      const response = await $fetch<any>('/api/gemini', {
        method: 'POST',
        body: {
          model: 'gemini-1.5-flash',
          contents: [{ parts: [{ text: isRetry ? `IMPORTANT: Your previous response was invalid. Return ONLY a JSON array of strings with exactly ${batch.length} elements, nothing else.\n\n${prompt}` : prompt }] }]
        }
      })

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Empty response from Gemini proxy')

      // Clean markdown if present
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(cleanJson)

      if (!Array.isArray(parsed) || parsed.length !== batch.length) {
        throw new Error(`Length mismatch: expected ${batch.length}, got ${parsed?.length}`)
      }

      return parsed as string[]
    } catch (error: any) {
      console.error('[Gemini Proxy Error]:', error)

      if (!isRetry) {
        console.warn('Translation failed, retrying once...')
        return translateBatchWithRetry(batch, targetLocale, contentType, true)
      }
      
      throw new Error(`Gemini Proxy Error: ${error.message || 'Unknown error'}`)
    }
  }

  const translateAllLocales = async (
    values: string[],
    targetLocales: string[],
    contentType: ContentType,
    onLocaleProgress?: (locale: string, status: 'running' | 'done' | 'error', data?: string[], error?: string) => void
  ): Promise<Record<string, string[]>> => {
    const results: Record<string, string[]> = {}

    for (const locale of targetLocales) {
      try {
        if (onLocaleProgress) onLocaleProgress(locale, 'running')
        
        const translated = await translateStrings(values, locale, contentType)
        results[locale] = translated
        
        if (onLocaleProgress) onLocaleProgress(locale, 'done', translated)
      } catch (error: any) {
        if (onLocaleProgress) onLocaleProgress(locale, 'error', undefined, error.message)
      }
    }

    return results
  }

  return {
    translateStrings,
    translateAllLocales
  }
}
