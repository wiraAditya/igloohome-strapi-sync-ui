<script setup lang="ts">
/**
 * Shared Coming Soon page component for feature placeholders.
 * Adheres to the "Refined Utilitarian Dashboard" aesthetic.
 */

interface Props {
  /**
   * The main title displayed in the header.
   */
  title: string
  /**
   * Subtitle/description of the feature.
   */
  description: string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-10 py-4">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-0">
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </NuxtLink>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">{{ title }}</h1>
        </div>
        <p class="text-base font-medium text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">{{ description }}</p>
      </div>
    </div>

    <!-- Coming Soon Content -->
    <div class="flex flex-col items-center justify-center min-h-[400px] rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-12 text-center shadow-sm overflow-hidden relative">
      <div class="relative z-10 space-y-6">
        <div class="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L13 15"/><path d="M22 19v2"/><path d="M5 11V9"/><path d="m7.3 4.4 1.4 1.4"/><path d="M12 2v2"/><path d="m16.7 4.4-1.4 1.4"/></svg>
        </div>
        
        <div class="space-y-2">
          <SharedStatusBadge status="warning" text="Development Phase" />
          <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Coming Soon</h2>
          <p class="text-sm font-medium text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
            This module is currently under development and will be available in the next release.
          </p>
        </div>

        <NuxtLink 
          to="/" 
          class="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-black rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
        >
          Return to Dashboard
        </NuxtLink>
      </div>

      <!-- Abstract Background Decor -->
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl"></div>
    </div>
  </div>
</template>
