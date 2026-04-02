<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { SUPPORTED_LOCALES } from "~/types/translations";
import type {
  StrapiEntry,
  ContentType,
  LocaleCode,
} from "~/types/translations";

const props = defineProps<{
  show: boolean;
  sourceEntries: StrapiEntry[];
  type: ContentType;
}>();

const emit = defineEmits<{
  (e: "upload", payload: { locale: string; entries: StrapiEntry[] }): void;
  (e: "close"): void;
}>();

interface StagedFile {
  id: string;
  filename: string;
  entries: StrapiEntry[];
  detectedLocale: string;
  error: string | null;
  searchQuery: string;
  isDropdownOpen: boolean;
}

const fileInput = ref<HTMLInputElement | null>(null);
const stagedFiles = ref<StagedFile[]>([]);
const locales = SUPPORTED_LOCALES;

const exampleFormat = computed(() => {
  if (props.type === "categories") {
    return [
      { id: "1", category: "Translated Category Name" },
      { id: "2", category: "Another Translated Name" },
    ];
  } else if (props.type === "changelogs") {
    return [
      {
        id: "101",
        version: "1.0.0",
        title: "New Update Title",
        changes: "- Fixed bug\n- New feature",
      },
    ];
  } else if (props.type === "faqs") {
    return [
      {
        id: "50",
        title: "How to reset?",
        content: "Press the button for 5 seconds.",
        category: "1",
      },
    ];
  }
  return [];
});

const reset = () => {
  stagedFiles.value = [];
  if (fileInput.value) fileInput.value.value = "";
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  if (files.length === 0) return;

  for (const file of files) {
    let fileError: string | null = null;
    let validEntries: StrapiEntry[] = [];
    let detectedCode = "";

    // Try to detect locale from filename
    const filename = file.name.toLowerCase();
    const foundLocale = locales.find(
      (l: any) =>
        filename.includes(`-${l.code}.`) || filename.startsWith(`${l.code}.`),
    );
    if (foundLocale) {
      detectedCode = foundLocale.code;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        throw new Error("Must be a JSON array.");
      }

      const sourceIds = new Set(props.sourceEntries.map((e) => e.id));
      validEntries = json.filter((e) => sourceIds.has(e.id));

      if (validEntries.length === 0) {
        throw new Error("No matching IDs found.");
      }

      if (json.length > validEntries.length) {
        fileError = `${json.length - validEntries.length} items ignored (ID mismatch).`;
      }
    } catch (err: any) {
      fileError = err.message || "Parse error.";
    }

    stagedFiles.value.push({
      id: Math.random().toString(36).slice(2),
      filename: file.name,
      entries: validEntries,
      detectedLocale: detectedCode,
      error: fileError,
      searchQuery: "",
      isDropdownOpen: false,
    });
  }

  if (fileInput.value) fileInput.value.value = "";
};

const removeFile = (id: string) => {
  stagedFiles.value = stagedFiles.value.filter((f) => f.id !== id);
};

