<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useIgwChangelogsStore } from "~/stores/igwChangelogs";
import { useStrapi } from "~/composables/useStrapi";
import { useUiStore } from "~/stores/ui";
import { useGemini } from "~/composables/useGemini";
import IgwTranslationReview from "~/components/iglooworks/IgwTranslationReview.vue";
import type {
  IgwChangelogEntry,
  IgwChangelogDtlEntry,
  LocaleCode,
} from "~/types/translations";

const route = useRoute();
const router = useRouter();
const changelogId = route.params.id as string;
const store = useIgwChangelogsStore();
const strapi = useStrapi();
const ui = useUiStore();
const gemini = useGemini();

const isLoading = ref(true);
const isTranslating = ref(false);
const isSyncing = ref(false);

// Workflow state
const currentStep = ref(1);
const enDetails = ref<IgwChangelogDtlEntry[]>([]);
const availableLocales = ref<{ code: string; name: string }[]>([]);

const selectedLocales = computed({
  get: () => store.activeSelectedLocales,
  set: (val) => (store.activeSelectedLocales = val),
});

const translations = computed({
  get: () => store.activeTranslations,
  set: (val) => (store.activeTranslations = val),
});

// Computed for the current entry (find from store)
const entry = computed<IgwChangelogEntry | undefined>(() =>
  store.parentEntries.find((p) => p.id === changelogId),
);

const fetchInitialData = async () => {
  isLoading.value = true;
  try {
    // 1. Fetch Parent Entry if missing
    if (!entry.value) {
      const { parents, dtls } = await strapi.getIgwChangelogs();
      store.setSource(dtls, parents);
    }

    if (!entry.value) {
      ui.addToast("Changelog version not found", "error");
      router.push("/iglooworks/changelogs");
      return;
    }

    // 2. Fetch English Details for this parent
    const query = `
      query IgwChangelogEnDetails($parentId: ID) {
        igwChangelog(id: $parentId) {
          data {
            id
            attributes {
              igw_changelog_dtls(filters: { locale: { eq: "en" } }, pagination: { pageSize: 1000 }) {
                data {
                  id
                  attributes {
                    Title
                    Changes
                  }
                }
              }
            }
          }
        }
      }
    `;
    const data = await strapi.graphqlFetch<any>(query, {
      parentId: changelogId,
    });
    const dtls =
      data.igwChangelog?.data?.attributes?.igw_changelog_dtls?.data || [];

    enDetails.value = dtls.map((d: any) => ({
      id: d.id,
      title: d.attributes.Title,
      content: d.attributes.Changes,
      parentId: changelogId,
    }));

    // 3. Fetch Available Locales from Strapi
    const locales = await strapi.getLocales();
    availableLocales.value = locales.filter((l) => l.code !== "en");
  } catch (e: any) {
    ui.addToast(`Failed to fetch data: ${e.message}`, "error");
  } finally {
    isLoading.value = false;
  }
};

const handleTranslate = async () => {
  if (selectedLocales.value.length === 0) {
    ui.addToast("Please select at least one target locale", "warning");
    return;
  }

  isTranslating.value = true;
  try {
    // Interleave title and content so both get translated: [title0, content0, title1, content1, ...]
    const stringsToTranslate = enDetails.value.flatMap((d) => [d.title, d.content]);

    // Perform AI Translation
    const results = await gemini.translateAllLocales(
      stringsToTranslate,
      selectedLocales.value,
      "igw-changelogs",
      (locale, status) => {
        if (status === "done") {
          ui.addToast(
            `AI Translation for ${locale.toUpperCase()} finished`,
            "info",
          );
        }
      },
    );

    // Merge new results with existing translations (if any)
    translations.value = { ...translations.value, ...results };
    ui.addToast(
      "AI Translation completed. Please review before syncing.",
      "success",
    );
    currentStep.value = 4; // Move to review step
  } catch (e: any) {
    ui.addToast(`Translation failed: ${e.message}`, "error");
  } finally {
    isTranslating.value = false;
  }
};

