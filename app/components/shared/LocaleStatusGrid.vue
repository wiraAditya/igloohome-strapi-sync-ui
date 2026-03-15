<script setup lang="ts">
import { SUPPORTED_LOCALES } from '../../types/translations'
import type { LocaleCode } from '../../types/translations'

const props = defineProps<{
  progress: Record<string, number> // locale code -> percentage (0-100)
}>()

const locales = SUPPORTED_LOCALES

const getDotColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
  if (percentage > 0) return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
  return 'bg-gray-300'
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
    <div
      v-for="locale in locales"
      :key="locale.code"
      class="flex flex-col p-2 border rounded-lg bg-white shadow-sm hover:border-blue-200 hover:bg-blue-50 transition-all group"
      :title="locale.name"
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-bold uppercase text-gray-500 group-hover:text-blue-600">
          {{ locale.code }}
        </span>
        <div
          class="h-2 w-2 rounded-full transition-all duration-500"
          :class="getDotColor(progress[locale.code] || 0)"
        ></div>
      </div>
      <div class="text-[10px] text-gray-400 font-medium">
        {{ progress[locale.code] || 0 }}%
      </div>
    </div>
  </div>
</template>
