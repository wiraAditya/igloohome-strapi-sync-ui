<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { FaqListEntry } from "~/types/translations";
import { useStrapi } from "~/composables/useStrapi";
import { useUiStore } from "~/stores/ui";

const props = defineProps<{
  faqId: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const strapi = useStrapi();
const ui = useUiStore();

const isLoading = ref(true);
const detail = ref<FaqListEntry | null>(null);
const activeLocale = ref("en");

onMounted(async () => {
  try {
    detail.value = await strapi.getFaqDetail(props.faqId);
  } catch (e: any) {
    ui.addToast(`Failed to load FAQ details: ${e.message}`, "error");
  } finally {
    isLoading.value = false;
  }
});

const localeContent = (locale: string) => {
  if (locale === "en") {
    return { title: detail.value?.title, content: detail.value?.content, publishedAt: detail.value?.publishedAt };
  }
  const loc = detail.value?.localizations?.find((l) => l.locale === locale);
  return { title: loc?.title, content: loc?.content, publishedAt: loc?.publishedAt };
};

const active = () => localeContent(activeLocale.value);
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div
      class="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
    >
      <div
        class="shrink-0 px-8 py-6 border-b border-gray-50 dark:border-slate-900 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10"
      >
        <div class="space-y-1">
          <h2 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            FAQ Details
          </h2>
          <p class="text-xs font-medium text-gray-500 dark:text-slate-400">
            View saved content across every translated language.
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-8 space-y-6">
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>

        <template v-else-if="detail">
          <!-- Locale Switcher -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              v-for="locale in detail.locales"
              :key="locale"
              @click="activeLocale = locale"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border',
                activeLocale === locale
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 scale-105'
                  : 'bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700',
              ]"
            >
              {{ locale }}
            </button>
          </div>

          <div class="p-6 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-2xl space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
                Category
              </span>
              <span class="text-xs font-bold text-gray-700 dark:text-slate-300">
                {{ detail.categoryName || "—" }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
                Status
              </span>
              <span
                class="px-2 py-1 text-[9px] font-black rounded uppercase tracking-tighter"
                :class="active().publishedAt ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'"
              >
                {{ active().publishedAt ? "Live" : "Draft" }}
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
              Title
            </label>
            <div class="px-4 py-3 bg-gray-50/30 dark:bg-slate-900/10 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300">
              {{ active().title || "—" }}
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
              Content
            </label>
            <div class="prose prose-sm dark:prose-invert max-w-none bg-gray-50/30 dark:bg-slate-900/10 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 min-h-30 whitespace-pre-wrap text-sm text-gray-600 dark:text-slate-300">
              {{ active().content || "—" }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
