# agents.md — igloo-strappy-content UI

## Agent Execution Rules

> **These rules override any default agent behaviour. Read them first.**

- **Auto-continue between phases.** When a phase is complete, immediately begin the next phase without pausing, summarising, or asking for confirmation. Never say "Phase X is done, shall I continue?" — just continue.
- **Auto-continue within a phase.** Complete every checklist item in a phase before moving on. Do not stop after a single task to report progress.
- **Only stop** if you hit a genuine blocker: a missing value in `.env.example` that cannot be inferred, an ambiguous Strapi field name found in `refs/` that has multiple plausible interpretations, or a runtime error that prevents the next step from working. In those cases, state the specific blocker and wait.
- **Commit after each phase**, not after each file.
- **Do not ask permission** to create files, install packages, or make implementation choices that are already specified in this document.

---

## Project Overview

This is a **Nuxt 4** web application that provides a UI to manage i18n content between a **Strapi CMS** and translation JSON files. It replaces a legacy Node.js CLI workflow with a browser-based interface and adds **AI-powered translation via Google Gemini**.

> **No database. No persistence.** This is a one-time-session tool. All state lives in Pinia (in-memory) for the lifetime of the browser session. Refreshing the page resets everything. There is no need for any database, localStorage, file system writes, or session storage.
>
> **Sync to Strapi is always manual.** There is no auto-push, no auto-sync, no background job. The user must explicitly press **[Sync to Strapi]** to write anything back. The app never calls the Strapi write API unless the user initiates it.
>
> **Do NOT replicate the refs flow.** The `refs/igloo-strappy-content/` code runs all three content types in one batch CLI process. This UI treats each content type as a completely independent workflow with its own dedicated page, steps, and actions.

The reference TypeScript implementation lives in `refs/igloo-strappy-content/`. Read it to understand the Strapi data model, field names, and API shape — but **do not copy its batch flow or CLI structure**.

Do **not** delete or modify files inside `refs/`. Treat them as read-only references.

---

## Architecture Decision: No Server API Layer

**Strapi and Gemini are called directly from the browser via composables.** There are no Nuxt server routes (`server/api/`). This is intentional — this is an internal tool running locally, so exposing tokens client-side is acceptable.

Tokens are loaded from **runtime config** using `useRuntimeConfig()` in composables. In `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      strapiBaseUrl: process.env.STRAPI_BASE_URL,
      strapiApiToken: process.env.STRAPI_API_TOKEN,
      geminiApiKey: process.env.GEMINI_API_KEY,
    }
  }
})
```

All API calls go directly from the browser:
- `useStrapi.ts` → calls Strapi REST API directly with `$fetch`
- `useGemini.ts` → calls `https://generativelanguage.googleapis.com` directly with `$fetch`

No `server/` directory is needed. Do not create one.

---

## Tech Stack

- **Framework**: Nuxt 4 (with `app/` directory structure)
- **Language**: TypeScript throughout
- **Styling**: Tailwind CSS v4
- **State**: Pinia
- **AI Translation**: Google Gemini API — called directly from browser
- **HTTP Client**: `$fetch` / `ofetch` (Nuxt built-in)
- **Zip downloads**: `jszip` (client-side only)
- **CMS**: Strapi REST API — called directly from browser

---

## Environment Variables

```env
STRAPI_BASE_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your_strapi_api_token
GEMINI_API_KEY=your_gemini_api_key
```

Accessed in composables via:
```typescript
const config = useRuntimeConfig()
config.public.strapiBaseUrl
config.public.strapiApiToken
config.public.geminiApiKey
```

---

## Supported Languages

`en` is always the source. The 19 target locales:

