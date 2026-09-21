<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from "vue";
import { marked } from "marked";
import type { FaqListEntry } from "~/types/translations";
import { useStrapi } from "~/composables/useStrapi";
import { useGemini } from "~/composables/useGemini";
import { useUiStore } from "~/stores/ui";

interface SavePayloadEn {
  mode: "en";
  title: string;
  content: string;
  categoryId: string;
  autoRegenerate: boolean;
  publishNow?: boolean;
  translations?: Record<string, { title: string; content: string }>;
}

interface SavePayloadLocale {
  mode: "locale";
  locale: string;
  title: string;
  content: string;
}

const props = withDefaults(
  defineProps<{
    initialData?: FaqListEntry;
    isEditing?: boolean;
    isSaving?: boolean;
    categories: { id: string; name: string }[];
  }>(),
  {
    isEditing: false,
    isSaving: false,
  },
);

const emit = defineEmits<{
  (e: "save", payload: SavePayloadEn | SavePayloadLocale): void;
  (e: "cancel"): void;
}>();

const strapi = useStrapi();
const gemini = useGemini();
const ui = useUiStore();

const step = ref<"form" | "preview">("form");
const selectedLocale = ref<string>("en");
const isFetchingLocale = ref(false);
const availableLocales = ref<{ code: string; name: string }[]>([]);

const form = reactive({
  title: "",
  content: "",
  categoryId: "",
});

const otherLocaleForm = reactive({
  title: "",
  content: "",
});

const autoRegenerate = ref(false);
const autoPublish = ref(true);
const keepTermsInput = ref("");
const selectedTargetLocales = ref<string[]>([]);

// Preview state
const isTranslating = ref(false);
const previewLocales = ref<string[]>([]);
const previewTranslations = reactive<Record<string, { title: string; content: string }>>({});
const activePreviewLocale = ref("");

const renderedEnglishContent = computed(() => marked.parse(form.content || "", { async: false }) as string);

const editableLocales = computed(() => {
  if (!props.isEditing || !props.initialData) return [];
  return props.initialData.locales.filter((l) => l !== "en");
});

const targetLocalesForRegenerate = computed(() => {
  if (props.isEditing) return availableLocales.value.map((l) => l.code);
  return selectedTargetLocales.value;
});

const localeName = (code: string) =>
  availableLocales.value.find((l) => l.code === code)?.name || code;

const loadOtherLocale = async (locale: string) => {
  if (!props.initialData) return;
  isFetchingLocale.value = true;
  try {
    let localizations = props.initialData.localizations;
    if (!localizations) {
      const detail = await strapi.getFaqDetail(props.initialData.id);
      localizations = detail?.localizations;
    }
    const match = localizations?.find((l) => l.locale === locale);
    otherLocaleForm.title = match?.title || "";
    otherLocaleForm.content = match?.content || "";
  } catch (e: any) {
    ui.addToast(`Failed to load ${locale.toUpperCase()} content: ${e.message}`, "error");
  } finally {
    isFetchingLocale.value = false;
  }
};

watch(selectedLocale, (locale) => {
  if (locale !== "en") {
    loadOtherLocale(locale);
  }
});

const toggleTargetLocale = (code: string) => {
  const idx = selectedTargetLocales.value.indexOf(code);
  if (idx === -1) selectedTargetLocales.value.push(code);
  else selectedTargetLocales.value.splice(idx, 1);
};

const allTargetLocalesSelected = computed(
  () =>
    availableLocales.value.length > 0 &&
    availableLocales.value.every((l) => selectedTargetLocales.value.includes(l.code)),
);

const toggleAllTargetLocales = () => {
  selectedTargetLocales.value = allTargetLocalesSelected.value
    ? []
    : availableLocales.value.map((l) => l.code);
};

onMounted(async () => {
  try {
    availableLocales.value = (await strapi.getLocales()).filter(
      (l) => l.code !== "en",
    );
  } catch (e: any) {
    ui.addToast(`Failed to load locales: ${e.message}`, "error");
  }

  if (props.initialData) {
    form.title = props.initialData.title;
    form.content = props.initialData.content;
    form.categoryId = props.initialData.category;
  }
});