const getFilteredLocales = (query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return locales;
  return locales.filter(
    (l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
  );
};

const selectLocale = (fileId: string, code: string) => {
  const file = stagedFiles.value.find((f) => f.id === fileId);
  if (file) {
    file.detectedLocale = code;
    file.isDropdownOpen = false;
    file.searchQuery = "";
  }
};

const confirmAllUploads = () => {
  const readyFiles = stagedFiles.value.filter(
    (f) => f.detectedLocale && f.entries.length > 0,
  );
  readyFiles.forEach((f) => {
    emit("upload", {
      locale: f.detectedLocale,
      entries: f.entries,
    });
  });
  emit("close");
  reset();
};

const canConfirm = computed(() => {
  return (
    stagedFiles.value.length > 0 &&
    stagedFiles.value.every((f) => f.detectedLocale)
  );
});

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) reset();
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-8 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-8 sm:scale-95"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-indigo-950/60 backdrop-blur-md dark:bg-slate-950/80"
          @click="$emit('close')"
        ></div>

        <!-- Modal Content -->
        <div
          class="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-[2.5rem] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 dark:border-slate-800 transition-colors"
        >
          <!-- Header -->
          <div
            class="p-6 sm:p-8 border-b border-gray-100 dark:border-slate-800 shrink-0 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50"
          >
            <div>
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3
                  class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase"
                >
                  Data Import
                </h3>
              </div>
              <p
                class="mt-1 text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest"
              >
                Target: {{ type }}
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div
            class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-thin dark:scrollbar-thumb-slate-700"
          >
            <!-- Format Guide -->
            <div v-if="stagedFiles.length === 0" class="space-y-4">
              <div
                class="flex items-center gap-2 text-indigo-800 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]"
              >
                <svg
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Template Reference
              </div>
              <div class="relative group">
                <div
                  class="absolute -inset-1 bg-linear-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"
                ></div>
                <pre
                  class="relative text-[10px] bg-indigo-900 dark:bg-slate-950 p-6 rounded-2xl overflow-x-auto text-indigo-100 dark:text-indigo-400 font-mono shadow-xl border border-white/5"
                  >{{ JSON.stringify(exampleFormat, null, 2) }}</pre
                >
              </div>
            </div>

            <!-- Upload Zone -->
            <label
              v-if="stagedFiles.length === 0"
              class="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-4xl cursor-pointer bg-gray-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group relative overflow-hidden"
            >
              <div
                class="relative flex flex-col items-center justify-center pt-5 pb-6 text-center"
              >
                <div
                  class="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                >
                  <svg
                    class="w-10 h-10 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                </div>
                <p
                  class="mb-2 text-base font-black text-gray-900 dark:text-white tracking-tight"
                >
                  Drag & Drop JSON files
                </p>
                <p
                  class="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest"
                >
                  Multiple files supported • Auto-detection
                </p>
              </div>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".json"
                multiple
                @change="handleFileUpload"
              />
            </label>

            <!-- Staged Files List -->
            <div v-else class="space-y-4">
              <div class="flex justify-between items-center mb-4">
                <h4
                  class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
                >
                  Staged for Import ({{ stagedFiles.length }})
                </h4>
                <button
                  @click="reset"
                  class="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest px-3 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div
                v-for="file in stagedFiles"
                :key="file.id"
                class="group p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 dark:hover:border-indigo-900"
              >
                <div class="flex justify-between items-start mb-6">
                  <div class="flex items-center gap-4 overflow-hidden">
                    <div
                      class="bg-gray-100 dark:bg-slate-800 p-3 rounded-xl text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                        />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div class="overflow-hidden">
                      <p
                        class="text-sm font-black text-gray-900 dark:text-white truncate"
                      >
                        {{ file.filename }}
                      </p>
                      <p
                        class="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-tight"
                      >
                        {{ file.entries.length }} records identified
                      </p>
                    </div>
                  </div>
                  <button
                    @click="removeFile(file.id)"
                    class="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Searchable Dropdown -->
                  <div class="relative">
                    <label
                      class="block text-[10px] font-black uppercase text-gray-400 dark:text-slate-500 mb-2 tracking-widest ml-1"
                      >Target Language</label
                    >
                    <div class="relative">
                      <button
                        @click="file.isDropdownOpen = !file.isDropdownOpen"
                        class="w-full px-4 py-3 border-2 rounded-xl text-left text-xs font-black transition-all flex justify-between items-center"
                        :class="[
                          file.detectedLocale
                            ? 'border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                            : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-600 hover:border-indigo-200',
                        ]"
                      >
                        <span
                          v-if="file.detectedLocale"
                          class="flex items-center gap-2"
                        >
                          {{
                            locales.find((l) => l.code === file.detectedLocale)
                              ?.name
                          }}
                          <span class="text-[10px] font-bold opacity-40"
                            >({{ file.detectedLocale.toUpperCase() }})</span
                          >
                        </span>
                        <span v-else>Select language...</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          :class="{ 'rotate-180': file.isDropdownOpen }"
                          class="transition-transform"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      <!-- Dropdown Menu -->
                      <Transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="opacity-0 translate-y-2"
                        enter-to-class="opacity-100 translate-y-0"
                      >
                        <div
                          v-if="file.isDropdownOpen"
                          class="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                        >
                          <div
                            class="p-3 border-b border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50"
                          >
                            <input
                              v-model="file.searchQuery"
                              type="text"
                              placeholder="Search languages..."
                              class="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all dark:text-white"
                              @click.stop
                              autoFocus
                            />
                          </div>
                          <div
                            class="max-h-60 overflow-y-auto scrollbar-thin dark:scrollbar-thumb-slate-700"
                          >
                            <button
                              v-for="l in getFilteredLocales(file.searchQuery)"
                              :key="l.code"
                              @click="selectLocale(file.id, l.code)"
                              class="w-full text-left px-5 py-3 text-xs font-black hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-between group"
                            >
                              <span
                                class="text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                >{{ l.name }}</span
                              >
                              <span
                                class="text-gray-300 dark:text-slate-600 font-black group-hover:text-indigo-300"
                                >{{ l.code.toUpperCase() }}</span
                              >
                            </button>
                            <div
                              v-if="
                                getFilteredLocales(file.searchQuery).length ===
                                0
                              "
                              class="p-8 text-center text-xs text-gray-400 font-black uppercase tracking-widest"
                            >
                              No matches
                            </div>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>

                  <!-- Error Banner for individual file -->
                  <div v-if="file.error" class="flex flex-col justify-end">
                    <div
                      class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl flex items-start gap-3 text-amber-700 dark:text-amber-400 transition-colors"
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
                        class="shrink-0 mt-0.5"
                      >
                        <path
                          d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
                        />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                      </svg>
                      <div class="space-y-0.5">
                        <span
                          class="text-[10px] font-black uppercase tracking-tight"
                          >Parser Notice</span
                        >
                        <p class="text-[10px] font-medium leading-relaxed">
                          {{ file.error }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add More Button -->
              <label
                class="block p-6 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl text-center cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
              >
                <span
                  class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                  >+ Add Additional Files</span
                >
                <input
                  type="file"
                  class="hidden"
                  accept=".json"
                  multiple
                  @change="handleFileUpload"
                />
              </label>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="bg-gray-50 dark:bg-slate-800/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-slate-800 shrink-0 transition-colors"
          >
            <div
              class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
            >
              <span
                class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
              ></span>
              {{ stagedFiles.length }} files ready
            </div>
            <div class="flex gap-4 w-full sm:w-auto">
              <button
                type="button"
                class="flex-1 sm:flex-none px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                type="button"
                class="flex-1 sm:flex-none px-10 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-950/40 disabled:opacity-30 disabled:shadow-none active:scale-95"
                :disabled="!canConfirm"
                @click="confirmAllUploads"
              >
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
