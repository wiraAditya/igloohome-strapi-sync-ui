<script setup lang="ts">
import { ref, computed } from 'vue'
import { SUPPORTED_LOCALES } from '~/types/translations'
import type { ContentType, LocaleCode } from '~/types/translations'

const props = defineProps<{
  type: ContentType
  title: string
  description: string
}>()

const { store, pull, aiTranslate, syncToStrapi } = useContentType(props.type)
const ui = useUiStore()
const { downloadJson, downloadZip } = useDownload()

// State for modals and selections
const selectedLocales = ref<LocaleCode[]>([])
const isPulling = ref(false)
const pullUnpublishedOnly = ref(false)

const locales = SUPPORTED_LOCALES
const showUploadModal = ref(false)
const showSyncModal = ref(false)
const syncLocale = ref<LocaleCode | null>(null)
const isTranslating = ref(false)

const handlePull = async () => {
  isPulling.value = true
  try {
    await pull(pullUnpublishedOnly.value)
    ui.addToast('Data successfully pulled from Strapi', 'success')
  } catch (e: any) {
    ui.addToast(`Failed to pull data: ${e.message}`, 'error')
  } finally {
    isPulling.value = false
  }
}

const handleTranslate = async () => {
  if (selectedLocales.value.length === 0) {
    ui.addToast('Please select at least one locale', 'info')
    return
  }
  
  isTranslating.value = true
  try {
    await aiTranslate(selectedLocales.value)
    ui.addToast('AI Translation completed', 'success')
  } catch (e: any) {
    ui.addToast(`Translation failed: ${e.message}`, 'error')
  } finally {
    isTranslating.value = false
  }
}

const handleRetry = async (locale: string) => {
  isTranslating.value = true
  try {
    await aiTranslate([locale as LocaleCode])
    ui.addToast(`Retry for ${locale} completed`, 'success')
  } catch (e: any) {
    ui.addToast(`Retry for ${locale} failed: ${e.message}`, 'error')
  } finally {
    isTranslating.value = false
  }
}

const handleUpdateEntry = (payload: { id: string; field: string; value: string; locale: string }) => {
  const { id, field, value, locale } = payload
  const entries = [...(store.localeEntries[locale] || [])]
  const index = entries.findIndex(e => e.id === id)
  if (index !== -1) {
    (entries[index] as any)[field] = value
    store.setLocaleEntries(locale, entries, store.localeSource[locale] || 'ai-generated')
  }
}

const openSync = (locale: string) => {
  syncLocale.value = locale as LocaleCode
  showSyncModal.value = true
}

const handleSyncConfirm = async () => {
  if (!syncLocale.value) return
  
  try {
    const result = await syncToStrapi(syncLocale.value)
    store.markSynced(syncLocale.value, result.synced)
    ui.addToast(`Successfully synced ${result.synced} entries to Strapi`, 'success')
    if (result.failed > 0) {
      ui.addToast(`Failed to sync ${result.failed} entries`, 'error')
    }
  } catch (e: any) {
    ui.addToast(`Sync failed: ${e.message}`, 'error')
  } finally {
    showSyncModal.value = false
    syncLocale.value = null
  }
}

const handleFileUpload = (data: { locale: string; entries: any[] }) => {
  store.setLocaleEntries(data.locale, data.entries, 'manual')
  ui.addToast(`Manual translation for ${data.locale} uploaded`, 'success')
  showUploadModal.value = false
}

const toggleLocale = (code: LocaleCode) => {
  const index = selectedLocales.value.indexOf(code)
  if (index === -1) {
    selectedLocales.value.push(code)
  } else {
    selectedLocales.value.splice(index, 1)
  }
}

const selectAllLocales = () => {
  selectedLocales.value = locales.map((l: { code: LocaleCode }) => l.code)
}

const clearLocaleSelection = () => {
  selectedLocales.value = []
}

const formatTime = (isoString: string) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

const getLocaleName = (code: string) => {
  return locales.find((l: any) => l.code === code)?.name || code
}

