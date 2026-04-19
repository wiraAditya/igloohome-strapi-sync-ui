<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUiStore } from "~/stores/ui";
import { useAuthStore } from "~/stores/auth";
import { useStrapi } from "~/composables/useStrapi";

const ui = useUiStore();
const authStore = useAuthStore();

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

const activeAboutTab = ref<'standard' | 'iglooworks' | 'technical'>('standard');
const aboutTabs = [
  { key: 'standard', label: 'Sync Flow' },
  { key: 'iglooworks', label: 'Iglooworks' },
  { key: 'technical', label: 'Technical' },
] as const;
</script>

<template>
  <div class="space-y-6 pb-16">

    <!-- Page Header -->
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl sm:text-3xl font-black leading-tight text-gray-900 dark:text-slate-100 uppercase tracking-tight">
        System Status
      </h1>
      <p class="text-sm text-gray-500 dark:text-slate-400 max-w-lg">
        Overview of your Strapi i18n Sync architecture and current configuration.
      </p>
    </div>

    <!-- Account Profile -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      <div class="px-5 py-4 sm:px-6 bg-gray-50/70 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3">
        <div class="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <h3 class="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider">Account Profile</h3>
          <p class="text-[10px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Current active session</p>
        </div>
      </div>
      <div class="px-5 py-5 sm:px-6">
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <dt class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Username</dt>
            <dd class="text-sm font-bold text-gray-900 dark:text-slate-200 bg-gray-50 dark:bg-slate-800/60 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-slate-700/50 truncate transition-colors duration-200">
              {{ authStore.user?.username || 'N/A' }}
            </dd>
          </div>
          <div>
            <dt class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Email</dt>
            <dd class="text-sm font-bold text-gray-900 dark:text-slate-200 bg-gray-50 dark:bg-slate-800/60 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-slate-700/50 truncate transition-colors duration-200">
              {{ authStore.user?.email || 'N/A' }}
            </dd>
          </div>
          <div class="sm:col-span-2 lg:col-span-1">
            <dt class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Role</dt>
            <dd class="flex items-center">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {{ authStore.user?.role?.name || authStore.user?.role?.type || 'No Role Assigned' }}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Architecture Pillars -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-blue-600 dark:bg-blue-900/50 rounded-2xl p-5 text-white shadow-md shadow-blue-100 dark:shadow-none dark:border dark:border-blue-800/40 flex lg:flex-col items-start gap-4 lg:gap-3 transition-colors duration-200">
        <div class="bg-white/20 dark:bg-blue-500/20 p-2 rounded-xl text-white dark:text-blue-300 shrink-0 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-black uppercase tracking-wider text-xs dark:text-blue-100 mb-1.5">Secure Proxy</h3>
          <p class="text-blue-100 dark:text-blue-200/70 text-xs leading-relaxed">
            All API communication routes through a Nitro server proxy. Tokens never reach the browser.
          </p>
        </div>
      </div>

      <div class="bg-indigo-600 dark:bg-indigo-900/50 rounded-2xl p-5 text-white shadow-md shadow-indigo-100 dark:shadow-none dark:border dark:border-indigo-800/40 flex lg:flex-col items-start gap-4 lg:gap-3 transition-colors duration-200">
        <div class="bg-white/20 dark:bg-indigo-500/20 p-2 rounded-xl text-white dark:text-indigo-300 shrink-0 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-black uppercase tracking-wider text-xs dark:text-indigo-100 mb-1.5">AI Translation</h3>
          <p class="text-indigo-100 dark:text-indigo-200/70 text-xs leading-relaxed">
            Powered by Google Gemini 1.5 Flash with batching and parallel processing for instant feedback.
          </p>
        </div>
      </div>

      <div class="bg-purple-600 dark:bg-purple-900/50 rounded-2xl p-5 text-white shadow-md shadow-purple-100 dark:shadow-none dark:border dark:border-purple-800/40 flex lg:flex-col items-start gap-4 lg:gap-3 transition-colors duration-200">
        <div class="bg-white/20 dark:bg-purple-500/20 p-2 rounded-xl text-white dark:text-purple-300 shrink-0 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-black uppercase tracking-wider text-xs dark:text-purple-100 mb-1.5">Sync Engine</h3>
          <p class="text-purple-100 dark:text-purple-200/70 text-xs leading-relaxed">
            Strict Fetch-Check-Update logic handles Strapi's complex localization and category linking.
          </p>
        </div>
      </div>
    </div>

    <!-- Connectivity Status -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      <div class="px-5 py-4 sm:px-6 bg-gray-50/70 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider">Connectivity Status</h3>
            <p class="text-[10px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Server-side environment variables</p>
          </div>
        </div>
        <button
          @click="testConnection"
          :disabled="isTesting"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-xs font-black uppercase tracking-widest rounded-xl text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 shadow-sm transition-all active:scale-95"
        >
          <svg v-if="isTesting" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          {{ isTesting ? 'Testing...' : 'Test Connection' }}
        </button>
      </div>

      <div class="divide-y divide-gray-100 dark:divide-slate-800/60">
        <!-- Strapi Endpoint -->
        <div class="px-5 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <dt class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest shrink-0 sm:w-40">Strapi Endpoint</dt>
          <dd class="flex-1 min-w-0 text-xs font-bold text-gray-900 dark:text-slate-200 bg-gray-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-gray-100 dark:border-slate-700/50 break-all font-mono transition-colors duration-200">
            {{ settingsData.strapiBaseUrl }}
          </dd>
        </div>

        <!-- Strapi Auth -->
        <div class="px-5 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <dt class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest shrink-0 sm:w-40">Strapi Auth</dt>
          <dd class="flex items-center">
            <span v-if="settingsData.isStrapiTokenSet" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Token Loaded
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Token Missing
            </span>
          </dd>
        </div>

        <!-- Gemini Service -->
        <div class="px-5 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <dt class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest shrink-0 sm:w-40">Gemini Service</dt>
          <dd class="flex items-center">
            <span v-if="settingsData.isGeminiKeySet" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              API Key Loaded
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              API Key Missing
            </span>
          </dd>
        </div>

        <!-- Test Result -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="testStatus !== 'idle'" class="px-5 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <dt class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest shrink-0 sm:w-40">Last Result</dt>
            <dd class="flex-1">
              <div v-if="testStatus === 'success'" class="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 text-xs font-bold transition-colors duration-200">
                <svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Connection successful
              </div>
              <div v-else-if="testStatus === 'error'" class="flex flex-col gap-1 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/20 transition-colors duration-200">
                <div class="flex items-center gap-2 text-xs font-bold">
                  <svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  Connection failed
                </div>
                <p class="text-[11px] text-rose-500 dark:text-rose-300 font-medium pl-6">{{ errorMessage }}</p>
              </div>
            </dd>
          </div>
        </Transition>
      </div>
    </div>

    <!-- About the System -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-xl transition-colors duration-200">
      <!-- Header -->
      <div class="px-5 py-4 sm:px-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 bg-gray-50/70 dark:bg-transparent transition-colors duration-200">
        <div class="bg-blue-50 dark:bg-blue-500/20 p-2 rounded-xl text-blue-600 dark:text-blue-400 shrink-0 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div>
          <h2 class="text-sm font-black uppercase tracking-wide text-gray-900 dark:text-white">About the System</h2>
          <p class="text-[10px] text-gray-400 dark:text-slate-500 font-medium uppercase tracking-widest">Internal Content Management Tool</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex border-b border-gray-100 dark:border-white/5 px-5 sm:px-6 overflow-x-auto scrollbar-none transition-colors duration-200">
        <button
          v-for="tab in aboutTabs"
          :key="tab.key"
          @click="activeAboutTab = tab.key"
          class="shrink-0 px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors duration-150"
          :class="activeAboutTab === tab.key
            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Panels -->
      <div class="px-5 py-6 sm:px-6">

        <!-- Standard Sync Flow -->
        <div v-show="activeAboutTab === 'standard'" class="space-y-5">
          <div>
            <h4 class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Core Purpose</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Streamlines multi-language localization for Strapi, bridging raw CMS data and high-quality AI translations in a safe environment for bulk updates.
            </p>
          </div>
          <div>
            <h4 class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Standard Sync Flow</h4>
            <p class="text-xs text-gray-500 dark:text-slate-400 mb-4">For general content (Categories, FAQs) using strict <strong class="text-gray-900 dark:text-gray-200">Fetch-Check-Update/Create</strong> logic via inline editors.</p>
            <ul class="space-y-3">
              <li v-for="(step, i) in [
                { label: 'Generate Source', desc: 'Pull unpublished content.' },
                { label: 'Review Keys', desc: 'Read-only source preview.' },
                { label: 'AI Translations', desc: 'Parallel locale generation.' },
                { label: 'Preview & Download', desc: 'Two-panel editor review.' },
                { label: 'Upload Manual', desc: 'Multi-file drag-and-drop.' },
                { label: 'Sync to Strapi', desc: 'Bulk or individual sync.' },
              ]" :key="i" class="flex items-start gap-3 text-xs text-gray-500 dark:text-slate-400">
                <span class="text-blue-500 dark:text-blue-400 font-black shrink-0 w-6">{{ String(i + 1).padStart(2, '0') }}.</span>
                <span><strong class="text-gray-900 dark:text-slate-200">{{ step.label }}:</strong> {{ step.desc }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Iglooworks Flow -->
        <div v-show="activeAboutTab === 'iglooworks'" class="space-y-5">
          <div>
            <h4 class="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Dedicated Workspace</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              A dedicated workspace (<code class="text-[11px] bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-gray-700 dark:text-gray-300">/translate/[id]</code>) for complex Parent-Child structures like IGW Changelogs.
            </p>
          </div>
          <ul class="space-y-3">
            <li v-for="(step, i) in [
              { label: 'Review Source', desc: 'Verify English (EN) base.' },
              { label: 'Locale Selection', desc: 'Choose target languages.' },
              { label: 'AI Translate', desc: 'Generate localized versions.' },
              { label: 'Review & Sync', desc: 'Final edit before publishing.' },
            ]" :key="i" class="flex items-start gap-3 text-xs text-gray-500 dark:text-slate-400">
              <span class="text-emerald-500 dark:text-emerald-400 font-black shrink-0 w-6">{{ String(i + 1).padStart(2, '0') }}.</span>
              <span><strong class="text-gray-900 dark:text-slate-200">{{ step.label }}:</strong> {{ step.desc }}</span>
            </li>
          </ul>
          <div class="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4 flex items-start gap-3 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500 dark:text-rose-400 shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p class="text-[11px] text-rose-700 dark:text-rose-300/90 font-medium leading-relaxed">
              <strong class="text-rose-800 dark:text-rose-200">Deletion of child entities</strong> is strictly restricted to English (EN) mode to maintain structural integrity.
            </p>
          </div>
        </div>

        <!-- Technical Standards -->
        <div v-show="activeAboutTab === 'technical'" class="space-y-5">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="item in [
              { label: 'Frontend', value: 'Nuxt 4 / Vue 3' },
              { label: 'Styling', value: 'Tailwind CSS v4' },
              { label: 'State', value: 'Pinia (Isolated)' },
              { label: 'API', value: 'GraphQL' },
            ]" :key="item.label" class="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10 transition-colors duration-200">
              <p class="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider mb-1">{{ item.label }}</p>
              <p class="text-xs font-bold text-gray-900 dark:text-gray-200">{{ item.value }}</p>
            </div>
          </div>
          <div class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <p class="text-[11px] text-amber-700 dark:text-amber-200/80 font-medium leading-relaxed">
              Changes in this session are kept in local memory. Sync or Export your data before refreshing the page.
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
