# Agent Context & Engineering Standards

This document is the primary reference for AI agents and developers working on the **Strapi I18n Sync UI**. It defines the "Golden Rules", architectural boundaries, and specific implementation logic for the project.

---

## 🏗 Core Architecture
- **Framework**: Nuxt 4 (Source: `app/`, Server: `server/`)
- **Compatibility Mode**: `future: { compatibilityVersion: 4 }`
- **Frontend Engine**: Vite + Tailwind CSS v4 (Native Vite Plugin)
- **Dark Mode**: Integrated via `@nuxtjs/color-mode` (Class strategy).
- **State Management**: Pinia (Isolated stores: `auth`, `categories`, `changelogs`, `faqs`, `ui`)
- **API Strategy**: **Secure Nitro Proxy** (Mandatory for Hosting).
  - **Browser**: Calls local proxy routes (`/api/strapi`, `/api/gemini`, `/api/settings`, `/api/auth/login`, `/api/auth/logout`).
  - **Server (Nitro)**: Handles authentication, holds secrets, and forwards requests.
- **Type Safety**: **GraphQL Codegen (Manual Schema Mode)**.
  - Source: `schema.graphql` (root).
  - Command: `npm run codegen`.
  - Output: `app/gql/`.

---

## 🚦 Critical Engineering Rules (Non-Negotiable)

### 1. Nuxt 4 Directory Constraints
- All application code (components, composables, stores, pages, types) **MUST** reside inside the `app/` directory.
- All server-side logic (Nitro event handlers) **MUST** reside inside the `server/` directory.

### 2. Import Aliasing
- Use the `~` alias for all internal imports (e.g., `import { ... } from '~/types/translations'`).
- **NEVER** use relative paths (`../../`) for core project files within the `app/` directory.

### 3. Secure API Architecture
- **NO SECRETS IN BROWSER**: `GEMINI_API_KEY` resides only in `runtimeConfig`. (Note: `STRAPI_API_TOKEN` is no longer used as a fallback).
- The browser must never see these keys. Use the Nitro proxy routes for all external API calls.
- The `/api/settings` route must only return boolean flags (e.g., `isStrapiTokenSet`) or masked information, never raw keys.
- **Strict User Context**: All operations strictly use the user's `strapi_jwt` from the `httpOnly` cookie. No system-wide fallback token is used.

### 4. Authentication & Security Protocol
- **Dual-Cookie Security Pattern**:
  - `strapi_jwt`: A raw JWT stored as an `httpOnly` cookie set by the server to prevent XSS attacks.
  - `strapi_user`: A standard cookie containing user session state, used solely for client-side hydration.
- **Middleware Protection**: Global Nuxt middleware (`auth.global.ts`) enforces strict protection across all application routes, automatically bypassing the `/login` page.
- **Strict User Context**: The Strapi proxy (`/api/strapi.post.ts`) strictly uses the `httpOnly` user JWT for all requests to Strapi, and no system-wide fallback token is used. This ensures all operations are tied directly to the user's Strapi role and permissions.

### 5. Strapi i18n Protocol (Refined)
- **Sync Logic**: ALWAYS follow the **"Fetch-Check-Update/Create"** pattern.
  - 1. Fetch the source entry with its existing `localizations`.
  - 2. **Check**: Determine if the target locale already exists in the localizations array.
  - 3. **Update**: If locale exists, use the `UPDATE` mutation on the specific localized ID.
  - 4. **Create**: If locale is missing, use the `SUBMIT` (Localization) mutation on the source ID.
  - **Goal**: Prevent duplicate entries and maintain correct relation links across locales.
- **Fetch Logic**: Support optional filtering for unpublished content using `unpublishedOnly`. Filter: `{ publishedAt: { eq: null } }`.
- **FAQ Mapping**: When syncing FAQs, you MUST look up the localized ID of the associated Category. Use a `categoryCache` to optimize repeated lookups.
- **PublishedAt**: Always include `publishedAt: new Date().toISOString()` in mutations.

### 6. Gemini AI Protocol
- **Model**: `gemini-3.1-flash-lite-preview` via the `@google/genai` library (server-side).
- **Batching**: Process strings in batches of **200** to stay within token/context limits.
- **Parallel Processing**: In `useContentType.ts`, results must be merged into the store **per-locale** as they finish. DO NOT wait for the entire batch of locales to finish before updating the UI.

---

## 🛠 Feature Specifications

### 1. 6-Step Standard Workflow
Used for general content types (Categories, FAQs):
1. **Generate Source JSON**: Pull from Strapi (with "Unpublished Only" toggle).
2. **Review Source Keys**: Read-only preview of source content.
3. **Generate AI Translations**: Parallel locale processing with per-locale retry.
4. **Preview & Download**: Inline two-panel editor (Locale List | Translation Table).
5. **Upload Manual Translation**: Multi-file drag-and-drop with auto-locale detection.
6. **Sync to Strapi**: Individual or **Bulk Sync** capability with confirmation gate.

