<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { type IgwChangelogEntry, type LocaleCode } from "~/types/translations";
import { useStrapi } from "~/composables/useStrapi";
import { useUiStore } from "~/stores/ui";

interface FormDetail {
  id?: string;
  title: string;
  content: string;
  tags?: string[];
  isNew?: boolean;
}

interface FormState {
  version: string;
  releaseDate: string;
  details: FormDetail[];
}

const props = withDefaults(
  defineProps<{
    initialData?: IgwChangelogEntry & { details?: FormDetail[] };
    isEditing?: boolean;
    isSaving?: boolean;
    locale?: LocaleCode | string;
  }>(),
  {
    locale: "en",
    isSaving: false,
  },
);

const emit = defineEmits<{
  (
    e: "save",
    data: {
      version: string;
      releaseDate: string;
      details: FormDetail[];
      locale: string;
    },
  ): void;
  (e: "cancel"): void;
}>();

const strapi = useStrapi();
const ui = useUiStore();

const availableLocales = ref<{ code: string; name: string }[]>([]);
const availableTags = ref<{ id: string; name: string }[]>([]);
const selectedLocale = ref<string>(props.locale);
const isFetchingDetails = ref(false);

// Use reactive for better nested property handling and strict typing
const form = reactive<FormState>({
  version: "",
  releaseDate: new Date().toISOString().split("T")[0] ?? "",
  details: [],
});

const addDetail = () => {
  form.details.push({
    title: "",
    content: "",
    tags: [],
    isNew: true,
  });
};

const toggleTag = (detail: FormDetail, tagId: string) => {
  if (!detail.tags) detail.tags = [];
  const idx = detail.tags.indexOf(tagId);
  if (idx === -1) {
    detail.tags.push(tagId);
  } else {
    detail.tags.splice(idx, 1);
  }
};

const fetchLocalizedDetails = async (locale: string) => {
  const parentId = props.initialData?.id;
  if (!props.isEditing || !parentId) return;

  isFetchingDetails.value = true;
  try {
    const dtls = await strapi.getIgwChangelogDtls(parentId, locale);
    form.details = dtls.map((d) => ({
      id: d.id,
      title: d.title || "",
      content: d.content || "",
      tags: d.tagIds ? [...d.tagIds] : [],
      isNew: false,
    }));

    if (form.details.length === 0) {
      addDetail();
    }
  } catch (e: any) {
    ui.addToast(
      `Failed to fetch ${locale.toUpperCase()} details: ${e.message}`,
      "error",
    );
  } finally {
    isFetchingDetails.value = false;
  }
};

watch(selectedLocale, (newLocale) => {
  if (props.isEditing) {
    fetchLocalizedDetails(newLocale);
  }
});

onMounted(async () => {
  try {
    [availableLocales.value, availableTags.value] = await Promise.all([
      strapi.getLocales(),
      strapi.getChangelogTags(),
    ]);
  } catch (err: any) {
    ui.addToast(`Failed to load form data: ${err.message}`, "error");
  }

  if (props.initialData) {
    // Create local string constants with guaranteed fallbacks to satisfy TS
    const version: string = props.initialData.version ?? "";
    const releaseDate: string =
      props.initialData.releaseDate ?? new Date().toISOString().split("T")[0];

    // Assign these constants to form
    form.version = version;
    form.releaseDate = releaseDate;

    if (props.initialData.details && props.initialData.details.length > 0) {
      form.details = props.initialData.details.map((d) => ({
        ...d,
        tags: d.tags ? [...d.tags] : [],
      }));
    }

    // Fetch localized details if we're starting with a non-English locale in edit mode
    if (props.isEditing && selectedLocale.value !== "en") {
      fetchLocalizedDetails(selectedLocale.value);
    } else if (form.details.length === 0) {
      addDetail();
    }
  } else {
    addDetail();
  }
});