| Code    | Language             |
|---------|----------------------|
| `cs`    | Czech                |
| `da`    | Danish               |
| `de`    | German               |
| `el`    | Greek                |
| `es`    | Spanish              |
| `fi`    | Finnish              |
| `fr`    | French               |
| `hu`    | Hungarian            |
| `id`    | Indonesian           |
| `it`    | Italian              |
| `ja`    | Japanese             |
| `nb`    | Norwegian Bokmål     |
| `nb_no` | Norwegian Bokmål NO  |
| `pt`    | Portuguese           |
| `sk`    | Slovak               |
| `sv`    | Swedish              |
| `th`    | Thai                 |
| `vi`    | Vietnamese           |
| `zh`    | Chinese (Simplified) |

---

## Strapi Content Types

Exactly **three content types**, each fully independent. Entries are identified by **numeric `id`** — there are no slugs anywhere in this project.

| Content Type | Strapi Collection | Page route    | Translatable fields     |
|--------------|-------------------|---------------|-------------------------|
| Categories   | `categories`      | `/categories` | `category`              |
| Changelogs   | `changelogs`      | `/changelogs` | `changes`               |
| FAQs         | `faqs`            | `/faqs`       | `title`, `content`      |

### Exact Strapi entry shapes

**Categories:**
```json
[
  { "id": "1", "category": "Smart Lock" },
  { "id": "2", "category": "Access Control" }
]
```

**Changelogs:**
```json
[
  {
    "id": "379",
    "appVersion": "3.2.3",
    "changes": "- Fixed lockbox autorelock settings\n- Fixed copy for Switch firmware update",
    "releaseDate": ""
  }
]
```

**FAQs:**
```json
[
  {
    "id": "1",
    "title": "How do I transfer ownership from one account to another?",
    "category": "1",
    "content": "To transfer ownership of the lock, you will need the consent of the previous owner."
  }
]
```

### Translation output structure

Translated JSON must **preserve the exact same object structure** as the source. Only the translatable fields are replaced with translated values. All other fields (`id`, `appVersion`, `releaseDate`, `category` on FAQs, etc.) are carried over unchanged.

**Example — translated Categories (de):**
```json
[
  { "id": "1", "category": "Intelligentes Schloss" },
  { "id": "2", "category": "Zugangskontrolle" }
]
```

**Example — translated Changelogs (de):**
```json
[
  {
    "id": "379",
    "appVersion": "3.2.3",
    "changes": "- Automatisches Wiederverriegeln des Schlüsselfachs behoben\n- Kopiertext für Switch-Firmware-Update behoben",
    "releaseDate": ""
  }
]
```

**Example — translated FAQs (de):**
```json
[
  {
    "id": "1",
    "title": "Wie übertrage ich das Eigentum von einem Konto auf ein anderes?",
    "category": "1",
    "content": "Um das Eigentum am Schloss zu übertragen, benötigen Sie die Zustimmung des bisherigen Eigentümers."
  }
]
```

### Key rules for data handling
- **Never use flat key-value JSON internally.** The in-memory store holds the full entry arrays, not flattened key maps.
- **`en.json` download** is the full source array for that content type — same structure as Strapi returns, nothing flattened.
- **Translated download** per locale is the full array with only translatable fields replaced.
- Non-translatable fields are copied as-is: `id`, `appVersion`, `releaseDate` (changelogs), `category` (faqs — the numeric reference, not the text).
- Entry order in the output array must match the source order.

---

## Application Routes & Navigation

```
/             → Dashboard — overview of all 3 content types with session status
/categories   → Categories workflow page
/changelogs   → Changelogs workflow page
/faqs         → FAQs workflow page
/settings     → Runtime config display + Strapi connection test
```

Persistent top nav links to all routes. Each content type page has fully isolated state.

---

## Project Structure

