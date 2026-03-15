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
    icon: 'folder'
  },
  {
    id: 'changelogs',
    name: 'Changelogs',
    description: 'Product updates and version history',
    store: changelogsStore,
    path: '/changelogs',
    icon: 'scroll'
  },
  {
    id: 'faqs',
    name: 'FAQs',
    description: 'Help center and frequently asked questions',
    store: faqsStore,
    path: '/faqs',
    icon: 'question'
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
  <div class="space-y-8">
    <div class="border-b border-gray-200 pb-5">
      <h1 class="text-3xl font-bold leading-6 text-gray-900">Dashboard</h1>
      <p class="mt-2 text-sm text-gray-500">
        Monitor your localization progress across different content types.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="type in contentTypes"
        :key="type.id"
        class="overflow-hidden rounded-lg bg-white shadow"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                <svg v-if="type.id === 'categories'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <svg v-else-if="type.id === 'changelogs'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="truncate text-sm font-medium text-gray-500">{{ type.name }}</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ type.description }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="flex items-center justify-between text-sm">
            <div class="flex gap-4">
              <div class="flex flex-col">
                <span class="text-gray-500 text-xs uppercase font-bold">Status</span>
                <SharedStatusBadge
                  :status="type.store.isPulled ? 'success' : 'warning'"
                  :text="type.store.isPulled ? 'Pulled' : 'Not Pulled'"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-gray-500 text-xs uppercase font-bold">Locales</span>
                <span class="font-medium text-gray-900">{{ getLocaleCount(type.store) }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-gray-500 text-xs uppercase font-bold">Synced</span>
                <span class="font-medium text-gray-900">{{ getSyncedCount(type.store) }}</span>
              </div>
            </div>
            <NuxtLink :to="type.path" class="font-medium text-blue-600 hover:text-blue-500">
              Manage
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-lg bg-blue-50 p-6 border border-blue-100">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">Quick Start Guide</h3>
          <div class="mt-2 text-sm text-blue-700">
            <ol class="list-decimal pl-5 space-y-1">
              <li>Select a content type from the cards above.</li>
              <li>Pull untranslated content from Strapi in Step 1.</li>
              <li>Select target locales and click "Start AI Translation" in Step 3.</li>
              <li>Preview results and sync them back to Strapi in Step 6.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
