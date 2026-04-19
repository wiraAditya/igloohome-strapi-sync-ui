<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useIgwChangelogsStore } from "~/stores/igwChangelogs";
import { useStrapi } from "~/composables/useStrapi";
import { useUiStore } from "~/stores/ui";
import type {
  IgwChangelogEntry,
  IgwChangelogDtlEntry,
} from "~/types/translations";
import IgwChangelogForm from "~/components/iglooworks/IgwChangelogForm.vue";

const store = useIgwChangelogsStore();
const strapi = useStrapi();
const ui = useUiStore();

const searchQuery = ref("");
const isFetching = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const showCreateModal = ref(false);

const EMPTY_CHANGELOG: IgwChangelogEntry & { details: any[] } = {
  id: "",
  version: "",
  releaseDate: new Date().toISOString().split("T")[0] ?? "",
  locales: ["en"],
  localeCounts: { en: 0 },
  details: [],
};

const editingEntry = ref<IgwChangelogEntry & { details: any[] }>({
  ...EMPTY_CHANGELOG,
});

// Computed for management table
const filteredParents = computed(() => {
  if (!searchQuery.value) return store.parentEntries;
  const query = searchQuery.value.toLowerCase();
  return store.parentEntries.filter(
    (p) =>
      p.version.toLowerCase().includes(query) || p.releaseDate.includes(query),
  );
});

const getDtlCount = (parentId: string) => {
  return store.sourceEntries.filter((d) => d.parentId === parentId).length;
};

const fetchAllData = async () => {
  isFetching.value = true;
  try {
    const { parents, dtls } = await strapi.getIgwChangelogs();
    store.setSource(dtls, parents);
  } catch (e: any) {
    ui.addToast(`Failed to fetch changelogs: ${e.message}`, "error");
  } finally {
    isFetching.value = false;
  }
};

onMounted(() => {
  fetchAllData();
});

const handleCreate = () => {
  editingEntry.value = { ...EMPTY_CHANGELOG };
  showCreateModal.value = true;
};

const handleEdit = (parent: IgwChangelogEntry) => {
  const dtls = store.sourceEntries.filter((d) => d.parentId === parent.id);
  editingEntry.value = {
    ...parent,
    details: dtls.map((d) => ({
      id: (d as IgwChangelogDtlEntry).id,
      title: (d as IgwChangelogDtlEntry).title,
      content: (d as IgwChangelogDtlEntry).content,
      tags: (d as IgwChangelogDtlEntry).tagIds ? [...((d as IgwChangelogDtlEntry).tagIds!)] : [],
    })),
  };
  showCreateModal.value = true;
};

const handleSave = async (formData: {
  version: string;
  releaseDate: string;
  details: { id?: string; title: string; content: string; tags?: string[]; isNew?: boolean }[];
  locale: string;
}) => {
  isSaving.value = true;
  try {
    let parentId = editingEntry.value.id;
    const isEnglish = formData.locale === "en";

    if (editingEntry.value.id) {
      // Update parent metadata ONLY if editing English
      if (isEnglish) {
        await strapi.updateIgwChangelog(editingEntry.value.id, {
          Version: formData.version,
          ReleaseDate: formData.releaseDate,
          publishedAt: new Date().toISOString(),
        });
      }
    } else {
      // Create new parent (always starts as English)
      const result = await strapi.createIgwChangelog({
        Version: formData.version,
        ReleaseDate: formData.releaseDate,
        publishedAt: new Date().toISOString(),
      });
      parentId = result.createIgwChangelog.data.id;
    }

    // Handle details (Update existing or create new)
    for (const dtl of formData.details) {
      const payload: Record<string, any> = {
        Title: dtl.title,
        Changes: dtl.content,
        igw_changelog: parentId,
        publishedAt: new Date().toISOString(),
      };

      // Tags are only written in EN mode to avoid locale-specific divergence
      if (formData.locale === "en" && dtl.tags !== undefined) {
        payload.changelog_tags = dtl.tags;
      }

      if (dtl.id && !dtl.isNew) {
        await strapi.updateIgwChangelogDtl(dtl.id, payload, formData.locale);
      } else {
        await strapi.createIgwChangelogDtl(payload, formData.locale);
      }
    }

    ui.addToast(
      editingEntry.value.id
        ? `${formData.locale.toUpperCase()} logs updated`
        : "Changelog created",
      "success",
    );
    showCreateModal.value = false;
    await fetchAllData();
  } catch (e: any) {
    ui.addToast(`Operation failed: ${e.message}`, "error");
  } finally {
    isSaving.value = false;
  }
};

const handleDelete = async (id: string) => {
  ui.confirm({
    title: "Delete Changelog",
    message:
      "Are you sure you want to delete this changelog? This will also delete all its translations.",
    confirmText: "Delete",
    type: "danger",
    onConfirm: async () => {
      isDeleting.value = true;
      try {
        await strapi.deleteIgwChangelog(id);
        ui.addToast("Changelog deleted successfully", "success");
        await fetchAllData();
      } catch (e: any) {
        ui.addToast(`Delete failed: ${e.message}`, "error");
      } finally {
        isDeleting.value = false;
      }
    },
  });
};

