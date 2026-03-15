<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUiStore } from "~/stores/ui";
import { useStrapi } from "~/composables/useStrapi";

const ui = useUiStore();

const settingsData = ref({
  strapiBaseUrl: 'Loading...',
  isStrapiTokenSet: false,
  isGeminiKeySet: false
});

const fetchSettings = async () => {
  try {
    const data = await $fetch<any>('/api/settings');
    settingsData.value = data;
  } catch (e) {
    ui.addToast("Failed to fetch settings status", "error");
  }
};

onMounted(() => {
  fetchSettings();
});

const isTesting = ref(false);
const testStatus = ref<"idle" | "success" | "error">("idle");
const errorMessage = ref("");

const testConnection = async () => {
  isTesting.value = true;
  testStatus.value = "idle";
  errorMessage.value = "";

  try {
    const { testConnection: runTest } = useStrapi();
    await runTest();
    testStatus.value = "success";
    ui.addToast("Strapi connection successful", "success");
  } catch (e: any) {
    testStatus.value = "error";
    errorMessage.value = e.message || "Connection failed";
    ui.addToast(`Strapi connection failed: ${errorMessage.value}`, "error");
  } finally {
    isTesting.value = false;
  }
};
</script>

<template>
  <div class="space-y-8 pb-12">
    <div class="border-b border-gray-200 pb-5">
      <h1 class="text-3xl font-bold leading-6 text-gray-900 uppercase tracking-tight">System Status</h1>
      <p class="mt-2 text-sm text-gray-500">
        Overview of the Strapi i18n Sync architecture and configuration.
      </p>
    </div>

    <!-- System Information -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-white/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 class="font-bold uppercase tracking-wider text-sm">Secure Proxy</h3>
        </div>
        <p class="text-blue-100 text-xs leading-relaxed">
          All API communication is routed through a secure Nitro server proxy. Your API tokens never reach the browser, protecting them from inspection.
        </p>
      </div>

      <div class="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-white/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
          </div>
          <h3 class="font-bold uppercase tracking-wider text-sm">AI Translation</h3>
        </div>
        <p class="text-indigo-100 text-xs leading-relaxed">
          Powered by Google Gemini 1.5 Flash. The system uses batching and sequential merging to provide instant visual feedback during translation.
        </p>
      </div>

      <div class="bg-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-100">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-white/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <h3 class="font-bold uppercase tracking-wider text-sm">Sync Engine</h3>
        </div>
        <p class="text-purple-100 text-xs leading-relaxed">
          Implements a strict Fetch-Check-Update logic. It automatically handles Strapi's complex localization data structures and category linking.
        </p>
      </div>
    </div>

    <div class="bg-white shadow-xl border border-gray-100 overflow-hidden sm:rounded-2xl">
      <div class="px-6 py-6 sm:px-8 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
        <div>
          <h3 class="text-lg leading-6 font-bold text-gray-900 uppercase tracking-wide">
            Connectivity Status
          </h3>
          <p class="mt-1 max-w-2xl text-xs font-medium text-gray-400 uppercase tracking-tighter">
            Verification of server-side environment variables
          </p>
        </div>
        <button
          @click="testConnection"
          :disabled="isTesting"
          class="inline-flex items-center px-6 py-2.5 border border-transparent text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-100 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all active:scale-95"
        >
          <svg
            v-if="isTesting"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
            ></circle>
            <path
              class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Test Strapi Connection
        </button>
      </div>
      <div class="px-6 py-4 sm:px-8">
        <dl class="divide-y divide-gray-100">
          <div class="py-5 grid grid-cols-3 gap-4">
            <dt class="text-xs font-black text-gray-400 uppercase tracking-widest self-center">
              Strapi Endpoint
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold bg-gray-50 p-3 rounded-xl border border-gray-100">
              {{ settingsData.strapiBaseUrl }}
            </dd>
          </div>
          <div class="py-5 grid grid-cols-3 gap-4">
            <dt class="text-xs font-black text-gray-400 uppercase tracking-widest self-center">
              Strapi Authentication
            </dt>
            <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 flex items-center">
              <span v-if="settingsData.isStrapiTokenSet" class="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                TOKEN SECURELY LOADED
              </span>
              <span v-else class="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-full border border-red-100 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                TOKEN MISSING
              </span>
            </dd>
          </div>
          <div class="py-5 grid grid-cols-3 gap-4">
            <dt class="text-xs font-black text-gray-400 uppercase tracking-widest self-center">
              Gemini Service
            </dt>
            <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 flex items-center">
              <span v-if="settingsData.isGeminiKeySet" class="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                API KEY SECURELY LOADED
              </span>
              <span v-else class="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-full border border-red-100 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                API KEY MISSING
              </span>
            </dd>
          </div>

          <!-- Connection Test Result -->
          <div
            v-if="testStatus !== 'idle'"
            class="py-5 grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <dt class="text-xs font-black text-gray-400 uppercase tracking-widest self-center">Last Test Result</dt>
            <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <div
                v-if="testStatus === 'success'"
                class="flex items-center text-green-700 bg-green-50 p-3 rounded-xl border border-green-100 font-bold"
              >
                <svg
                  class="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                Connection successful
              </div>
              <div
                v-else-if="testStatus === 'error'"
                class="flex flex-col text-red-700 bg-red-50 p-3 rounded-xl border border-red-100"
              >
                <div class="flex items-center font-bold">
                  <svg
                    class="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Connection failed
                </div>
                <p class="mt-1 text-xs text-red-500 font-medium ml-7">{{ errorMessage }}</p>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- About the System -->
    <div class="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl">
      <div class="flex items-center gap-4 mb-8">
        <div class="bg-blue-500 p-3 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div>
          <h2 class="text-xl font-bold uppercase tracking-tight">About the Synchronization System</h2>
          <p class="text-gray-400 text-xs font-medium uppercase tracking-widest">Internal Content Management Tool</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="space-y-6">
          <section>
            <h4 class="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Core Purpose</h4>
            <p class="text-sm text-gray-300 leading-relaxed">
              This application streamlines the multi-language localization workflow for Strapi. It bridges the gap between raw CMS data and high-quality AI translations, providing a safe environment for bulk updates.
            </p>
          </section>
          
          <section>
            <h4 class="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Key Workflows</h4>
            <ul class="space-y-3 text-xs text-gray-400">
              <li class="flex items-start gap-2">
                <span class="text-blue-500 font-bold">01.</span>
                <span>Automatic pulling of unpublished (untranslated) content from Strapi via GraphQL.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 font-bold">02.</span>
                <span>Batch translation using Gemini 1.5 Flash with specialized context-aware prompts.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 font-bold">03.</span>
                <span>Human-in-the-loop review system with inline manual overrides and JSON file imports.</span>
              </li>
            </ul>
          </section>
        </div>

        <div class="space-y-6">
          <section class="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 class="text-white text-xs font-bold uppercase tracking-widest mb-4">Technical Standards</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] text-gray-500 font-black uppercase mb-1">Frontend</p>
                <p class="text-xs font-bold">Nuxt 4 / Vue 3</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500 font-black uppercase mb-1">Styling</p>
                <p class="text-xs font-bold">Tailwind CSS v4</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500 font-black uppercase mb-1">State</p>
                <p class="text-xs font-bold">Pinia (Isolated)</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500 font-black uppercase mb-1">API Protocol</p>
                <p class="text-xs font-bold">GraphQL</p>
              </div>
            </div>
          </section>

          <div class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
             <p class="text-[10px] text-amber-200/70 font-medium leading-relaxed uppercase tracking-tight">
               Changes made in this session are kept in local memory. Ensure you Sync or Export your data before refreshing the page.
             </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
