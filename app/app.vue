<script setup lang="ts">
/**
 * Global App Shell
 * Handles layout and common elements across all pages.
 */
useHead({
  title: "Strapi I18n Sync",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Strapi I18n Sync` : "Strapi I18n Sync";
  },
  meta: [
    {
      name: "description",
      content: "AI-powered synchronization for Strapi Internationalization.",
    },
  ],
});
</script>

<template>
  <NuxtLoadingIndicator color="#4F46E5" :height="2" />

  <!-- Global UI Elements -->
  <SharedToastContainer />
  <SharedConfirmDialog />
  <SharedLoadingOverlay />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Reset base styles handled by main.css */
</style>
