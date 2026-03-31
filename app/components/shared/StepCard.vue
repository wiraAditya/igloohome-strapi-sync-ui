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
    class="relative overflow-hidden rounded-3xl border transition-all duration-500"
    :class="[
      locked
        ? 'bg-gray-50/50 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 grayscale'
        : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5'
    ]"
  >
    <!-- Background Decoration for active state -->
    <div 
      v-if="!locked" 
      class="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-50/50 dark:bg-indigo-900/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
    ></div>

    <div class="p-6 sm:p-8 relative z-10">
      <div class="flex flex-col sm:flex-row sm:items-start gap-6">
        <!-- Step Indicator -->
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black transition-all duration-300"
          :class="[
            locked 
              ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600' 
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40'
          ]"
        >
          {{ stepNumber }}
        </div>

        <div class="flex-1">
          <div class="flex items-start justify-between">
            <div>
              <h3
                class="text-xl font-black tracking-tight"
                :class="locked ? 'text-gray-400 dark:text-slate-600' : 'text-gray-900 dark:text-white'"
              >
                {{ title }}
              </h3>
              <p
                class="mt-1 text-sm font-medium leading-relaxed"
                :class="locked ? 'text-gray-300 dark:text-slate-700' : 'text-gray-500 dark:text-slate-400'"
              >
                {{ description }}
              </p>
            </div>

            <div v-if="locked" class="text-gray-300 dark:text-slate-700 bg-gray-100 dark:bg-slate-800 p-2 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          <!-- Content Area -->
          <div v-if="!locked" class="mt-8">
            <slot />
          </div>

          <!-- Locked Message -->
          <div
            v-else
            class="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 dark:border-slate-800 py-10 text-center bg-gray-50/30 dark:bg-slate-900/20"
          >
            <div class="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300 dark:text-slate-600">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-600">
              Prerequisite Pending
            </p>
            <p class="mt-1 text-xs font-medium text-gray-300 dark:text-slate-700">
              Complete previous steps to unlock
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
