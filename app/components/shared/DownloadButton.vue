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
    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    @click="handleDownload"
    :class="[
      variant === 'secondary'
        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'
        : variant === 'outline'
        ? 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50'
        : variant === 'ghost'
        ? 'bg-transparent text-gray-600 hover:bg-gray-100'
        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
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
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    </slot>
    {{ label }}
  </button>
</template>
