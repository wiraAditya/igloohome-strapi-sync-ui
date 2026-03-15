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
    class: 'bg-rose-50 text-rose-700 border-rose-100'
  },
  'ai-generated': {
    label: 'AI Generated',
    class: 'bg-indigo-50 text-indigo-700 border-indigo-100'
  },
  manual: {
    label: 'Manual',
    class: 'bg-violet-50 text-violet-700 border-violet-100'
  },
  translated: {
    label: 'Translated',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  success: {
    label: 'Success',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  warning: {
    label: 'Warning',
    class: 'bg-amber-50 text-amber-700 border-amber-100'
  }
}

const config = computed(() => statusConfig[props.status] || { label: props.status, class: 'bg-gray-50 text-gray-500 border-gray-100' })
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors"
    :class="config.class"
  >
    <span class="w-1 h-1 rounded-full mr-1.5 opacity-50" :class="config.class.split(' ')[1].replace('text-', 'bg-')"></span>
    {{ text || config.label }}
  </span>
</template>
