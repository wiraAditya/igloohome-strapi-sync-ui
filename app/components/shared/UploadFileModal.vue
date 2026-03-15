<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { SUPPORTED_LOCALES } from '~/types/translations'
import type { StrapiEntry, ContentType, LocaleCode } from '~/types/translations'

const props = defineProps<{
  show: boolean
  sourceEntries: StrapiEntry[]
  type: ContentType
}>()

const emit = defineEmits<{
  (e: 'upload', payload: { locale: string; entries: StrapiEntry[] }): void
  (e: 'close'): void
}>()

interface StagedFile {
  id: string
  filename: string
  entries: StrapiEntry[]
  detectedLocale: string
  error: string | null
  searchQuery: string
  isDropdownOpen: boolean
}

const fileInput = ref<HTMLInputElement | null>(null)
const stagedFiles = ref<StagedFile[]>([])
const locales = SUPPORTED_LOCALES

const exampleFormat = computed(() => {
  if (props.type === 'categories') {
    return [
      { id: "1", category: "Translated Category Name" },
      { id: "2", category: "Another Translated Name" }
    ]
  } else if (props.type === 'changelogs') {
    return [
      { 
        id: "101", 
        appVersion: "1.0.0", 
        changes: "- Fixed bug\n- New feature", 
        releaseDate: "2024-03-15" 
      }
    ]
  } else if (props.type === 'faqs') {
    return [
      { 
        id: "50", 
        title: "How to reset?", 
        content: "Press the button for 5 seconds.", 
        category: "1" 
      }
    ]
  }
  return []
})

const reset = () => {
  stagedFiles.value = []
  if (fileInput.value) fileInput.value.value = ''
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length === 0) return

  for (const file of files) {
    let fileError: string | null = null
    let validEntries: StrapiEntry[] = []
    let detectedCode = ''

    // Try to detect locale from filename
    const filename = file.name.toLowerCase()
    const foundLocale = locales.find((l: any) => 
      filename.includes(`-${l.code}.`) || filename.startsWith(`${l.code}.`)
    )
    if (foundLocale) {
      detectedCode = foundLocale.code
    }

    try {
      const text = await file.text()
      const json = JSON.parse(text)

      if (!Array.isArray(json)) {
        throw new Error('Must be a JSON array.')
      }

      const sourceIds = new Set(props.sourceEntries.map(e => e.id))
      validEntries = json.filter(e => sourceIds.has(e.id))
      
      if (validEntries.length === 0) {
        throw new Error('No matching IDs found.')
      }

      if (json.length > validEntries.length) {
        fileError = `${json.length - validEntries.length} items ignored (ID mismatch).`
      }
    } catch (err: any) {
      fileError = err.message || 'Parse error.'
    }

    stagedFiles.value.push({
      id: Math.random().toString(36).slice(2),
      filename: file.name,
      entries: validEntries,
      detectedLocale: detectedCode,
      error: fileError,
      searchQuery: '',
      isDropdownOpen: false
    })
  }
  
  if (fileInput.value) fileInput.value.value = ''
}

const removeFile = (id: string) => {
  stagedFiles.value = stagedFiles.value.filter(f => f.id !== id)
}

const getFilteredLocales = (query: string) => {
  const q = query.toLowerCase().trim()
  if (!q) return locales
  return locales.filter(l => 
    l.name.toLowerCase().includes(q) || 
    l.code.toLowerCase().includes(q)
  )
}

const selectLocale = (fileId: string, code: string) => {
  const file = stagedFiles.value.find(f => f.id === fileId)
  if (file) {
    file.detectedLocale = code
    file.isDropdownOpen = false
    file.searchQuery = ''
  }
}

const confirmAllUploads = () => {
  const readyFiles = stagedFiles.value.filter(f => f.detectedLocale && f.entries.length > 0)
  readyFiles.forEach(f => {
    emit('upload', {
      locale: f.detectedLocale,
      entries: f.entries
    })
  })
  emit('close')
  reset()
}

const canConfirm = computed(() => {
  return stagedFiles.value.length > 0 && stagedFiles.value.every(f => f.detectedLocale)
})