const runTranslationPreview = async () => {
  const locales = targetLocalesForRegenerate.value;
  if (locales.length === 0) {
    ui.addToast("Select at least one target language", "warning");
    return;
  }

  previewLocales.value = locales;
  step.value = "preview";
  isTranslating.value = true;

  try {
    const keepTerms = keepTermsInput.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const results = await gemini.translateAllLocales(
      [form.title, form.content],
      locales,
      "faqs",
      keepTerms,
    );

    // Only keep locales that actually translated — never fall back to blank
    // strings, or a failed translation would silently overwrite existing
    // content in Strapi with empty Title/Content on save.
    const succeeded = locales.filter((locale) => results[locale]);
    const failed = locales.filter((locale) => !results[locale]);

    succeeded.forEach((locale) => {
      const pair = results[locale]!;
      previewTranslations[locale] = {
        title: pair[0] ?? "",
        content: pair[1] ?? "",
      };
    });
    previewLocales.value = succeeded;
    activePreviewLocale.value = succeeded[0] ?? "";

    if (failed.length > 0) {
      ui.addToast(
        `Translation failed for ${failed.map((l) => l.toUpperCase()).join(", ")} — left unchanged. Retry later or edit them individually.`,
        "warning",
      );
    }

    if (succeeded.length === 0) {
      ui.addToast("No languages translated successfully", "error");
      step.value = "form";
    }
  } catch (e: any) {
    ui.addToast(`Translation failed: ${e.message}`, "error");
    step.value = "form";
  } finally {
    isTranslating.value = false;
  }
};

const backToForm = () => {
  step.value = "form";
};

const emitEnSave = (translations?: Record<string, { title: string; content: string }>) => {
  emit("save", {
    mode: "en",
    title: form.title,
    content: form.content,
    categoryId: form.categoryId,
    autoRegenerate: autoRegenerate.value,
    publishNow: !props.isEditing ? autoPublish.value : undefined,
    translations,
  });
};

const confirmPreviewAndSave = () => {
  const translations: Record<string, { title: string; content: string }> = {};
  previewLocales.value.forEach((locale) => {
    if (previewTranslations[locale]) {
      translations[locale] = { ...previewTranslations[locale] };
    }
  });
  emitEnSave(translations);
};

const handleSubmit = () => {
  if (selectedLocale.value === "en") {
    if (!form.title.trim() || !form.content.trim()) {
      ui.addToast("Please fill in the title and content", "warning");
      return;
    }

    if (autoRegenerate.value) {
      runTranslationPreview();
      return;
    }

    emitEnSave();
  } else {
    if (!otherLocaleForm.title.trim() || !otherLocaleForm.content.trim()) {
      ui.addToast("Please fill in the title and content", "warning");
      return;
    }

    emit("save", {
      mode: "locale",
      locale: selectedLocale.value,
      title: otherLocaleForm.title,
      content: otherLocaleForm.content,
    });
  }
};
</script>