const handleDownload = (locale: string) => {
  const entries = store.localeEntries[locale]
  if (entries) {
    downloadJson(`${props.type}_${locale}.json`, entries)
  }
}

const handleDownloadAll = () => {
  downloadZip(`${props.type}_translations`, store.localeEntries)
}

// Computed for progress grid
const localeProgress = computed(() => {
  const progress: Record<string, number> = {}
  locales.forEach((l: { code: string }) => {
    const status = store.localeJobStatus[l.code]
    if (status === 'done') progress[l.code] = 100
    else if (status === 'running') progress[l.code] = 50
    else if (status === 'error') progress[l.code] = 0
    else progress[l.code] = 0
  })
  return progress
})

// Prerequisites
const hasLocaleData = computed(() => Object.keys(store.localeEntries).length > 0)
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
        <p class="mt-1 text-sm text-gray-500">{{ description }}</p>
      </div>
      <div v-if="store.isPulled" class="flex gap-2">
        <SharedStatusBadge status="success" text="Data Pulled" />
        <span class="text-xs text-gray-400 self-center">
          {{ store.sourceEntries.length }} entries found
        </span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Step 1: Generate Source JSON -->
      <SharedStepCard
        :step-number="1"
        title="Generate Source JSON"
        description="Fetch the latest untranslated content from Strapi"
      >
        <div class="space-y-4">
          <div v-if="store.isPulled" class="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2 text-amber-800 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <span>Re-generating will clear existing translations for this session.</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div v-if="store.isPulled" class="flex flex-col">
              <span class="text-sm font-medium text-gray-700">Source Ready</span>
              <span class="text-xs text-gray-500">{{ store.sourceEntries.length }} keys identified</span>
            </div>
            <div v-else class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer group">
                <div class="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded transition-colors group-hover:border-blue-500" :class="{'bg-blue-600 border-blue-600': pullUnpublishedOnly}">
                  <svg v-if="pullUnpublishedOnly" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <input type="checkbox" v-model="pullUnpublishedOnly" class="absolute opacity-0 w-full h-full cursor-pointer" />
                </div>
                <span class="text-sm text-gray-600 font-medium">Unpublished (Untranslated) only</span>
              </label>
            </div>
            <div class="flex gap-3">
              <SharedDownloadButton
                v-if="store.isPulled"
                :data="store.sourceEntries"
                :filename="`${type}_source.json`"
                label="Download Source"
                variant="outline"
              />
              <button
                @click="handlePull"
                :disabled="isPulling"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg v-if="isPulling" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ store.isPulled ? 'Re-pull Data' : 'Pull from Strapi' }}
              </button>
            </div>
          </div>
        </div>
      </SharedStepCard>

      <!-- Step 2: Review Source Keys -->
      <SharedStepCard
        :step-number="2"
        title="Review Source Keys"
        description="Verify the content that will be translated"
        :locked="!store.isPulled"
      >
        <div class="max-h-[400px] overflow-hidden rounded-lg border border-gray-200">
          <SharedTranslationTable
            :source-entries="store.sourceEntries"
            :type="type"
            read-only
          />
        </div>
      </SharedStepCard>

      <!-- Step 3: Generate AI Translations -->
      <SharedStepCard
        :step-number="3"
        title="Generate AI Translations"
        description="Use Gemini AI to translate content into selected locales"
        :locked="!store.isPulled"
      >
        <div class="space-y-6">
          <!-- Locale Selection Grid -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-700">Target Locales</h4>
              <div class="flex gap-2">
                <button @click="selectAllLocales" class="text-xs text-blue-600 hover:text-blue-800">Select All</button>
                <button @click="clearLocaleSelection" class="text-xs text-gray-500 hover:text-gray-700">Clear</button>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              <div
                v-for="l in locales"
                :key="l.code"
                class="relative group"
              >
                <button
                  @click="toggleLocale(l.code)"
                  class="w-full flex items-center justify-between px-3 py-2 border rounded-md text-xs transition-colors"
                  :class="[
                    selectedLocales.includes(l.code)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  <span>{{ l.name }}</span>
                  <span class="font-bold opacity-50">{{ l.code.toUpperCase() }}</span>
                </button>
                
                <button
                  v-if="store.localeJobStatus[l.code] === 'error'"
                  @click.stop="handleRetry(l.code)"
                  class="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full border border-red-200 shadow-sm hover:bg-red-200 transition-colors"
                  title="Retry Translation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Progress and Status -->
          <div v-if="isTranslating || Object.keys(store.localeJobStatus).length > 0" class="space-y-4 pt-4 border-t border-gray-100">
            <div v-if="isTranslating" class="space-y-2">
              <div class="flex justify-between text-xs text-gray-500">
                <span>Translating...</span>
                <span>{{ Math.round((store.translationProgress.current / (store.translationProgress.total || 1)) * 100) }}%</span>
              </div>
              <SharedProgressBar 
                :current="store.translationProgress.current" 
                :total="store.translationProgress.total" 
              />
            </div>
            
            <SharedLocaleStatusGrid :progress="localeProgress" />
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button
              @click="handleTranslate"
              :disabled="isTranslating || selectedLocales.length === 0"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg v-if="isTranslating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Start AI Translation
            </button>
          </div>
        </div>
      </SharedStepCard>

      <!-- Step 4: Preview & Download Translations -->
      <SharedStepCard
        :step-number="4"
        title="Preview & Download Translations"
        description="Verify AI results and export JSON files for safety"
        :locked="!hasLocaleData"
      >
        <SharedTranslationPreviewModal
          :locale-entries="store.localeEntries"
          :locale-job-status="store.localeJobStatus"
          :source-entries="store.sourceEntries"
          :content-type="type"
          @retry="handleRetry"
          @update:entry="handleUpdateEntry"
          @download="handleDownload"
          @download-all="handleDownloadAll"
        />
      </SharedStepCard>

      <!-- Step 5: Upload Manual Translation -->
      <SharedStepCard
        :step-number="5"
        title="Upload Manual Translation (optional)"
        description="Manually override or add translations via JSON file upload"
        :locked="!store.isPulled"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Use this to upload pre-translated JSON or correct errors.
          </div>
          <button
            @click="showUploadModal = true"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload File
          </button>
        </div>
      </SharedStepCard>

      <!-- Step 6: Sync to Strapi -->
      <SharedStepCard
        :step-number="6"
        title="Sync to Strapi"
        description="Push the final translations back to your Strapi instance"
        :locked="!hasLocaleData"
      >
        <div class="overflow-hidden border border-gray-200 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locale</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(entries, locale) in store.localeEntries" :key="locale">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
                  {{ locale }} ({{ getLocaleName(locale) }})
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ store.localeSource[locale] === 'ai-generated' ? 'AI Generated' : 'Manual Upload' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <SharedStatusBadge
                    v-if="store.syncedLocales[locale]"
                    status="success"
                    :text="`Synced (${store.syncedLocales[locale].count})`"
                  />
                  <SharedStatusBadge
                    v-else
                    status="warning"
                    text="Not Synced"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openSync(locale)"
                    class="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto"
                  >
                    <template v-if="store.syncedLocales[locale]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Synced {{ formatTime(store.syncedLocales[locale].at) }}</span>
                    </template>
                    <template v-else>
                      Sync to Strapi
                    </template>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SharedStepCard>
    </div>

    <!-- Modals -->
    <SharedUploadFileModal
      v-if="showUploadModal"
      :show="showUploadModal"
      :type="type"
      :source-entries="store.sourceEntries"
      @close="showUploadModal = false"
      @upload="handleFileUpload"
    />

    <SharedSyncConfirmModal
      v-if="showSyncModal && syncLocale && store.localeEntries[syncLocale]"
      :show="showSyncModal"
      :locale="syncLocale"
      :key-count="(store.localeEntries[syncLocale] || []).length"
      :content-type="type"
      @cancel="showSyncModal = false"
      @confirm="handleSyncConfirm"
    />
  </div>
</template>
