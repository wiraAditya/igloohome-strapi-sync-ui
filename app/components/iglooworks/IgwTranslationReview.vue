<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { IgwChangelogDtlEntry, LocaleCode } from "~/types/translations";
import { SUPPORTED_LOCALES } from "~/types/translations";

interface Props {
  sourceEntries: IgwChangelogDtlEntry[];
  selectedLocales: LocaleCode[];
}

const props = defineProps<Props>();

// Record of locale to array of translated changes
const translations = defineModel<Record<string, string[]>>("translations", {
  required: true,
  default: () => ({}),
});

const activeLocale = ref<LocaleCode>(props.selectedLocales[0] || "da");

// Update active locale if the current one is removed from selection
watch(
  () => props.selectedLocales,
  (newLocales) => {
    if (newLocales.length > 0 && !newLocales.includes(activeLocale.value)) {
      activeLocale.value = newLocales[0] ?? "id";
    }
  },
  { deep: true },
);

const activeLocaleName = computed(
  () =>
    SUPPORTED_LOCALES.find((l) => l.code === activeLocale.value)?.name ||
    activeLocale.value,
);

/**
 * Updates a specific translation entry for the active locale.
 * Ensures the locale array exists before assignment to prevent runtime errors and
 * provides TypeScript narrowing via a local reference.
 *
 * @param index - The index of the source entry being translated
 * @param value - The new translated string value
 */
const updateTranslation = (index: number, value: string): void => {
  const currentTranslations = translations.value;
  const locale = activeLocale.value;

  // Tiger-Style Defensive Check: Ensure model and locale are valid
  if (!currentTranslations || !locale) {
    return;
  }

  // Ensure the locale entry exists in the record
  if (!currentTranslations[locale]) {
    currentTranslations[locale] = [];
  }

  // Stable reference for TypeScript narrowing and reactivity safety
  const localeArray = currentTranslations[locale];
  if (Array.isArray(localeArray)) {
    localeArray[index] = value;
  }
};

// Navigation for locales
const setLocale = (locale: LocaleCode) => {
  activeLocale.value = locale;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Locale Switcher -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        v-for="locale in selectedLocales"
        :key="locale"
        @click="setLocale(locale)"
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

    <!-- Review Panels -->
    <div class="space-y-8">
      <div
        v-for="(source, index) in sourceEntries"
        :key="source.id"
        class="group relative bg-white dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden transition-all hover:border-indigo-100 dark:hover:border-indigo-900/30 shadow-sm"
      >
        <!-- Header -->
        <div
          class="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between"
        >
          <h3
            class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight"
          >
            Detail #{{ index + 1 }}:
            <span class="text-indigo-600 dark:text-indigo-400 ml-1">{{
              source.title
            }}</span>
          </h3>
          <div class="flex items-center gap-2">
            <span
              class="px-2 py-1 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-md uppercase"
            >
              {{ activeLocaleName }}
            </span>
          </div>
        </div>

        <!-- Content Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-800"
        >
          <!-- English Source -->
          <div class="p-6 space-y-3">
            <div class="flex items-center justify-between">
              <label
                class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest"
                >English Source</label
              >
            </div>
            <div
              class="prose prose-sm dark:prose-invert max-w-none bg-gray-50/30 dark:bg-slate-900/10 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 min-h-30 whitespace-pre-wrap text-sm text-gray-600 dark:text-slate-300"
            >
              {{ source.content }}
            </div>
          </div>

          <!-- AI Translation / Editor -->
          <div class="p-6 space-y-3 bg-indigo-50/5 dark:bg-indigo-500/5">
            <div class="flex items-center justify-between">
              <label
                class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"
              >
                {{ activeLocaleName }} Translation
              </label>
            </div>
            <textarea
              :value="translations?.[activeLocale]?.[index] ?? ''"
              @input="
                (e: Event) =>
                  updateTranslation(
                    index,
                    (e.target as HTMLTextAreaElement).value,
                  )
              "
              class="w-full min-h-40 p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-y shadow-inner scrollbar-thin"
              placeholder="Waiting for AI translation..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
