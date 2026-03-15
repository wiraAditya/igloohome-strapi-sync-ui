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
  <div class="relative flex flex-col gap-4">
    <!-- Comparison View Table (Desktop/Tablet) -->
    <div class="hidden md:block overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">
      <div class="max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <table class="w-full text-sm text-left border-collapse table-fixed">
          <thead class="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-24">Entry ID</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Original Content (EN)</th>
              <th v-if="locale" class="px-6 py-4 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50/30">
                {{ locale.toUpperCase() }} Translation
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="source in sourceEntries"
              :key="getEntryId(source)"
              class="hover:bg-gray-50/50 transition-colors group"
            >
              <!-- ID Column -->
              <td class="px-6 py-8 align-top">
                <span class="text-[10px] font-black text-gray-300 tracking-widest bg-gray-50 px-2 py-1 rounded-md">{{ getEntryId(source) }}</span>
                
                <!-- Metadata if Changelog -->
                <div v-if="isChangelog(source)" class="mt-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-700 uppercase">
                    v{{ asChangelog(source).appVersion }}
                  </span>
                </div>
              </td>

              <!-- Source Column (EN) -->
              <td class="px-6 py-8 align-top">
                <div class="space-y-6">
                  <!-- Category Mapping -->
                  <div v-if="isCategory(source)" class="space-y-1">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-tight">Name</p>
                    <p class="text-sm font-bold text-gray-900 leading-relaxed">{{ asCategory(source).category }}</p>
                  </div>

                  <!-- Changelog Mapping -->
                  <div v-else-if="isChangelog(source)" class="space-y-1">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-tight">Changes</p>
                    <div class="text-xs font-medium text-gray-700 whitespace-pre-wrap leading-relaxed">{{ asChangelog(source).changes }}</div>
                  </div>

                  <!-- FAQ Mapping -->
                  <div v-else-if="isFaq(source)" class="space-y-4">
                    <div class="space-y-1">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-tight">Title</p>
                      <p class="text-sm font-bold text-gray-900 leading-relaxed">{{ asFaq(source).title }}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-tight">Content Body</p>
                      <p class="text-xs font-medium text-gray-600 leading-relaxed">{{ asFaq(source).content }}</p>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Target Column (Translation) -->
              <td v-if="locale" class="px-6 py-8 align-top bg-indigo-50/10">
                <div class="space-y-6">
                  <!-- Category Edit -->
                  <div v-if="isCategory(source)" class="space-y-2">
                    <div v-if="!readOnly" class="relative group/field">
                      <textarea
                        :value="asCategory(getLocaleEntry(getEntryId(source)))?.category"
                        @input="onInput(getEntryId(source), 'category', ($event.target as any).value)"
                        rows="2"
                        class="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        placeholder="Type translation..."
                      ></textarea>
                    </div>
                    <div v-else class="p-4 bg-white/50 border border-indigo-100 rounded-2xl text-sm font-bold text-indigo-700 leading-relaxed">
                      {{ asCategory(getLocaleEntry(getEntryId(source)))?.category || '—' }}
                    </div>
                  </div>

                  <!-- Changelog Edit -->
                  <div v-else-if="isChangelog(source)" class="space-y-2">
                    <div v-if="!readOnly" class="relative group/field">
                      <textarea
                        :value="asChangelog(getLocaleEntry(getEntryId(source)))?.changes"
                        @input="onInput(getEntryId(source), 'changes', ($event.target as any).value)"
                        rows="6"
                        class="w-full p-4 bg-white border border-gray-200 rounded-2xl text-xs font-mono leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        placeholder="Type translated changes..."
                      ></textarea>
                    </div>
                    <div v-else class="p-4 bg-white/50 border border-indigo-100 rounded-2xl text-xs font-mono text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {{ asChangelog(getLocaleEntry(getEntryId(source)))?.changes || '—' }}
                    </div>
                  </div>

                  <!-- FAQ Edit -->
                  <div v-else-if="isFaq(source)" class="space-y-4">
                    <div class="space-y-2">
                      <div v-if="!readOnly" class="relative group/field">
                        <input
                          type="text"
                          :value="asFaq(getLocaleEntry(getEntryId(source)))?.title"
                          @input="onInput(getEntryId(source), 'title', ($event.target as any).value)"
                          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                          placeholder="Translated Title"
                        />
                      </div>
                      <div v-else class="p-3 px-4 bg-white/50 border border-indigo-100 rounded-2xl text-sm font-black text-indigo-900">
                        {{ asFaq(getLocaleEntry(getEntryId(source)))?.title || '—' }}
                      </div>
                    </div>
                    <div class="space-y-2">
                      <div v-if="!readOnly" class="relative group/field">
                        <textarea
                          :value="asFaq(getLocaleEntry(getEntryId(source)))?.content"
                          @input="onInput(getEntryId(source), 'content', ($event.target as any).value)"
                          rows="4"
                          class="w-full p-4 bg-white border border-gray-200 rounded-2xl text-xs font-medium leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                          placeholder="Translated Content Body"
                        ></textarea>
                      </div>
                      <div v-else class="p-4 bg-white/50 border border-indigo-100 rounded-2xl text-xs font-medium text-gray-700 leading-relaxed">
                        {{ asFaq(getLocaleEntry(getEntryId(source)))?.content || '—' }}
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
        class="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm"
      >
        <!-- Card Header (ID + Meta) -->
        <div class="bg-gray-50 px-5 py-3 flex justify-between items-center border-b">
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Entry ID: {{ getEntryId(source) }}</span>
          <span v-if="isChangelog(source)" class="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-700 uppercase">v{{ asChangelog(source).appVersion }}</span>
        </div>

        <div class="p-5 space-y-8">
          <!-- Iterate Fields for this source -->
          <template v-if="isCategory(source)">
            <div class="space-y-4">
              <div class="space-y-2">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Name</p>
                <p class="text-sm font-bold text-gray-900 leading-relaxed p-3 bg-gray-50 rounded-2xl">{{ asCategory(source).category }}</p>
              </div>
              <div v-if="locale" class="space-y-2">
                <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{{ locale.toUpperCase() }} Translation</p>
                <textarea
                  v-if="!readOnly"
                  :value="asCategory(getLocaleEntry(getEntryId(source)))?.category"
                  @input="onInput(getEntryId(source), 'category', ($event.target as any).value)"
                  rows="2"
                  class="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                ></textarea>
                <p v-else class="text-sm font-bold text-indigo-700 bg-indigo-50 p-3 rounded-2xl">{{ asCategory(getLocaleEntry(getEntryId(source)))?.category || '—' }}</p>
              </div>
            </div>
          </template>

          <template v-else-if="isChangelog(source)">
            <div class="space-y-6">
              <div class="space-y-2">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Changes</p>
                <div class="text-xs font-medium text-gray-700 whitespace-pre-wrap p-3 bg-gray-50 rounded-2xl leading-relaxed">{{ asChangelog(source).changes }}</div>
              </div>
              <div v-if="locale" class="space-y-2">
                <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{{ locale.toUpperCase() }} Translation</p>
                <textarea
                  v-if="!readOnly"
                  :value="asChangelog(getLocaleEntry(getEntryId(source)))?.changes"
                  @input="onInput(getEntryId(source), 'changes', ($event.target as any).value)"
                  rows="5"
                  class="w-full p-4 bg-white border border-gray-200 rounded-2xl text-xs font-mono leading-relaxed"
                ></textarea>
                <div v-else class="text-xs font-mono text-gray-900 whitespace-pre-wrap p-3 bg-indigo-50 rounded-2xl">{{ asChangelog(getLocaleEntry(getEntryId(source)))?.changes || '—' }}</div>
              </div>
            </div>
          </template>

          <template v-else-if="isFaq(source)">
            <div class="space-y-6">
              <!-- Title Field -->
              <div class="space-y-4 pb-4 border-b border-gray-50">
                <div class="space-y-2">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Title</p>
                  <p class="text-sm font-bold text-gray-900 leading-relaxed">{{ asFaq(source).title }}</p>
                </div>
                <div v-if="locale" class="space-y-2">
                  <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{{ locale.toUpperCase() }} Title</p>
                  <input
                    v-if="!readOnly"
                    type="text"
                    :value="asFaq(getLocaleEntry(getEntryId(source)))?.title"
                    @input="onInput(getEntryId(source), 'title', ($event.target as any).value)"
                    class="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black"
                  />
                  <p v-else class="text-sm font-black text-indigo-900 bg-indigo-50 p-3 rounded-2xl">{{ asFaq(getLocaleEntry(getEntryId(source)))?.title || '—' }}</p>
                </div>
              </div>
              <!-- Content Field -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Content</p>
                  <p class="text-xs font-medium text-gray-600 leading-relaxed">{{ asFaq(source).content }}</p>
                </div>
                <div v-if="locale" class="space-y-2">
                  <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{{ locale.toUpperCase() }} Content</p>
                  <textarea
                    v-if="!readOnly"
                    :value="asFaq(getLocaleEntry(getEntryId(source)))?.content"
                    @input="onInput(getEntryId(source), 'content', ($event.target as any).value)"
                    rows="4"
                    class="w-full p-4 bg-white border border-gray-200 rounded-2xl text-xs font-medium leading-relaxed"
                  ></textarea>
                  <p v-else class="text-xs font-medium text-gray-700 bg-indigo-50 p-4 rounded-2xl leading-relaxed">{{ asFaq(getLocaleEntry(getEntryId(source)))?.content || '—' }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
