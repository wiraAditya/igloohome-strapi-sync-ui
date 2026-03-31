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
    <div v-if="label" class="flex items-center justify-between mb-2">
      <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
        {{ label }}
      </span>
      <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        {{ current }}/{{ total }} ({{ percentage }}%)
      </span>
    </div>
    <div class="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner border border-gray-100 dark:border-slate-800">
      <div
        class="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(79,70,229,0.3)]"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>
