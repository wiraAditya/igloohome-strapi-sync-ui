<script setup lang="ts">
const categoriesStore = useCategoriesStore()
const changelogsStore = useChangelogsStore()
const faqsStore = useFaqsStore()

const contentTypes = [
  {
    id: 'categories',
    name: 'Categories',
    description: 'Product categories and labels',
    store: categoriesStore,
    path: '/categories',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    color: 'indigo'
  },
  {
    id: 'changelogs',
    name: 'Changelogs',
    description: 'Product updates and version history',
    store: changelogsStore,
    path: '/changelogs',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'indigo'
  },
  {
    id: 'faqs',
    name: 'FAQs',
    description: 'Help center and frequently asked questions',
    store: faqsStore,
    path: '/faqs',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0118 0z',
    color: 'indigo'
  }
]

const getSyncedCount = (store: any) => {
  return Object.keys(store.syncedLocales).length
}

const getLocaleCount = (store: any) => {
  return Object.keys(store.localeEntries).length
}
</script>

<template>
  <div class="space-y-12 py-4">
    <!-- Hero Section -->
    <div class="relative overflow-hidden rounded-3xl bg-indigo-900 px-8 py-12 shadow-2xl">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">
          Content <span class="text-indigo-400">Localization</span> Dashboard
        </h1>
        <p class="mt-4 text-lg text-indigo-100/80 font-medium leading-relaxed">
          Streamline your Strapi content translation workflow with AI-powered synchronization. 
          Monitor progress and manage translations across all content types.
        </p>
      </div>
      <!-- Background Decor -->
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div class="absolute -bottom-20 right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
    </div>

    <!-- Content Types Grid -->
    <section>
      <div class="flex items-end justify-between mb-8 px-2">
        <div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight uppercase">Content Types</h2>
          <p class="text-sm text-gray-500 font-medium">Select a module to start synchronizing</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="type in contentTypes"
          :key="type.id"
          :to="type.path"
          class="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-1 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 border border-gray-100"
        >
          <div class="flex flex-1 flex-col justify-between p-6">
            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3">
                  <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="type.icon" />
                  </svg>
                </div>
                <div class="flex flex-col items-end">
                   <SharedStatusBadge
                    :status="type.store.isPulled ? 'success' : 'warning'"
                    :text="type.store.isPulled ? 'Ready' : 'Pending'"
                  />
                </div>
              </div>
              <h3 class="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                {{ type.name }}
              </h3>
              <p class="mt-2 text-sm text-gray-500 font-medium leading-relaxed">
                {{ type.description }}
              </p>
            </div>

            <div class="mt-8 grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
              <div class="space-y-1">
                <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Locales</span>
                <p class="text-lg font-bold text-gray-900">{{ getLocaleCount(type.store) }}</p>
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Synced to Strapi</span>
                <p class="text-lg font-bold text-indigo-600">{{ getSyncedCount(type.store) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Hover Action Area -->
          <div class="mt-auto bg-gray-50 p-4 flex items-center justify-between group-hover:bg-indigo-600 transition-colors">
            <span class="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Manage Content</span>
            <svg class="h-4 w-4 text-gray-400 group-hover:text-white transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Quick Start Guide -->
    <section class="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="bg-amber-50 p-6 rounded-2xl shrink-0">
          <svg class="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-black text-gray-900 tracking-tight uppercase mb-4">Quick Start Workflow</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="relative">
              <span class="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white shadow-lg">1</span>
              <div class="h-full rounded-2xl bg-gray-50 p-4 pt-6">
                <p class="text-xs font-bold text-gray-900 leading-tight">Select a content type from the dashboard cards above.</p>
              </div>
            </div>
            <div class="relative">
              <span class="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white shadow-lg">2</span>
              <div class="h-full rounded-2xl bg-gray-50 p-4 pt-6">
                <p class="text-xs font-bold text-gray-900 leading-tight">Pull untranslated content from Strapi in Step 1.</p>
              </div>
            </div>
            <div class="relative">
              <span class="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white shadow-lg">3</span>
              <div class="h-full rounded-2xl bg-gray-50 p-4 pt-6">
                <p class="text-xs font-bold text-gray-900 leading-tight">Select target locales and click "Start AI Translation".</p>
              </div>
            </div>
            <div class="relative">
              <span class="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white shadow-lg">4</span>
              <div class="h-full rounded-2xl bg-gray-50 p-4 pt-6">
                <p class="text-xs font-bold text-gray-900 leading-tight">Preview results and sync back to Strapi in Step 6.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
