<script setup lang="ts">
import { useDownload } from '~/composables/useDownload'
const props = defineProps<{
  label?: string
  data?: any
  filename?: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}>()

const { downloadJson } = useDownload()

const handleDownload = () => {
  if (props.data && props.filename) {
    downloadJson(props.filename, props.data)
  }
}
</script>

<template>
  <button
    type="button"
    :disabled="loading || !data"
    class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 border"
    @click="handleDownload"
    :class="[
      variant === 'secondary'
        ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 shadow-sm'
        : variant === 'outline'
        ? 'bg-transparent text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
        : variant === 'ghost'
        ? 'bg-transparent text-gray-500 dark:text-slate-400 border-transparent hover:bg-gray-100 dark:hover:bg-slate-800'
        : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40'
    ]"
  >
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot name="icon">
      <svg
        v-if="!loading"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    </slot>
    {{ label }}
  </button>
</template>
