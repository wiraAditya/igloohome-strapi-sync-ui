import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // Nuxt 4 directory structure
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],

  colorMode: {
    classPrefix: '',
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  vite: {
    plugins: [
      tailwindcss()
    ],
    optimizeDeps: {
      include: ['jszip', '@google/genai']
    }
  },

  css: ['~/assets/css/main.css'],

  ssr: true,

  /**
   * ARCHITECTURAL DECISION (SECURE/HOSTED):
   * secrets are now kept on the server.
   * Nitro routes (/api/strapi and /api/gemini) act as proxies.
   */
  runtimeConfig: {
    strapiApiToken: process.env.STRAPI_API_TOKEN,
    geminiApiKey: process.env.GEMINI_API_KEY,
    strapiBaseUrl: process.env.STRAPI_BASE_URL,
    public: {
      // Publicly safe info only
    },
  },

  typescript: {
    strict: true,
  },

  devtools: {
    enabled: true
  }
})