const removeDetail = async (index: number) => {
  const detail = form.details[index];
  if (!detail) return;

  // Restriction logic: Non-English can't delete existing details
  if (!detail.isNew && detail.id && selectedLocale.value !== "en") {
    ui.addToast(
      "Deletion of existing logs is restricted for non-English languages",
      "warning",
    );
    return;
  }

  // Handle existing detail deletion (English only)
  if (!detail.isNew && detail.id) {
    if (
      !confirm(
        "Are you sure you want to delete this log entry permanently? This cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await strapi.deleteIgwChangelogDtl(detail.id);
      ui.addToast("Log entry deleted from Strapi", "success");
    } catch (e: any) {
      ui.addToast(`Failed to delete log: ${e.message}`, "error");
      return;
    }
  }

  form.details.splice(index, 1);
};

const handleSubmit = () => {
  // Validation: At least one detail present
  if (form.details.length === 0) {
    ui.addToast("At least one log detail is required", "error");
    return;
  }

  // Validation: All details must have title and content
  const hasEmpty = form.details.some(
    (d) => !d.title.trim() || !d.content.trim(),
  );
  if (hasEmpty) {
    ui.addToast("Please fill in all log titles and descriptions", "warning");
    return;
  }

  // Final casting to ensure strict string values for the emit
  const payload = {
    version: form.version as string,
    releaseDate: form.releaseDate as string,
    details: JSON.parse(JSON.stringify(form.details)),
    locale: String(selectedLocale.value || "en"),
  };

  emit("save", payload);
};
</script>

<template>
  <div class="space-y-8 relative">
    <!-- Locale Selector & Metadata Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Locale -->
      <div class="space-y-2">
        <label
          class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
        >
          Edit Language
        </label>
        <select
          v-model="selectedLocale"
          :disabled="!!!isEditing"
          class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <option value="en">English (Base)</option>
          <option
            v-for="loc in availableLocales.filter((l) => l.code !== 'en')"
            :key="loc.code"
            :value="loc.code"
          >
            {{ loc.name }} ({{ loc.code.toUpperCase() }})
          </option>
        </select>
        <p
          v-if="!isEditing"
          class="text-[9px] font-bold text-amber-500 uppercase tracking-tight"
        >
          New versions must start with English
        </p>
      </div>

      <!-- Version -->
      <div class="space-y-2">
        <label
          class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
        >
          App Version
        </label>
        <input
          v-model="form.version"
          type="text"
          placeholder="e.g. 1.0.0"
          :disabled="!!(selectedLocale !== 'en')"
          class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700 disabled:opacity-70 shadow-sm"
          required
        />
      </div>

      <!-- Release Date -->
      <div class="space-y-2">
        <label
          class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
        >
          Release Date
        </label>
        <input
          v-model="form.releaseDate"
          type="date"
          :disabled="!!(selectedLocale !== 'en')"
          class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all disabled:opacity-70 shadow-sm"
          required
        />
      </div>
    </div>

    <!-- Dynamic Details Section -->
    <div class="pt-6 border-t border-gray-100 dark:border-slate-800 space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
          <h3
            class="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white"
          >
            Log Details ({{ selectedLocale.toUpperCase() }})
          </h3>
          <div
            v-if="isFetchingDetails"
            class="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
          ></div>
        </div>
        <button
          type="button"
          @click="addDetail"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-all active:scale-95"
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
            <path d="M5 12h14m-7-7v14" />
          </svg>
          Add Log Entry
        </button>
      </div>

      <div class="space-y-6">
        <div
          v-for="(detail, index) in form.details"
          :key="index"
          class="relative p-6 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-2xl space-y-4 group transition-all hover:border-indigo-100 dark:hover:border-indigo-900/30 shadow-sm"
        >
          <!-- Delete Button -->
          <button
            v-if="form.details.length > 1"
            type="button"
            @click="removeDetail(index)"
            :disabled="
              !!(!detail.isNew && detail.id && selectedLocale !== 'en')
            "
            class="absolute top-4 right-4 p-2 text-gray-300 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            :title="
              !!(!detail.isNew && detail.id && selectedLocale !== 'en')
                ? 'Cannot delete existing logs in non-English'
                : 'Remove Log'
            "
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
              <path
                d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
              />
            </svg>
          </button>

          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
            >
              Log Title #{{ index + 1 }}
            </label>
            <input
              v-model="detail.title"
              type="text"
              placeholder="e.g. Performance Improvements"
              class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700 shadow-sm"
              required
            />
          </div>

          <div class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
            >
              Changes Description (Markdown supported)
            </label>
            <textarea
              v-model="detail.content"
              rows="4"
              placeholder="List the changes here..."
              class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl xs font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700 resize-none font-mono text-xs leading-relaxed shadow-sm"
              required
            ></textarea>
          </div>

          <!-- Tags -->
          <div v-if="availableTags.length > 0" class="space-y-2">
            <label
              class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500"
            >
              Tags
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in availableTags"
                :key="tag.id"
                type="button"
                :disabled="selectedLocale !== 'en'"
                @click="toggleTag(detail, tag.id)"
                class="px-3 py-1 text-[10px] font-black uppercase tracking-tight rounded-full border transition-all"
                :class="
                  detail.tags?.includes(tag.id)
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-600'
                "
                :title="selectedLocale !== 'en' ? 'Tags can only be edited in English mode' : undefined"
              >
                {{ tag.name }}
              </button>
            </div>
            <p
              v-if="selectedLocale !== 'en'"
              class="text-[9px] font-bold text-amber-500 uppercase tracking-tight"
            >
              Tags are read-only in non-English mode
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions (Sticky Footer) -->
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
        class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
        :disabled="isFetchingDetails || isSaving"
      >
        <span
          v-if="isFetchingDetails || isSaving"
          class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"
        ></span>
        <span v-if="isSaving">Saving...</span>
        <span v-else-if="isFetchingDetails">Loading...</span>
        <span v-else>{{
          isEditing
            ? `Update ${selectedLocale.toUpperCase()} Logs`
            : "Create English Changelog"
        }}</span>
      </button>
    </div>
  </div>
</template>