```
app/
  components/
    shared/
      StepCard.vue                # Workflow step wrapper (number, title, locked state)
      StatusBadge.vue             # missing / ai-generated / manual / translated
      DownloadButton.vue          # Client-side JSON download trigger
      LocaleStatusGrid.vue        # 19-locale grid with completion % and dots
      TranslationTable.vue        # Key | English | Locale value | Status (read-only or editable)
      UploadFileModal.vue         # Upload translator .json with preview
      TranslationPreviewModal.vue # Per-locale preview + download + sync
      SyncConfirmModal.vue        # Confirmation before syncing to Strapi
      ProgressBar.vue             # Generic progress bar
    nav/
      AppNav.vue                  # Top nav

  pages/
    index.vue                     # Dashboard
    categories.vue                # Categories 6-step workflow
    changelogs.vue                # Changelogs 6-step workflow
    faqs.vue                      # FAQs 6-step workflow
    settings.vue                  # Config display + connection test

  stores/
    categories.ts                 # Pinia store — Categories only, in-memory
    changelogs.ts                 # Pinia store — Changelogs only, in-memory
    faqs.ts                       # Pinia store — FAQs only, in-memory
    ui.ts                         # Global toasts + loading state

  composables/
    useStrapi.ts                  # Direct Strapi REST calls via $fetch
    useGemini.ts                  # Direct Gemini API calls via $fetch, with progress tracking
    useContentType.ts             # Factory — binds correct store + composables to a content type
    useDownload.ts                # downloadJson() and downloadZip()

types/
  translations.ts                 # Shared TypeScript types

nuxt.config.ts                    # runtimeConfig.public for all tokens
.env.example
```

---

## Composables Spec

### `useStrapi.ts`

Calls Strapi REST API directly. Reads config from `useRuntimeConfig().public`.

```typescript
// Shared entry types
interface CategoryEntry   { id: string; category: string }
interface ChangelogEntry  { id: string; appVersion: string; changes: string; releaseDate: string }
interface FaqEntry        { id: string; title: string; category: string; content: string }
type StrapiEntry = CategoryEntry | ChangelogEntry | FaqEntry

// Fetch ALL entries for a content type, handling Strapi pagination automatically.
// Keeps fetching ?pagination[page]=N until pagination.pageCount is exhausted.
async function fetchCollection(type: ContentType): Promise<StrapiEntry[]>

// Extract only the translatable field values from an entry array as a plain string array,
// used to build the text payload sent to Gemini.
// Categories  → [entry.category, ...]
// Changelogs  → [entry.changes, ...]
// FAQs        → [entry.title, entry.content, ...] (interleaved: title then content per entry)
function extractTranslatableFields(type: ContentType, entries: StrapiEntry[]): string[]

// Merge translated strings back into a full entry array, preserving all non-translatable fields.
// The translatedValues array must be in the same order as extractTranslatableFields returned.
function mergeTranslations(
  type: ContentType,
  sourceEntries: StrapiEntry[],
  translatedValues: string[]
): StrapiEntry[]

// Push a translated entry array back to Strapi for a given locale.
// Iterates entries and calls PUT /api/{collection}/{id} for each, passing only translatable fields.
async function pushLocaleToStrapi(
  type: ContentType,
  locale: string,
  translatedEntries: StrapiEntry[]
): Promise<{ synced: number; failed: number; errors: string[] }>
```

Pagination: Strapi returns 25 results by default. Keep fetching `?pagination[page]=N` until `pagination.pageCount` is reached.

**Strapi push call shape** — only send the translatable fields per type:
- Categories: `PUT /api/categories/{id}` body: `{ data: { category: "..." } }`
- Changelogs: `PUT /api/changelogs/{id}` body: `{ data: { changes: "..." } }`
- FAQs: `PUT /api/faqs/{id}` body: `{ data: { title: "...", content: "..." } }`

### `useGemini.ts`

Calls Gemini API directly. Reads `geminiApiKey` from `useRuntimeConfig().public`.

Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API_KEY}`

```typescript
// Translate an array of plain strings for a single locale.
// Input is the output of useStrapi.extractTranslatableFields().
// Returns translated strings in the exact same order and count.
// Batches at 200 strings if needed, reassembles in order.
async function translateStrings(
  values: string[],
  targetLocale: string,
  contentType: ContentType,
  onProgress?: (done: number, total: number) => void
): Promise<string[]>

