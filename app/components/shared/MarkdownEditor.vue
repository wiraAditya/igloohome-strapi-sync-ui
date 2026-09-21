<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { marked } from "marked";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    rows?: number;
  }>(),
  {
    placeholder: "",
    rows: 5,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement>();
const mode = ref<"edit" | "preview">("edit");

const renderedHtml = computed(() => marked.parse(props.modelValue || "", { async: false }) as string);

const wrapSelection = (before: string, after: string, placeholder: string) => {
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = props.modelValue;
  const selected = value.slice(start, end) || placeholder;
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
  emit("update:modelValue", newValue);
  nextTick(() => {
    el.focus();
    const cursorStart = start + before.length;
    el.setSelectionRange(cursorStart, cursorStart + selected.length);
  });
};

const prefixLines = (prefix: string) => {
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = props.modelValue;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const prefixed = block
    .split("\n")
    .map((line) => prefix + line)
    .join("\n");
  const newValue = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
  emit("update:modelValue", newValue);
  nextTick(() => {
    el.focus();
    el.setSelectionRange(lineStart, lineStart + prefixed.length);
  });
};

const applyBold = () => wrapSelection("**", "**", "bold text");
const applyItalic = () => wrapSelection("_", "_", "italic text");
const applyUnderline = () => wrapSelection("<u>", "</u>", "underlined text");
const applyStrikethrough = () => wrapSelection("~~", "~~", "strikethrough text");
const applyCode = () => wrapSelection("`", "`", "code");
const applyLink = () => wrapSelection("[", "](https://)", "link text");
const applyBulletList = () => prefixLines("- ");
const applyNumberedList = () => prefixLines("1. ");
const applyQuote = () => prefixLines("> ");
</script>

<template>
  <div
    class="border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 shadow-sm overflow-hidden"
  >
    <div
      class="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/40"
    >
      <div class="flex items-center gap-1 flex-wrap">
        <button
          type="button"
          @click="applyBold"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          @click="applyItalic"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-sm italic font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          @click="applyUnderline"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold underline text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Underline"
        >
          U
        </button>

        <div class="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1" />

        <button
          type="button"
          @click="applyStrikethrough"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Strikethrough"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <path d="M16 6.5c-1-1-2.5-1.5-4-1.5-2.5 0-4 1-4 2.5 0 1 .5 1.7 1.5 2.2" />
            <path d="M8 17.5c1 1 2.5 1.5 4 1.5 2.5 0 4-1 4-2.7 0-1-.5-1.6-1.3-2" />
          </svg>
        </button>
        <button
          type="button"
          @click="applyCode"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Code"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </button>
        <button
          type="button"
          @click="applyLink"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 15l6-6" />
            <path d="M11 6l1-1a4 4 0 1 1 6 6l-1 1" />
            <path d="M13 18l-1 1a4 4 0 1 1-6-6l1-1" />
          </svg>
        </button>
        <button
          type="button"
          @click="applyBulletList"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Bullet list"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none" />
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <button
          type="button"
          @click="applyNumberedList"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Numbered list"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </button>
        <button
          type="button"
          @click="applyQuote"
          :disabled="mode === 'preview'"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Quote"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="6" y1="5" x2="6" y2="19" stroke-width="3" />
            <line x1="10" y1="7" x2="19" y2="7" />
            <line x1="10" y1="12" x2="19" y2="12" />
            <line x1="10" y1="17" x2="15" y2="17" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        @click="mode = mode === 'edit' ? 'preview' : 'edit'"
        class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-800 transition-colors"
      >
        {{ mode === "edit" ? "Preview mode" : "Edit mode" }}
      </button>
    </div>

    <textarea
      v-if="mode === 'edit'"
      ref="textareaRef"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :rows="rows"
      :placeholder="placeholder"
      class="w-full px-4 py-3 bg-transparent text-sm text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700 resize-none"
    ></textarea>
    <div
      v-else
      class="markdown-body text-gray-900 dark:text-white px-4 py-3 min-h-30"
      v-html="renderedHtml"
    ></div>
  </div>
</template>