const handlePublish = async (parent: IgwChangelogEntry) => {
  const isCurrentlyPublished = !!parent.publishedAt;
  try {
    await strapi.publishIgwChangelog(parent.id, !isCurrentlyPublished);
    ui.addToast(
      `Version ${parent.version} ${isCurrentlyPublished ? "unpublished" : "published"}`,
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
    <div
      class="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-0"
    >
      <div class="space-y-2">
        <h1
          class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase"
        >
          Iglooworks Changelogs
        </h1>
        <p
          class="text-base font-medium text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed"
        >
          Manage product versions and translate changelog details across all
          supported locales.
        </p>
      </div>
      <button
        @click="handleCreate"
        class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14m-7-7v14" />
        </svg>
        New Version
      </button>
    </div>

    <!-- Management Section -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
          <h2
            class="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white"
          >
            Version Management
          </h2>
        </div>

        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search versions..."
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      <!-- Parents Table -->
      <div
        class="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950/20"
      >
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-100 dark:divide-slate-800"
          >
            <thead class="bg-gray-50/50 dark:bg-slate-900/50">
              <tr>
                <th
                  class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]"
                >
                  Version
                </th>
                <th
                  class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]"
                >
                  Release Date
                </th>
                <th
                  class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]"
                >
                  Details (Base)
                </th>
                <th
                  class="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]"
                >
                  Language Ready
                </th>
                <th
                  class="px-6 py-4 text-right text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-slate-800">
              <tr v-if="isFetching && store.parentEntries.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div
                    class="animate-spin inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"
                  ></div>
                  <p
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    Fetching data...
                  </p>
                </td>
              </tr>
              <tr v-else-if="filteredParents.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <p
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    No versions found
                  </p>
                </td>
              </tr>
              <tr
                v-for="parent in filteredParents"
                :key="parent.id"
                class="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors group"
              >
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight"
                      >{{ parent.version }}</span
                    >
                    <span
                      v-if="parent.publishedAt"
                      class="px-1.5 py-0.5 text-[8px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded uppercase tracking-tighter"
                    >
                      Live
                    </span>
                    <span
                      v-else
                      class="px-1.5 py-0.5 text-[8px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded uppercase tracking-tighter"
                    >
                      Draft
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <span
                    class="text-xs font-bold text-gray-500 dark:text-slate-400"
                    >{{ parent.releaseDate }}</span
                  >
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs font-black text-indigo-600 dark:text-indigo-400"
                      >{{ getDtlCount(parent.id) }}</span
                    >
                    <span
                      class="text-[10px] font-medium text-gray-400 uppercase"
                      >entries</span
                    >
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-wrap gap-1.5 max-w-60">
                    <span
                      v-for="locale in [...parent.locales].sort()"
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
                      @click="navigateTo(`/iglooworks/changelogs/translate/${parent.id}`)"
                      :disabled="isDeleting"
                      class="p-2 transition-all rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Prepare Translation"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                        <path d="M5 3v4" />
                        <path d="M19 17v4" />
                        <path d="M3 5h4" />
                        <path d="M17 19h4" />
                      </svg>
                    </button>
                    <button
                      @click="handleEdit(parent)"
                      :disabled="isDeleting"
                      class="p-2 text-gray-400 hover:text-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-900 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="View"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      @click="handlePublish(parent)"
                      :disabled="isDeleting"
                      class="p-2 transition-all rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      :class="
                        parent.publishedAt
                          ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                          : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                      "
                      :title="parent.publishedAt ? 'Unpublish' : 'Publish'"
                    >
                      <svg
                        v-if="parent.publishedAt"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                        <path d="M9 12h6" />
                      </svg>
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </button>
                    <button
                      @click="handleEdit(parent)"
                      :disabled="isDeleting"
                      class="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                        />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
                    <button
                      @click="handleDelete(parent.id)"
                      :disabled="isDeleting"
                      class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
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
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        @click="!isSaving && (showCreateModal = false)"
      ></div>
      <div
        class="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
      >
        <!-- Modal Header (Fixed) -->
        <div
          class="shrink-0 px-8 py-6 border-b border-gray-50 dark:border-slate-900 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10"
        >
          <div class="space-y-1">
            <h2
              class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
            >
              {{ editingEntry.id ? "Edit Version" : "New Version" }}
            </h2>
            <p class="text-xs font-medium text-gray-500 dark:text-slate-400">
              Configure your product update metadata and base content.
            </p>
          </div>
          <button
            @click="!isSaving && (showCreateModal = false)"
            :disabled="isSaving"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-8">
            <IgwChangelogForm
              :initial-data="editingEntry"
              :is-editing="!!editingEntry.id"
              :is-saving="isSaving"
              @save="handleSave"
              @cancel="!isSaving && (showCreateModal = false)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
