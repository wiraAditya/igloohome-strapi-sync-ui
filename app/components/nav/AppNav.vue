<script setup lang="ts">
import { ref, watch } from 'vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)

interface NavLink {
  name: string
  path: string
  icon: string
  comingSoon?: boolean
}

interface NavSection {
  group: string | null
  links: NavLink[]
}

const navigation: NavSection[] = [
  {
    group: 'Igloohome',
    links: [
      { name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: 'Category', path: '/categories', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
      { name: 'Changelog', path: '/changelogs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: 'FAQ', path: '/faqs', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0118 0z' },
    ]
  },
  {
    group: 'Iglooworks',
    links: [
      { name: 'Changelog', path: '/iglooworks/changelog', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', comingSoon: true },
    ]
  },
  {
    group: 'Iglooaccess',
    links: [
      { name: 'Changelog', path: '/iglooaccess/changelog', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', comingSoon: true },
    ]
  },
  {
    group: null,
    links: [
      { name: 'Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
    ]
  }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <!-- Mobile Header -->
  <header class="md:hidden flex items-center justify-between h-16 px-4 bg-indigo-900 text-white shrink-0 z-50">
    <NuxtLink to="/" class="flex items-center gap-2">
      <div class="bg-white/10 p-1.5 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6 6-6"/><path d="m5 12 6 6 6-6"/></svg>
      </div>
      <span class="text-base font-black tracking-tight">Strapi<span class="text-indigo-400">i18n</span></span>
    </NuxtLink>
    <button @click="toggleMobileMenu" class="p-2 bg-white/5 rounded-xl transition-all active:scale-95">
      <svg v-if="!isMobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
      <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  </header>

  <!-- Sidebar Container -->
  <aside 
    class="fixed md:relative inset-0 md:inset-auto z-40 md:z-auto transition-transform duration-300 transform md:translate-x-0 bg-indigo-950 flex flex-col w-72 h-full shrink-0 shadow-2xl border-r border-indigo-900/50"
    :class="[isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full']"
  >
    <!-- Logo Section -->
    <div class="p-8 hidden md:block">
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="bg-indigo-600 p-2.5 rounded-2xl group-hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 group-hover:scale-105 group-active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6 6-6"/><path d="m5 12 6 6 6-6"/></svg>
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-black text-white tracking-tight leading-none">Strapi<span class="text-indigo-400">i18n</span></span>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/60 mt-1">Sync Engine</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation Area -->
    <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-8 mt-4 md:mt-0">
      <div v-for="section in navigation" :key="section.group || 'standalone'" class="space-y-1">
        <div v-if="section.group" class="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/40">
          {{ section.group }}
        </div>
        
        <NuxtLink
          v-for="link in section.links"
          :key="link.path"
          :to="link.path"
          class="group flex items-center gap-3.5 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200 text-indigo-300/60 hover:text-white hover:bg-white/5"
          active-class="!bg-indigo-600 !text-white shadow-xl shadow-indigo-600/20"
        >
          <svg class="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon" />
          </svg>
          <span class="truncate">{{ link.name }}</span>
          
          <span v-if="link.comingSoon" class="ml-auto text-[8px] font-black uppercase tracking-tighter bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-md border border-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
            Soon
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Footer Meta -->
    <div class="p-6 mt-auto border-t border-white/5 space-y-4">
       <div class="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
        <div class="relative flex h-2 w-2 shrink-0">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <div class="flex flex-col overflow-hidden">
          <span class="text-[9px] font-black uppercase tracking-widest text-indigo-400/60">System Status</span>
          <span class="text-[10px] font-bold text-white uppercase tracking-tighter truncate">Operational v1.0</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div 
    v-if="isMobileMenuOpen" 
    @click="isMobileMenuOpen = false"
    class="fixed inset-0 bg-indigo-950/80 backdrop-blur-sm z-30 md:hidden"
  ></div>
</template>

<style scoped>
/* Hide scrollbar for sidebar but allow scrolling */
nav::-webkit-scrollbar {
  display: none;
}
nav {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
