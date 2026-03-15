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
    class: 'bg-red-100 text-red-700 border-red-200'
  },
  'ai-generated': {
    label: 'AI Generated',
    class: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  manual: {
    label: 'Manual',
    class: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  translated: {
    label: 'Translated',
    class: 'bg-green-100 text-green-700 border-green-200'
  },
  success: {
    label: 'Success',
    class: 'bg-green-100 text-green-700 border-green-200'
  },
  warning: {
    label: 'Warning',
    class: 'bg-amber-100 text-amber-700 border-amber-200'
  }
}

const config = computed(() => statusConfig[props.status] || { label: props.status, class: 'bg-gray-100 text-gray-700 border-gray-200' })
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
    :class="config.class"
  >
    {{ text || config.label }}
  </span>
</template>
