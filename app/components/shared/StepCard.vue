<script setup lang="ts">
defineProps<{
  stepNumber: number
  title: string
  description: string
  locked?: boolean
}>()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-xl border transition-all duration-300"
    :class="[
      locked
        ? 'bg-gray-50 border-gray-200 opacity-80'
        : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
    ]"
  >
    <!-- Step Header -->
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
            :class="[
              locked ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white'
            ]"
          >
            {{ stepNumber }}
          </div>
          <div>
            <h3
              class="text-lg font-semibold"
              :class="locked ? 'text-gray-400' : 'text-gray-900'"
            >
              {{ title }}
            </h3>
            <p
              class="text-sm"
              :class="locked ? 'text-gray-300' : 'text-gray-500'"
            >
              {{ description }}
            </p>
          </div>
        </div>

        <div v-if="locked" class="text-gray-400">
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
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>

      <!-- Content Area -->
      <div v-if="!locked" class="mt-6 pt-6 border-t border-gray-100">
        <slot />
      </div>

      <!-- Locked Message -->
      <div
        v-else
        class="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-center"
      >
        <p class="text-sm font-medium text-gray-400">
          Complete the previous step first
        </p>
      </div>
    </div>
  </div>
</template>
