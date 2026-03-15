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
  <div class="overflow-x-auto border rounded-lg">
    <div class="max-h-[500px] overflow-y-auto">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="sticky top-0 bg-gray-50 z-10 border-b">
          <tr>
            <th class="px-4 py-3 font-semibold text-gray-900 w-16">ID</th>

            <template v-if="type === 'categories'">
              <th class="px-4 py-3 font-semibold text-gray-900">Category (EN)</th>
              <th v-if="locale" class="px-4 py-3 font-semibold text-gray-900">
                Category ({{ locale }})
              </th>
            </template>

            <template v-else-if="type === 'changelogs'">
              <th class="px-4 py-3 font-semibold text-gray-900 w-24">Version</th>
              <th class="px-4 py-3 font-semibold text-gray-900">Changes (EN)</th>
              <th v-if="locale" class="px-4 py-3 font-semibold text-gray-900">
                Changes ({{ locale }})
              </th>
            </template>

            <template v-else-if="type === 'faqs'">
              <th class="px-4 py-3 font-semibold text-gray-900">Title / Content (EN)</th>
              <th v-if="locale" class="px-4 py-3 font-semibold text-gray-900">
                Title / Content ({{ locale }})
              </th>
            </template>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="source in sourceEntries"
            :key="getEntryId(source)"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-4 text-gray-500 align-top">{{ getEntryId(source) }}</td>

            <!-- Categories -->
            <template v-if="isCategory(source)">
              <td class="px-4 py-4 text-gray-900 align-top">
                {{ asCategory(source).category }}
              </td>
              <td v-if="locale" class="px-4 py-4 align-top">
                <textarea
                  v-if="!readOnly"
                  :value="asCategory(getLocaleEntry(getEntryId(source)))?.category"
                  @input="
                    onInput(
                      getEntryId(source),
                      'category',
                      ($event.target as any).value
                    )
                  "
                  rows="2"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Translated category name"
                ></textarea>
                <div v-else class="text-gray-900">
                  {{ asCategory(getLocaleEntry(getEntryId(source)))?.category }}
                </div>
              </td>
            </template>

            <!-- Changelogs -->
            <template v-else-if="isChangelog(source)">
              <td class="px-4 py-4 text-gray-900 align-top font-mono text-xs">
                {{ asChangelog(source).appVersion }}
              </td>
              <td class="px-4 py-4 text-gray-900 align-top">
                <div class="whitespace-pre-wrap">{{ asChangelog(source).changes }}</div>
              </td>
              <td v-if="locale" class="px-4 py-4 align-top">
                <textarea
                  v-if="!readOnly"
                  :value="asChangelog(getLocaleEntry(getEntryId(source)))?.changes"
                  @input="
                    onInput(
                      getEntryId(source),
                      'changes',
                      ($event.target as any).value
                    )
                  "
                  rows="4"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs font-mono"
                  placeholder="Translated changes"
                ></textarea>
                <div v-else class="text-gray-900 whitespace-pre-wrap text-xs">
                  {{ asChangelog(getLocaleEntry(getEntryId(source)))?.changes }}
                </div>
              </td>
            </template>

            <!-- FAQs -->
            <template v-else-if="isFaq(source)">
              <td class="px-4 py-4 text-gray-900 align-top">
                <div class="font-medium mb-1">{{ asFaq(source).title }}</div>
                <div class="text-xs text-gray-500 line-clamp-2">{{ asFaq(source).content }}</div>
              </td>
              <td v-if="locale" class="px-4 py-4 align-top">
                <div v-if="!readOnly" class="space-y-2">
                  <input
                    type="text"
                    :value="asFaq(getLocaleEntry(getEntryId(source)))?.title"
                    @input="
                      onInput(
                        getEntryId(source),
                        'title',
                        ($event.target as any).value
                      )
                    "
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Translated title"
                  />
                  <textarea
                    :value="asFaq(getLocaleEntry(getEntryId(source)))?.content"
                    @input="
                      onInput(
                        getEntryId(source),
                        'content',
                        ($event.target as any).value
                      )
                    "
                    rows="3"
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs"
                    placeholder="Translated content"
                  ></textarea>
                </div>
                <div v-else class="text-gray-900">
                  <div class="font-medium mb-1">
                    {{ asFaq(getLocaleEntry(getEntryId(source)))?.title }}
                  </div>
                  <div class="text-xs text-gray-500">
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
