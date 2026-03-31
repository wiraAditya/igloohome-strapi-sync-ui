<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { SUPPORTED_LOCALES } from '~/types/translations'
import type {
  ContentType,
  StrapiEntry,
  LocaleCode,
  LocaleJobStatus
} from '~/types/translations'
import SharedTranslationTable from './TranslationTable.vue'

const props = defineProps<{
  localeEntries: Record<string, StrapiEntry[]>
  localeJobStatus: Record<string, LocaleJobStatus>
  sourceEntries: StrapiEntry[]
  contentType: ContentType
}>()

const emit = defineEmits<{
  (e: 'download', locale: string): void
  (e: 'downloadAll'): void
  (e: 'retry', locale: string): void
  (e: 'update:entry', payload: { id: string; field: string; value: string; locale: string }): void
}>()

const selectedLocale = ref<string>('')

const locales = SUPPORTED_LOCALES

const availableLocales = computed(() => {
  return locales.filter((l: any) => props.localeJobStatus[l.code] || props.localeEntries[l.code])
})

// Select first available locale by default
watch(
  availableLocales,
  (newLocales) => {
    if (newLocales.length > 0 && !selectedLocale.value) {
      selectedLocale.value = (newLocales[0] as any).code
    }
  },
  { immediate: true }
)

const selectedLocaleName = computed(() => {
  return locales.find((l: any) => l.code === selectedLocale.value)?.name || selectedLocale.value
})

const handleUpdateEntry = (payload: { id: string; field: string; value: string }) => {
  emit('update:entry', { ...payload, locale: selectedLocale.value })
}
</script>

<template>
  <div class="border border-gray-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col transition-colors">
    <!-- Header -->
    <div class="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h4 class="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase">Translation Preview</h4>
        <p class="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Review and Export Session Data</p>
      </div>
      <button
        v-if="availableLocales.length > 0"
        @click="$emit('downloadAll')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-950/50 active:scale-95 w-full sm:w-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        Download All (.zip)
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="flex flex-col md:flex-row h-auto md:h-[700px] overflow-hidden">
      <!-- Left Panel: Locale Selector -->
      <div class="w-full md:w-72 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/30 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-hide transition-colors">
        <!-- Mobile Horizontal Tab List -->
        <div class="flex md:flex-col p-2 sm:p-4 gap-2">
          <button 
            v-for="l in availableLocales" 
            :key="l.code" 
            class="flex items-center gap-3 p-3 rounded-2xl transition-all shrink-0 md:shrink"
            :class="[selectedLocale === l.code ? 'bg-white dark:bg-slate-800 shadow-md dark:shadow-indigo-900/20 border border-gray-100 dark:border-slate-700' : 'hover:bg-gray-100/50 dark:hover:bg-slate-800/50 text-gray-500 dark:text-slate-400']"
            @click="selectedLocale = l.code"
          >
            <div class="relative">
              <div v-if="localeJobStatus[l.code] === 'done'" class="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/50"></div>
              <div v-else-if="localeJobStatus[l.code] === 'running'" class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <div v-else-if="localeJobStatus[l.code] === 'error'" class="w-2 h-2 rounded-full bg-rose-500"></div>
              <div v-else class="w-2 h-2 rounded-full bg-gray-300 dark:bg-slate-700"></div>
            </div>
            
            <div class="flex flex-col items-start min-w-[60px] md:min-w-0">
              <span class="text-xs font-black uppercase tracking-tighter" :class="[selectedLocale === l.code ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-slate-400']">
                {{ l.code }}
              </span>
              <span class="hidden md:block text-[10px] font-medium text-gray-400 dark:text-slate-500 truncate w-32 uppercase tracking-tighter">
                {{ l.name }}
              </span>
            </div>

            <div class="hidden md:flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                v-if="localeJobStatus[l.code] === 'done'"
                @click.stop="$emit('download', l.code)"
                class="p-1.5 text-gray-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </button>
            </div>
          </button>
        </div>
        
        <div v-if="availableLocales.length === 0" class="p-8 text-center">
          <p class="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">No Active Translations</p>
        </div>
      </div>

      <!-- Right Panel: Data View -->
      <div class="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden min-w-0 transition-colors">
        <template v-if="selectedLocale">
          <!-- View Controls -->
          <div class="px-4 py-4 sm:px-6 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 transition-colors">
            <div class="overflow-hidden">
              <h5 class="text-sm font-black text-gray-900 dark:text-white uppercase truncate">
                {{ selectedLocaleName }}
              </h5>
              <p class="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.2em] mt-0.5">
                {{ contentType }}
              </p>
            </div>
            <button
              v-if="localeJobStatus[selectedLocale] === 'done'"
              @click="$emit('download', selectedLocale)"
              class="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export JSON
            </button>
          </div>
          
          <!-- Table Container -->
          <div class="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50/30 dark:bg-slate-950/30 transition-colors">
            <SharedTranslationTable
              :source-entries="sourceEntries"
              :locale-entries="localeEntries[selectedLocale]"
              :type="contentType"
              :locale="selectedLocale"
              @update:entry="handleUpdateEntry"
              class="bg-white dark:bg-slate-900 shadow-sm"
            />
          </div>
        </template>
        
        <div v-else class="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div class="bg-gray-50 dark:bg-slate-800 p-6 rounded-full mb-4 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-200 dark:text-slate-700"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h6 class="text-sm font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">Select Locale to Preview</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
