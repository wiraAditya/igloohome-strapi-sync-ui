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
        @click.self="$emit('cancel')"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div class="p-6">
            <div
              class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
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

            <h3 class="text-xl font-bold text-gray-900 mb-2">Sync to Strapi?</h3>
            <p class="text-gray-600 leading-relaxed">
              You are about to sync <span class="font-bold text-gray-900">{{ localeName }} ({{ locale }})</span> —
              <span class="font-bold text-gray-900">{{ keyCount }} entries</span> — to Strapi under
              <span class="font-bold text-gray-900 capitalize">{{ contentType }}</span
              >. This will overwrite existing content in Strapi.
            </p>
            <p class="mt-4 text-sm font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
              This action cannot be undone. Are you sure you want to continue?
            </p>
          </div>

          <div class="bg-gray-50 p-6 flex items-center justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              @click="$emit('cancel')"
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              @click="$emit('confirm')"
            >
              Confirm & Sync
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
