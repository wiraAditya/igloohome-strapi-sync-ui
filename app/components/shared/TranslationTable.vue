<script setup lang="ts">
import type {
  ContentType,
  StrapiEntry,
  CategoryEntry,
  ChangelogEntry,
  FaqEntry
} from '../../types/translations'

const props = defineProps<{
  sourceEntries: StrapiEntry[]
  localeEntries?: StrapiEntry[]
  type: ContentType
  locale?: string
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:entry', payload: { id: string; field: string; value: string }): void
}>()

const onInput = (id: string, field: string, value: string) => {
  emit('update:entry', { id, field, value })
}

const getEntryId = (entry: any): string => entry?.id || ''

const getLocaleEntry = (id: string) => {
  return props.localeEntries?.find((e: any) => e.id === id)
}

const isCategory = (entry: StrapiEntry): entry is CategoryEntry =>
  props.type === 'categories'
const isChangelog = (entry: StrapiEntry): entry is ChangelogEntry =>
  props.type === 'changelogs'
const isFaq = (entry: StrapiEntry): entry is FaqEntry => props.type === 'faqs'

// Helper to cast in script instead of template
const asCategory = (entry: any) => entry as CategoryEntry
const asChangelog = (entry: any) => entry as ChangelogEntry
const asFaq = (entry: any) => entry as FaqEntry
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl bg-white border border-gray-100">
    <div class="max-h-[600px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
      <table class="w-full text-sm text-left border-collapse min-w-[600px]">
        <thead class="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-gray-100 shadow-sm shadow-gray-500/5">
          <tr>
            <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-20">ID</th>

            <template v-if="type === 'categories'">
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source (EN)</th>
              <th v-if="locale" class="px-6 py-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                {{ locale.toUpperCase() }} Translation
              </th>
            </template>

            <template v-else-if="type === 'changelogs'">
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">Version</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Changes (EN)</th>
              <th v-if="locale" class="px-6 py-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                {{ locale.toUpperCase() }} Translation
              </th>
            </template>

            <template v-else-if="type === 'faqs'">
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Content (EN)</th>
              <th v-if="locale" class="px-6 py-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                {{ locale.toUpperCase() }} Translation
              </th>
            </template>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="source in sourceEntries"
            :key="getEntryId(source)"
            class="hover:bg-indigo-50/30 transition-colors group"
          >
            <td class="px-6 py-6 text-gray-400 align-top font-black text-[10px] tracking-widest">{{ getEntryId(source) }}</td>

            <!-- Categories -->
            <template v-if="isCategory(source)">
              <td class="px-6 py-6 text-gray-900 align-top font-bold">
                {{ asCategory(source).category }}
              </td>
              <td v-if="locale" class="px-6 py-6 align-top">
                <div v-if="!readOnly" class="relative">
                  <textarea
                    :value="asCategory(getLocaleEntry(getEntryId(source)))?.category"
                    @input="onInput(getEntryId(source), 'category', ($event.target as any).value)"
                    rows="2"
                    class="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm group-hover:border-indigo-200"
                    placeholder="Enter translation..."
                  ></textarea>
                </div>
                <div v-else class="text-indigo-700 font-bold bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                  {{ asCategory(getLocaleEntry(getEntryId(source)))?.category }}
                </div>
              </td>
            </template>

            <!-- Changelogs -->
            <template v-else-if="isChangelog(source)">
              <td class="px-6 py-6 align-top">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-[10px] font-black text-gray-600 uppercase tracking-tight">
                  v{{ asChangelog(source).appVersion }}
                </span>
              </td>
              <td class="px-6 py-6 text-gray-900 align-top max-w-md">
                <div class="whitespace-pre-wrap text-xs font-medium leading-relaxed">{{ asChangelog(source).changes }}</div>
              </td>
              <td v-if="locale" class="px-6 py-6 align-top">
                <div v-if="!readOnly">
                  <textarea
                    :value="asChangelog(getLocaleEntry(getEntryId(source)))?.changes"
                    @input="onInput(getEntryId(source), 'changes', ($event.target as any).value)"
                    rows="5"
                    class="w-full p-4 bg-white border border-gray-100 rounded-xl text-xs font-mono leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm group-hover:border-indigo-200"
                    placeholder="Enter translated changes..."
                  ></textarea>
                </div>
                <div v-else class="text-indigo-900 whitespace-pre-wrap text-xs font-mono bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/30 leading-relaxed">
                  {{ asChangelog(getLocaleEntry(getEntryId(source)))?.changes }}
                </div>
              </td>
            </template>

            <!-- FAQs -->
            <template v-else-if="isFaq(source)">
              <td class="px-6 py-6 text-gray-900 align-top max-w-sm">
                <div class="font-black text-sm mb-2 tracking-tight">{{ asFaq(source).title }}</div>
                <div class="text-xs font-medium text-gray-500 leading-relaxed">{{ asFaq(source).content }}</div>
              </td>
              <td v-if="locale" class="px-6 py-6 align-top">
                <div v-if="!readOnly" class="space-y-3">
                  <input
                    type="text"
                    :value="asFaq(getLocaleEntry(getEntryId(source)))?.title"
                    @input="onInput(getEntryId(source), 'title', ($event.target as any).value)"
                    class="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm group-hover:border-indigo-200"
                    placeholder="Translated Title"
                  />
                  <textarea
                    :value="asFaq(getLocaleEntry(getEntryId(source)))?.content"
                    @input="onInput(getEntryId(source), 'content', ($event.target as any).value)"
                    rows="3"
                    class="w-full p-4 bg-white border border-gray-100 rounded-xl text-xs font-medium leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm group-hover:border-indigo-200"
                    placeholder="Translated Content"
                  ></textarea>
                </div>
                <div v-else class="space-y-3 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/30">
                  <div class="font-black text-sm text-indigo-900 tracking-tight">
                    {{ asFaq(getLocaleEntry(getEntryId(source)))?.title }}
                  </div>
                  <div class="text-xs font-medium text-indigo-700/80 leading-relaxed">
                    {{ asFaq(getLocaleEntry(getEntryId(source)))?.content }}
                  </div>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
