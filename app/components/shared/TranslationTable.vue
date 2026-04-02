<script setup lang="ts">
import { computed } from "vue";
import type {
  ContentType,
  StrapiEntry,
  CategoryEntry,
  ChangelogEntry,
  FaqEntry,
} from "~/types/translations";

const props = defineProps<{
  sourceEntries: StrapiEntry[];
  localeEntries?: StrapiEntry[];
  type: ContentType;
  locale?: string;
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  (
    e: "update:entry",
    payload: { id: string; field: string; value: string },
  ): void;
}>();

const onInput = (id: string, field: string, value: string) => {
  emit("update:entry", { id, field, value });
};

const getEntryId = (entry: any): string => (entry?.id ? String(entry.id) : "");

const localeEntriesMap = computed(() => {
  const map: Record<string, StrapiEntry> = {};
  props.localeEntries?.forEach((e: any) => {
    if (e.id) map[String(e.id)] = e;
  });
  return map;
});

const isCategory = (entry: StrapiEntry): entry is CategoryEntry =>
  props.type === "categories";
const isChangelog = (entry: StrapiEntry): entry is ChangelogEntry =>
  props.type === "changelogs";
const isFaq = (entry: StrapiEntry): entry is FaqEntry => props.type === "faqs";

// Helper to cast in script instead of template
const asCategory = (entry: any) => entry as CategoryEntry;
const asChangelog = (entry: any) => entry as ChangelogEntry;
const asFaq = (entry: any) => entry as FaqEntry;
</script>

