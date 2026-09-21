<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStrapi } from "~/composables/useStrapi";
import { useDownload } from "~/composables/useDownload";
import { useUiStore } from "~/stores/ui";
import type { FaqListEntry } from "~/types/translations";
import FaqForm from "~/components/faqs/FaqForm.vue";
import FaqInfoModal from "~/components/faqs/FaqInfoModal.vue";

const strapi = useStrapi();
const { downloadJson } = useDownload();
const ui = useUiStore();

const entries = ref<FaqListEntry[]>([]);
const categories = ref<{ id: string; name: string }[]>([]);
const searchQuery = ref("");
const isFetching = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const showModal = ref(false);
const showInfoModal = ref(false);
const editingEntry = ref<FaqListEntry | undefined>(undefined);
const infoEntryId = ref<string>("");

type SortField = "title" | "category" | "published" | "enOnly";
const sortField = ref<SortField>("title");
const sortDirection = ref<"asc" | "desc">("asc");

const toggleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const sortValue = (entry: FaqListEntry): string | number => {
  switch (sortField.value) {
    case "title":
      return entry.title.toLowerCase();
    case "category":
      return (entry.categoryName || "").toLowerCase();
    case "published":
      return entry.publishedAt ? 1 : 0;
    case "enOnly":
      return entry.locales.length <= 1 ? 1 : 0;
  }
};

const filteredEntries = computed(() => {
  let result = entries.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        (e.categoryName || "").toLowerCase().includes(query),
    );
  }

  const dir = sortDirection.value === "asc" ? 1 : -1;
  return [...result].sort((a, b) => {
    const av = sortValue(a);
    const bv = sortValue(b);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
});

const fetchAllData = async () => {
  isFetching.value = true;
  try {
    const [faqs, cats] = await Promise.all([
      strapi.getFaqs(),
      strapi.getCategories(),
    ]);
    entries.value = faqs;
    categories.value = cats;
  } catch (e: any) {
    ui.addToast(`Failed to fetch FAQs: ${e.message}`, "error");
  } finally {
    isFetching.value = false;
  }
};

onMounted(() => {
  fetchAllData();
});

const handleCreate = () => {
  editingEntry.value = undefined;
  showModal.value = true;
};

const handleEdit = (entry: FaqListEntry) => {
  editingEntry.value = entry;
  showModal.value = true;
};

const handleInfo = (entry: FaqListEntry) => {
  infoEntryId.value = entry.id;
  showInfoModal.value = true;
};

type SavePayload =
  | {
      mode: "en";
      title: string;
      content: string;
      categoryId: string;
      autoRegenerate: boolean;
      publishNow?: boolean;
      translations?: Record<string, { title: string; content: string }>;
    }
  | { mode: "locale"; locale: string; title: string; content: string };

const handleSave = async (payload: SavePayload) => {
  isSaving.value = true;
  try {
    if (payload.mode === "locale") {
      if (!editingEntry.value) return;
      // Translations always mirror the English entry's current publish state.
      const result = await strapi.pushFaqTranslations(
        editingEntry.value.id,
        editingEntry.value.category,
        { [payload.locale]: { title: payload.title, content: payload.content } },
        editingEntry.value.publishedAt ?? null,
      );
      if (result.failed > 0) {
        ui.addToast(`Failed to update ${payload.locale.toUpperCase()}: ${result.errors[0]}`, "error");
      } else {
        ui.addToast(`${payload.locale.toUpperCase()} updated`, "success");
      }
    } else {
      let entryId = editingEntry.value?.id;
      // Translations mirror whatever the English entry's publish state ends up being:
      // on edit that's whatever it already was (editing content doesn't change publish state),
      // on create it's whatever the "Publish immediately" toggle picked.
      let publishedAt: string | null;

      if (editingEntry.value) {
        await strapi.updateFaq(editingEntry.value.id, {
          Title: payload.title,
          Content: payload.content,
          Category: payload.categoryId || null,
        });
        publishedAt = editingEntry.value.publishedAt ?? null;
      } else {
        publishedAt = payload.publishNow ? new Date().toISOString() : null;
        const result = await strapi.createFaq({
          Title: payload.title,
          Content: payload.content,
          Category: payload.categoryId || null,
          publishedAt,
        });
        entryId = result.createIgloohomeFaq.data.id.toString();
      }

      if (payload.autoRegenerate && payload.translations && entryId) {
        const locales = Object.keys(payload.translations);

        if (locales.length > 0) {
          const res = await strapi.pushFaqTranslations(
            entryId,
            payload.categoryId,
            payload.translations,
            publishedAt,
          );

          ui.addToast(
            `Translations synced: ${res.synced} language(s)${res.failed > 0 ? `, ${res.failed} failed` : ""}`,
            res.failed > 0 ? "warning" : "success",
          );
        }
      }

      ui.addToast(editingEntry.value ? "FAQ updated" : "FAQ created", "success");
    }

    showModal.value = false;
    await fetchAllData();
  } catch (e: any) {
    ui.addToast(`Save failed: ${e.message}`, "error");
  } finally {
    isSaving.value = false;
  }
};

