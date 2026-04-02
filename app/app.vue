<script setup lang="ts">
/**
 * Global App Shell
 * Handles layout and common elements across all pages.
 */
useHead({
  title: "Strapi I18n Sync",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Strapi I18n Sync` : "Strapi I18n Sync";
  },
  meta: [
    {
      name: "description",
      content: "AI-powered synchronization for Strapi Internationalization.",
    },
  ],
});
</script>

<template>
  <NuxtLoadingIndicator color="#4F46E5" :height="2" />

  <div
    class="min-h-screen bg-(--bg-main) font-sans antialiased text-(--text-main) selection:bg-indigo-600 selection:text-white flex flex-col md:flex-row h-screen overflow-hidden transition-colors duration-300"
  >
    <!-- Scalable Sidebar Navigation -->
    <NavAppNav />

    <!-- Main Content App-Shell -->
    <main class="flex-1 flex flex-col min-w-0 relative overflow-hidden">
      <!-- Session Header (Status Bar) -->
      <header
        class="hidden md:flex h-16 shrink-0 bg-(--bg-card)/50 backdrop-blur-xl border-b border-(--border-color) items-center justify-between px-8 z-10 transition-colors"
      >
        <div class="flex items-center gap-4">
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-800/50 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
              ></span>
            </span>
            Session Sync Active
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Dark Mode Toggle Component - Wrapped in ClientOnly to avoid Hydration Mismatch -->
          <div class="flex items-center gap-2 mr-2">
            <ClientOnly>
              <SharedColorModeToggle />
              <template #fallback>
                <div
                  class="w-10 h-10 rounded-lg bg-(--bg-card) border border-(--border-color) animate-pulse"
                />
              </template>
            </ClientOnly>
          </div>

          <NuxtLink
            to="/settings"
            class="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
            aria-label="Settings"
          >
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
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </NuxtLink>
        </div>
      </header>

      <!-- Scrollable Workspace -->
      <div
        class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-(--bg-main) transition-colors"
      >
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Suspense>
            <template #default>
              <NuxtPage />
            </template>
            <template #fallback>
              <div class="flex items-center justify-center min-h-[50vh]">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                ></div>
              </div>
            </template>
          </Suspense>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* Reset base styles handled by main.css */
</style>