<template>
  <div class="relative flex flex-col gap-4 transition-colors">
    <!-- Comparison View Table (Desktop/Tablet) -->
    <div
      class="hidden md:block overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm transition-colors"
    >
      <div
        class="max-h-175 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800"
      >
        <table class="w-full text-sm text-left border-collapse table-fixed">
          <thead
            class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 border-b border-gray-100 dark:border-slate-800 transition-colors"
          >
            <tr>
              <th
                class="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] w-24"
              >
                Entry ID
              </th>
              <th
                class="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]"
              >
                Original Content (EN)
              </th>
              <th
                v-if="locale"
                class="px-6 py-4 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] bg-indigo-50/30 dark:bg-indigo-900/10"
              >
                {{ locale.toUpperCase() }} Translation
              </th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-gray-50 dark:divide-slate-800 transition-colors"
          >
            <tr
              v-for="source in sourceEntries"
              :key="getEntryId(source)"
              class="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group"
            >
              <!-- ID Column -->
              <td class="px-6 py-8 align-top">
                <span
                  class="text-[10px] font-black text-gray-300 dark:text-slate-600 tracking-widest bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md"
                  >{{ getEntryId(source) }}</span
                >

                <!-- Metadata if Changelog -->
                <div
                  v-if="isChangelog(source)"
                  class="mt-4 flex flex-col gap-2"
                >
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 uppercase w-fit"
                  >
                    v{{ asChangelog(source).appVersion }}
                  </span>
                </div>
              </td>

              <!-- Source Column (EN) -->
              <td class="px-6 py-8 align-top">
                <div class="space-y-6">
                  <!-- Category Mapping -->
                  <div v-if="isCategory(source)" class="space-y-1">
                    <p
                      class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight"
                    >
                      Name
                    </p>
                    <p
                      class="text-sm font-bold text-gray-900 dark:text-slate-200 leading-relaxed"
                    >
                      {{ asCategory(source).category }}
                    </p>
                  </div>

                  <!-- Changelog Mapping -->
                  <div v-else-if="isChangelog(source)" class="space-y-4">
                    <div class="space-y-1">
                      <p
                        class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight"
                      >
                        Version
                      </p>
                      <p
                        class="text-sm font-bold text-gray-900 dark:text-slate-200 leading-relaxed"
                      >
                        {{ asChangelog(source).appVersion }}
                      </p>
                    </div>
                    <div class="space-y-1">
                      <p
                        class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight"
                      >
                        Changes
                      </p>
                      <div
                        class="text-xs font-medium text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed"
                      >
                        {{ asChangelog(source).changes }}
                      </div>
                    </div>
                  </div>

                  <!-- FAQ Mapping -->
                  <div v-else-if="isFaq(source)" class="space-y-4">
                    <div class="space-y-1">
                      <p
                        class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight"
                      >
                        Title
                      </p>
                      <p
                        class="text-sm font-bold text-gray-900 dark:text-slate-200 leading-relaxed"
                      >
                        {{ asFaq(source).title }}
                      </p>
                    </div>
                    <div class="space-y-1">
                      <p
                        class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight"
                      >
                        Content Body
                      </p>
                      <p
                        class="text-xs font-medium text-gray-600 dark:text-slate-400 leading-relaxed"
                      >
                        {{ asFaq(source).content }}
                      </p>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Target Column (Translation) -->
              <td
                v-if="locale"
                class="px-6 py-8 align-top bg-indigo-50/10 dark:bg-indigo-900/5"
              >
                <div class="space-y-6">
                  <!-- Category Edit -->
                  <div v-if="isCategory(source)" class="space-y-2">
                    <div v-if="!readOnly" class="relative group/field">
                      <textarea
                        :value="
                          asCategory(localeEntriesMap[getEntryId(source)])
                            ?.category
                        "
                        @input="
                          onInput(
                            getEntryId(source),
                            'category',
                            ($event.target as HTMLTextAreaElement).value,
                          )
                        "
                        rows="2"
                        class="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
                        placeholder="Type translation..."
                      ></textarea>
                    </div>
                    <div
                      v-else
                      class="p-4 bg-white/50 dark:bg-slate-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl text-sm font-bold text-indigo-700 dark:text-indigo-400 leading-relaxed"
                    >
                      {{
                        asCategory(localeEntriesMap[getEntryId(source)])
                          ?.category || "—"
                      }}
                    </div>
                  </div>

                  <!-- Changelog Edit -->
                  <div v-else-if="isChangelog(source)" class="space-y-4">
                    <div class="space-y-2">
                      <div v-if="!readOnly" class="relative group/field">
                        <input
                          type="text"
                          :value="
                            asChangelog(localeEntriesMap[getEntryId(source)])
                              ?.appVersion
                          "
                          @input="
                            onInput(
                              getEntryId(source),
                              'appVersion',
                              ($event.target as HTMLInputElement).value,
                            )
                          "
                          class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-black text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
                          placeholder="Translated Version"
                        />
                      </div>
                      <div
                        v-else
                        class="p-3 px-4 bg-white/50 dark:bg-slate-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl text-sm font-black text-indigo-900 dark:text-indigo-400"
                      >
                        {{
                          asChangelog(localeEntriesMap[getEntryId(source)])
                            ?.appVersion || "—"
                        }}
                      </div>
                    </div>
                    <div class="space-y-2">
                      <div v-if="!readOnly" class="relative group/field">
                        <textarea
                          :value="
                            asChangelog(localeEntriesMap[getEntryId(source)])
                              ?.changes
                          "
                          @input="
                            onInput(
                              getEntryId(source),
                              'changes',
                              ($event.target as HTMLTextAreaElement).value,
                            )
                          "
                          rows="6"
                          class="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-gray-900 dark:text-slate-200 leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
                          placeholder="Type translated changes..."
                        ></textarea>
                      </div>
                      <div
                        v-else
                        class="p-4 bg-white/50 dark:bg-slate-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl text-xs font-mono text-gray-900 dark:text-slate-300 whitespace-pre-wrap leading-relaxed"
                      >
                        {{
                          asChangelog(localeEntriesMap[getEntryId(source)])
                            ?.changes || "—"
                        }}
                      </div>
                    </div>
                  </div>

                  <!-- FAQ Edit -->
                  <div v-else-if="isFaq(source)" class="space-y-4">
                    <div class="space-y-2">
                      <div v-if="!readOnly" class="relative group/field">
                        <input
                          type="text"
                          :value="
                            asFaq(localeEntriesMap[getEntryId(source)])?.title
                          "
                          @input="
                            onInput(
                              getEntryId(source),
                              'title',
                              ($event.target as HTMLInputElement).value,
                            )
                          "
                          class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-black text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
                          placeholder="Translated Title"
                        />
                      </div>
                      <div
                        v-else
                        class="p-3 px-4 bg-white/50 dark:bg-slate-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl text-sm font-black text-indigo-900 dark:text-indigo-400"
                      >
                        {{
                          asFaq(localeEntriesMap[getEntryId(source)])?.title ||
                          "—"
                        }}
                      </div>
                    </div>
                    <div class="space-y-2">
                      <div v-if="!readOnly" class="relative group/field">
                        <textarea
                          :value="
                            asFaq(localeEntriesMap[getEntryId(source)])?.content
                          "
                          @input="
                            onInput(
                              getEntryId(source),
                              'content',
                              ($event.target as HTMLTextAreaElement).value,
                            )
                          "
                          rows="4"
                          class="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-gray-900 dark:text-slate-200 leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
                          placeholder="Translated Content Body"
                        ></textarea>
                      </div>
                      <div
                        v-else
                        class="p-4 bg-white/50 dark:bg-slate-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl text-xs font-medium text-gray-700 dark:text-slate-400 leading-relaxed"
                      >
                        {{
                          asFaq(localeEntriesMap[getEntryId(source)])?.content ||
                          "—"
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Card Stack View (Mobile Only) -->
    <div class="md:hidden space-y-6">
      <div
        v-for="source in sourceEntries"
        :key="getEntryId(source)"
        class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
      >
        <!-- Card Header (ID + Meta) -->
        <div
          class="bg-gray-50 dark:bg-slate-800/50 px-5 py-3 flex justify-between items-center border-b border-gray-100 dark:border-slate-800"
        >
          <span
            class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]"
            >Entry ID: {{ getEntryId(source) }}</span
          >
          <span
            v-if="isChangelog(source)"
            class="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 uppercase"
            >v{{ asChangelog(source).appVersion }}</span
          >
        </div>

        <div class="p-5 space-y-8">
          <!-- Category Mapping -->
          <template v-if="isCategory(source)">
            <div class="space-y-4">
              <div class="space-y-2">
                <p
                  class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  Original Name
                </p>
                <p
                  class="text-sm font-bold text-gray-900 dark:text-slate-200 leading-relaxed p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl transition-colors"
                >
                  {{ asCategory(source).category }}
                </p>
              </div>
              <div v-if="locale" class="space-y-2">
                <p
                  class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"
                >
                  {{ locale.toUpperCase() }} Translation
                </p>
                <textarea
                  v-if="!readOnly"
                  :value="
                    asCategory(localeEntriesMap[getEntryId(source)])?.category
                  "
                  @input="
                    onInput(
                      getEntryId(source),
                      'category',
                      ($event.target as HTMLTextAreaElement).value,
                    )
                  "
                  rows="2"
                  class="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-gray-900 dark:text-white transition-all"
                ></textarea>
                <p
                  v-else
                  class="text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-2xl transition-colors"
                >
                  {{
                    asCategory(localeEntriesMap[getEntryId(source)])?.category ||
                    "—"
                  }}
                </p>
              </div>
            </div>
          </template>

          <template v-else-if="isChangelog(source)">
            <div class="space-y-6">
              <!-- Version Field -->
              <div
                class="space-y-4 pb-4 border-b border-gray-50 dark:border-slate-800"
              >
                <div class="space-y-2">
                  <p
                    class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Original Version
                  </p>
                  <p
                    class="text-sm font-bold text-gray-900 dark:text-slate-200 leading-relaxed"
                  >
                    {{ asChangelog(source).appVersion }}
                  </p>
                </div>
                <div v-if="locale" class="space-y-2">
                  <p
                    class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"
                  >
                    {{ locale.toUpperCase() }} Version
                  </p>
                  <input
                    v-if="!readOnly"
                    type="text"
                    :value="
                      asChangelog(localeEntriesMap[getEntryId(source)])?.appVersion
                    "
                    @input="
                      onInput(
                        getEntryId(source),
                        'appVersion',
                        ($event.target as HTMLInputElement).value,
                      )
                    "
                    class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-black text-gray-900 dark:text-white transition-all"
                  />
                  <p
                    v-else
                    class="text-sm font-black text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-2xl transition-colors"
                  >
                    {{
                      asChangelog(localeEntriesMap[getEntryId(source)])?.appVersion ||
                      "—"
                    }}
                  </p>
                </div>
              </div>
              <!-- Changes Field -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <p
                    class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Original Changes
                  </p>
                  <div
                    class="text-xs font-medium text-gray-700 dark:text-slate-300 whitespace-pre-wrap p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl leading-relaxed transition-colors"
                  >
                    {{ asChangelog(source).changes }}
                  </div>
                </div>
                <div v-if="locale" class="space-y-2">
                  <p
                    class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"
                  >
                    {{ locale.toUpperCase() }} Translation
                  </p>
                  <textarea
                    v-if="!readOnly"
                    :value="
                      asChangelog(localeEntriesMap[getEntryId(source)])?.changes
                    "
                    @input="
                      onInput(
                        getEntryId(source),
                        'changes',
                        ($event.target as HTMLTextAreaElement).value,
                      )
                    "
                    rows="5"
                    class="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-gray-900 dark:text-slate-200 leading-relaxed transition-all"
                  ></textarea>
                  <div
                    v-else
                    class="text-xs font-mono text-gray-900 dark:text-slate-300 whitespace-pre-wrap p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl transition-colors"
                  >
                    {{
                      asChangelog(localeEntriesMap[getEntryId(source)])
                        ?.changes || "—"
                    }}
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="isFaq(source)">
            <div class="space-y-6">
              <!-- Title Field -->
              <div
                class="space-y-4 pb-4 border-b border-gray-50 dark:border-slate-800"
              >
                <div class="space-y-2">
                  <p
                    class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Original Title
                  </p>
                  <p
                    class="text-sm font-bold text-gray-900 dark:text-slate-200 leading-relaxed"
                  >
                    {{ asFaq(source).title }}
                  </p>
                </div>
                <div v-if="locale" class="space-y-2">
                  <p
                    class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"
                  >
                    {{ locale.toUpperCase() }} Title
                  </p>
                  <input
                    v-if="!readOnly"
                    type="text"
                    :value="asFaq(localeEntriesMap[getEntryId(source)])?.title"
                    @input="
                      onInput(
                        getEntryId(source),
                        'title',
                        ($event.target as HTMLInputElement).value,
                      )
                    "
                    class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-black text-gray-900 dark:text-white transition-all"
                  />
                  <p
                    v-else
                    class="text-sm font-black text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-2xl transition-colors"
                  >
                    {{
                      asFaq(localeEntriesMap[getEntryId(source)])?.title || "—"
                    }}
                  </p>
                </div>
              </div>
              <!-- Content Field -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <p
                    class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest"
                  >
                    Original Content
                  </p>
                  <p
                    class="text-xs font-medium text-gray-600 dark:text-slate-400 leading-relaxed"
                  >
                    {{ asFaq(source).content }}
                  </p>
                </div>
                <div v-if="locale" class="space-y-2">
                  <p
                    class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"
                  >
                    {{ locale.toUpperCase() }} Content
                  </p>
                  <textarea
                    v-if="!readOnly"
                    :value="asFaq(localeEntriesMap[getEntryId(source)])?.content"
                    @input="
                      onInput(
                        getEntryId(source),
                        'content',
                        ($event.target as HTMLTextAreaElement).value,
                      )
                    "
                    rows="4"
                    class="w-full p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-gray-900 dark:text-slate-200 leading-relaxed transition-all"
                  ></textarea>
                  <p
                    v-else
                    class="text-xs font-medium text-gray-700 dark:text-slate-400 bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-2xl leading-relaxed transition-colors"
                  >
                    {{
                      asFaq(localeEntriesMap[getEntryId(source)])?.content || "—"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
