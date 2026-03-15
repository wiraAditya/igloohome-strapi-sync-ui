import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { model, contents } = body

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API key is not configured on the server.'
    })
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey })

  const result = await ai.models.generateContent({
    model: model || 'gemini-1.5-flash',
    contents
  })

  return result
})
