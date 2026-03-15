<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans antialiased text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
    <NavAppNav />
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
/* Global scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>
