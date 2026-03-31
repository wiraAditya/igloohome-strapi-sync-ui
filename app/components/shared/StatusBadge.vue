<script setup lang="ts">
import { computed } from 'vue'
import type { KeyStatus } from '../../types/translations'

const props = defineProps<{
  status: KeyStatus | 'success' | 'warning' | string
  text?: string
}>()

const statusConfig: Record<string, { label: string, class: string }> = {
  missing: {
    label: 'Missing',
    class: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800/50'
  },
  'ai-generated': {
    label: 'AI Generated',
    class: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50'
  },
  manual: {
    label: 'Manual',
    class: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-800/50'
  },
  translated: {
    label: 'Translated',
    class: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50'
  },
  success: {
    label: 'Success',
    class: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50'
  },
  warning: {
    label: 'Warning',
    class: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50'
  }
}

const config = computed(() => statusConfig[props.status] || { 
  label: props.status, 
  class: 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-700' 
})
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors"
    :class="config.class"
  >
    <span class="w-1 h-1 rounded-full mr-1.5 opacity-50 bg-current"></span>
    {{ text || config.label }}
  </span>
</template>
