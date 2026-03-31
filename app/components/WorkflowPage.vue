<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
const isSyncingAll = ref(false)

const handleSyncAll = async () => {
  const readyLocales = Object.keys(store.localeEntries) as LocaleCode[]
  if (readyLocales.length === 0) return

  if (!confirm(`Are you sure you want to sync ALL ${readyLocales.length} locales to Strapi? This may take a while.`)) {
    return
  }

  isSyncingAll.value = true
  try {
    for (const locale of readyLocales) {
      ui.addToast(`Syncing ${locale.toUpperCase()}...`, 'info')
      const result = await syncToStrapi(locale)
      store.markSynced(locale, result.synced)
      if (result.failed > 0) {
        ui.addToast(`${locale.toUpperCase()}: Synced ${result.synced}, Failed ${result.failed}`, 'info')
      } else {
        ui.addToast(`${locale.toUpperCase()} synced successfully`, 'success')
      }
    }
    ui.addToast('Bulk sync completed', 'success')
  } catch (e: any) {
    ui.addToast(`Bulk sync failed: ${e.message}`, 'error')
  } finally {
    isSyncingAll.value = false
  }
}

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
  <div class="space-y-10 pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-0">
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </NuxtLink>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">{{ title }}</h1>
        </div>
        <p class="text-base font-medium text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">{{ description }}</p>
      </div>
      <div v-if="store.isPulled" class="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 pl-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div class="flex flex-col">
          <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Current Session</span>
          <span class="text-sm font-bold text-gray-900 dark:text-white">{{ store.sourceEntries.length }} entries identified</span>
        </div>
        <SharedStatusBadge status="success" text="Data Active" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8">
      <!-- Step 1: Generate Source JSON -->
      <SharedStepCard
        :step-number="1"
        title="Generate Source JSON"
        description="Fetch the latest untranslated content from Strapi"
      >
        <div class="space-y-6">
          <div v-if="store.isPulled" class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-400">
            <div class="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-lg text-amber-600 dark:text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-black uppercase tracking-tight">Warning: Session data exists</p>
              <p class="text-xs font-medium opacity-80">Re-generating will clear existing translations for this session. Make sure you have backed up any manual changes.</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <label class="relative flex items-center gap-3 cursor-pointer group">
                <div class="relative flex items-center justify-center w-6 h-6 border-2 border-gray-200 dark:border-slate-700 rounded-lg transition-all group-hover:border-indigo-500 group-hover:scale-105" :class="{'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40': pullUnpublishedOnly}">
                  <svg v-if="pullUnpublishedOnly" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <input type="checkbox" v-model="pullUnpublishedOnly" class="absolute opacity-0 w-full h-full cursor-pointer" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">Unpublished Only</span>
                  <span class="text-xs font-medium text-gray-400 dark:text-slate-500">Pull only untranslated entries</span>
                </div>
              </label>
            </div>
            
            <div class="flex flex-wrap gap-3 w-full sm:w-auto">
              <SharedDownloadButton
                v-if="store.isPulled"
                :data="store.sourceEntries"
                :filename="`${type}_source.json`"
                label="Download Source"
                variant="outline"
                class="flex-1 sm:flex-none"
              />
              <button
                @click="handlePull"
                :disabled="isPulling"
                class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-black rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-widest"
              >
                <svg v-if="isPulling" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ store.isPulled ? 'Re-pull Data' : 'Initialize Pull' }}
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
        <div class="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner bg-gray-50/30 dark:bg-slate-950/20">
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
        <div class="space-y-10">
          <!-- Locale Selection Grid -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="space-y-1">
                <h4 class="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Target Languages</h4>
                <p class="text-xs font-medium text-gray-500 dark:text-slate-400">Select at least one locale to proceed</p>
              </div>
              <div class="flex gap-4">
                <button @click="selectAllLocales" class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors">Select All</button>
                <button @click="clearLocaleSelection" class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors">Clear</button>
              </div>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div
                v-for="l in locales"
                :key="l.code"
                class="relative group"
              >
                <button
                  @click="toggleLocale(l.code)"
                  class="w-full flex items-center justify-between px-4 py-3 border-2 rounded-2xl text-xs font-bold transition-all duration-300"
                  :class="[
                    selectedLocales.includes(l.code)
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md shadow-indigo-100 dark:shadow-indigo-950/50'
                      : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-gray-50 dark:hover:bg-slate-900'
                  ]"
                >
                  <span class="truncate pr-2 uppercase">{{ l.name }}</span>
                  <span class="font-black opacity-30 text-[10px] tracking-tighter">{{ l.code.toUpperCase() }}</span>
                </button>
                
                <button
                  v-if="store.localeJobStatus[l.code] === 'error'"
                  @click.stop="handleRetry(l.code)"
                  class="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-600 hover:scale-110 transition-all z-20"
                  title="Retry Translation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Progress and Status -->
          <div v-if="isTranslating || Object.keys(store.localeJobStatus).length > 0" class="space-y-6 pt-10 border-t border-gray-50 dark:border-slate-800">
            <div v-if="isTranslating" class="space-y-4 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30">
              <div class="flex justify-between items-end">
                <div class="space-y-1">
                  <span class="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Engine Working</span>
                  <p class="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-tight">Processing translations...</p>
                </div>
                <span class="text-xl font-black text-indigo-600 dark:text-indigo-400">{{ Math.round((store.translationProgress.current / (store.translationProgress.total || 1)) * 100) }}%</span>
              </div>
              <SharedProgressBar 
                :current="store.translationProgress.current" 
                :total="store.translationProgress.total" 
                class="!h-3"
              />
            </div>
            
            <SharedLocaleStatusGrid :progress="localeProgress" />
          </div>

          <div class="flex justify-end pt-8 border-t border-gray-50 dark:border-slate-800">
            <button
              @click="handleTranslate"
              :disabled="isTranslating || selectedLocales.length === 0"
              class="inline-flex items-center px-8 py-3 border border-transparent text-sm font-black rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-widest"
            >
              <svg v-if="isTranslating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isTranslating ? 'Running Engine...' : 'Start Translation' }}
            </button>
          </div>
        </div>
      </SharedStepCard>

      <!-- Step 4: Preview & Download Translations -->
      <SharedStepCard
        :step-number="4"
        title="Preview & Download"
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
        title="Manual Override"
        description="Manually override or add translations via JSON file upload"
        :locked="!store.isPulled"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl text-gray-400 dark:text-slate-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Upload Existing Data</p>
              <p class="text-xs font-medium text-gray-500 dark:text-slate-400">Use this to upload pre-translated JSON or correct AI errors.</p>
            </div>
          </div>
          <button
            @click="showUploadModal = true"
            class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 dark:border-slate-700 shadow-sm text-xs font-black rounded-xl text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-slate-800 transition-all uppercase tracking-widest"
          >
            Upload JSON Files
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
        <div class="space-y-6">
          <div v-if="hasLocaleData" class="flex justify-end">
            <button
              @click="handleSyncAll"
              :disabled="isSyncingAll"
              class="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-black rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-widest"
            >
              <svg v-if="isSyncingAll" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSyncingAll ? 'Syncing Batch...' : 'Bulk Sync All Locales' }}
            </button>
          </div>

          <div class="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950/20">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
                <thead class="bg-gray-50/50 dark:bg-slate-900/50">
                  <tr>
                    <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Locale</th>
                    <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Origin</th>
                    <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Status</th>
                    <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-slate-800 transition-colors">
                  <tr v-for="(entries, locale) in store.localeEntries" :key="locale" class="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase">
                          {{ (locale as string).split('_')[0] }}
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{{ locale }}</span>
                          <span class="text-[10px] font-medium text-gray-500 dark:text-slate-500 uppercase tracking-tighter">{{ getLocaleName(locale as string) }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <span 
                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight"
                        :class="store.localeSource[locale as string] === 'ai-generated' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'"
                      >
                        {{ store.localeSource[locale as string] === 'ai-generated' ? 'AI' : 'Manual' }}
                      </span>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <SharedStatusBadge
                        v-if="store.syncedLocales[locale as string]"
                        status="success"
                        :text="`Synced (${store.syncedLocales[locale as string].count})`"
                      />
                      <SharedStatusBadge
                        v-else
                        status="warning"
                        text="Pending"
                      />
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap text-right">
                      <button
                        @click="openSync(locale as string)"
                        class="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all ml-auto"
                      >
                        <template v-if="store.syncedLocales[locale as string]">
                          <div class="flex flex-col items-end">
                            <div class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                               <span>Synced</span>
                            </div>
                            <span class="text-[9px] font-medium text-gray-400 dark:text-slate-500">{{ formatTime(store.syncedLocales[locale as string].at) }}</span>
                          </div>
                        </template>
                        <template v-else>
                          <span>Push Data</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </template>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
      :key-count="((store.localeEntries[syncLocale] || []) as any).length"
      :content-type="type"
      @cancel="showSyncModal = false"
      @confirm="handleSyncConfirm"
    />
  </div>
</template>