### 2. IGW Changelogs Architecture
- **Parent-Child Structure**: 
  - `IgwChangelog`: The non-localized parent container holding `version` and `date`.
  - `IgwChangelogDtl`: The localized child entity holding `title` and `changes`.
- **Dedicated Workspace**: Per-version translation at `/translate/[id]`.
- **4-Step Workspace Workflow**:
  1. **Review Source**: Verify English (EN) source content.
  2. **Locale Selection**: Choose target locales for translation.
  3. **AI Translate**: Generate localized versions via Gemini.
  4. **Review & Sync**: Manual edit/review before pushing to Strapi.
- **Deletion Rule**: To maintain cross-locale structural integrity, **deletion of log entries** (`IgwChangelogDtl`) is strictly restricted to **English (EN) mode**.

### 3. Supported Locales
All components must use the centralized `SUPPORTED_LOCALES` constant from `~/types/translations`. It includes 19 locales: `cs, da, de, el, es, fi, fr, hu, id, it, ja, nb, nb_no, pt, sk, sv, th, vi, zh`.

---

## 🎨 UI & UX Standards

### 1. Global UI Framework
- **UI Store**: `useUiStore` centralizes global interaction states:
  - `confirm`: Triggers the global confirmation modal.
  - `toast`: Manages system-wide feedback notifications.
  - `loading`: Global overlay — **reserved for page-level skeleton loading only**. Do NOT use for button actions.
- **Reusable Components**:
  - **SharedConfirmDialog**: Mandatory replacement for `window.confirm`. Internally manages `isConfirming` state — the confirm button shows a spinner and both buttons are disabled while `onConfirm` is awaited. Backdrop dismiss is also blocked during confirmation.
  - **SharedToastContainer**: Centralized mount point for all toast notifications.
  - **SharedLoadingOverlay**: Responds to `uiStore.isLoading`. Use only for initial page data fetches, not for save/delete/sync actions.

### 3. Async Action UX Pattern (Non-Negotiable)
For any async mutation (save, delete, sync, translate), follow this pattern — **never use `ui.setLoading`**:

1. **Local loading ref**: Add a dedicated `ref` (e.g. `isSaving`, `isDeleting`, `isSyncing`) scoped to the operation.
2. **Disable the trigger button**: Bind `:disabled="isLoading"` + `disabled:opacity-30 disabled:cursor-not-allowed` on the button.
3. **Show inline spinner**: Add `<span v-if="isLoading" class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />` inside the button alongside a contextual label (e.g. `"Saving..."`, `"Deleting..."`).
4. **Block dismissal during saves**: If the operation runs inside a modal, guard all close paths (backdrop click, X button, cancel button) with `!isLoading`.
5. **Confirmation dialogs**: `SharedConfirmDialog` already handles its own `isConfirming` state internally — no extra work needed in callers.
6. **Always use `finally`**: Reset the loading ref in a `finally` block to guarantee cleanup on both success and error paths.

### 2. Visual Identity
- **Aesthetic**: "Refined Utilitarian Dashboard" - High information density, SaaS-like professional look.
- **Dark Mode**: Every component MUST support `.dark` class variants. Use `slate-900/950` for dark backgrounds.
- **Colors**: Indigo primary (#4F46E5), Emerald success (#10B981), Rose error (#F43F5E), Amber warning (#F59E0B).
- **Typography**: System sans-serif with `font-black` for headers and `font-medium` for body/labels.
- **Layouts (Nuxt Layout System)**: 
  - `default`: The main application layout featuring a permanent vertical sidebar (desktop) or drawer (mobile).
  - `blank`: A clean slate layout with no navigation, used specifically for the `/login` page.
- **Micro-interactions**: Hover effects on cards, rotation on icons, and pulse animations for status indicators.

---

## ⚠️ High-Risk Pitfalls (Common Errors)

- **Template Type Errors**: Vue templates fail to resolve `StrapiEntry` unions.
  - *Fix*: Use `asCategory(source)`, `asChangelog(source)`, `asFaq(source)`, or `getEntryId(source)` helper functions in the `<script setup>` block.
- **Vite Dependency Discovery**: New libraries (like `jszip`) must be added to `optimizeDeps.include` in `nuxt.config.ts`.
- **Duplicate Template Tags**: When editing `WorkflowPage.vue`, ensure no duplicate `<template>` or `<script>` blocks are created.
- **SSR Mismatch**: The app is configured as `ssr: false` (SPA mode). Ensure all browser-only APIs are handled correctly.

---

## 🔄 Development Workflow
1. **Schema Sync**: Edit `schema.graphql` manually -> `npm run codegen`.
2. **Pull**: Fetch data via `/api/strapi`.
3. **AI Translate**: Bulk processing via `/api/gemini`.
4. **Export**: Mandatory backup before sync.
5. **Sync**: Push via `/api/strapi` with `publishedAt` timestamp.

---

**Always refer to `app/types/translations.ts` for the latest entry interfaces before modifying query or mapping logic.**