watch(() => props.show, (newVal) => {
  if (!newVal) reset()
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="p-6 border-b shrink-0 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 class="text-xl font-bold text-gray-900 uppercase tracking-tight">Manual Upload: {{ type }}</h3>
              <p class="text-xs text-gray-500 font-medium">Upload JSON files with translated content</p>
            </div>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- Format Guide -->
            <div v-if="stagedFiles.length === 0" class="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div class="flex items-center gap-2 mb-3 text-blue-800 font-bold text-xs uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Required JSON Structure
              </div>
              <pre class="text-[10px] bg-white/80 p-3 rounded-lg border border-blue-100 overflow-x-auto text-blue-900 font-mono shadow-sm">{{ JSON.stringify(exampleFormat, null, 2) }}</pre>
            </div>

            <!-- Upload Zone -->
            <label
              v-if="stagedFiles.length === 0"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all group"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <div class="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <p class="mb-2 text-sm text-gray-700">
                  <span class="font-bold">Click to select files</span> or drag and drop
                </p>
                <p class="text-xs text-gray-400 uppercase font-bold tracking-tighter">JSON format only • Multiple files supported</p>
              </div>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".json"
                multiple
                @change="handleFileUpload"
              />
            </label>

            <!-- Staged Files List -->
            <div v-else class="space-y-3">
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-xs font-black uppercase tracking-widest text-gray-400">Staged Files ({{ stagedFiles.length }})</h4>
                <button @click="reset" class="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest">Clear All</button>
              </div>
              
              <div v-for="file in stagedFiles" :key="file.id" class="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-3 transition-all hover:border-blue-200">
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-3 overflow-hidden">
                    <div class="bg-gray-100 p-2 rounded-lg text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div class="overflow-hidden">
                      <p class="text-sm font-bold text-gray-900 truncate">{{ file.filename }}</p>
                      <p class="text-[10px] font-medium text-gray-500">{{ file.entries.length }} valid keys identified</p>
                    </div>
                  </div>
                  <button @click="removeFile(file.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                  <!-- Searchable Dropdown -->
                  <div class="flex-1 w-full relative">
                    <label class="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Assign Locale</label>
                    <div class="relative">
                      <button 
                        @click="file.isDropdownOpen = !file.isDropdownOpen"
                        class="w-full p-2.5 border rounded-lg text-left text-sm font-bold transition-all flex justify-between items-center"
                        :class="[file.detectedLocale ? 'border-green-200 bg-green-50 text-green-800' : 'border-gray-200 bg-white text-gray-400 hover:border-blue-400']"
                      >
                        {{ file.detectedLocale ? `${locales.find(l => l.code === file.detectedLocale)?.name} (${file.detectedLocale.toUpperCase()})` : 'Select target locale...' }}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{'rotate-180': file.isDropdownOpen}" class="transition-transform"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>

                      <!-- Dropdown Menu -->
                      <div v-if="file.isDropdownOpen" class="absolute left-0 right-0 top-full mt-1 z-50 bg-white border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div class="p-2 border-b bg-gray-50">
                          <input 
                            v-model="file.searchQuery"
                            type="text"
                            placeholder="Search language or code..."
                            class="w-full p-2 bg-white border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            @click.stop
                            autoFocus
                          />
                        </div>
                        <div class="max-h-48 overflow-y-auto">
                          <button 
                            v-for="l in getFilteredLocales(file.searchQuery)" 
                            :key="l.code"
                            @click="selectLocale(file.id, l.code)"
                            class="w-full text-left p-2.5 text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-between"
                          >
                            <span>{{ l.name }}</span>
                            <span class="text-gray-400 font-mono">{{ l.code.toUpperCase() }}</span>
                          </button>
                          <div v-if="getFilteredLocales(file.searchQuery).length === 0" class="p-4 text-center text-xs text-gray-400 font-medium">
                            No languages match your search
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Error Banner for individual file -->
                  <div v-if="file.error" class="flex-1 w-full p-2.5 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2 text-amber-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    <span class="text-[10px] font-bold uppercase tracking-tight">{{ file.error }}</span>
                  </div>
                </div>
              </div>

              <!-- Add More Button -->
              <label class="block p-4 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group">
                <span class="text-xs font-bold text-gray-400 group-hover:text-blue-500">+ Add More Files</span>
                <input type="file" class="hidden" accept=".json" multiple @change="handleFileUpload" />
              </label>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 p-6 flex items-center justify-between gap-3 border-t shrink-0">
            <div class="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {{ stagedFiles.length }} files ready to process
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-8 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-30 disabled:shadow-none"
                :disabled="!canConfirm"
                @click="confirmAllUploads"
              >
                Import All Files
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