// Translate for multiple locales sequentially to avoid Gemini rate limits.
// Returns a map of locale → translated string array (same order as input values).
async function translateAllLocales(
  values: string[],
  targetLocales: string[],
  contentType: ContentType,
  onLocaleProgress?: (locale: string, status: 'running' | 'done' | 'error', error?: string) => void
): Promise<Record<string, string[]>>
```

**Gemini prompt** (build this string in `useGemini.ts`):

```
You are a professional software localisation translator.
Translate the following JSON array of strings from English to {TARGET_LANGUAGE_NAME} ({TARGET_LOCALE_CODE}).
This content is from a SaaS product's {CONTENT_TYPE} section.

Rules:
- Return ONLY a valid JSON array of strings. No markdown, no explanation, no code fences.
- The output array MUST have exactly the same number of elements as the input array.
- Translate each string at the same index; do not merge, split, skip, or reorder elements.
- Do NOT translate interpolation placeholders: {variable}, %s, %d, {{var}}, %(name)s
- Preserve newlines (\n) exactly as they appear in the source strings.
- Preserve capitalisation style (ALL CAPS stays ALL CAPS, Title Case stays Title Case).
- For categories: translate short UI labels concisely.
- For changelogs: translate product update prose naturally; preserve version numbers, app version strings, and product names exactly.
- For faqs: translate question-and-answer pairs clearly; keep the question mark.

Input JSON array:
{INPUT_JSON_ARRAY}
```

Parse the response as `JSON.parse(response)` and validate it is an array of strings with the **exact same length** as the input. If length mismatches or parse fails, retry once with: `IMPORTANT: Your previous response was invalid. Return ONLY a JSON array of strings with exactly {N} elements, nothing else.` If retry fails, mark that locale as error.

### `useContentType.ts`

Factory composable. Accepts `'categories' | 'changelogs' | 'faqs'` and returns the correct store + bound composable methods so page components stay thin and don't contain duplicate logic.

```typescript
function useContentType(type: ContentType) {
  const store = type === 'categories'
    ? useCategoriesStore()
    : type === 'changelogs'
    ? useChangelogsStore()
    : useFaqsStore()

  return {
    store,
    // Fetch from Strapi → store in store.sourceEntries
    pull: async () => {
      const entries = await useStrapi().fetchCollection(type)
      store.setSource(entries)
    },
    // Extract translatable strings → send to Gemini → merge back → store locale entries
    aiTranslate: async (locales: string[]) => {
      const values = useStrapi().extractTranslatableFields(type, store.sourceEntries)
      await useGemini().translateAllLocales(values, locales, type, (locale, status) => {
        store.setLocaleJobStatus(locale, status)
      })
      // For each completed locale, merge translated strings back into full entry arrays
    },
    // Push stored locale entry array directly to Strapi
    syncToStrapi: async (locale: string) => {
      return useStrapi().pushLocaleToStrapi(type, locale, store.localeEntries[locale])
    },
  }
}
```

### `useDownload.ts`

```typescript
// Single file — pure client-side, no server needed
function downloadJson(filename: string, data: Record<string, string>): void

// All locales as a zip — uses JSZip
async function downloadZip(
  filenamePrefix: string,
  localeMap: Record<string, Record<string, string>>
): Promise<void>
```

---

## Per-Content-Type Store Shape

All three stores (`categories.ts`, `changelogs.ts`, `faqs.ts`) share **identical interface, isolated state**.

```typescript
type LocaleJobStatus = 'idle' | 'running' | 'done' | 'error'
type TranslationSource = 'ai-generated' | 'manual'

interface ContentTypeState {
  // Source data — full entry array exactly as returned from Strapi
  sourceEntries: StrapiEntry[]
  isPulled: boolean

  // Translated data — full entry arrays with translatable fields replaced, keyed by locale
  localeEntries: Record<string, StrapiEntry[]>
  localeSource: Record<string, TranslationSource>   // how each locale's data was produced
  localeJobStatus: Record<string, LocaleJobStatus>
  translationProgress: { current: number; total: number }

