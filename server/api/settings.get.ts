export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const mask = (val?: string) => {
    if (!val) return 'Not Set'
    return val.slice(-4).padStart(val.length, '•')
  }

  return {
    strapiBaseUrl: config.strapiBaseUrl || 'Not Set',
    isStrapiTokenSet: !!config.strapiApiToken,
    isGeminiKeySet: !!config.geminiApiKey
  }
})
