<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
  label?: string
}>()

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.current / props.total) * 100)
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">
        {{ label || 'Progress' }}
      </span>
      <span class="text-sm font-medium text-gray-700">
        {{ current }}/{{ total }} ({{ percentage }}%)
      </span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        class="bg-blue-600 h-2.5 transition-all duration-300 ease-out"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>
