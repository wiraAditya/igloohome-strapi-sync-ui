# Agent Context & Engineering Standards

This document is the primary reference for AI agents and developers working on the **Strapi I18n Sync UI**. It defines the "Golden Rules", architectural boundaries, and specific implementation logic for the project.

---

## 🏗 Core Architecture
- **Framework**: Nuxt 4 (Source: `app/`, Server: `server/`)
- **Compatibility Mode**: `future: { compatibilityVersion: 4 }`
- **Frontend Engine**: Vite + Tailwind CSS v4 (Native Vite Plugin)
- **Dark Mode**: Integrated via `@nuxtjs/color-mode` (Class strategy).
- **State Management**: Pinia (Isolated stores: `categories`, `changelogs`, `faqs`, `ui`)
- **API Strategy**: **Secure Nitro Proxy** (Mandatory for Hosting).
  - **Browser**: Calls local proxy routes (`/api/strapi`, `/api/gemini`, `/api/settings`).
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
- **NO SECRETS IN BROWSER**: `STRAPI_API_TOKEN` and `GEMINI_API_KEY` reside only in `runtimeConfig`.
- The browser must never see these keys. Use the Nitro proxy routes for all external API calls.
- The `/api/settings` route must only return boolean flags (e.g., `isStrapiTokenSet`) or masked information, never raw keys.

### 4. Strapi i18n Protocol
- **Fetch Logic**: Support optional filtering for unpublished content using `unpublishedOnly`. Filter: `{ publishedAt: { eq: null } }`.
- **Sync Logic**: Follow the "Fetch-Check-Update/Create" pattern.
  - 1. Fetch source ID with its `localizations`.
  - 2. If locale exists: use `UPDATE` mutation on the localized ID.
  - 3. If locale missing: use `SUBMIT` (Localization) mutation on the source ID.
- **FAQ Mapping**: When syncing FAQs, you MUST look up the localized ID of the associated Category. Use a `categoryCache` to optimize repeated lookups.
- **PublishedAt**: Always include `publishedAt: new Date().toISOString()` in mutations.

### 5. Gemini AI Protocol
- **Model**: `gemini-1.5-flash` via the `@google/genai` library (server-side).
- **Batching**: Process strings in batches of **200** to stay within token/context limits.
- **Sequential Merging**: In `useContentType.ts`, results must be merged into the store **per-locale** as they finish. DO NOT wait for the entire batch of locales to finish before updating the UI.

---

## 🛠 Feature Specifications

### 1. 6-Step Workflow
Every content type page must implement these 6 steps with strict locking (prerequisites):
1. **Generate Source JSON**: Pull from Strapi (with "Unpublished Only" toggle).
2. **Review Source Keys**: Read-only preview of source content.
3. **Generate AI Translations**: Sequential locale processing with per-locale retry.
4. **Preview & Download**: Inline two-panel editor (Locale List | Translation Table).
5. **Upload Manual Translation**: Multi-file drag-and-drop with auto-locale detection from filename and searchable dropdown override.
6. **Sync to Strapi**: Individual or **Bulk Sync** capability with confirmation gate.

### 2. Supported Locales
All components must use the centralized `SUPPORTED_LOCALES` constant from `~/types/translations`. It includes 19 locales: `cs, da, de, el, es, fi, fr, hu, id, it, ja, nb, nb_no, pt, sk, sv, th, vi, zh`.

---

## 🎨 UI & UX Standards
- **Aesthetic**: "Refined Utilitarian Dashboard" - High information density, SaaS-like professional look.
- **Dark Mode**: Every component MUST support `.dark` class variants. Use `slate-900/950` for dark backgrounds.
- **Colors**: Indigo primary (#4F46E5), Emerald success (#10B981), Rose error (#F43F5E), Amber warning (#F59E0B).
- **Typography**: System sans-serif with `font-black` for headers and `font-medium` for body/labels.
- **Layout**: Permanent Vertical Sidebar (Desktop) / Drawer (Mobile).
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