const handleSync = async () => {
  const localesToSync = Object.keys(translations.value) as LocaleCode[];
  if (localesToSync.length === 0) {
    ui.addToast("No translations to sync", "warning");
    return;
  }

  ui.confirm({
    title: "Confirm Sync",
    message: `Sync ${localesToSync.length} locales to Strapi? Existing localizations will be updated`,
    confirmText: "Sync Now",
    onConfirm: async () => {
      isSyncing.value = true;
      try {
        for (const locale of localesToSync) {
          const translatedContents = translations.value[locale] ?? [];

          for (let i = 0; i < enDetails.value.length; i++) {
            const enDtl = enDetails.value[i];
            // Translations are interleaved: even index = title, odd index = content
            const translatedTitle = translatedContents[i * 2] ?? enDtl?.title ?? "";
            const translatedContent = translatedContents[i * 2 + 1] ?? "";

            // 1. Check if localization already exists
            const checkQuery = `
              query CheckLoc($id: ID) {
                igwChangelogDtl(id: $id) {
                  data {
                    attributes {
                      localizations(pagination: { pageSize: 1000 }) {
                        data {
                          id
                          attributes { locale }
                        }
                      }
                    }
                  }
                }
              }
            `;
            const checkRes = await strapi.graphqlFetch<any>(checkQuery, {
              id: enDtl?.id ?? "",
            });
            const localizations =
              checkRes.igwChangelogDtl?.data?.attributes?.localizations?.data ||
              [];
            const existingLoc = localizations.find(
              (l: any) => l.attributes.locale === locale,
            );

            const payload = {
              Title: translatedTitle,
              Changes: translatedContent,
              igw_changelog: changelogId,
              publishedAt: new Date().toISOString(),
            };

            if (existingLoc) {
              await strapi.updateIgwChangelogDtl(existingLoc.id, payload, locale);
            } else {
              await strapi.submitIgwChangelogDtl(
                enDtl?.id ?? "",
                locale,
                payload,
              );
            }
          }
          ui.addToast(
            `Successfully synced ${locale.toUpperCase()} to Strapi`,
            "success",
          );
        }
        ui.addToast("All translations synced and published", "success");
        store.resetActiveSession();
        router.push("/iglooworks/changelogs");
      } catch (e: any) {
        ui.addToast(`Sync failed: ${e.message}`, "error");
      } finally {
        isSyncing.value = false;
      }
    },
  });
};

const toggleLocale = (code: LocaleCode) => {
  const newLocales = [...selectedLocales.value];
  const idx = newLocales.indexOf(code);
  if (idx === -1) newLocales.push(code);
  else newLocales.splice(idx, 1);
  selectedLocales.value = newLocales;
};

const nextStep = () => {
  if (currentStep.value === 2 && selectedLocales.value.length === 0) {
    ui.addToast("Select at least one locale", "warning");
    return;
  }
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};

