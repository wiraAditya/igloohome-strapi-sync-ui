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
  <div class="border rounded-xl bg-white overflow-hidden shadow-sm">
    <div class="bg-gray-50 border-b p-4 flex items-center justify-between">
      <h4 class="font-bold text-gray-900">Translation Preview</h4>
      <button
        v-if="availableLocales.length > 0"
        @click="$emit('downloadAll')"
        class="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        Download All (.zip)
      </button>
    </div>

    <div class="flex h-[600px]">
      <!-- Left Panel: Locale List -->
      <div class="w-64 border-r overflow-y-auto bg-white shrink-0">
        <div v-for="l in availableLocales" :key="l.code" 
          class="group border-b last:border-0 transition-colors cursor-pointer"
          :class="[selectedLocale === l.code ? 'bg-blue-50' : 'hover:bg-gray-50']"
          @click="selectedLocale = l.code"
        >
          <div class="p-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div v-if="localeJobStatus[l.code] === 'done'" class="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div v-else-if="localeJobStatus[l.code] === 'running'" class="text-blue-500 animate-spin">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
              </div>
              <div v-else-if="localeJobStatus[l.code] === 'error'" class="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              
              <span class="text-sm font-medium" :class="[selectedLocale === l.code ? 'text-blue-700' : 'text-gray-700']">
                {{ l.code.toUpperCase() }}
              </span>
            </div>

            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                v-if="localeJobStatus[l.code] === 'done'"
                @click.stop="$emit('download', l.code)"
                class="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                title="Download JSON"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </button>
              <button 
                v-if="localeJobStatus[l.code] === 'error'"
                @click.stop="$emit('retry', l.code)"
                class="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                title="Retry AI"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="availableLocales.length === 0" class="p-6 text-center text-gray-400 text-sm">
          No translations available yet.
        </div>
      </div>

      <!-- Right Panel: Table -->
      <div class="flex-1 overflow-hidden bg-gray-50/30 flex flex-col">
        <template v-if="selectedLocale">
          <div class="p-4 border-b bg-white flex items-center justify-between">
            <div>
              <h5 class="font-bold text-gray-900 leading-none">Showing: {{ selectedLocaleName }} ({{ selectedLocale }})</h5>
              <p class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                {{ contentType }}
              </p>
            </div>
            <button
              v-if="localeJobStatus[selectedLocale] === 'done'"
              @click="$emit('download', selectedLocale)"
              class="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1 shadow-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download {{ selectedLocale }}.json
            </button>
          </div>
          
          <div class="flex-1 overflow-hidden p-4">
            <SharedTranslationTable
              :source-entries="sourceEntries"
              :locale-entries="localeEntries[selectedLocale]"
              :type="contentType"
              :locale="selectedLocale"
              @update:entry="handleUpdateEntry"
              class="h-full bg-white shadow-sm"
            />
          </div>
        </template>
        
        <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-20"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p class="text-sm">Select a locale to preview translations</p>
        </div>
      </div>
    </div>
  </div>
</template>