<template>
  <div class="space-y-8 relative">
    <template v-if="step === 'form'">
      <!-- Locale Selector -->
      <div class="space-y-2">
        <label
          class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
        >
          Edit Language
        </label>
        <select
          v-model="selectedLocale"
          :disabled="!isEditing"
          class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <option value="en">English (Base)</option>
          <option v-for="code in editableLocales" :key="code" :value="code">
            {{ localeName(code) }} ({{ code.toUpperCase() }})
          </option>
        </select>
        <p
          v-if="!isEditing"
          class="text-[9px] font-bold text-amber-500 uppercase tracking-tight"
        >
          New FAQs must start with English
        </p>
      </div>

      <!-- English fields -->
      <div v-if="selectedLocale === 'en'" class="space-y-6">
        <div class="space-y-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
          >
            Category
          </label>
          <select
            v-model="form.categoryId"
            class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer shadow-sm"
          >
            <option value="">No category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
          >
            Title (Question)
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="e.g. How do I reset my lock?"
            class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700 shadow-sm"
            required
          />
        </div>

        <div class="space-y-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
          >
            Content (Answer)
          </label>
          <SharedMarkdownEditor
            v-model="form.content"
            :rows="5"
            placeholder="Answer the question here..."
          />
        </div>

        <!-- Publish-on-create toggle -->
        <label
          v-if="!isEditing"
          class="flex items-start gap-3 cursor-pointer p-6 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-2xl"
        >
          <input
            v-model="autoPublish"
            type="checkbox"
            class="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span class="space-y-1">
            <span
              class="block text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white"
            >
              Publish immediately
            </span>
            <span class="block text-xs font-medium text-gray-500 dark:text-slate-400">
              If off, English (and any auto-generated languages below) are created as drafts instead of going live.
            </span>
          </span>
        </label>

        <!-- Auto-regenerate toggle -->
        <div
          class="p-6 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-2xl space-y-4"
        >
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="autoRegenerate"
              type="checkbox"
              class="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="space-y-1">
              <span
                class="block text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white"
              >
                {{
                  isEditing
                    ? "Auto-regenerate all languages on save"
                    : "Auto-push to selected languages on create"
                }}
              </span>
              <span class="block text-xs font-medium text-gray-500 dark:text-slate-400">
                {{
                  isEditing
                    ? "Re-translates this FAQ into every supported language. You'll review the translations before anything is saved."
                    : "Pick languages below to translate alongside the English version. You'll review the translations before anything is created."
                }}
              </span>
            </span>
          </label>

          <div v-if="autoRegenerate" class="space-y-4 pt-2">
            <div class="space-y-2">
              <label
                class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
              >
                Do Not Translate
              </label>
              <input
                v-model="keepTermsInput"
                type="text"
                placeholder="keypad backlight, auto-relock"
                class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div v-if="!isEditing" class="space-y-2">
              <div class="flex items-center justify-between">
                <label
                  class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
                >
                  Target Languages
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="allTargetLocalesSelected"
                    @change="toggleAllTargetLocales"
                    class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400">
                    Select All
                  </span>
                </label>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="l in availableLocales"
                  :key="l.code"
                  type="button"
                  @click="toggleTargetLocale(l.code)"
                  class="px-3 py-2 border-2 rounded-xl text-xs font-bold transition-all text-left"
                  :class="[
                    selectedTargetLocales.includes(l.code)
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-500 dark:text-slate-400 hover:border-indigo-200',
                  ]"
                >
                  {{ l.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other locale fields -->
      <div v-else class="space-y-6">
        <div v-if="isFetchingLocale" class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span class="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></span>
          Loading {{ localeName(selectedLocale) }} content...
        </div>
        <template v-else>
          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400"
            >
              {{ localeName(selectedLocale) }} Title
            </label>
            <input
              v-model="otherLocaleForm.title"
              type="text"
              class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400"
            >
              {{ localeName(selectedLocale) }} Content
            </label>
            <SharedMarkdownEditor v-model="otherLocaleForm.content" :rows="5" />
          </div>
          <p class="text-[9px] font-bold text-amber-500 uppercase tracking-tight">
            Category is inherited from English and can't be changed per language
          </p>
        </template>
      </div>

      <!-- Actions -->
      <div
        class="sticky bottom-0 z-20 flex items-center justify-end gap-3 py-6 mt-6 -mx-8 px-8 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-900"
      >
        <button
          type="button"
          @click="emit('cancel')"
          :disabled="isSaving"
          class="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSaving || isFetchingLocale"
          class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
        >
          <span
            v-if="isSaving"
            class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"
          ></span>
          <span v-if="isSaving">Saving...</span>
          <span v-else-if="selectedLocale === 'en' && autoRegenerate">
            Preview Translations
          </span>
          <span v-else-if="selectedLocale === 'en'">
            {{ isEditing ? "Update English" : "Create FAQ" }}
          </span>
          <span v-else>Update {{ selectedLocale.toUpperCase() }}</span>
        </button>
      </div>
    </template>

    <!-- Translation preview step -->
    <template v-else>
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h3 class="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
            Review Translations
          </h3>
          <p class="text-xs font-medium text-gray-500 dark:text-slate-400">
            Nothing is saved yet — review and edit before confirming.
          </p>
        </div>
      </div>

      <div v-if="isTranslating" class="flex flex-col items-center gap-4 py-16">
        <div class="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
        <p class="text-xs font-black text-gray-400 uppercase tracking-widest">
          Translating into {{ previewLocales.length }} language(s)...
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Locale tab switcher -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            v-for="locale in previewLocales"
            :key="locale"
            @click="activePreviewLocale = locale"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border',
              activePreviewLocale === locale
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 scale-105'
                : 'bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700',
            ]"
          >
            {{ locale }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
              English (Source)
            </span>
            <div class="px-4 py-3 bg-gray-50/30 dark:bg-slate-900/10 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300">
              {{ form.title }}
            </div>
            <div
              class="markdown-body bg-gray-50/30 dark:bg-slate-900/10 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 min-h-30 text-gray-600 dark:text-slate-300"
              v-html="renderedEnglishContent"
            ></div>
          </div>

          <div class="space-y-4" v-if="previewTranslations[activePreviewLocale]">
            <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {{ localeName(activePreviewLocale) }}
            </span>
            <input
              v-model="previewTranslations[activePreviewLocale]!.title"
              type="text"
              class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none shadow-inner"
            />
            <SharedMarkdownEditor
              v-model="previewTranslations[activePreviewLocale]!.content"
              :rows="6"
            />
          </div>
        </div>
      </div>

      <!-- Preview actions -->
      <div
        class="sticky bottom-0 z-20 flex items-center justify-end gap-3 py-6 mt-6 -mx-8 px-8 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-900"
      >
        <button
          type="button"
          @click="backToForm"
          :disabled="isSaving"
          class="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back to Edit
        </button>
        <button
          type="button"
          @click="confirmPreviewAndSave"
          :disabled="isSaving || isTranslating"
          class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
        >
          <span
            v-if="isSaving"
            class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"
          ></span>
          <span v-if="isSaving">Saving...</span>
          <span v-else>Confirm & Save</span>
        </button>
      </div>
    </template>
  </div>
</template>
