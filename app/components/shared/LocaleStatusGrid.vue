<script setup lang="ts">
import { SUPPORTED_LOCALES } from '../../types/translations'
import type { LocaleCode } from '../../types/translations'

const props = defineProps<{
  progress: Record<string, number> // locale code -> percentage (0-100)
}>()

const locales = SUPPORTED_LOCALES

const getDotColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
  if (percentage > 0) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
  return 'bg-gray-300 dark:bg-slate-700'
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
    <div
      v-for="locale in locales"
      :key="locale.code"
      class="flex flex-col p-3 border rounded-xl bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group"
      :title="locale.name"
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-black uppercase text-gray-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {{ locale.code }}
        </span>
        <div
          class="h-2 w-2 rounded-full transition-all duration-500"
          :class="getDotColor(progress[locale.code] || 0)"
        ></div>
      </div>
      <div class="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
        {{ progress[locale.code] || 0 }}% <span class="hidden group-hover:inline ml-1 font-medium text-gray-300 dark:text-slate-600">Complete</span>
      </div>
    </div>
  </div>
</template>
