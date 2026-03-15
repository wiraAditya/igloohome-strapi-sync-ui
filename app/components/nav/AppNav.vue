<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Categories', path: '/categories', icon: 'categories' },
  { name: 'Changelogs', path: '/changelogs', icon: 'changelogs' },
  { name: 'FAQs', path: '/faqs', icon: 'faqs' },
  { name: 'Settings', path: '/settings', icon: 'settings' }
]
</script>

<template>
  <nav class="bg-white border-b sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo/Title -->
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6 6-6"/><path d="m5 12 6 6 6-6"/></svg>
            </div>
            <span class="text-xl font-black text-gray-900 tracking-tight">Strapi<span class="text-blue-600">i18n</span>Sync</span>
          </NuxtLink>

          <!-- Desktop Links -->
          <div class="hidden sm:ml-10 sm:flex sm:space-x-4">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-blue-50 text-blue-700"
            >
              {{ link.name }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Session
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
