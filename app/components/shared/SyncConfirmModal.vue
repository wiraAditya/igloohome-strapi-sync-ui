<script setup lang="ts">
import { computed } from 'vue'
import { SUPPORTED_LOCALES } from '../../types/translations'
import type { ContentType } from '../../types/translations'

const props = defineProps<{
  show: boolean
  locale: string
  keyCount: number
  contentType: ContentType
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const localeName = computed(() => {
  return SUPPORTED_LOCALES.find((l: any) => l.code === props.locale)?.name || props.locale
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-indigo-950/40 backdrop-blur-md" @click="$emit('cancel')"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all">
          <div class="p-8">
            <div
              class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-6 shadow-inner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
                />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>

            <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-3">Sync to Strapi</h3>
            <p class="text-gray-500 font-medium leading-relaxed">
              You are about to synchronize <span class="font-black text-indigo-600">{{ localeName }} ({{ locale.toUpperCase() }})</span> data to your Strapi production instance.
            </p>
            
            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span class="text-xs font-black uppercase tracking-widest text-gray-400">Total Entries</span>
                <span class="text-lg font-black text-gray-900">{{ keyCount }}</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span class="text-xs font-black uppercase tracking-widest text-gray-400">Content Type</span>
                <span class="text-sm font-black text-indigo-600 capitalize">{{ contentType }}</span>
              </div>
            </div>

            <div class="mt-8 flex items-start gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div class="space-y-1">
                <p class="text-xs font-black uppercase tracking-tight">Destructive Action</p>
                <p class="text-xs font-medium opacity-80 leading-snug">This will overwrite existing content in Strapi. This action cannot be undone.</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              class="w-full sm:w-auto px-6 py-3 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
              @click="$emit('cancel')"
            >
              Cancel
            </button>
            <button
              type="button"
              class="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
              @click="$emit('confirm')"
            >
              Confirm & Sync Engine
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