const handleDelete = (entry: FaqListEntry) => {
  ui.confirm({
    title: "Delete FAQ",
    message:
      "This will delete the FAQ and ALL its translations across every language. This cannot be undone.",
    confirmText: "Delete",
    type: "danger",
    onConfirm: async () => {
      isDeleting.value = true;
      try {
        await strapi.deleteFaq(entry.id);
        ui.addToast("FAQ deleted successfully", "success");
        await fetchAllData();
      } catch (e: any) {
        ui.addToast(`Delete failed: ${e.message}`, "error");
      } finally {
        isDeleting.value = false;
      }
    },
  });
};

const EXPORT_FIELDS = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "content", label: "Content" },
  { key: "published", label: "Published" },
  { key: "languages", label: "Languages" },
] as const;

type ExportFieldKey = (typeof EXPORT_FIELDS)[number]["key"];

const showExportModal = ref(false);
const selectedExportFields = ref<ExportFieldKey[]>(["title", "category"]);

const toggleExportField = (key: ExportFieldKey) => {
  const idx = selectedExportFields.value.indexOf(key);
  if (idx === -1) selectedExportFields.value.push(key);
  else selectedExportFields.value.splice(idx, 1);
};

const exportFieldValue = (entry: FaqListEntry, key: ExportFieldKey) => {
  switch (key) {
    case "id":
      return entry.id;
    case "title":
      return entry.title;
    case "category":
      return entry.categoryName || null;
    case "content":
      return entry.content;
    case "published":
      return !!entry.publishedAt;
    case "languages":
      return entry.locales;
  }
};

const handleExport = () => {
  if (selectedExportFields.value.length === 0) {
    ui.addToast("Select at least one field to export", "warning");
    return;
  }

  const data = filteredEntries.value.map((entry) => {
    const obj: Record<string, unknown> = {};
    for (const key of selectedExportFields.value) {
      obj[key] = exportFieldValue(entry, key);
    }
    return obj;
  });

  downloadJson("faqs_export.json", data);
  showExportModal.value = false;
};

const handlePublish = async (entry: FaqListEntry) => {
  const isCurrentlyPublished = !!entry.publishedAt;
  try {
    await strapi.publishFaq(entry.id, !isCurrentlyPublished);
    ui.addToast(
      `FAQ ${isCurrentlyPublished ? "unpublished" : "published"}`,
      "success",
    );
    await fetchAllData();
  } catch (e: any) {
    ui.addToast(
      `${isCurrentlyPublished ? "Unpublish" : "Publish"} failed: ${e.message}`,
      "error",
    );
  }
};
</script>