  syncedLocales: Record<string, { at: string; count: number }>
}
```

Actions:
- `setSource(entries)` — stores fetched Strapi entries, resets all translation state, sets `isPulled = true`
- `setLocaleEntries(locale, entries, source)` — stores translated entry array for a locale
- `setLocaleJobStatus(locale, status)` — updates job status for a locale
- `setProgress(current, total)` — updates progress counter
- `markSynced(locale, count)` — records sync timestamp + count
- `reset()` — clears all state

**There are no flat key maps in the store.** The store holds full `StrapiEntry[]` arrays throughout. Flattening is never done — `en.json` download and translated downloads both output the full entry array structure.

---

## Workflow Page Spec

**All three content type pages follow the same 6-step layout.** Steps are stacked cards, all visible simultaneously. A step is locked (greyed, lock icon, "Complete the previous step first") until its prerequisite is met. Use `useContentType(type)` to wire everything — do not duplicate logic across the three pages.

---

### Step 1 — Generate Source JSON

**Prerequisite:** none
**Unlocks:** Steps 2, 3, 5

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1  Generate Source JSON                               │
│  ─────────────────────────────────────────────────────────  │
│  Fetch all [Categories] from Strapi and generate en.json.   │
│                                                             │
│  [Generate en.json]                                         │
│                                                             │
│  ✓ 42 keys generated from 14 entries        [↓ en.json]    │
└─────────────────────────────────────────────────────────────┘
```

- **[Generate en.json]** calls `useContentType(type).pull()` — fetches directly from Strapi via `useStrapi`
- Shows spinner on button while loading
- On success: key count + entry count inline; **[↓ en.json]** download button appears (client-side, `useDownload.downloadJson`)
- Filename: `{type}-en.json` (e.g. `categories-en.json`). Content is the full `sourceEntries` array — same structure as Strapi, no flattening.
- Re-pulling resets Steps 3–6 state + shows inline warning: "Re-generating will clear existing translations for this session."
- On error: inline error message + Retry

---

### Step 2 — Review Source Keys

**Prerequisite:** `isPulled === true`

```
┌─────────────────────────────────────────────────────────────┐
│  Step 2  Review Source Keys                                 │
│  ─────────────────────────────────────────────────────────  │
│  42 keys ready for translation                              │
│  ┌──────────────────────────────────────────┐              │
│  │ ID   │ Field    │ English value                  │              │
│  │ 1    │ category │ Smart Lock                     │              │
│  │ 2    │ category │ Access Control                 │              │
│  └──────────────────────────────────────────┘              │
│  (read-only, scrollable, max 8 rows before scroll)          │
└─────────────────────────────────────────────────────────────┘
```

- Read-only `TranslationTable` showing `sourceKeys`
- No editing — source always comes from Strapi

---

### Step 3 — Generate AI Translations

**Prerequisite:** `isPulled === true`

```
┌─────────────────────────────────────────────────────────────┐
│  Step 3  Generate AI Translations                           │
│  ─────────────────────────────────────────────────────────  │
│  [✓ Select All]  [✗ Clear]                                  │
│  ☑ cs  ☑ da  ☑ de  ☑ el  ☑ es  ☑ fi  ☑ fr  ☑ hu          │
│  ☑ id  ☑ it  ☑ ja  ☑ nb  ☑ nb_no ☑ pt  ☑ sk  ☑ sv        │
│  ☑ th  ☑ vi  ☑ zh                                          │
│                                                             │
│  [Generate Translations]                                    │
│                                                             │
│  ████████████░░░░░░  12/19 locales                          │
│  ✓ cs  ✓ da  ✓ de  ✓ el  ✓ es  ✓ fi  ✓ fr  ✓ hu           │
│  ✓ id  ✓ it  ✓ ja  ✓ nb  ⟳ nb_no ...                      │
└─────────────────────────────────────────────────────────────┘
```