onMounted(() => {
  fetchInitialData();
  // If we already have translations in the store, jump to the review step
  if (Object.keys(store.activeTranslations).length > 0) {
    currentStep.value = 4;
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-12 pb-20">
    <!-- Header -->
    <header
      class="flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div class="flex items-center gap-6">
        <NuxtLink
          to="/iglooworks/changelogs"
          class="group p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-100 dark:hover:border-slate-700 transition-all active:scale-95 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="group-hover:-translate-x-1 transition-transform"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </NuxtLink>

        <div class="space-y-1">
          <div v-if="isLoading" class="flex flex-col gap-2">
            <div
              class="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"
            ></div>
            <div
              class="h-4 w-32 bg-gray-100 dark:bg-slate-900 rounded animate-pulse"
            ></div>
          </div>
          <template v-else-if="entry">
            <h1
              class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
            >
              Translate v{{ entry.version }}
            </h1>
            <p class="text-sm font-medium text-gray-500 dark:text-slate-400">
              Released on
              <span
                class="text-gray-900 dark:text-slate-200 font-bold uppercase"
                >{{ entry.releaseDate }}</span
              >
            </p>
          </template>
        </div>
      </div>

      <div v-if="entry" class="flex items-center gap-3">
        <span
          v-if="entry.publishedAt"
          class="px-3 py-1.5 text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg uppercase tracking-widest shadow-sm shadow-emerald-500/5"
        >
          Live
        </span>
        <span
          v-else
          class="px-3 py-1.5 text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg uppercase tracking-widest shadow-sm shadow-amber-500/5"
        >
          Draft
        </span>
      </div>
    </header>

    <!-- Workspace -->
    <main v-if="!isLoading && entry" class="space-y-12">
      <!-- Step Indicator -->
      <nav class="flex items-center justify-between max-w-2xl mx-auto px-4">
        <div v-for="step in 4" :key="step" class="flex items-center">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500"
            :class="[
              currentStep === step
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110'
                : currentStep > step
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600',
            ]"
          >
            <svg
              v-if="currentStep > step"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span v-else>{{ step }}</span>
          </div>
          <div
            v-if="step < 4"
            class="w-12 h-1 mx-2 rounded-full transition-colors duration-500"
            :class="
              currentStep > step
                ? 'bg-emerald-500'
                : 'bg-gray-100 dark:bg-slate-800'
            "
          ></div>
        </div>
      </nav>

      <!-- Step 1: Review Source Content -->
      <section
        v-if="currentStep === 1"
        class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2
              class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
            >
              Review Source Content
            </h2>
            <p class="text-sm font-medium text-gray-500 dark:text-slate-400">
              Verify the English details for this version before proceeding.
            </p>
          </div>
          <button
            @click="nextStep"
            class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Looks Good
          </button>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div
            v-for="dtl in enDetails"
            :key="dtl.id"
            class="p-8 bg-white dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg"
                >{{ dtl.title }}</span
              >
              <span
                class="px-2 py-1 text-[10px] font-bold bg-gray-50 dark:bg-slate-900 text-gray-400 rounded-md"
                >EN</span
              >
            </div>
            <div
              class="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-slate-300 bg-gray-50/30 dark:bg-slate-900/10 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 min-h-25 whitespace-pre-wrap"
            >
              {{ dtl.content }}
            </div>
          </div>
        </div>
      </section>

      <!-- Step 2: Select Target Locales -->
      <section
        v-if="currentStep === 2"
        class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2
              class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
            >
              Select Target Locales
            </h2>
            <p class="text-sm font-medium text-gray-500 dark:text-slate-400">
              Choose the languages you want to translate into.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="prevStep"
              class="px-6 py-3 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all"
            >
              Back
            </button>
            <button
              @click="nextStep"
              class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              Next Step
            </button>
          </div>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <button
            v-for="l in availableLocales"
            :key="l.code"
            @click="toggleLocale(l.code as LocaleCode)"
            class="w-full flex items-center justify-between px-5 py-4 border-2 rounded-2xl text-xs font-bold transition-all duration-300"
            :class="[
              selectedLocales.includes(l.code as LocaleCode)
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md shadow-indigo-100 dark:shadow-indigo-950/50'
                : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-gray-50 dark:hover:bg-slate-900',
            ]"
          >
            <span class="truncate pr-2 uppercase tracking-tight">{{
              l.name
            }}</span>
            <span class="font-black opacity-30 text-[10px] tracking-tighter">{{
              l.code.toUpperCase()
            }}</span>
          </button>
        </div>
      </section>

      <!-- Step 3: Translate -->
      <section
        v-if="currentStep === 3"
        class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2
              class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
            >
              AI Translation
            </h2>
            <p class="text-sm font-medium text-gray-500 dark:text-slate-400">
              Generate translations using Gemini AI.
            </p>
          </div>
          <button
            @click="prevStep"
            :disabled="isTranslating"
            class="px-6 py-3 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Back
          </button>
        </div>

        <div
          class="bg-white dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center gap-8 text-center shadow-sm"
        >
          <div
            class="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
              />
            </svg>
          </div>
          <div class="space-y-2">
            <h3
              class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
            >
              Ready to generate?
            </h3>
            <p
              class="text-sm font-medium text-gray-500 dark:text-slate-400 max-w-md mx-auto"
            >
              We will translate your changelog into
              <span class="text-indigo-600 font-bold"
                >{{ selectedLocales.length }} languages</span
              >. This may take a few moments.
            </p>
          </div>

          <button
            @click="handleTranslate"
            :disabled="isTranslating || selectedLocales.length === 0"
            class="group relative inline-flex items-center gap-4 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <svg
              v-if="isTranslating"
              class="animate-spin h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
              />
            </svg>
            <span class="text-base font-black uppercase tracking-widest">
              {{
                isTranslating ? "AI is processing..." : "Start AI Translation"
              }}
            </span>
          </button>

          <button
            v-if="Object.keys(translations).length > 0"
            @click="currentStep = 4"
            class="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
          >
            View Existing Translations
          </button>
        </div>
      </section>

      <!-- Step 4: Review & Sync -->
      <section
        v-if="currentStep === 4"
        class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2
              class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
            >
              Review & Sync
            </h2>
            <p class="text-sm font-medium text-gray-500 dark:text-slate-400">
              Refine the translations and push to Strapi.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="currentStep = 2"
              :disabled="isSyncing"
              class="px-6 py-3 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add Locales
            </button>
            <button
              @click="handleSync"
              :disabled="isSyncing"
              class="inline-flex items-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 font-black uppercase text-xs tracking-widest"
            >
              <svg
                v-if="isSyncing"
                class="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isSyncing ? "Syncing..." : "Sync & Publish" }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-8">
          <IgwTranslationReview
            v-model:translations="translations"
            :source-entries="enDetails"
            :selected-locales="Object.keys(translations) as LocaleCode[]"
          />
        </div>
      </section>
    </main>
  </div>
</template>