<template>
  <div class="space-y-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-0">
      <div class="space-y-2">
        <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
          Igloohome FAQs
        </h1>
        <p class="text-base font-medium text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Manage FAQ entries and translate them across all supported locales.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="showExportModal = true"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 text-gray-700 dark:text-slate-300 text-sm font-black uppercase tracking-widest rounded-xl shadow-sm transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Export
        </button>
        <button
          @click="handleCreate"
          class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14m-7-7v14" />
          </svg>
          New FAQ
        </button>
      </div>
    </div>

    <!-- Management Section -->
    <section class="space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
          <h2 class="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white">
            FAQ Management
          </h2>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3">
          <!-- Sort controls -->
          <div class="flex items-center gap-1.5">
            <button
              v-for="opt in [
                { field: 'title', label: 'Title' },
                { field: 'category', label: 'Category' },
                { field: 'published', label: 'Published' },
                { field: 'enOnly', label: 'EN Only' },
              ]"
              :key="opt.field"
              @click="toggleSort(opt.field as SortField)"
              class="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border"
              :class="
                sortField === opt.field
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-500 hover:border-indigo-200'
              "
            >
              {{ opt.label }}
              <svg
                v-if="sortField === opt.field"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="sortDirection === 'desc' ? 'rotate-180' : ''"
                class="transition-transform"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>

          <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search FAQs..."
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950/20">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
            <thead class="bg-gray-50/50 dark:bg-slate-900/50">
              <tr>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Title
                </th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Category
                </th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Languages
                </th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-slate-800">
              <tr v-if="isFetching && entries.length === 0">
                <td colspan="4" class="px-6 py-12 text-center">
                  <div class="animate-spin inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Fetching data...
                  </p>
                </td>
              </tr>
              <tr v-else-if="filteredEntries.length === 0">
                <td colspan="4" class="px-6 py-12 text-center">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    No FAQs found
                  </p>
                </td>
              </tr>
              <tr
                v-for="entry in filteredEntries"
                :key="entry.id"
                class="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors group"
              >
                <td class="px-6 py-5 max-w-xs">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-black text-gray-900 dark:text-white truncate">{{ entry.title }}</span>
                    <span
                      v-if="entry.publishedAt"
                      class="shrink-0 px-1.5 py-0.5 text-[8px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded uppercase tracking-tighter"
                    >
                      Live
                    </span>
                    <span
                      v-else
                      class="shrink-0 px-1.5 py-0.5 text-[8px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded uppercase tracking-tighter"
                    >
                      Draft
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <span class="text-xs font-bold text-gray-500 dark:text-slate-400">{{ entry.categoryName || "—" }}</span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-wrap gap-1.5 max-w-60">
                    <span
                      v-for="locale in [...entry.locales].sort()"
                      :key="locale"
                      class="px-1.5 py-0.5 text-[9px] font-black border rounded uppercase tracking-tighter transition-all"
                      :class="[
                        locale === 'en'
                          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                          : 'bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800',
                      ]"
                    >
                      {{ locale.toUpperCase() }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="handleInfo(entry)"
                      :disabled="isDeleting"
                      class="p-2 text-gray-400 hover:text-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-900 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Info"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      @click="handlePublish(entry)"
                      :disabled="isDeleting"
                      class="p-2 transition-all rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      :class="entry.publishedAt ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'"
                      :title="entry.publishedAt ? 'Unpublish' : 'Publish'"
                    >
                      <svg v-if="entry.publishedAt" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                        <path d="M9 12h6" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </button>
                    <button
                      @click="handleEdit(entry)"
                      :disabled="isDeleting"
                      class="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
                    <button
                      @click="handleDelete(entry)"
                      :disabled="isDeleting"
                      class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" @click="!isSaving && (showModal = false)"></div>
      <div class="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div class="shrink-0 px-8 py-6 border-b border-gray-50 dark:border-slate-900 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
          <div class="space-y-1">
            <h2 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {{ editingEntry ? "Edit FAQ" : "New FAQ" }}
            </h2>
            <p class="text-xs font-medium text-gray-500 dark:text-slate-400">
              Configure the question, answer, and translations.
            </p>
          </div>
          <button
            @click="!isSaving && (showModal = false)"
            :disabled="isSaving"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div class="p-8">
            <FaqForm
              :initial-data="editingEntry"
              :is-editing="!!editingEntry"
              :is-saving="isSaving"
              :categories="categories"
              @save="handleSave"
              @cancel="!isSaving && (showModal = false)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Info Modal -->
    <FaqInfoModal
      v-if="showInfoModal"
      :faq-id="infoEntryId"
      @close="showInfoModal = false"
    />

    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" @click="showExportModal = false"></div>
      <div class="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-50 dark:border-slate-900 flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Export FAQs
            </h2>
            <p class="text-xs font-medium text-gray-500 dark:text-slate-400">
              Choose which fields to include in the JSON export.
            </p>
          </div>
          <button
            @click="showExportModal = false"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div class="p-8 space-y-2">
          <label
            v-for="field in EXPORT_FIELDS"
            :key="field.key"
            class="flex items-center gap-3 px-4 py-3 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl cursor-pointer hover:border-indigo-200 dark:hover:border-slate-700 transition-colors"
          >
            <input
              type="checkbox"
              :checked="selectedExportFields.includes(field.key)"
              @change="toggleExportField(field.key)"
              class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-slate-300">
              {{ field.label }}
            </span>
          </label>
        </div>

        <div class="px-8 py-6 border-t border-gray-50 dark:border-slate-900 flex items-center justify-between gap-3">
          <p class="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
            {{ filteredEntries.length }} FAQ(s) will be exported
          </p>
          <button
            type="button"
            @click="handleExport"
            class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