- Locales default to all selected
- **[Generate Translations]** calls `useContentType(type).aiTranslate(selectedLocales)` — calls Gemini directly via `useGemini`
- `ProgressBar` updates live: `{n}/{total} locales`
- Each locale gets a live status icon: ⟳ running / ✓ done / ✗ error
- Failed locales show a per-locale **[Retry]** after job completes
- On completion, Step 4 unlocks

---

### Step 4 — Preview & Download Translations

**Prerequisite:** At least one locale has `localeJobStatus === 'done'`

```
┌─────────────────────────────────────────────────────────────┐
│  Step 4  Preview & Download Translations                    │
│  ─────────────────────────────────────────────────────────  │
│                              [↓ Download All (.zip)]        │
│  ┌────────────────┬──────────────────────────────────────┐ │
│  │ ✓ cs  [↓]     │ Showing: Czech (cs)    [↓ cs.json]   │ │
│  │ ✓ da  [↓]     │                                      │ │
│  │ ✗ el  [retry] │ Key               │ Translated        │ │
│  │ ✓ es  [↓]     │ categories.x.name │ Název kategorie  │ │
│  │ ...            │ ...               │ ...              │ │
│  └────────────────┴──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- Two-panel layout inside `TranslationPreviewModal` embedded inline (not a popup)
- Left: locale list with ✓/✗ and per-locale **[↓]** download (`{type}-{locale}.json`)
- Right: scrollable table Key | English | Translated value for selected locale
- **[↓ Download All (.zip)]** — all successful locales into `{type}-translations.zip` via `useDownload.downloadZip`
- Failed locales: **[retry]** re-runs Gemini for that locale only

---

### Step 5 — Upload Manual Translation *(optional)*

**Prerequisite:** `isPulled === true`

```
┌─────────────────────────────────────────────────────────────┐
│  Step 5  Upload Manual Translation  (optional)              │
│  ─────────────────────────────────────────────────────────  │
│  Have a file from a translator? Upload it here.             │
│  Keys are merged with existing AI translations.             │
│                                                             │
│  [Upload .json file]                                        │
│                                                             │
│  ✓ ja — 42 keys loaded (manual)                            │
└─────────────────────────────────────────────────────────────┘
```

- File parsed entirely in the browser (no server route): `JSON.parse(await file.text())`
- Flatten nested keys with dot notation if needed
- Detect locale from filename (`fr.json` → `fr`)
- Show `UploadFileModal` preview: filename, detected locale, key count, 5 sample pairs, locale selector
- On confirm: `store.setTranslation(locale, keys, 'manual')`
- Keys not present in `sourceKeys` are dropped with inline warning: "{n} unknown keys skipped"
- Multiple uploads for different locales are cumulative

---

### Step 6 — Sync to Strapi

**Prerequisite:** At least one locale has data in `localeTranslations`

```
┌─────────────────────────────────────────────────────────────┐
│  Step 6  Sync to Strapi                                     │
│  ─────────────────────────────────────────────────────────  │
│  Locale         Keys    Source      Action                  │
│  ────────────────────────────────────────────────────────── │
│  cs Czech       42      AI          [Sync to Strapi]        │
│  da Danish      42      AI          [Sync to Strapi]        │
│  de German      42      AI          ✓ Synced  14:32         │
│  el Greek        0      —           (no data)               │
│  ja Japanese    42      manual      [Sync to Strapi]        │
└─────────────────────────────────────────────────────────────┘
```

- One row per locale; locales with zero keys show "(no data)", no button
- **[Sync to Strapi]** opens `SyncConfirmModal`:
  > "You are about to sync **Czech (cs)** — **42 keys** — to Strapi under **Categories**. This will overwrite existing content. Continue?"
- On confirm: calls `useContentType(type).syncToStrapi(locale)` → `useStrapi().pushLocaleToStrapi(...)` directly to Strapi
- On success: button → "✓ Synced HH:MM"; calls `store.markSynced(locale, count)`; button remains clickable to re-sync
- On failure: inline error + Retry
- **Never auto-sync.** No watcher, no lifecycle hook, no "sync all" button.

---

## Dashboard Page (`/`)

Three summary cards, one per content type:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  📁 Categories  │  │  📋 Changelogs  │  │  ❓ FAQs        │
│                 │  │                 │  │                 │
│  ○ Not pulled   │  │  ✓ 42 keys      │  │  ○ Not pulled   │
│  0/19 locales   │  │  17/19 locales  │  │  0/19 locales   │
│  0 synced       │  │  3 synced       │  │  0 synced       │
│                 │  │                 │  │                 │
│  [Go →]         │  │  [Go →]         │  │  [Go →]         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Reads live from the three stores.

---

## Settings Page (`/settings`)

- Displays current runtime config values masked: `••••••••1234`
- Instructions: "To change these values, edit `.env` and restart the dev server."
- **[Test Strapi Connection]** — calls `GET {STRAPI_BASE_URL}/api/categories?pagination[pageSize]=1` directly from browser, shows ✓ Connected or ✗ Failed + error detail

---

## Shared Components Spec

### `StepCard.vue`
Props: `stepNumber: number`, `title: string`, `description: string`, `locked: boolean`. Slot for content. When `locked`: grey background, lock icon, "Complete the previous step first." message; slot content hidden.

### `TranslationTable.vue`
Props: `sourceEntries: StrapiEntry[]`, `localeEntries: StrapiEntry[]`, `type: ContentType`, `locale: string`, `readonly: boolean`. Emits `update:entry` with `{ id, field, value }`. Columns depend on content type: Categories shows ID | category | translated category; Changelogs shows ID | appVersion | changes | translated changes; FAQs shows ID | title | content | translated title | translated content. Max 10 rows before scroll.

### `SyncConfirmModal.vue`
Props: `locale`, `keyCount`, `contentType`. Emits `confirm` / `cancel`.

### `TranslationPreviewModal.vue`
Props: `localeEntries: Record<string, StrapiEntry[]>`, `sourceEntries: StrapiEntry[]`, `contentType: ContentType`. Embedded inline in Step 4, not a popup overlay. Downloads output the full translated entry array as JSON.

### `UploadFileModal.vue`
File parsed in-browser. Props: `sourceEntries: StrapiEntry[]` (used to validate uploaded entry IDs match). Emits `loaded: { locale: string, entries: StrapiEntry[] }`. Uploaded file must be a JSON array matching the expected entry shape for this content type. Entries with IDs not found in `sourceEntries` are dropped with a count warning.

### `LocaleStatusGrid.vue`
19-locale compact grid. Each cell: locale code + dot (green ≥80%, yellow 1–79%, grey 0%) + %.

---

## Status Badges

| Status         | Colour | Meaning                                      |
|----------------|--------|----------------------------------------------|
| `missing`      | Red    | No translation value                         |
| `ai-generated` | Blue   | Produced by Gemini                           |
| `manual`       | Purple | Loaded from uploaded translator file         |
| `translated`   | Green  | Manually edited inline                       |

---

## Error Handling

- Strapi fetch failures: inline error in Step 1 with Retry button
- Gemini failures per locale: locale marked `error`; per-locale Retry in Steps 3 and 4; never fails the whole job
- Gemini invalid JSON: retry once with explicit reminder; if retry fails, mark locale as error
- Strapi push failures: show synced vs failed count inline in Step 6
- Upload parse failures: show error inside `UploadFileModal` before confirming
- All errors surface as toast notifications via `stores/ui.ts` in addition to inline display

---

## Coding Conventions

- `<script setup lang="ts">` in all Vue components
- No `server/` directory — all API calls are direct browser `$fetch` calls in composables
- No `zod` needed for server routes (there are none); use TypeScript types for composable I/O
- Tailwind utility classes only
- Components under 200 lines; split if larger
- Three content type pages share logic via `useContentType(type)` — zero duplicated page code
- Upload file parsing is done entirely in the browser with `FileReader` / `file.text()` — no upload endpoint

---

## Key Constraints & Gotchas

- **Never auto-sync.** No watchers, lifecycle hooks, or "save on edit" that call Strapi write endpoints.
- **Each content type is fully independent.** Stores are isolated; actions on one page never touch another.
- **No server directory.** Do not create `server/api/` or `server/utils/`. All logic lives in `app/composables/`.
- **Do not replicate the refs batch flow.** `refs/` processes all types together in CLI — this UI keeps them separate and user-driven.
- `nb` and `nb_no` are separate locale slots
- `zh` defaults to Simplified Chinese
- Interpolation variables `{name}`, `{{name}}`, `%s`, `%(name)s` in field values must not be translated
- Newlines (`\n`) inside `changes` field (changelogs) must be preserved exactly in translated output
- The `category` field on FAQ entries is a numeric ID reference — it must never be translated or modified
- Strapi pagination: fetch all pages per collection, never assume one page is complete
- Upload: entries with IDs not present in `sourceEntries` are dropped with a count warning

---

## Agent Task Checklist

**Auto-continue through all phases without stopping for confirmation.**

### Phase 1 — Foundation
- [ ] Read all files in `refs/igloo-strappy-content/`; document the Strapi data model, field names, localisable fields, and pagination shape for each of the three collections
- [ ] Create `types/translations.ts` — `ContentType`, `LocaleCode`, `KeyStatus`, `TranslationMap`, `ContentTypeState`
- [ ] Create `nuxt.config.ts` with `runtimeConfig.public` for all three tokens
- [ ] Create `.env.example`

### Phase 2 — Composables
- [ ] `composables/useStrapi.ts` — `fetchCollection`, `buildSourceJson`, `pushLocaleToStrapi` (direct `$fetch` to Strapi)
- [ ] `composables/useGemini.ts` — `translateLocale`, `translateAllLocales`, prompt builder, 200-key batching, retry logic (direct `$fetch` to Gemini)
- [ ] `composables/useDownload.ts` — `downloadJson`, `downloadZip` (JSZip)
- [ ] `composables/useContentType.ts` — factory composable binding store + composables to a type

### Phase 3 — Stores
- [ ] `stores/categories.ts` — full `ContentTypeState` + all actions
- [ ] `stores/changelogs.ts` — same shape, isolated
- [ ] `stores/faqs.ts` — same shape, isolated
- [ ] `stores/ui.ts` — toasts + global loading flag

### Phase 4 — Shared Components
- [ ] `StepCard.vue`
- [ ] `StatusBadge.vue`
- [ ] `DownloadButton.vue`
- [ ] `ProgressBar.vue`
- [ ] `TranslationTable.vue` (read-only + editable modes)
- [ ] `LocaleStatusGrid.vue`
- [ ] `SyncConfirmModal.vue`
- [ ] `UploadFileModal.vue` (browser-side file parsing, no upload endpoint)
- [ ] `TranslationPreviewModal.vue` (inline panel, not popup)
- [ ] `AppNav.vue`

### Phase 5 — Pages
- [ ] `pages/categories.vue` — all 6 steps via `useContentType('categories')`
- [ ] `pages/changelogs.vue` — all 6 steps via `useContentType('changelogs')`
- [ ] `pages/faqs.vue` — all 6 steps via `useContentType('faqs')`
- [ ] `pages/index.vue` — dashboard with 3 store-reactive summary cards
- [ ] `pages/settings.vue` — masked config display + Strapi connection test

### Phase 6 — Polish
- [ ] Locked step visual (grey + lock icon + message)
- [ ] Re-pull warning banner in Step 1 when `isPulled === true`
- [ ] Per-locale retry buttons in Steps 3 and 4
- [ ] Sync success state in Step 6 (✓ Synced + HH:MM timestamp)
- [ ] Toast notifications wired to all async actions
- [ ] Empty/idle state on dashboard cards when store is fresh
